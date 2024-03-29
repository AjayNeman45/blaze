import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Logo from "../../assets/images/insights.png";
import "./SurveyQuestions.css";
import Loader from "../../components/loader/Loader";
import ErrorPage from "../../components/error-page/ErrorPage";
import { decryptText } from "../../utils/enc-dec.utils";
import {
  addQualificationResponse,
  getAllSessions,
  getQuestion,
  getSessionBasedOnType,
  getSurvey,
} from "../../utils/firebaseQueries";
import Question from "../../components/question/Question";
import { useLocation } from "react-router-dom";

const SurveyQuestions = () => {
  let { encryptedID, questionNumber } = useParams();
  const [question, setQuestion] = useState({});
  questionNumber = parseInt(questionNumber);
  var surveyID = decryptText(encryptedID?.split("-")[0]);
  const [errCode, setErrCode] = useState(null);
  const [errMsg, setErrMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);

  const [multiPunchResp, setMultiPunchRes] = useState([]); // special state for multipunch repsonse
  const [sessionID, setSessionID] = useState(
    localStorage.getItem("session_id")
  );
  const [isFinalQuestion, setIsFinalQuestion] = useState(false);
  const [error, setError] = useState(null);
  const history = useHistory();
  const [nextQNumber, setNextQNumber] = useState(null);
  const [sessions, setSessions] = useState([]);
  const gamma = localStorage.getItem("gamma");
  const default_responses = JSON.parse(
    localStorage.getItem("default_responses")
  );
  const [response, setResponse] = useState(null);

  const nextQuestionUrl = `/blaze/${encryptedID}/questions/${nextQNumber}`;
  const predirectUrl = `/blaze/${encryptedID}/preRedirectUrl/${questionNumber}`;
  const refereneUrl = `/blaze/${encryptedID}/reference`;

  useEffect(() => {
    getAllSessions(surveyID, gamma).then((res) => {
      let tmp = [];
      res.forEach((session) => {
        tmp.push(session.data());
      });
      setSessions(tmp);
    });
  }, []);

  const handleSinglePunch = () => {
    const user_res = parseInt(response);
    let flag = false,
      index,
      mirats_status;
    if (question?.conditions?.valid_options?.includes(user_res)) {
      flag = true;
    }
    question?.conditions?.valid_options?.map((option, i) => {
      if (option === user_res) index = i;
    });
    question?.is_core_demographic ? (mirats_status = 23) : (mirats_status = 24);

    const body = {
      question_name: question?.question_name,
      question_id: String(questionNumber),
      user_response: parseInt(response),
    };
    setResponse(null);

    let cntCompleted = 0;
    sessions.forEach((session) => {
      let response;
      session?.responses?.map((resp) => {
        if (parseInt(question?.question_id) === parseInt(resp?.question_id)) {
          response = resp?.user_response;
        }
      });
      if (response === user_res && session?.client_status === 10)
        cntCompleted++;
    });

    if (flag) {
      setError("");
      isFinalQuestion ? (mirats_status = 3) : (mirats_status = 1);
      if (question?.conditions?.quotas?.hasOwnProperty(index)) {
        if (!(question?.conditions?.quotas?.[index] - cntCompleted)) {
          mirats_status = 40;
          setErrCode(40);
          setErrMsg("Respondent went over quota within the Lucid Marketplac");
          addQualificationResponseInSessions(body, mirats_status);
          return;
        }
      }
      addQualificationResponseInSessions(body, mirats_status);

      if (isFinalQuestion) {
        if (gamma === "alpha") history.push(predirectUrl);
        else history.push(refereneUrl);
        console.log("Cangrats You are qualify for the survey");
      } else history.push(nextQuestionUrl);
    } else {
      if (gamma === "alpha") {
        addQualificationResponseInSessions(body, mirats_status);
        history.push(predirectUrl);
      } else {
        setErrCode(mirats_status);
        setErrMsg(
          `Respondent failed on a ${
            mirats_status === 23 ? "standard" : "custom"
          } qualification`
        );
      }
    }
    setResponse("");
  };

  const handleMultiPunch = () => {
    let mirats_status,
      flag = true;

    multiPunchResp?.map((res) => {
      const user_res = parseInt(res);
      if (!question?.conditions?.valid_options?.includes(user_res))
        flag = false;
    });

    const body = {
      question_name: question?.question_name,
      question_id: String(questionNumber),
      user_response: multiPunchResp,
    };
    setMultiPunchRes([]);

    let cntCompleted = {};
    for (let i = 0; i < multiPunchResp?.length; i++) {
      cntCompleted[multiPunchResp[i]] = 0;
    }
    sessions?.map((session) => {
      let ans;
      session?.responses?.map((resp) => {
        if (resp?.question_id === question?.question_id)
          ans = resp?.user_response;
      });
      Object.keys(cntCompleted).map((key) => {
        if (ans?.indexOf(parseInt(key)) !== -1) cntCompleted[key]++;
      });
    });

    question?.is_core_demographic ? (mirats_status = 23) : (mirats_status = 24);
    // conditions for right answer
    addQualificationResponseInSessions(body, mirats_status);

    if (multiPunchResp.length < question?.conditions?.how_many?.min) {
      if (gamma === "alpha") history.push(predirectUrl);
      else
        setError(
          `Select Minimum ${question?.conditions?.how_many?.min} options`
        );
    } else if (multiPunchResp.length > question?.conditions?.how_many?.max) {
      if (gamma === "alpha") history.push(predirectUrl);
      else
        setError(
          `Select maximum ${question?.conditions?.how_many?.max} options`
        );
    } else if (!flag) {
      if (gamma === "alpha") history.push(predirectUrl);
      else {
        setErrCode(mirats_status);
        setErrMsg(
          `Respondent failed on a ${
            mirats_status === 23 ? "standard" : "custom"
          } qualification`
        );
      }
    } else {
      if (isFinalQuestion) {
        isFinalQuestion ? (mirats_status = 3) : (mirats_status = 1);
        addQualificationResponseInSessions(body, mirats_status);
        if (gamma === "alpha") history.push(predirectUrl);
        else history.push(refereneUrl);
        console.log("Cangrats You are qualify for the survey");
        return;
      }
      history.push(nextQuestionUrl);
    }
  };

  const handleNumericOpenEnd = () => {
    let mirats_status;
    const body = {
      question_name: question?.question_name,
      question_id: String(questionNumber),
      user_response: response,
    };
    const user_res = parseInt(response);
    question?.is_core_demographic ? (mirats_status = 23) : (mirats_status = 24);

    let flag = false,
      optIndexForUserAns,
      rangeForUserAns;
    question?.conditions?.valid_responses?.map((res, i) => {
      if (res.from <= user_res && user_res <= res.to) {
        optIndexForUserAns = i;
        rangeForUserAns = res;
        flag = true;
      }
    });

    let cntCompleted = 0;
    sessions.forEach((session) => {
      if (session?.mirats_status === 3) {
        let response;
        session?.responses?.map((resp) => {
          if (parseInt(question?.question_id) === parseInt(resp?.question_id)) {
            response = parseInt(resp?.user_response);
          }
        });
        if (
          response >= rangeForUserAns?.from &&
          response <= rangeForUserAns?.to &&
          session?.client_status === 10
        ) {
          cntCompleted++;
        }
      }
    });

    if (flag) {
      setResponse("");
      setError("");
      isFinalQuestion ? (mirats_status = 3) : (mirats_status = 1);
      if (question?.conditions?.quotas?.hasOwnProperty(optIndexForUserAns)) {
        if (
          !(question?.conditions?.quotas[optIndexForUserAns] - cntCompleted)
        ) {
          mirats_status = 40;
          setErrCode(40);
          setErrMsg("Respondent went over quota within the Lucid Marketplac");
          addQualificationResponseInSessions(body, mirats_status);
          return;
        }
      }
      addQualificationResponseInSessions(body, mirats_status);
      if (isFinalQuestion) {
        if (gamma === "alpha") history.push(predirectUrl);
        else history.push(refereneUrl);
        console.log("Cangrats You are qualify for the survey");
      } else history.push(nextQuestionUrl);
    } else {
      if (gamma === "alpha") {
        addQualificationResponseInSessions(body, mirats_status);
        history.push(predirectUrl);
      } else {
        setErrCode(mirats_status);
        setErrMsg(
          `Respondent failed on a ${
            mirats_status === 23 ? "standard" : "custom"
          } qualification`
        );
      }
    }
  };

  const handleTextOpenEnd = () => {
    let mirats_status;
    const body = {
      question_name: question?.question_name,
      question_id: String(questionNumber),
      user_response: response,
    };
    setResponse("");
    setError("");
    question?.is_core_demographic ? (mirats_status = 23) : (mirats_status = 24);
    isFinalQuestion ? (mirats_status = 3) : (mirats_status = 1);
    addQualificationResponseInSessions(body, mirats_status);
    if (isFinalQuestion) {
      if (gamma === "alpha") history.push(predirectUrl);
      else history.push(refereneUrl);
      console.log("congrats you are qualify for the survey");
      return;
    }
    history.push(nextQuestionUrl);
  };

  const addQualificationResponseInSessions = (body, mirats_status) => {
    addQualificationResponse(surveyID, sessionID, body, gamma, mirats_status)
      .then((res) => console.log("responses added"))
      .catch((err) => console.log(err));
  };

  const handleNextBtn = (e) => {
    e.preventDefault();
    switch (question?.question_type) {
      case "Single Punch":
        handleSinglePunch();
        break;
      case "Multi Punch":
        handleMultiPunch();
        break;
      case "Numeric - Open-end":
        handleNumericOpenEnd();
        break;
      case "Text - Open-end":
        handleTextOpenEnd();
        break;
      default:
        return;
    }
  };

  const handleMultiPunchChange = (e) => {
    const value = parseInt(e.target.value);
    if (e.target.checked) {
      setMultiPunchRes((prevData) => [...prevData, value]);
    } else {
      setMultiPunchRes(multiPunchResp.filter((val) => val !== value));
    }
  };

  // fetch the question, options and its related data according to question number and set the question state
  useEffect(() => {
    // setMultiPunchRes([default_responses?.[`${questionNumber}`]]);
    setResponse(default_responses?.[`${questionNumber}`]);

    const func = async () => {
      setShowSkeleton(true);
      let sessionType = gamma == "alpha" ? "TestSessions" : "Sessions";
      let session = await getSessionBasedOnType(
        surveyID,
        sessionID,
        sessionType
      );

      // ---- >>>>> don't open the question page if mirats mirats_status is 24 or 23 or 40
      if (session.data()?.mirats_status === 24) {
        // history.push(
        // 	`/blaze/${encryptedID}/lightningStart?SRCID=${srcID}&RID=${rID}&gamma=${gamma}`
        // )
        setErrCode(24);
        setErrMsg("Respondent failed on a custom qualification");
        return;
      }
      if (session.data()?.mirats_status === 23) {
        setErrCode(23);
        setErrMsg(
          "Respondent failed on a standard qualification such as age, gender, etc qualification"
        );
        return;
      }
      if (session.data()?.mirats_status === 40) {
        setErrCode(40);
        setErrMsg("Respondent went over quota within the Lucid Marketplace");
        return;
      }
      let moveToQuestionNo;
      getSurvey(surveyID)
        .then(async (data) => {
          moveToQuestionNo = data?.qualifications?.questions[0]?.question_id;
          const responses = session.data()?.responses;
          let questions = data?.qualifications?.questions;
          questions = questions?.filter((que) => que?.status);

          for (var i = 0; i < questions.length; i++) {
            let question_id = String(questions[i]?.question_id);
            let responseOfQId = responses && responses[i]?.question_id;
            // if question has not been yet attempted
            if (question_id !== responseOfQId) {
              moveToQuestionNo = question_id;
              const ql_question = await getQuestion(moveToQuestionNo);
              setQuestion((oldData) => {
                return {
                  ...oldData,
                  ...questions[i],
                  ...ql_question.data()?.lang[data?.country?.code],
                  question_type: ql_question.data()?.question_type,
                  is_core_demographic: ql_question.data()?.is_core_demographic,
                  question_name: ql_question.data()?.name,
                };
              });
              if (questions[i + 1]?.status && questions[i + 1]?.question_id) {
                setNextQNumber(questions[i + 1]?.question_id);
              } else {
                setIsFinalQuestion(true);
              }
              break;
            }
          }

          if (!session.data().hasOwnProperty("gdpr_consent")) {
            history.push(`/blaze/${encryptedID}/gdpr-consent`);
          } else {
            if (
              !session.data()?.gdpr_consent &&
              session?.mirats_status === 236
            ) {
              setErrCode(236);
              setErrMsg(
                "EU-based respondent terminated when they did not consent to GDPR"
              );
              return;
            } else if (moveToQuestionNo != questionNumber) {
              history.push(
                `/blaze/${encryptedID}/questions/${moveToQuestionNo}`
              );
            }
          }

          setShowSkeleton(false);
        })
        .catch((err) => console.log(err));
    };
    questionNumber && func();
  }, [questionNumber]);

  window.addEventListener("popstate", () => {
    history.go(1);
  });

  return (
    <>
      {loading && !errCode && !errMsg && <Loader />}
      {!loading && errCode && errMsg && (
        <ErrorPage errCode={errCode} errMsg={errMsg} />
      )}
      {!loading && !errMsg && !errCode && (
        <div className="qualification_question_page">
          <img src={Logo} alt="" className="qualification-page-logo" />
          <div className="line_design"></div>
          <Question
            question={question}
            error={error}
            response={response}
            setResponse={setResponse}
            handleMultiPunchChange={handleMultiPunchChange}
            showSkeleton={showSkeleton}
            response={response}
            multiPunchResp={multiPunchResp}
          />
          <div className="survey_page_question_options">
            <div className="survey_page_btns">
              <div className="survey_page_next_btn">
                <form onSubmit={handleNextBtn}>
                  {isFinalQuestion ? (
                    <button
                      onClick={handleNextBtn}
                      className="finish_btn"
                      type="submit"
                    >
                      Finish
                    </button>
                  ) : (
                    <button
                      type="submit"
                      onClick={handleNextBtn}
                      onKeyPress={handleNextBtn}
                      className="next_btn"
                    >
                      Next
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>
          <div className="powered_by_text">
            <span>
              Powered by <span>Mirats Insights</span>
            </span>
            <div className="privacy_terms">
              <span>
                <a href="#">Privacy Policy</a> | <a href="#">General Terms</a>
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SurveyQuestions;
