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
      let completes = [],
        totalCompletes = 0,
        totalPrescreens = 0,
        prescreens = 0;
      let quotasLen = Object.keys(question?.conditions?.quotas)?.length;
      for (let i = 0; i < quotasLen; i++) {
        completes.push(0);
      }

      if (!question?.status) return;

      // --->>> fetch all the sessions and the find out complete and prescreens sessions
      const questionData = await getQuestion(qid);

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
                    console.log("yess....");
                    prescreens++;
                    if (parseInt(sd?.client_status) === 10) {
                      completes[index]++;
                    }
                  }
                }
              );
            case "Single Punch":
              sd?.responses?.map((resp) => {
                if (parseInt(resp?.question_id) === qid) {
                  user_resp = parseInt(resp?.user_response);
                }
              });
              user_resp < quotasLen &&
                question?.conditions?.valid_options?.map((valid_opt, index) => {
                  if (user_resp === valid_opt) {
                    prescreens++;
                    if (parseInt(sd?.client_status) === 10) {
                      completes[index]++;
                    }
                  }
                });
            default:
              return;
          }
        });
        console.log(question?.question_id, completes, prescreens);
        setQualifications((prevData) => [
          ...prevData,
          {
            ...question,
            ...questionData.data()?.lang["ENG-IN"],
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
          total_remaining: totalPrescreens - totalCompletes,
          total_conversion: (totalCompletes / totalPrescreens) * 100,
        });
      });
    });
  };

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
