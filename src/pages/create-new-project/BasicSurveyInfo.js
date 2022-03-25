import React, { useMemo } from "react";
import { useState } from "react";
import { useCreateNewProject } from "./CreateNewProjectContext";
// import { InputHelperCard } from "./CreateNewProject";
import { useEffect } from "react";
import { Loading } from "@nextui-org/react";
import Select from "react-select";
import countryList from "react-select-country-list";

const inputHelperCardData = [
  {
    title: "Number of Completes",
    desc: "Suppliers use this to reference initial estimates for total completes required for a survey.",
  },
  {
    title: "Industry",
    desc: "Industry specifies the genre of your survey, which helps suppliers send the right respondents.",
  },
];

const surveyTypes = [
  { label: "B2B", value: "b2b" },
  { label: "B2C", value: "b2c" },
];

const BasicSurveyInfo = () => {
  const [country, setCountry] = useState("");
  const [surveyType, setSurveyType] = useState("");
  const countries = useMemo(() => countryList().getData(), []);
  const [languages, setLanguages] = useState([]);

  const changeHandler = (e) => {
    setCountry(e);
    setSurveyData({
      ...surveyData,
      country: e.value,
    });
  };

  const [preexistCheck, setPreexistCheck] = useState(false);
  const { surveyData, setSurveyData, insertBasicData, error, insertLoading } =
    useCreateNewProject();
  useEffect(() => {
    setSurveyData({
      ...surveyData,
      existing_project_checked: preexistCheck,
    });
  }, [preexistCheck]);
  console.log(surveyData);
  const handleInputChange = (type, e) => {
    switch (type) {
      case "survey_name":
        setSurveyData({
          ...surveyData,
          survey_name: e.target.value,
        });
        break;
      case "country":
        setCountry(e);
        setSurveyData({
          ...surveyData,
          country: {
            ...surveyData.country,
            country: e.value,
            country_full_name: e.label,
            code: surveyData?.country?.language + "-" + e.value,
          },
        });
        break;
      case "language":
        setSurveyData({
          ...surveyData,
          country: {
            ...surveyData.country,
            language: e.target.value,
            code: e.target.value + "-" + surveyData?.country?.country,
          },
        });
        return;
      case "no_of_completes":
        setSurveyData({
          ...surveyData,
          no_of_completes: parseInt(e.target.value),
        });
        break;
      case "project_name":
        setSurveyData({
          ...surveyData,
          project: e.target.value,
        });
        break;
      case "external_survey_name":
        setSurveyData({
          ...surveyData,
          external_survey_name: e.target.value,
        })
        break;
      case "client_name":
        setSurveyData({
          ...surveyData,
          client_info: {
            ...surveyData?.client_info,
            client_name: e.target.value
          }
        })
        break;
      case "survey_group":
        setSurveyData({
          ...surveyData,
          survey_group: e.target.value,
        });
        break;
      default:
        return;
    }
  };

  // console.log(l);

  return (
    <div>
      <div className="basic_survey_info">
        <div className="create_survey_left">
          <p className="title">Basic Survey Information</p>
          <p className="subtitle">
            This information will be visible on all across all our console.
          </p>
          {/* <InputHelperCard
            title={inputHelperCardData[0].title}
            desc={inputHelperCardData[0].desc}
          /> */}
        </div>
        <div className="create_survey_right">
          <div className="column">
            <label>Survey Name</label>
            <input
              type="text"
              className="text_input"
              value={surveyData?.survey_name}
              onChange={(e) => handleInputChange("survey_name", e)}
            />
          </div>
          <div className="country">
            <label>Country</label>
            <Select
              options={countries}
              value={country}
              onChange={(e) => handleInputChange("country", e)}
              className="country_select"
              containerStyle={{
                width: "100%",
                height: "100%",
                // border: "1px solid #959595",
              }}
              inputStyle={{
                width: "100%",
                height: "100%",

                // height: "45px",
              }}
            />
          </div>
          <div className="column">
            <label>Country - Language</label>

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
            <label>Number of Completes Required</label>
            <input
              type="text"
              className="text_input"
              value={surveyData?.no_of_completes}
              onChange={(e) => 
              setSurveyData({
                ...surveyData,
                no_of_completes: e.target.value,
              })
            }
            />
          </div>
          <div className="column">
            {/* <label>Survey Type</label>
            <Select
              options={surveyTypes}
              value={surveyType}
              onChange={(e) => handleInputChange("survey-type", e)}
              className="survey_type_select"
            /> */}
            <label>Client Name / Organization Name</label>
            <input type="text" placeholder="GMO Research Inc." value={surveyData?.client_info?.client_name} onChange={(e) => handleInputChange("client_name", e)} />
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
              Do you want this survey to add in the list of a specific
              pre-existing project? You need to have a project ID to do the
              same.
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
                <label>Please Enter Project ID here</label>
                <input type="text" placeholder="1102003" />
              </>
            ) : (
              <>
                <label>Please Enter Project Name here</label>
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
            <label>External Survey Name</label>
            <input
              type="text"
              placeholder="Robert D. Jr."
              value={surveyData?.external_survey_name}
              onChange={(e) => handleInputChange("external_survey_name", e)}
            />
          </div>
          <div className="column">
            <label>Survey Groups (optional)</label>
            <input
              type="text"
              placeholder="11200342"
              value={surveyData?.survey_group}
              onChange={(e) => handleInputChange("survey_group", e)}
            />
          </div>
        </div>
      </div>
      <hr />

      <div className="next_btn_container">
        {!insertLoading ? (
          <button className="next_btn" onClick={insertBasicData}>
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
