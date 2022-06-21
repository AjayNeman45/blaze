import React, { useEffect, useState } from "react";
import styles from "./Reconciliations.module.css";
import { statusData } from "./DataAnalysis";
import { v4 as uuid } from "uuid";
import { utils, writeFile } from "xlsx";
import cx from "classnames";
import { useParams } from "react-router-dom";
import { ReconciliationTable } from "./Reconciliations";
import {
  getAllSessions,
  getQuestion,
  getSurvey,
} from "../../utils/firebaseQueries";

const RespondantAnswer = () => {
  const { surveyID } = useParams();

  const [checkedStatus, setCheckedStatus] = useState([0]);
  const [sessions, setSessions] = useState([]);
  const [sessionsCopy, setSessionsCopy] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [surveyQualifications, setSurveyQualifications] = useState([]);
  const [fromDate, setFromDate] = useState();
  const [endDate, setEndDate] = useState();
  const [msg, setMsg] = useState("");
  const [surveyName, setSurveyName] = useState("");
  const [survey, setSurvey] = useState({});
  const gamma = localStorage.getItem("gamma");

  const handleStatusClick = (e, code) => {
    if (checkedStatus.includes(code)) {
      setCheckedStatus(() => checkedStatus.filter((c) => c !== code));
    } else {
      setCheckedStatus([...checkedStatus, code]);
    }
  };

  useEffect(() => {
    var dt = new Date();
    dt.setDate(dt.getDate() - 29);
    setFromDate(dt.toISOString().substring(0, 10));
    setEndDate(new Date().toISOString().substring(0, 10));

    const func = async () => {
      try {
        const survey = await getSurvey(surveyID);
        setSurvey(survey);
        survey.qualifications.questions.map((q) => {
          getQuestion(q.question_id).then((res) =>
            setSurveyQualifications((prevData) => [...prevData, res.data()])
          );
        });
        const allSessions = await getAllSessions(surveyID, gamma);
        allSessions.forEach((session) => {
          setSessions((oldData) => [
            ...oldData,
            {
              session_data: session.data(),
              survey_id: survey.survey_id,
              survey_name: survey.survey_name,
            },
          ]);
        });
      } catch (err) {
        console.log(err);
      }
    };
    func();
  }, []);

  // handles show table btn
  const handleShowTable = () => {
    setSessionsCopy([]);

    let from_d = new Date(fromDate);
    let end_d = new Date(endDate);
    if (from_d != "Invalid Date" && end_d != "Invalid Date") setMsg("");
    else {
      setMsg("Select field date to filter");
      setShowTable(false);
      return;
    }
    setSessionsCopy(() => {
      let temp = [];
      sessions.map((session) => {
        if (
          new Date(session?.session_data?.date?.toDate()).valueOf() >=
            from_d.valueOf() &&
          new Date(session?.session_data?.date?.toDate()).valueOf() <=
            end_d.valueOf()
        ) {
          setShowTable(true);
          if (checkedStatus.includes(0)) temp.push(session);
          else if (!checkedStatus.length) {
            setCheckedStatus([0]);
            temp.push(session);
          } else if (
            checkedStatus.includes(session?.session_data?.client_status)
          ) {
            temp.push(session);
          }
        }
      });
      return temp;
    });
  };

  // handles Download To Excel btn
  const DownloadToExcel = () => {
    var elt = document.getElementById("table-to-xls");
    var wb = utils.table_to_book(elt, { sheet: "Sheet JS" });
    return writeFile(wb, `RespondantsAnswer${surveyID}_${surveyName}.xlsx`);
  };

  return (
    <>
      <div className={styles.data_analysis_section}>
        <div className={styles.filter_by_field_Date}>
          <span className={styles.legend}>Field Dates</span>
          <br />
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            placeholder="from"
            className={styles.date_input}
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="to"
            className={styles.date_input}
          />
        </div>
        <br />
        <div className={styles.filter_by_status}>
          {statusData?.map((st) => {
            return (
              <div key={uuid()}>
                <span
                  className={
                    checkedStatus.includes(st.code)
                      ? cx(styles.active_status, styles.status)
                      : styles.status
                  }
                  onClick={(e) => handleStatusClick(e, st?.code)}
                >
                  {st.label}
                </span>
              </div>
            );
          })}
        </div>
        {msg.length ? (
          <p
            style={{
              textAlign: "center",
              color: "red",
            }}
          >
            {msg}
          </p>
        ) : null}
        <div className={styles.btns}>
          <button type="button" onClick={DownloadToExcel}>
            Export To Excel
          </button>
          <button onClick={handleShowTable}>Show Table</button>
        </div>
      </div>
      <br />
      <div className={styles.data_analysis_table}>
        {showTable && (
          <div className={styles.tableContainer}>
            <table className={styles.table} id="table-to-xls">
              <thead className={styles.tableHead}>
                <tr className={styles.tableHeads}>
                  <th>RID</th>
                  <th>Ref_ID</th>
                  <th>External Supplier Acoount</th>
                  <th>Survey Number</th>
                  <th>Project Number</th>
                  {surveyQualifications?.map((qua) => {
                    return <th>{qua?.name}</th>;
                  })}
                </tr>
              </thead>
              <tbody className={styles.tableBody}>
                {sessionsCopy?.map((session) => {
                  return (
                    <tr>
                      <td>{session?.session_data?.rid}</td>
                      <td>{session?.session_data?.ref_id}</td>

                      {survey?.external_suppliers.map((supp) => {
                        if (
                          supp?.supplier_account_id ===
                          session?.session_data?.supplier_account_id
                        ) {
                          return <td>{supp?.supplier_account}</td>;
                        }
                      })}
                      <td>{survey?.survey_id}</td>
                      <td>{survey?.project_id}</td>
                      {session?.session_data?.responses?.map((res) => {
                        return <td>{res.user_response}</td>;
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* <ReconciliationTable
          sessionsCopy={sessionsCopy}
          showTable={showTable}
        /> */}
      </div>
    </>
  );
};

export default RespondantAnswer;
