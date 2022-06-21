import { Skeleton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQualificationsContext } from "../pages/qualifications/QualificationsContext";
import Question from "./question/Question";
import Logo from "../assets/images/insights.png";
const variants = ["h1", "h3", "body1", "caption"];

const QuestionPreview = () => {
  const { qualifications } = useQualificationsContext();
  const { questionNumber } = useParams();
  const [question, setQuestion] = useState({});
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState();
  const [multiPunchResp, setMultiPunchResp] = useState([]);
  useEffect(() => {
    setLoading(true);
    qualifications?.map((qualification) => {
      if (qualification.question_id == String(questionNumber)) {
        setQuestion(qualification);
        setLoading(false);
        return;
      }
    });
  }, [qualifications]);

  return (
    <>
      <div className="qualification_question_page">
        <img src={Logo} alt="" className="qualification-page-logo" />
        <div className="line_design"></div>
        <Question
          question={question}
          error=""
          response={response}
          multiPunchResp={multiPunchResp}
          setResponse={setResponse}
          handleMultiPunchChange=""
          loading={loading}
        />
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
    </>
  );
};

export default QuestionPreview;
