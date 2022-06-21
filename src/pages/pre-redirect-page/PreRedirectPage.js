import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { decryptText } from "../../utils/enc-dec.utils";
import {
  getQuestion,
  getSessionBasedOnType,
  getSurvey,
  updateSession,
} from "../../utils/firebaseQueries";
import styles from "./PreRedirectPage.module.css";
import Logo from "../../assets/images/insights.png";
import Hashids from "hashids";
import { useHistory } from "react-router-dom";
import { v4 as uuid } from "uuid";

const PreRedirectPage = () => {
  let hashids = new Hashids("My Project");
  const [testSession, setTestSession] = useState(null);
  const [question, setQuestion] = useState(null);
  const { encryptedID, questionNumber } = useParams();
  const [survey, setSurvey] = useState({});
  const surveyID = decryptText(
    encryptedID?.split("-")[0] ? encryptedID?.split("-")[0] : ""
  );
  const history = useHistory();
  const srcID = localStorage.getItem("srcID");
  const rID = localStorage.getItem("srcID");
  const gamma = localStorage.getItem("gamma");

  const sessionID = localStorage.getItem("session_id");

  useEffect(() => {
    window.addEventListener("popstate", () => {
      history.go(1);
    });
    if (testSession?.mirats_status === 0) {
      history.push(
        `/blaze/${encryptedID}/questions/42?SRCID=${srcID}&RID=${rID}$gamma=alpha`
      );
      return;
    }
    const func = async () => {
      await getSessionBasedOnType(surveyID, sessionID, "TestSessions")
        .then((res) => setTestSession(res.data()))
        .catch((err) => console.log(err));
      await getSurvey(surveyID)
        .then((res) => setSurvey(res))
        .catch((err) => console.log(err));
    };
    func();
  }, []);

  useEffect(() => {
    const func = async () => {
      await getQuestion(questionNumber)
        .then((res) => setQuestion(res.data()))
        .catch((err) => console.log(err));
    };
    questionNumber && func();
  }, [questionNumber]);

  const handleContinueBtn = () => {
    const body = {
      survey_start_time: new Date(),
    };
    updateSession(surveyID, sessionID, gamma, body)
      .then(() => {
        console.log("survey start time updated");
      })
      .catch((err) => console.log(err.message));
  };

  window.addEventListener("popstate", () => {
    history.go(1);
  });

  return (
    <div className={styles.preRedirectPage}>
      <img src={Logo} alt="" width={300} height={50} className={styles.logo} />
      <div
        className="line_design"
        style={{ width: "100%", margin: "0 auto" }}
      ></div>
      <p className={styles.legend}>Test Survey Pre-screener Summary Session</p>
      <div className={styles.pre_screener_session}>
        <div>
          <span>RID: </span>
          <span>{rID}</span>
        </div>
        <div>
          <span>SRCID: </span>
          <span>{testSession?.supplier_account_id}</span>
        </div>
        <div>
          <span>Screener Response Status: </span>
          <span>{testSession?.mirats_status}</span>
        </div>
        <div>
          <span>Survey Name: </span>
          <span>{survey?.survey_name}</span>
        </div>
        <div>
          <span>Description: </span>
          <span>
            {testSession?.mirats_status === 3
              ? "Redirecting to Client Survey"
              : question?.is_core_demographic
              ? "Term: Demographic Question Disqualification"
              : "Term: Non-Demographic Question Disqualification"}
          </span>
        </div>
        <div>
          <span>Date:</span>
          <span>{testSession?.date.toDate().toDateString()}</span>
        </div>
        <div>
          <span>Supplier Name:</span>
          {survey?.external_suppliers?.map((supplier) => {
            if (
              supplier?.supplier_account_id === testSession?.supplier_account_id
            ) {
              return <span key={uuid()}>{supplier?.supplier_account}</span>;
            }
          })}
        </div>
        <div>
          <span>Survey ID:</span>
          <span>{surveyID}</span>
        </div>
        <div>
          <span>Entry Time:</span>
          <span>{testSession?.date.toDate().toLocaleTimeString("en-in")}</span>
        </div>

        <div>
          <span>Qualification term:</span>
          <span>
            {questionNumber === "gdpr"
              ? "GDPR_CONSENT"
              : testSession?.mirats_status === 3
              ? "NaN"
              : question?.name}
          </span>
        </div>

        <div className={styles.client_redirect_url}>
          <span>Client Redirect URL:</span>
          <span>
            http://localhost:3000/blaze/53616c7465645f5f56307e1a0891dcea206f60f
          </span>
        </div>
      </div>

      <p className={styles.legend}>Questionnaire Attempts</p>
      <div className={styles.questionnaire_attempts}>
        {testSession?.responses?.map((res) => {
          return (
            <div className={styles.questionnaire_attempt} key={uuid()}>
              <span className={styles.response_question}>
                {res?.question_name}:
              </span>

              <div className={styles.response_ans}>
                {Array.isArray(res?.user_response) ? (
                  res?.user_response?.map((ans, i) => (
                    <span key={uuid()}>
                      {ans}
                      {i + 1 != res?.user_response.length && ", "}
                    </span>
                  ))
                ) : (
                  <span>{res?.user_response}</span>
                )}
              </div>
            </div>
          );
        })}

        {/* <div>
					<span>GENDER:</span>
					<span>2</span>
				</div>
				<div>
					<span>ZIPCODE:</span>
					<span>400890</span>
				</div> */}
      </div>

      <p className={styles.legend}>Technical Details</p>

      <div className={styles.technical_details}>
        <div>
          <span>Browser Name:</span>
          <span>{testSession?.session_technical_details?.browser_name}</span>
        </div>

        <div>
          <span>Os Type: </span>
          <span>{testSession?.session_technical_details?.os}</span>
        </div>

        <div>
          <span>Device Type: </span>
          <span>{testSession?.session_technical_details?.deviceType}</span>
        </div>

        <div>
          <span>Platform: </span>
          <span>{testSession?.session_technical_details?.platform}</span>
        </div>

        <div>
          <span>Browser Version: </span>
          <span>{testSession?.session_technical_details?.version}</span>
        </div>

        <div>
          <span>Language: </span>
          <span>{testSession?.session_technical_details?.language}</span>
        </div>

        <div>
          <span>User Agent: </span>
          <span>{testSession?.session_technical_details?.user_agent}</span>
        </div>
      </div>

      <button className={styles.continue_btn} onClick={handleContinueBtn}>
        Continue
      </button>

      {/* <div className='powered_by_text'>
				<span>
					Powered by <span>Mirats Insights</span>
				</span>
				<div className='privacy_terms'>
					<span>
						<a href='#'>Privacy Policy</a> |{" "}
						<a href='#'>General Terms</a>
					</span>
				</div>
			</div> */}
    </div>
  );
};

export default PreRedirectPage;
