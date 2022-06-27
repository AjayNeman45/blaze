import { Loading } from "@nextui-org/react";
import { useEffect } from "react";
import { useState } from "react";
import {
  studyTypesData,
  surveyTypesData,
  industryData,
} from "../../utils/commonData";

import { useCreateNewProject } from "./CreateNewProjectContext";

const SetUpRequirments = () => {
  const [collectUserData, setCollectUserData] = useState(false);
  const [enableNextBtn, setEnableNextBtn] = useState(false);

  const {
    surveyData,
    setSurveyData,
    insertSetupRequirementData,
    insertLoading,
  } = useCreateNewProject();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setSurveyData({
      ...surveyData,
      collect_user_data: collectUserData === "yes" ? true : false,
    });
  }, [collectUserData]);

  useEffect(() => {
    let s = surveyData;
    if (s?.study_type && s?.survey_type && s?.business_unit && s?.industry) {
      setEnableNextBtn(true);
    } else {
      setEnableNextBtn(false);
    }
  }, [surveyData]);

  return (
    <>
      <div className="setup_requirment_info">
        <div className="create_survey_left">
          <p className="title">Setup Requirements of this survey.</p>
          <p className="subtitle">
            Complete this information to set your survey's requirement.
          </p>
          {/* <InputHelperCard /> */}
        </div>
        <div className="create_survey_right">
          <div className="column">
            <label>
              <span>Study Type</span> &nbsp;{" "}
              <span className="required_tag">Required</span>
            </label>
            <select
              value={surveyData?.study_type}
              onChange={(e) =>
                setSurveyData({
                  ...surveyData,
                  study_type: e.target.value,
                })
              }
            >
              <option selected disabled hidden>
                select study type
              </option>
              {studyTypesData?.map((type) => {
                return <option value={type?.value}>{type.label}</option>;
              })}
            </select>
          </div>
          <div className="column">
            <label>
              <span>Survey Type</span> &nbsp;
              <span className="required_tag">Required</span>
            </label>

            <select
              placeholder="Consumers"
              onChange={(e) =>
                setSurveyData({
                  ...surveyData,
                  survey_type: e.target.value,
                })
              }
            >
              <option selected disabled hidden>
                select survey type
              </option>
              {surveyTypesData?.map((surveyType) => {
                return (
                  <option value={surveyType?.value}>{surveyType?.label}</option>
                );
              })}
            </select>
          </div>
          <div className="column">
            <label>
              <span>Business Units</span> &nbsp;
              <span className="required_tag">Required</span>
            </label>

            <select
              placeholder="Mirats illustrate"
              value={surveyData?.business_unit}
              onChange={(e) =>
                setSurveyData({
                  ...surveyData,
                  business_unit: e.target.value,
                })
              }
            >
              <option selected disabled hidden>
                select business unit
              </option>
              <option value="mirats-api">MIRATS-API</option>
              <option value="mirats-otc">MIRATS-OTC</option>
            </select>
          </div>
          <div className="column">
            <label>
              <span>Industry</span> &nbsp;
              <span className="required_tag">Required</span>
            </label>
            <select
              placeholder="Others"
              value={surveyData?.industry}
              onChange={(e) =>
                setSurveyData({
                  ...surveyData,
                  industry: e.target.value,
                })
              }
            >
              <option selected disabled hidden>
                select industry
              </option>
              {industryData?.map((data) => (
                <option value={data?.value}>{data?.label}</option>
              ))}
            </select>
          </div>
          {/* <div className="column">
            <label>
              Industry <span>*</span>
            </label>
            <select
              value={surveyData?.industry}
              onChange={(e) =>
                setSurveyData({
                  ...surveyData,
                  industry: e.target.value,
                })
              }
            >
              <option value="--">--</option>
              <option value="other">Other</option>
            </select>
          </div> */}
        </div>
      </div>
      <hr />

      {/* requirements */}
      <div className="project_detail_info">
        <div className="create_survey_left">
          <p className="title">Your Projects PII Requirements</p>
          <p className="subtitle">
            Tell us about your project's Personal Identification Information
            requirement. Do you require them while running this survey?
          </p>
        </div>
        <div className="create_survey_right">
          <label>
            <span>
              Does your survey collect personal information that can be used to
              identify an individual?
            </span>{" "}
            &nbsp;
            <span className="required_tag">Required</span>
          </label>

          <div className="radio_btns">
            <div className="radio_btn">
              <input
                type="radio"
                name="preexist"
                value={true}
                checked={collectUserData}
                onChange={(e) => setCollectUserData(true)}
                id="yes"
              />
              <span for="yes">Yes</span>
            </div>
            <div className="radio_btn">
              <input
                type="radio"
                name="preexist"
                value={false}
                checked={!collectUserData}
                onChange={(e) => setCollectUserData(false)}
                id="no"
              />
              <span for="no">No</span>
            </div>
          </div>
          {/* checkboxes */}
          <div className={!collectUserData ? "hide_info" : "show_info"}>
            <label>What information do you collect?</label>
            <div className="checkboxes">
              <div className="input-check">
                <input type="checkbox" checked={collectUserData} />
                <label>Name of the respondent</label>
              </div>
              <div className="input-check">
                <input type="checkbox" checked={collectUserData} />
                <label>Email of the respondent</label>
              </div>
              <div className="input-check">
                <input type="checkbox" checked={collectUserData} />
                <label>Mobile No of the respondent</label>
              </div>
              <div className="input-check">
                <input type="checkbox" checked={collectUserData} />
                <label>Physical Address of the respondent</label>
              </div>
              <div className="input-check">
                <input type="checkbox" checked={collectUserData} />
                <label>Other</label>
              </div>
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
          <button
            onClick={insertSetupRequirementData}
            disabled={!enableNextBtn}
          >
            Next
          </button>
        ) : (
          <Loading type="spinner" size="lg" className="insert_loading" />
        )}
      </div>
    </>
  );
};

export default SetUpRequirments;
