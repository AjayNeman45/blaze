import React, { useEffect } from "react";
import styles from "./SurveyLogsPdfFormat.module.css";
import logo from "../../../../assets/images/mirats-logo.png";
import { MdArrowBack } from "react-icons/md";
import LiveSurveyLogsContext from "../../LiveSurveyLogsContext";
const SurveyLogsPdfFormat = ({
  downloadToPDF,
  sessions,
  survey,
  logType,
  clientCodes,
  miratsCodes,
  setShowPdfFormatModal,
}) => {
  const ref = React.createRef();
  console.log(survey);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <div className={styles.format_pdf_btns}>
        <div className={styles.back_btn}>
          <MdArrowBack size={50} onClick={() => setShowPdfFormatModal(false)} />
        </div>
        <button
          className={styles.download_btn}
          onClick={() => {
            downloadToPDF();
          }}
        >
          Download
        </button>
      </div>
      <div
        ref={ref}
        className={styles.pdf_Container}
        id="survey-log-pdf-template"
      >
        <div className={styles.miarts_logo}>
          <img src={logo} alt="" className={styles.img} />
        </div>

        <h4 className={styles.Address}>
          Mirats Insights ​Private Limited, 7022 1Aerocity,​ NIBR Corporate Park
          Nr, Safed Pul, Mumbai, Maharashtra 400072
        </h4>
        <div className={styles.survey_logs_basic_details}>
          <div className={styles.details}>
            <span>Survey Number</span>
            <span>1000001</span>
          </div>
          <div className={styles.details}>
            <span>Project Number</span>
            <span>10000002</span>
          </div>
          <div className={styles.details}>
            <span>Supplier ID</span>
            <span>1234567890</span>
          </div>
          <div className={styles.details}>
            <span>Supplier Name</span>
            <span>Google Inc.</span>
          </div>
        </div>

        <div className={styles.survey_logs_table}>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Survey Start Time</th>
                <th>Survey End Time</th>
                <th>Total Survey Time</th>
                <th>
                  Client CPI ({survey?.client_info?.client_cost_currency_symbol}
                  )
                </th>
                {/* <th>Ref ID</th> */}
                <th>Session Technical Details</th>
                <th>RID</th>
                <th>TID</th>
                <th>Client Status</th>
                <th>Mirats Status</th>
                <th>Age</th>
                <th>User Address (IP Address)</th>
              </tr>
            </thead>
            <tbody>
              {sessions?.map((session) => {
                return (
                  <tr>
                    <td>{session?.date.toDate().toLocaleDateString()}</td>
                    <td>
                      {session?.survey_start_time.toDate().toLocaleTimeString()}
                    </td>
                    <td>
                      {session?.survey_end_time.toDate().toLocaleTimeString()}
                    </td>
                    <td>{session?.total_survey_time}</td>
                    <td>{session?.client_cpi}</td>
                    {/* <td>{session?.ref_id}</td> */}
                    <td>
                      {session?.session_technical_details?.browser_name},
                      {session?.session_technical_details?.cookie_enabled},
                      {session?.session_technical_details?.deviceType},
                      {session?.session_technical_details?.language},
                      {session?.session_technical_details?.os},
                      {session?.session_technical_details?.platform},
                      {session?.session_technical_details?.user_agent},
                      {session?.session_technical_details?.version},
                    </td>
                    <td>{session?.rid}</td>
                    <td>{session?.tid}</td>
                    <td>
                      {clientCodes?.map((code) => {
                        if (code?.code === session?.client_status) {
                          return code?.m_desc;
                        }
                      })}
                      ({session?.client_status})
                    </td>
                    <td>
                      {" "}
                      {miratsCodes?.map((code) => {
                        if (code?.code === session?.mirats_status) {
                          return code?.m_desc;
                        }
                      })}
                      {session?.mirats_status}
                    </td>
                    <td>
                      {session?.responses?.map((resp) => {
                        if (resp?.question_id === "42")
                          return resp?.user_response;
                      })}
                    </td>
                    <td>
                      {session?.geo_data?.city}, {session?.geo_data?.region},{" "}
                      {session?.geo_data?.country}, ({session?.geo_data?.ip})
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default SurveyLogsPdfFormat;
