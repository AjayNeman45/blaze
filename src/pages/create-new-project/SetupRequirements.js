import { Loading } from "@nextui-org/react";
import { useEffect } from "react";
import { useState } from "react";
// import { InputHelperCard } from "./CreateNewProject"
import { useCreateNewProject } from "./CreateNewProjectContext";

const SetUpRequirments = () => {
  const [collectUserData, setCollectUserData] = useState("no");
  const {
    surveyData,
    setSurveyData,
    insertSetupRequirementData,
    insertLoading,
  } = useCreateNewProject();
  console.log(surveyData);

  useEffect(() => {
    setSurveyData({
      ...surveyData,
      collect_user_data: collectUserData === "yes" ? true : false,
    });
  }, [collectUserData]);

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
            <label>Study Type</label>

            <select
              placeholder="Adhoc"
              value={surveyData?.study_type}
              onChange={(e) =>
                setSurveyData({
                  ...surveyData,
                  study_type: e.target.value,
                })
              }
            >
              <option value="--">--</option>
              <option value="Ad Effectiveness Research">Ad Effectiveness Research</option>
              <option value="Adhoc">Adhoc</option>
              <option value="Community Build">Community Build</option>
              <option value="Face to Face">Face to Face</option>
              <option value="IHUT">IHUT</option>
              <option value="Incidence Check">Incidence Check</option>
              <option value="Internal Use">Internal Use</option>
              <option value="Qualitative Screening">Qualitative Screening</option>
              <option value="Adhoc">Recontact</option>
              <option value="Adhoc">Recruit - Panel</option>
              <option value="Tracking - Monthly">Tracking - Monthly</option>
              <option value="Tracking - Quaterly
">Tracking - Quaterly
</option>
              <option value="Tracking - Weekly">Tracking - Weekly</option>
              <option value="Tracking - Yearly
">Tracking - Yearly
</option>

              <option value="Tracking - Biyearly">Tracking - Biyearly</option>
              <option value="Wave Study">Wave Study</option>



          

            </select>
          </div>
          <div className="column">
            <label>Survey Type</label>
            <select placeholder="Consumers" onChange={(e) =>
                setSurveyData({
                  ...surveyData,
                  survey_type: e.target.value,
                })
              }>


              <option value="Consumer">Consumer</option>
              <option value="Business-To-Business">Business-To-Business</option>
              <option value="Information Technology Decision Maker">Information Technology Decision Maker</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Medical Professionals">Medical Professionals</option>
              <option value="Panel Recruits">Panel Recruits</option>

              

            </select>
          </div>
          <div className="column">
            <label>Business Units</label>
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
              <option value="--">--</option>
              <option value="mirats-api">MIRATS-API</option>
            </select>
          </div>
          <div className="column">
            <label>Industry</label>
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
              <option value="--">--</option>
              <option value="other">Other</option>
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
            Does your survey collect personal information that can be used to
            identify an individual?
          </label>
          <div className="radio_btns">
            <div className="radio_btn">
              <input
                type="radio"
                name="preexist"
                value="yes"
                checked={collectUserData == "yes"}
                onChange={(e) => setCollectUserData(e.target.value)}
                id="yes"
              />
              <span for="yes">Yes</span>
            </div>
            <div className="radio_btn">
              <input
                type="radio"
                name="preexist"
                value="no"
                checked={collectUserData == "no"}
                onChange={(e) => setCollectUserData(e.target.value)}
                id="no"
              />
              <span for="no">No</span>
            </div>
          </div>
          {/* checkboxes */}
          <label>What information do you collect?</label>
          <div className="checkboxes">
            <div className="input-check">
              <input type="checkbox" checked={surveyData?.collect_user_data}/>
              <label>Name of the respondent</label>
            </div>
            <div className="input-check">
              <input type="checkbox" checked={surveyData?.collect_user_data}/>
              <label>Email of the respondent</label>
            </div>
            <div className="input-check">
              <input type="checkbox" checked={surveyData?.collect_user_data}/>
              <label>Mobile No of the respondent</label>
            </div>
            <div className="input-check">
              <input type="checkbox" checked={surveyData?.collect_user_data}/>
              <label>Physical Address of the respondent</label>
            </div>
            <div className="input-check">
              <input type="checkbox" checked={surveyData?.collect_user_data}/>
              <label>Other</label>
            </div>
          </div>
        </div>
      </div>

      <div className="next_btn_container">
        {!insertLoading ? (
          <button onClick={insertSetupRequirementData} className="next_btn">
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
