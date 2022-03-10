import React, { useState } from "react";

const Age = () => {
  const [response, setResponse] = useState();

  const handleNextBtn = () => {
    console.log("dgfsdg");
  };
  return (
    <div className="survey_page">
      <div className="line_design"></div>
      <div className="survey_page_question_options">
        <p className="survey_page_question">GDPR consent</p>
        <p className="survey_page_desc">Please give gdpr consent</p>
        <div className="survey_question_response_section">
          <div>
            <input
              type="text"
              className="survey_page_input"
              placeholder="Your response"
              value={response}
              onChange={(e) => {
                setResponse(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="survey_page_btns">
          <div className="survey_page_next_btn">
            <button className="next_btn" onClick={handleNextBtn}>
              Next
            </button>
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
  );
};

export default Age;
