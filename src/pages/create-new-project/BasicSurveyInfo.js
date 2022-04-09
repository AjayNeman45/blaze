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
    padding: 20,
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
    width: "100%",
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
  } = useCreateNewProject();

  const [preexistCheck, setPreexistCheck] = useState(false);

  useEffect(() => {
    setSurveyData({
      ...surveyData,
      existing_project_checked: preexistCheck,
    });
  }, [preexistCheck]);
  const handleInputChange = (type, e) => {
    switch (type) {
      case "survey_name":
        setSurveyData((prevData) => {
          return {
            ...prevData,
            survey_name: e.target.value,
          };
        });
        break;
      case "country":
        setCountry(e);
        setSurveyData((prevData) => {
          return {
            ...prevData,
            country: {
              ...surveyData.country,
              country: e.value,
              country_full_name: e.label,
              code: surveyData?.country?.language + "-" + e.value,
            },
          };
        });
        break;
      case "language":
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
        return;
      case "no_of_completes":
        setSurveyData((prevData) => {
          return {
            ...prevData,
            no_of_completes: parseInt(e.target.value),
          };
        });
        break;
      case "project_name":
        setSurveyData((prevData) => {
          return {
            ...prevData,
            project: e.target.value,
          };
        });
        break;
      case "external_survey_name":
        setSurveyData((prevData) => {
          return {
            ...prevData,
            external_survey_name: e.target.value,
          };
        });
        break;
      case "survey_group":
        setSurveyData((prevData) => {
          return {
            ...prevData,
            survey_group: parseInt(e.target.value),
          };
        });
        break;
      case "client":
        setSurveyData((prevData) => {
          return {
            ...prevData,
            client_info: e.label,
          };
        });
      default:
        return;
    }
  };

  useEffect(() => {
    let s = surveyData;
    // ******** condition for next button to enable
    if (
      s?.client_info &&
      s?.country &&
      s?.external_survey_name &&
      s?.no_of_completes &&
      s?.project &&
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
          { value: res.data()?.company_name, label: res.data()?.company_name },
        ]);
      });
    });
  }, []);

  console.log(clients);

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
              onChange={(e) => handleInputChange("survey_name", e)}
            />
          </div>
          <div className="column">
            <label>
              <span>Country</span> &nbsp;
              <span className="required_tag">Country</span>
            </label>
            <div style={{ marginTop: "1rem" }}>
              <Select
                styles={selectStyle}
                options={countries}
                value={country}
                onChange={(e) => handleInputChange("country", e)}
              />
            </div>
          </div>
          <div className="column">
            <label>
              <span>Country - Language</span> &nbsp;
              <span className="required_tag">required</span>
            </label>

            <select
              value={surveyData?.country_langauge}
              onChange={(e) => handleInputChange("language", e)}
            >
              <option value="_">Select the country and Language</option>
              <option value="ENG">English</option>
              <option value="FRA">French</option>
              <option value="GER">German</option>
              <option value="JPN">Japanese</option>
              <option value="ESP">Spanish</option>
            </select>
          </div>
          <div className="column">
            <label>
              <span>Number of Completes Required</span> &nbsp;
              <span className="required_tag">required</span>
            </label>
            <input
              type="number"
              value={surveyData?.no_of_completes}
              onChange={(e) => handleInputChange("no_of_completes", e)}
            />
          </div>
          <div className="column">
            <label>
              <span>Client Name / Organization Name</span> &nbsp;
              <span className="required_tag">required</span>
            </label>
            <div style={{ marginTop: "1rem" }}>
              <Select
                styles={selectStyle}
                options={clients}
                value={{
                  label: surveyData?.client_info,
                  value: surveyData?.client_info,
                }}
                className="text_input"
                onChange={(e) => handleInputChange("client", e)}
              />
            </div>
          </div>
        </div>
      </div>
      <hr />
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
          {/* <div className="project_name_input">
            <label>
              {preexistCheck === "No"
                ? "New Project Name"
                : "Existing Project Name"}
            </label>
            <input
              type="text"
              className="text_input"
              value={surveyData?.project}
              onChange={(e) => handleInputChange("project_name", e)}
            />
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div> */}
          <div className="column">
            {preexistCheck ? (
              <>
                <label>
                  <span>Please Enter Project ID here</span> &nbsp;
                  <span className="required_tag">required</span>
                </label>
                <input type="number" placeholder="1102003" />
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
                  onChange={(e) => handleInputChange("project_name", e)}
                />
              </>
            )}
          </div>
          <div className="column">
            <label>
              <label>External Survey Name</label> &nbsp;
              <span className="required_tag">required</span>
            </label>
            <input
              type="text"
              placeholder="Robert D. Jr."
              value={surveyData?.external_survey_name}
              onChange={(e) => handleInputChange("external_survey_name", e)}
            />
          </div>
          <div className="column">
            <label>
              <span>Survey Groups (optional)</span>
            </label>
            <input
              type="number"
              placeholder="11200342"
              value={surveyData?.survey_group}
              onChange={(e) => handleInputChange("survey_group", e)}
            />
          </div>
        </div>
      </div>
      <hr />

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
