import React, { useMemo } from "react";
import { useState } from "react";
import { useCreateNewProject } from "./CreateNewProjectContext";
// import { InputHelperCard } from "./CreateNewProject";
import { useEffect } from "react";
import { Loading } from "@nextui-org/react";
import Select from "react-select";
import countryList from "react-select-country-list";
import Snackbar from "../../components/Snackbar";
import { getClients } from "../../utils/firebaseQueries";

export const selectStyle = {
  menu: (provided, state) => ({
    ...provided,
    width: "100%",
    borderBottom: "1px dotted pink",
    color: state.selectProps.menuColor,
    padding: 10,
  }),
  control: (styles) => ({
    ...styles,
    width: "100%",
    border: "1px solid gray",
    borderRadius: "10px",
  }),
  input: (styles) => ({
    ...styles,
    height: "45px",
  }),
};

const BasicSurveyInfo = () => {
  const [country, setCountry] = useState("");
  const [surveyType, setSurveyType] = useState("");
  const countries = useMemo(() => countryList().getData(), []);
  const [enableNextBtn, setEnableNextBtn] = useState(false);
  const [clients, setClients] = useState([]);

  const {
    surveyData,
    setSurveyData,
    insertBasicData,
    error,
    insertLoading,
    snackbar,
    snackbarData,
    handleSnackbar,
    checkProjectExistance,
    surveyGrps,
  } = useCreateNewProject();

  const [preexistCheck, setPreexistCheck] = useState(false);

  useEffect(() => {
    setSurveyData({
      ...surveyData,
      existing_project_checked: preexistCheck,
    });
  }, [preexistCheck]);
  const handleInputChange = (type, val) => {
    setSurveyData((prevData) => {
      return {
        ...prevData,
        [type]: val,
      };
    });
  };

  useEffect(() => {
    let s = surveyData;
    // ******** condition for next button to enable
    if (
      s?.client_info &&
      s?.country &&
      s?.external_survey_name &&
      s?.no_of_completes &&
      (s?.project || s?.project_id) &&
      s?.survey_name
    ) {
      setEnableNextBtn(true);
    } else {
      setEnableNextBtn(false);
    }
  }, [surveyData]);

  useEffect(() => {
    window.scrollTo(0, 0);
    getClients().then((result) => {
      result.forEach((res) => {
        setClients((prevData) => [
          ...prevData,
          {
            value: res.data()?.company_name,
            label: res.data()?.company_name,
          },
        ]);
      });
    });
  }, []);

  return (
    <div>
      <Snackbar
        msg={snackbarData?.msg}
        severity={snackbarData?.severity}
        open={snackbar}
        handleClose={handleSnackbar}
      />
      <div className="basic_survey_info">
        <div className="create_survey_left">
          <p className="title">Basic Survey Information</p>
          <p className="subtitle">
            This information will be visible on all across all our console.
          </p>
        </div>
        <div className="create_survey_right">
          <div className="column">
            <label>
              <label>Survey Name</label>&nbsp;
              <span className="required_tag">required</span>
            </label>
            <input
              type="text"
              className="text_input"
              value={surveyData?.survey_name}
              onChange={(e) => handleInputChange("survey_name", e.target.value)}
            />
          </div>
          {/****** country input  *****/}
          <div className="column">
            <label>
              <span>Country</span> &nbsp;
              <span className="required_tag">required</span>
            </label>
            <div style={{ marginTop: "1rem" }}>
              <Select
                styles={selectStyle}
                options={countries}
                // value={country}
                onChange={(e) => {
                  setCountry(e);
                  setSurveyData((prevData) => {
                    return {
                      ...prevData,
                      country: {
                        ...surveyData.country,
                        code: prevData?.country?.language + "-" + e.value,
                        country: e.value,
                        country_full_name: e.label,
                      },
                      // code:
                      // 	prevData?.country?.language +
                      // 	"-" +
                      // 	e.value,
                    };
                  });
                }}
              />
            </div>
          </div>

          {/****** language input  *****/}
          <div className="column">
            <label>
              <span>Country - Language</span> &nbsp;
              <span className="required_tag">required</span>
            </label>

            <select
              value={surveyData?.country_langauge}
              onChange={(e) => {
                setSurveyData((prevData) => {
                  return {
                    ...prevData,
                    country: {
                      ...surveyData.country,
                      language: e.target.value,
                      code: e.target.value + "-" + surveyData?.country?.country,
                    },
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

          {/* Number of completes  */}
          <div className="column">
            <label>
              <span>Number of Completes Required</span> &nbsp;
              <span className="required_tag">required</span>
            </label>
            <input
              type="number"
              value={surveyData?.no_of_completes}
              onChange={(e) =>
                handleInputChange("no_of_completes", parseInt(e.target.value))
              }
            />
          </div>

          {/* client name  */}
          <div className="column">
            <label>
              <span>Client Name / Organization Name</span> &nbsp;
              <span className="required_tag">required</span>
            </label>
            <div style={{ marginTop: "1rem" }}>
              <Select
                styles={selectStyle}
                options={clients}
                className="text_input"
                onChange={(e) => {
                  setSurveyData((prevData) => {
                    return {
                      ...prevData,
                      client_info: {
                        client_name: e.label,
                      },
                    };
                  });
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="project_detail_info">
        <div className="create_survey_left">
          <p className="title">Your Project Details</p>
          <p className="subtitle">
            Tell us about your project! is this survey belongs to a pre-existing
            project or it is going to be a new one. Adding surveys to project
            helps our team to organize surveyData.
          </p>
        </div>
        <div className="create_survey_right">
          {/* check for inserting survey into already exist project  */}
          <div className="radio_input">
            <label>
              <span>
                Do you want this survey to add in the list of a specific
                pre-existing project? You need to have a project ID to do the
                same.
              </span>{" "}
              &nbsp;
              <span className="required_tag">required</span>
            </label>

            <div className="radio_btns">
              <div className="radio_btn">
                <input
                  type="radio"
                  name="preexist"
                  value="Yes"
                  id="yes"
                  checked={preexistCheck}
                  onChange={(e) => {
                    setPreexistCheck(true);
                  }}
                />
                <span htmlFor="yes">Yes</span>
              </div>
              <div className="radio_btn">
                <input
                  type="radio"
                  name="preexist"
                  value="No"
                  id="no"
                  checked={!preexistCheck}
                  onChange={(e) => {
                    setPreexistCheck(false);
                  }}
                />
                <span htmlFor="no">No</span>
              </div>
            </div>
          </div>

          {/* project id and project name input  */}
          <div className="column">
            {preexistCheck ? (
              <>
                <label>
                  <span>Please Enter Project ID here</span> &nbsp;
                  <span className="required_tag">required</span>
                </label>
                <input
                  type="number"
                  placeholder="1102003"
                  onChange={(e) => {
                    setSurveyData((prevData) => {
                      return {
                        ...prevData,
                        project_id: parseInt(e.target.value),
                      };
                    });
                  }}
                />
              </>
            ) : (
              <>
                <label>
                  <span>Please Enter Project Name here</span> &nbsp;
                  <span className="required_tag">required</span>
                </label>
                <input
                  type="text"
                  value={surveyData?.project}
                  placeholder="Project name"
                  onChange={(e) => handleInputChange("project", e.target.value)}
                />
              </>
            )}
            <span className="error_msg">{error}</span>
          </div>

          {/* external survey name  */}
          <div className="column">
            <label>
              <label>External Survey Name</label> &nbsp;
              <span className="required_tag">required</span>
            </label>
            <input
              type="text"
              placeholder="Robert D. Jr."
              value={surveyData?.external_survey_name}
              onChange={(e) =>
                handleInputChange("external_survey_name", e.target.value)
              }
            />
          </div>

          {/* survey groups  */}
          <div className="column">
            <label>
              <span>Survey Groups (optional)</span>
            </label>
            <div style={{ marginTop: "1rem" }}>
              <Select
                styles={selectStyle}
                options={surveyGrps}
                onChange={(e) => handleInputChange("survey_group", e.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div
        className={
          enableNextBtn
            ? "next_btn_container"
            : "next_btn_container next_btn_disable"
        }
      >
        {!insertLoading ? (
          <button disabled={!enableNextBtn} onClick={insertBasicData}>
            Next
          </button>
        ) : (
          <Loading type="spinner" size="lg" className="insert_loading" />
        )}
      </div>
    </div>
  );
};

export default BasicSurveyInfo;
