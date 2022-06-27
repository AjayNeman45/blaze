import React, { useEffect, useState } from "react";
import ErrorPage from "../../../components/error-page/ErrorPage";
import { useGdprContext } from "./GdprConsentContext";
import Logo from "../../../assets/images/insights.png";
import "./Gdpr.css";

const GdprConsent = () => {
  const { setGdprConsent, errCode, errMsg, survey } = useGdprContext();
  const [response, setResponse] = useState();
  return (
    <>
      {errCode && errMsg ? (
        <ErrorPage errCode={errCode} errMsg={errMsg} />
      ) : (
        <div className="gdpr_consent_page">
          <img src={Logo} alt="" className="qualification-page-logo" />
          <div
            className="line_design"
            style={{ width: "100%", margin: "0 auto" }}
          ></div>
          <div className="survey_page_question_options">
            <label className="gdpr_aggrement_title">
              {" "}
              Namaste! Welcome to the survey, powered by Mirats Insights, LLC.
            </label>

            <div className="gdpr_aggrement">
              <p className="gdpr_aggrement_desc">
                We're conducting research, and we think you might be the perfect
                candidate for us. So we'd love to hear from you. The survey
                should only take less than{" "}
                <b>{parseInt(survey?.expected_completion_loi) + 5}</b> minutes,
                and your responses are completely anonymous. <br /> <br />
                You can only take the survey once; you're not allowed to resume
                the study—questions marked with an asterisk (*) are required.
                <br /> <br />
                We generally collect the following technical user data: IP
                address(es), Cookie IDs, device IDs, and other data entered by
                you related to your demographics, lifestyle, and interests.
                Before accessing this survey, you must provide your opt-in
                consent to collect your Data according to the conditions below.
                <br /> <br />
              </p>
              <span> Do you agree with the points below?</span>
              <ul className="gdpr_aggrement_points">
                <li>
                  <em>
                    <a href="#">General Terms </a>
                  </em>
                  related to your access.
                </li>
                <li>
                  <em>
                    <a href="#">Privacy Policy</a>
                  </em>{" "}
                  for sharing your data
                </li>
                <li>
                  <em>
                    <a href="#">Cookie Policy </a>
                  </em>{" "}
                  for cookies and other tracking technologies.
                </li>
                <li>
                  You consent to Mirats Insights' processing of your information
                  on secure servers in the United States.
                </li>
              </ul>
              <br /> <br />
              <p className="gdpr_aggrement_last_note">
                <em>
                  You can enforce your Subject Access Rights, including the
                  withdrawal of your consent, by visiting{" "}
                  <em>
                    <a href="#" className="data_rights_link">
                      Mirats Insights Data Rights Portal.
                    </a>
                  </em>
                </em>
                <br /> <br />
                If you have any questions about the survey, please email us:
                &nbsp;
                <a href="#" className="mail_link">
                  support_globalsurveys@miratsinsights.com.
                </a>
                <br /> <br />
                We appreciate your input!
              </p>
            </div>

            <div className="survey_question_response_section">
              <div className="survey_question_option">
                <input
                  type="radio"
                  id="agree"
                  name="option"
                  value="agree"
                  onChange={(e) => setResponse(true)}
                />
                <label htmlFor="agree">Agree</label>
              </div>
              <div className="survey_question_option">
                <input
                  type="radio"
                  id="disagree"
                  name="option"
                  value="disagree"
                  onChange={(e) => setResponse(false)}
                />
                <label htmlFor="disagree">Disagree</label>
              </div>
            </div>
            <div className="survey_page_btns">
              <div className="survey_page_next_btn">
                <button
                  className="next_btn"
                  onClick={() => setGdprConsent(response)}
                >
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
      )}
    </>
  );
};

export default GdprConsent;
