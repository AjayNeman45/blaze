import React, { useEffect, useMemo, useState } from "react";
import styles from "./createQualifications.module.css";
import { AiOutlineDelete } from "react-icons/ai";
// Modal
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { styled } from "@mui/material/styles";

// Autocomplete MuI
import PropTypes from "prop-types";
import { useAutocomplete } from "@mui/base/AutocompleteUnstyled";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useQualificationLibraryContext } from "../QuestionLibraryContext";
import Select from "react-select";
import countryList from "react-select-country-list";
import { surveySelectStyle } from "../../survey-groups/CreateSurveyGroup/CreateSurveyGroupModal";

// MOdal
const style = {
  position: "absolute",
  height: "450px",
  width: "850px",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "#FFFFFF",
  border: "1px solid #F1F1F1",
  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
  borderRadius: "30px",
  p: 5,
};

const questionTypeOptions = [
  { label: "Single Punch", value: "Single Punch" },
  { label: "Multi Punch", value: "Multi Punch" },
  { label: "Numeric - Open-end", value: "Numeric - Open-end" },
  { label: "Text - Open-end", value: "Text - Open-end" },
];

function CreateQualifications({ openModal, setOpenModal }) {
  const {
    setQualificationData,
    qualificationData,
    maxQuestionID,
    handleAddQuestionBtn,
  } = useQualificationLibraryContext();

  const [countryLanguage, setCountryLanguage] = useState({});

  const [currentModal, setCurrentModal] = useState(false);

  useEffect(() => {
    setCurrentModal(openModal);
  }, [openModal]);

  const handleQualDataChange = (val, key) => {
    setQualificationData((prevData) => {
      return {
        ...prevData,
        [key]: val,
      };
    });
  };

  return (
    <div>
      <QestionNameTypeModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        para={"first"}
      />
    </div>
  );
}

const QestionNameTypeModal = ({ openModal, setOpenModal, para }) => {
  const [modalFor, setModalFor] = useState();
  const { qualificationData, setQualificationData } =
    useQualificationLibraryContext();
  useEffect(() => {
    setModalFor(para);
  }, [para]);

  return (
    <>
      <div>
        <Modal
          open={openModal}
          onClose={() => {
            setQualificationData({});
            setModalFor("first");
            setOpenModal(false);
          }}
        >
          {(() => {
            switch (modalFor) {
              case "first":
                return <FirstModal setModalFor={setModalFor} />;
              case "second":
                return <SecondModal setModalFor={setModalFor} />;
              case "third":
                return <ThirdModal setModalFor={setModalFor} />;
              case "fourth":
                return <FourthModal setModalFor={setModalFor} />;
              case "fifth":
                return <FifthModal setModalFor={setModalFor} />;
              default:
                return;
            }
          })()}
        </Modal>
      </div>
    </>
  );
};

const FirstModal = ({ setModalFor }) => {
  const { qualificationData, setQualificationData, maxQuestionID } =
    useQualificationLibraryContext();
  const [disabledBtn, setDisabledBtn] = useState(true);

  useEffect(() => {
    if (
      qualificationData?.hasOwnProperty("name") &&
      qualificationData?.name?.length &&
      qualificationData?.hasOwnProperty("question_type")
    ) {
      setDisabledBtn(false);
    } else {
      setDisabledBtn(true);
    }
  }, [qualificationData]);

  return (
    <Box sx={style}>
      <div className={styles.firstModal_container}>
        <div className={styles.qualification_name}>
          <h1 className={styles.create_qualification_title}>
            Create Qualifications
          </h1>
          <p className={styles.servey_Id}>Question ID : {maxQuestionID}</p>
        </div>

        <h2 className={styles.qualification_title}>Qualification Name</h2>

        <div className={styles.inputContainer1}>
          <input
            type="text"
            value={qualificationData?.name}
            onChange={(e) => {
              setQualificationData((prevData) => {
                return {
                  ...prevData,
                  name: e.target.value,
                };
              });
            }}
          />
        </div>

        <div className={styles.qualification_type}>
          <h2 className={styles.qualification_title}>Qualification Type</h2>
        </div>

        <div className={styles.selectInput_Container}>
          <select
            value={qualificationData?.question_type}
            onChange={(e) => {
              setQualificationData((prevData) => {
                return {
                  ...prevData,
                  question_type: e.target.value,
                };
              });
            }}
          >
            <option selected disabled hidden>
              select qualification type
            </option>
            <option value="Single Punch">Single Punch</option>
            <option value="Multi Punch">Multi Punch</option>
            <option value="Numeric - Open-end">Numeric - Open-end</option>
            <option value="Text - Open-end">Text - Open-end</option>
          </select>
        </div>

        <div className={styles.btnContainer1}>
          <button
            onClick={() => {
              setModalFor("second");
            }}
            disabled={disabledBtn}
            className={styles.modal1_btn}
          >
            Next
          </button>
        </div>
      </div>
    </Box>
  );
};

const SecondModal = ({ setModalFor }) => {
  const { qualificationData, setQualificationData, maxQuestionID } =
    useQualificationLibraryContext();
  const [disabledBtn, setDisabledBtn] = useState(true);

  useEffect(() => {
    if (
      qualificationData.hasOwnProperty("question_status") &&
      qualificationData?.hasOwnProperty("is_core_demographic")
    ) {
      setDisabledBtn(false);
    } else {
      setDisabledBtn(true);
    }
  }, [qualificationData]);

  return (
    <Box sx={style}>
      <div className={styles.modal2_mainContainer}>
        <div className={styles.question_status}>
          <h1 className={styles.create_qualification_title}>
            Create Qualifications
          </h1>
          <p className={styles.servey_Id}>Question ID : {maxQuestionID}</p>
        </div>
        <div className={styles.question_Status_container}>
          <h2 className={styles.question_status_title}>Question status</h2>
          <select
            value={qualificationData?.question_status}
            onChange={(e) => {
              setQualificationData((prevData) => {
                return {
                  ...prevData,
                  question_status: e.target.value,
                };
              });
            }}
          >
            <option selected disabled hidden>
              select question status
            </option>
            <option value="active">Active</option>
            <option value="inactive">In Active</option>
          </select>
        </div>

        <div className={styles.demographic_container}>
          <h2 className={styles.question_status_title}>Is Core Demorgraphic</h2>
          <div className={styles.is_core_demogrphic_container}>
            <div className={styles.is_core_demographic_input_container}>
              <input
                type="radio"
                name="isCoreDemographic"
                value={true}
                id="yes"
                onChange={(e) => {
                  setQualificationData((prevData) => {
                    return {
                      ...prevData,
                      is_core_demographic: true,
                    };
                  });
                }}
                checked={qualificationData?.is_core_demographic}
              />
              &nbsp;
              <label>Yes</label>
            </div>
            <div className={styles.is_core_demographic_input_container}>
              <input
                type="radio"
                name="isCoreDemographic"
                value={false}
                id="no"
                onChange={(e) => {
                  setQualificationData((prevData) => {
                    return {
                      ...prevData,
                      is_core_demographic: false,
                    };
                  });
                }}
                checked={!qualificationData?.is_core_demographic}
              />{" "}
              &nbsp;
              <label htmlFor="no">No</label>
            </div>
          </div>
        </div>

        <div className={styles.secondModal_btn}>
          <button
            className={styles.Backbtn}
            onClick={() => setModalFor("first")}
          >
            Back
          </button>

          <button
            className={styles.nextBtn}
            onClick={() => setModalFor("third")}
            disabled={disabledBtn}
          >
            Next
          </button>
        </div>
      </div>
    </Box>
  );
};

const ThirdModal = ({ setModalFor }) => {
  const countries = useMemo(() => countryList().getData(), []);
  const { qualificationData, setQualificationData, maxQuestionID } =
    useQualificationLibraryContext();
  const [countryLanguage, setCountryLanguage] = useState();
  const [disabledBtn, setDisabledBtn] = useState(true);

  useEffect(() => {
    if (
      countryLanguage?.hasOwnProperty("country") &&
      countryLanguage.hasOwnProperty("language")
    ) {
      setDisabledBtn(false);
    } else {
      setDisabledBtn(true);
    }
    setQualificationData((prevData) => {
      return {
        ...prevData,
        "country-language":
          countryLanguage?.language + "-" + countryLanguage?.country,
      };
    });
  }, [countryLanguage]);

  return (
    <Box sx={style}>
      <div className={styles.thirdModal_container}>
        <div className={styles.headingContainer}>
          <h1 className={styles.qualificationTitle}>Create Qualifications</h1>
          <p className={styles.servey_Id}>Question ID : {maxQuestionID}</p>
        </div>

        <div className={styles.country_container}>
          <h2 className={styles.countryName}>Country</h2>
          <Select
            options={countries}
            styles={surveySelectStyle}
            onChange={(e) =>
              setCountryLanguage((prevData) => {
                return {
                  ...prevData,
                  country: e.value,
                };
              })
            }
            className={styles.selectInput}
          />
        </div>

        <div className={styles.secondInputContainer}>
          <h2 className={styles.languageName}>Language</h2>
          <select
            value={countryLanguage?.language}
            onChange={(e) => {
              setCountryLanguage((prevData) => {
                return {
                  ...prevData,
                  language: e.target.value,
                };
              });
            }}
          >
            <option selected disabled hidden>
              Select the country and Language
            </option>
            <option value="ENG">English</option>
            <option value="FRA">French</option>
            <option value="GER">German</option>
            <option value="JPN">Japanese</option>
            <option value="ESP">Spanish</option>
          </select>
        </div>

        <div className={styles.btnContainer}>
          <button
            onClick={() => {
              setModalFor("second");
            }}
            className={styles.Backbtn}
          >
            Back
          </button>
          <button
            className={styles.nextBtn}
            onClick={() => setModalFor("fourth")}
            disabled={disabledBtn}
          >
            Next
          </button>
        </div>
      </div>
    </Box>
  );
};

const FourthModal = ({ setModalFor }) => {
  const {
    qualificationData,
    setQualificationData,
    maxQuestionID,
    handleAddQuestionBtn,
  } = useQualificationLibraryContext();
  const [disabledBtn, setDisabledBtn] = useState(true);

  useEffect(() => {
    let tmp = qualificationData?.lang?.[qualificationData["country-language"]];
    if (tmp?.hasOwnProperty("question_text")) {
      if (tmp?.question_text.length) {
        setDisabledBtn(false);
      } else {
        setDisabledBtn(true);
      }
    } else {
      setDisabledBtn(true);
    }
  }, [qualificationData]);
  return (
    <Box sx={style}>
      <div className={styles.questionTextContainer}>
        <div className={styles.qualificationContainer}>
          <h1 className={styles.titleQualification}>Create Qualifications</h1>
          <p className={styles.servey_Id}>Question ID : {maxQuestionID}</p>
        </div>

        <div className={styles.textareaContainer}>
          <h2 className={styles.questionTitle}>Qualification Question Text</h2>
          <textarea
            rows={4}
            cols={70}
            value={
              qualificationData?.lang?.[qualificationData["country-language"]]
                ?.question_text
            }
            onChange={(e) => {
              setQualificationData((prevData) => {
                return {
                  ...prevData,
                  lang: {
                    ...prevData?.lang,
                    [qualificationData["country-language"]]: {
                      question_text: e.target.value,
                    },
                  },
                };
              });
            }}
          />
        </div>

        <div className={styles.btnContainer}>
          <button
            onClick={() => {
              let tmp = qualificationData;
              delete tmp?.lang?.[qualificationData?.["country-language"]];
              setQualificationData(tmp);
              setModalFor("third");
            }}
            className={styles.Backbtn}
          >
            Back
          </button>
          {qualificationData?.question_type === "Single Punch" ||
          qualificationData?.question_type === "Multi Punch" ? (
            <button
              onClick={() => {
                setModalFor("fifth");
              }}
              disabled={disabledBtn}
              className={styles.nextBtn}
            >
              Next
            </button>
          ) : (
            <button
              className={styles.nextBtn}
              onClick={handleAddQuestionBtn}
              disabled={disabledBtn}
            >
              Finish
            </button>
          )}
        </div>
      </div>
    </Box>
  );
};

const FifthModal = ({ setModalFor }) => {
  const {
    qualificationData,
    setQualificationData,
    handleAddQuestionBtn,
    maxQuestionID,
  } = useQualificationLibraryContext();
  const [optionsCnt, setOptionsCnt] = useState(2);
  const [optionsTexts, setOptionsTexts] = useState({});
  const [disabledBtn, setDisabledBtn] = useState(true);
  // const [deleteBtn, setDeleteBtn] = useState(false);

  const handleDelete = (e, i) => {};

  useEffect(() => {
    if (Object.keys(optionsTexts).length >= 2) {
      setDisabledBtn(false);
    } else {
      setDisabledBtn(true);
    }
    let optionsArr = [];
    Object.keys(optionsTexts)?.map((key) => {
      optionsArr.push(optionsTexts[key]);
    });
    qualificationData?.["country-language"] !== undefined &&
      setQualificationData((prevData) => {
        return {
          ...prevData,
          lang: {
            ...prevData?.lang,
            [qualificationData?.["country-language"]]: {
              ...prevData?.lang?.[qualificationData["country-language"]],
              options: optionsArr,
            },
          },
        };
      });
  }, [optionsTexts]);
  return (
    <Box sx={style}>
      <div className={styles.mainContainer}>
        <div className={styles.headingContainer}>
          <h1 className={styles.title}>Create Qualifications</h1>
          <p className={styles.servey_Id}>Question ID : {maxQuestionID}</p>
        </div>

        <div className={styles.optionTextContainer}>
          <h2 className={styles.optionText}> Options Text</h2>

          {[...Array(optionsCnt)]?.map((_, i) => (
            <input
              type="text"
              value={optionsTexts[i]}
              onChange={(e) => {
                setOptionsTexts((prevData) => {
                  return {
                    ...prevData,
                    [i]: e.target.value,
                  };
                });
              }}
            />
          ))}
        </div>

        <h3
          onClick={() => setOptionsCnt(optionsCnt + 1)}
          className={styles.add_more_option_btn}
        >
          Add more option
        </h3>

        <div className={styles.btnContainer}>
          <button
            onClick={() => {
              let tmp = qualificationData;
              delete tmp?.question_text;
              setQualificationData(tmp);
              setModalFor("third");
            }}
            disabled={disabledBtn}
            className={styles.Backbtn}
          >
            Add Another Language
          </button>
          <button
            className={styles.nextBtn}
            disabled={disabledBtn}
            onClick={handleAddQuestionBtn}
          >
            Finish
          </button>
        </div>
      </div>
    </Box>
  );
};

export default CreateQualifications;

{
  /* <Modal
				open={openModal}
				onClose={() => setOpenModal(false)}
				aria-labelledby='modal-modal-title'
				aria-describedby='modal-modal-description'
			>
				<Box sx={style}>
					<div className={styles.modal_container}>
						<h1 className={styles.createQualifications_title}>
							Create Qualifications
						</h1>
						<div
							className={
								styles.createQualifications_mainContainer
							}
						>
							<div
								className={styles.createQualifications_leftSide}
							>
								<div className={styles.inputFild_container}>
									<p>Qualification Name</p>
									<input
										type='text'
										value={qualificationData?.name}
										onChange={e =>
											handleQualDataChange(
												e.target.value,
												"name"
											)
										}
									/>
								</div>
								<div className={styles.inputFild_container}>
									<p>Question Type</p>
									<select
										className={styles.questionTypeSelect}
										onChange={e => {
											setQualificationData(prevData => {
												return {
													...prevData,
													question_type:
														e.target.value,
												}
											})
										}}
									>
										<option selected disabled hidden>
											Select question type
										</option>
										{questionTypeOptions?.map(qtOption => (
											<option value={qtOption.value}>
												{qtOption.label}
											</option>
										))}
									</select>
								</div>
								<div className={styles.inputFild_container}>
									<p>Question Status</p>
									<select>
										<option selected disabled hidden>
											select question status
										</option>
										<option>Active</option>
										<option>In Active</option>
									</select>
								</div>
								<div className={styles.radioBox_container}>
									<p>Is Core Demographic</p>
									<div
										className={
											styles.isCoreDemographic_radio_btns
										}
									>
										<div>
											<input
												type='radio'
												name='isCoreDemographic'
												value={true}
												id='yes'
												onChange={e => {
													handleQualDataChange(
														true,
														"is_core_demographic"
													)
												}}
											/>{" "}
											&nbsp;
											<label htmlFor='yes'>Yes</label>
										</div>
										<div>
											<input
												type='radio'
												name='isCoreDemographic'
												value={false}
												id='no'
												onChange={e => {
													handleQualDataChange(
														false,
														"is_core_demographic"
													)
												}}
											/>{" "}
											&nbsp;
											<label htmlFor='no'>No</label>
										</div>
									</div>
								</div>
							</div>

							<div
								className={
									styles.createQualifications_rightSide
								}
							>
								<p>Country</p>
								<Select
									options={countries}
									// value={country}
									styles={surveySelectStyle}
									onChange={e => {
										setCountryLanguage(prevData => {
											return {
												country: e.value,
												language: prevData?.language,
											}
										})
									}}
								/>
								<div className={styles.inputFild_container}>
									<p>Language</p>
									<select
										onChange={e => {
											setCountryLanguage(prevData => {
												return {
													language: e.target.value,
													country: prevData?.country,
												}
											})
										}}
									>
										<option selected disabled hidden>
											Select the country and Language
										</option>
										<option value='ENG'>English</option>
										<option value='FRA'>French</option>
										<option value='GER'>German</option>
										<option value='JPN'>Japanese</option>
										<option value='ESP'>Spanish</option>
									</select>
								</div>
								<div className={styles.inputFild_container}>
									<p>Qualification Question Text</p>
									<textarea
										rows='6'
										cols='50'
										value={
											qualificationData?.lang?.[
												qualificationData[
													"country-language"
												]
											]?.question_text
										}
										onChange={e => {
											setQualificationData(prevData => {
												return {
													...prevData,
													lang: {
														...prevData?.lang,
														[qualificationData[
															"country-language"
														]]: {
															question_text:
																e.target.value,
														},
													},
												}
											})
										}}
									/>
								</div>

								<p className={styles.subtitle}>
									Question ID : {maxQuestionID}
								</p>
							</div>
						</div>

						{(qualificationData?.question_type === "Single Punch" ||
							qualificationData?.question_type ===
								"Multi Punch") && (
							<div className={styles.inputFild_container}>
								<p> Options Text</p>
								{[...Array(optionsCnt)]?.map((_, i) => (
									<input
										type='text'
										value={optionsTexts[i]}
										onChange={e => {
											setOptionsTexts(prevData => {
												return {
													...prevData,
													[i]: e.target.value,
												}
											})
										}}
									/>
								))}
								<p
									onClick={() =>
										setOptionsCnt(optionsCnt + 1)
									}
									className={styles.add_more_option_btn}
								>
									Add more option
								</p>
							</div>
						)}

						<button
							className={styles.addSurvery_btn}
							onClick={handleAddQuestionBtn}
						>
							{" "}
							+ Add Question
						</button>
					</div>
				</Box>
			</Modal> */
}
