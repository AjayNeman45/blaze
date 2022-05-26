import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import {
  getAllSessions,
  getAllStatus,
  getStatusDesc,
  getSurvey,
} from "../../utils/firebaseQueries";
// import XLSX from "xlsx"
import styles from "./Reconciliations.module.css";
import { ReconciliationTable } from "./Reconciliations";
import { v4 as uuid } from "uuid";
import { utils, writeFile } from "xlsx";
import cx from "classnames";

export const statusData = [
  {
    name: "all",
    label: "All",
    default_checked: true,
    code: 0,
  },
  {
    name: "completed",
    label: "Completed",
    code: 10,
  },
  {
    name: "over-quota",
    label: "Over Quota",
    code: 40,
  },
  {
    name: "terminated",
    label: "Terminated",
    code: 20,
  },
  {
    name: "in-client-survey",
    label: "In Client Survey",
    code: 1,
  },
];

const DataAnalysis = () => {
  const { surveyID } = useParams();
  const [sessions, setSessions] = useState([]);
  const [sessionsCopy, setSessionsCopy] = useState([]);
  const [filterByStatus, setFilterByStatus] = useState([]);
  const [showTable, setShowTable] = useState(false);
  //   const [surveyID, setSurveyID] = useState("");
  const [surveyName, setSurveyName] = useState("");
  const [fromDate, setFromDate] = useState();
  const [endDate, setEndDate] = useState();
  const [checkedStatus, setCheckedStatus] = useState([0]);
  const [msg, setMsg] = useState("");
  const { projectId } = useParams();
  const gamma = localStorage.getItem("gamma");

  // fetching all the sessions of the project
  useEffect(() => {
    var dt = new Date();
    dt.setDate(dt.getDate() - 29);
    setFromDate(dt.toISOString().substring(0, 10));
    setEndDate(new Date().toISOString().substring(0, 10));

    const func = async () => {
      try {
        const survey = await getSurvey(surveyID);
        const allSessions = await getAllSessions(surveyID, gamma);
        allSessions.forEach((session) => {
          let clientStatus = session.data()?.client_status;
          let miratsStatus = session.data()?.mirats_status;
          getStatusDesc("client_codes", clientStatus).then((miratCodeDesc) => {
            getStatusDesc("mirats_codes", miratsStatus).then(
              (clientCodeDesc) => {
                setSessions((oldData) => [
                  ...oldData,
                  {
                    session_data: session.data(),
                    survey_id: survey.survey_id,
                    survey_name: survey.survey_name,
                    session_id: session.id,
                    client_status_desc: miratCodeDesc?.m_desc,
                    mirats_status_desc: clientCodeDesc?.m_desc,
                  },
                ]);
              }
            );
          });
        });
      } catch (err) {
        console.log(err);
      }
    };
    func();
  }, []);

  // handles status change function
  const handleStatusClick = (e, code) => {
    console.log(code);
    if (checkedStatus.includes(code)) {
      setCheckedStatus(() => checkedStatus.filter((c) => c !== code));
    } else {
      setCheckedStatus([...checkedStatus, code]);
    }
  };

  // handles show table btn
  const handleShowTable = () => {
    setSessionsCopy([]);
    setShowTable(true);
    let from_d = new Date(fromDate);
    let end_d = new Date(endDate);
    // console.log(from_d, end_d)
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
          if (checkedStatus.includes(0)) temp.push(session);
          else if (!checkedStatus.length) {
            setCheckedStatus([0]);
            temp.push(session);
          } else if (
            checkedStatus.includes(session?.session_data?.client_status)
          ) {
            console.log("for other status");
            temp.push(session);
          }
        }
      });
      return temp;
    });
  };
  // handles Download To Excel btn
  const DownloadToExcel = () => {
    console.log("download excel function called");
    var elt = document.getElementById("table-to-xls");
    var wb = utils.table_to_book(elt, { sheet: "Sheet JS" });
    return writeFile(wb, `DataAnalysis_${surveyID}_${surveyName}.xlsx`);
  };

  return (
    // <></>
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
            {!sessionsCopy.length ? (
              <p className={styles.result_not_founds}>Result Not Found</p>
            ) : (
              <table className={styles.table} id="table-to-xls">
                <thead className={styles.tableHead}>
                  <tr>
                    <th>#</th>
                    <th>RID</th>
                    <th>Ref ID</th>
                    <th>SRC ID</th>
                    <th>Survey Number</th>
                    <th>Survey Name</th>
                    <th>Client Status</th>
                    <th>Client Status Description</th>
                    <th>Session ID</th>
                    <th>Mirats Status</th>
                    <th>Mirats Status Description</th>
                    <th>Fingerprint</th>
                    <th>GDPR consent</th>
                    <th>City</th>
                    <th>Country</th>
                    <th>Region</th>
                    <th>Timezone</th>
                    <th>IP</th>
                    <th>Reconciled</th>
                    <th>Browser Name</th>
                    <th>Cookie</th>
                    <th>Device Type</th>
                    <th>Operating System</th>
                    <th>language</th>
                    <th>Survey Start Date & Time</th>
                    <th>Survey End Time</th>
                  </tr>
                </thead>
                <tbody className={styles.tableBody}>
                  {sessionsCopy?.map((session, indx) => {
                    if (Object.keys(session).length) {
                      return (
                        <tr>
                          <td>{indx}</td>
                          <td>{session?.session_data?.rid}</td>
                          <td>{session?.session_data?.ref_id}</td>
                          <td>{session?.session_data?.supplier_account_id}</td>
                          <td>{session?.survey_id}</td>
                          <td>{session?.survey_name}</td>
                          <td>{session?.session_data?.client_status}</td>
                          <td>{session?.client_status_desc}</td>
                          <td>{session.session_id}</td>
                          <td>{session?.session_data?.mirats_status}</td>
                          <td>{session?.mirats_status_desc}</td>
                          <td>{session?.session_data?.fingerprint}</td>
                          <td className={styles.table_tag}>
                            <span>
                              {session?.session_data?.gdpr_consent
                                ? "accepted"
                                : "declined"}
                            </span>
                          </td>
                          <td>{session?.session_data?.geo_data?.city}</td>
                          <td>{session?.session_data?.geo_data?.country}</td>
                          <td>{session?.session_data?.geo_data?.region}</td>
                          <td>{session?.session_data?.geo_data?.timezone}</td>

                          <td>{session?.session_data?.geo_data?.ip}</td>
                          <td className={styles.table_tag}>
                            <span>
                              {session?.session_data?.is_reconciled
                                ? "reconciled"
                                : "not reconciled"}
                            </span>
                          </td>

                          <td>
                            {
                              session?.session_data?.session_techincal_details
                                ?.browser_name
                            }
                          </td>
                          <td className={styles.table_tag}>
                            <span>
                              {session?.session_data?.session_techincal_details
                                ?.cookie_enabled
                                ? "enabled"
                                : "disabled"}
                            </span>
                          </td>
                          <td>
                            {
                              session?.session_data?.session_techincal_details
                                ?.deviceType
                            }
                          </td>
                          <td>
                            {
                              session?.session_data?.session_techincal_details
                                ?.os
                            }
                          </td>
                          <td>
                            {
                              session?.session_data?.session_techincal_details
                                ?.language
                            }
                          </td>
                          <td>
                            {session?.session_data?.survey_start_time
                              ?.toDate()
                              ?.toLocaleString()}
                          </td>
                          <td>
                            {session?.session_data?.survey_end_time
                              ?.toDate()
                              ?.toLocaleString()}
                          </td>
                        </tr>
                      );
                    }
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </>
  );
};
export default DataAnalysis;
