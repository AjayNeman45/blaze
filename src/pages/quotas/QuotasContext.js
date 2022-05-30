import { doc, getDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import {
  getAllSessions,
  getQuestion,
  getSurvey,
} from "../../utils/firebaseQueries";

const QuotasContext = createContext();

export const useQuotasContext = () => {
  return useContext(QuotasContext);
};

const QuotasContextProvider = ({ children }) => {
  const [survey, setSurvey] = useState();
  const { surveyID } = useParams();
  const [qualifications, setQualifications] = useState([]);
  const [totalData, setTotalData] = useState([]);
  useEffect(() => {
    getSurvey(surveyID)
      .then((data) => {
        getQualificationsForQuotas(data);
        setSurvey(data);
      })
      .catch((err) => console.log(err.message));
  }, [surveyID]);

  const getQualificationsForQuotas = (surveyData) => {
    setQualifications([]);

    surveyData?.qualifications?.questions?.map(async (question) => {
      const qid = question?.question_id;
      let completes = {},
        totalCompletes = 0,
        totalPrescreens = 0,
        prescreens = 0;

      let quotasLen =
        question?.conditions?.quotas &&
        Object.keys(question?.conditions?.quotas)?.length;
      if (!question?.status) return;

      // --->>> fetch all the sessions and the find out complete and prescreens sessions
      const questionData = await getQuestion(qid);

      if (question?.conditions?.hasOwnProperty("valid_responses")) {
        question?.conditions?.valid_responses?.map((valid_res) => {
          completes[`${valid_res?.from}-${valid_res?.to}`] = 0;
        });
      } else {
        question?.conditions?.valid_options?.map((valid_opt) => {
          completes[
            questionData.data()?.lang[surveyData?.country?.code]?.options?.[
              valid_opt
            ]
          ] = 0;
        });
      }

      getAllSessions(surveyID).then(async (sessions) => {
        sessions.forEach((session) => {
          const sd = session.data();
          if (sd?.mirats_status === 3) totalPrescreens++;
          if (sd?.client_status === 10) totalCompletes++;
          let user_resp;
          switch (questionData.data()?.question_type) {
            case "Numeric - Open-end":
              sd?.responses?.map((resp) => {
                if (parseInt(resp?.question_id) === qid) {
                  user_resp = parseInt(resp?.user_response);
                }
              });

              question?.conditions?.valid_responses?.map(
                (valid_resp, index) => {
                  if (
                    index < quotasLen &&
                    user_resp >= valid_resp?.from &&
                    user_resp <= valid_resp?.to
                  ) {
                    prescreens++;
                    if (parseInt(sd?.client_status) === 10) {
                      completes[`${valid_resp?.from}-${valid_resp?.to}`]++;
                    }
                  }
                }
              );
              break;
            case "Single Punch":
              sd?.responses?.map((resp) => {
                if (parseInt(resp?.question_id) === qid) {
                  user_resp = parseInt(resp?.user_response);
                }
              });
              question?.conditions?.valid_options?.map((valid_opt, index) => {
                if (user_resp === parseInt(valid_opt)) {
                  prescreens++;
                  if (
                    sd?.client_status === 10 &&
                    question?.conditions?.quotas?.hasOwnProperty(String(index))
                  ) {
                    completes[
                      questionData.data()?.lang[surveyData?.country?.code]
                        ?.options?.[valid_opt]
                    ]++;
                  }
                }
              });
              break;
            case "Multi Punch":
              sd?.responses?.map((resp) => {
                if (parseInt(resp?.question_id) === qid) {
                  user_resp = resp?.user_response;
                }
              });
              user_resp?.length &&
                user_resp?.map((ans) => {
                  let flag = false;
                  question?.conditions?.valid_options?.map(
                    (valid_opt, index) => {
                      if (ans === valid_opt) {
                        flag = true;
                        if (
                          sd?.client_status === 10 &&
                          question?.conditions?.quotas?.hasOwnProperty(
                            String(index)
                          )
                        ) {
                          completes[
                            questionData.data()?.lang[surveyData?.country?.code]
                              ?.options?.[valid_opt]
                          ]++;
                        }
                      }
                    }
                  );
                  if (flag) prescreens++;
                });
              break;
            default:
              return;
          }
        });

        setQualifications((prevData) => [
          ...prevData,
          {
            ...question,
            ...questionData.data()?.lang[surveyData?.country?.code],
            question_type: questionData.data()?.question_type,
            question_name: questionData.data()?.name,
            conditions: question?.conditions ? question?.conditions : null,
            completes,
            prescreens,
          },
        ]);
        setTotalData({
          total_completes: totalCompletes,
          total_prescreens: totalPrescreens,
          total_remaining:
            parseInt(surveyData?.no_of_completes) - parseInt(totalCompletes),
          total_conversion: Math.round(
            (totalCompletes / totalPrescreens) * 100
          ),
        });
      });
    });
  };

  console.log(qualifications);

  const value = {
    survey,
    qualifications,
    getQualificationsForQuotas,
    setQualifications,
    totalData,
  };
  return (
    <QuotasContext.Provider value={value}>{children}</QuotasContext.Provider>
  );
};

export default QuotasContextProvider;
