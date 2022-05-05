import { Skeleton, Typography } from "@mui/material";
import React from "react";
import "../../pages/survey-questions/SurveyQuestions.css";
import { v4 as uuid } from "uuid";
const variants = ["h1", "h3", "body1", "caption"];

const Question = ({
  question,
  error,
  response,
  setResponse,
  multiPunchResp,
  handleMultiPunchChange,
  loading,
  showSkeleton,
}) => {
  return (
    <>
      {showSkeleton ? (
        <div className="question_page_skeleton">
          <Skeleton animation="wave" width={500} height={50} />
          <Skeleton animation="wave" width={800} height={50} />
          <Skeleton animation="wave" width={800} height={50} />
        </div>
      ) : (
        <div className="survey_page">
          {loading ? (
            <div className="question_page_skeleton">
              {variants.map((variant) => (
                <Typography component="div" key={uuid()} variant={variant}>
                  {loading ? <Skeleton /> : variant}
                </Typography>
              ))}
            </div>
          ) : (
            <div className="survey_page_question_options">
              <p className="survey_page_question">{question?.question_text}</p>
              <div className="survey_question_response_section">
                {(() => {
                  switch (question.question_type) {
                    case "Single Punch":
                      return (
                        <div>
                          <div className="survey_page_question_desc">
                            <p>Select one correct option</p>
                          </div>
                          {error && (
                            <span
                              style={{
                                color: "red",
                              }}
                            >
                              {error}
                            </span>
                          )}
                          {question?.display_options?.map((option, index) => (
                            <div className="survey_question_option" key={index}>
                              <input
                                type="radio"
                                id={option}
                                name="option"
                                value={option}
                                defaultChecked={option === response}
                                onChange={(e) => setResponse(e.target.value)}
                              />
                              <label htmlFor={option}>
                                {question?.options[option]}
                              </label>
                            </div>
                          ))}
                        </div>
                      );
                    case "Multi Punch":
                      return (
                        <div className="multi_punch">
                          <div className="survey_page_question_desc">
                            <p>Mulitple choice question</p>
                            &nbsp;
                            <p>
                              (Select atleast{" "}
                              {question?.conditions?.how_many?.min} and atmost{" "}
                              {question?.conditions?.how_many?.max})
                            </p>
                          </div>
                          {error && (
                            <span
                              style={{
                                color: "red",
                              }}
                            >
                              {error}
                            </span>
                          )}
                          {question?.display_options?.map((option, index) => (
                            <div className="inputGroup">
                              <input
                                id={index}
                                name="option"
                                type="checkbox"
                                value={option}
                                onChange={handleMultiPunchChange}
                                defaultChecked={multiPunchResp.includes(option)}
                              />
                              <label htmlFor={index}>
                                {question?.options[option]}
                              </label>
                            </div>
                          ))}
                        </div>
                      );
                    case "Numeric - Open-end":
                      return (
                        <div>
                          <span className="survey_page_question_desc">
                            Response should be in numeric format
                          </span>
                          {error && (
                            <span
                              style={{
                                color: "red",
                              }}
                            >
                              {error}
                            </span>
                          )}
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
                      );
                    case "Text - Open-end":
                      return (
                        <div>
                          <div className="survey_page_question_desc">
                            <p>Response should be in text format</p>
                          </div>
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
                      );
                    case "textarea":
                      return (
                        <div>
                          <textarea
                            className="survey_page_textarea"
                            placeholder="Your answer"
                            value={response}
                            onChange={(e) => setResponse(e.target.value)}
                          />
                        </div>
                      );
                    // case "select":
                    //   return (
                    //     <div>
                    //       <select
                    //         className="survey_page_select"
                    //         onChange={(e) => setResponse(e.target.value)}
                    //       >
                    //         {data[questionNumber - 1].options.map((option, index) => (
                    //           <option key={index}>{option}</option>
                    //         ))}
                    //       </select>
                    //     </div>
                    //   );
                    default:
                      return;
                  }
                })()}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Question;
