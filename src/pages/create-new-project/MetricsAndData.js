import { Loading } from "@nextui-org/react";
import { useEffect } from "react";
import { useCreateNewProject } from "./CreateNewProjectContext";

const MetricsAndData = () => {
  const { surveyData, setSurveyData, metricsData, insertLoading } =
    useCreateNewProject();
    console.log(surveyData)

  const HandleDeviceSuitability=(e,label)=>{
    if(e.target.checked){
    setSurveyData({...surveyData,device_suitability:{...surveyData?.device_suitability,[label]:true}})
    }else{
      setSurveyData({...surveyData,device_suitability:{...surveyData?.device_suitability,[label]:false}})
    }
  }

  return (
    <>
      <div className="metrics_and_data">
        <div className="create_survey_left">
          <p className="title">Expected Metrics & Data</p>
          <p className="desc">
            Fill in to inform suppliers of your survey before receiving traffic.
            Review in-field survey data when survey is live.
          </p>
        </div>
        <div className="create_survey_right">
          <div className="column">
            <label>Expected Incidence Rate</label>
            <input
              placeholder="32%"
              type="text"
              className="text_input"
              value={surveyData?.expected_incidence_rate}
              onChange={(e) =>
                setSurveyData({
                  ...surveyData,
                  expected_incidence_rate: e.target.value,
                })
              }
            />
          </div>
          <div className="column">
            <label>Expected Completion LOI</label>
            <input
              placeholder="12m"
              type="text"
              className="text_input"
              value={surveyData?.exected_completion_loi}
              onChange={(e) =>
                setSurveyData({
                  ...surveyData,
                  expected_completion_loi: e.target.value,
                })
              }
            />
          </div>
          <div className="column">
            <label>Expected Start Date</label>
            <input
              type="date"
              className="text_input"
              // value={surveyData?.expected_start_date}
              onChange={(e) =>
                setSurveyData({
                  ...surveyData,
                  expected_start_date: new Date(e.target.value),
                })
              }
            />
          </div>
          <div className="column">
            {/* <input type="date" placeholder="dd/mm/yyyy" /> */}
            <label>Expected End Date</label>
            <input
              type="date"
              className="text_input"
              value={surveyData?.exected_completion_loi}
              onChange={(e) =>
                setSurveyData({
                  ...surveyData,
                  expected_end_date: new Date(e.target.value),
                })
              }
            />
          </div>
        </div>
      </div>
      {/* <hr /> */}
      <div className="internal_status">
        <div className="create_survey_left">
          <p className="title">Internal Status</p>
          <p className="desc">
            Tell us about your device and compability of the survey.
          </p>
        </div>
        <div className="create_survey_right">
          <div className="column">
            <label>Survey Current Status</label>
            <input
              type="text"
              className="text_input"
              value="Bidding"
              disabled={true}
            />
          </div>
          <div className="column">
            <label>Survey Internal Status</label>
            <select
              onChange={(e) =>
                setSurveyData({
                  ...surveyData,
                  internal_status: e.target.value,
                })
              }
              defaultValue="ongoing"
            >
              <option value="ongoing">ongoing</option>
              <option value="lead">lead</option>
              <option value="won">won</option>
              <option value="lost">lost</option>
            </select>
          </div>
          {/* checkboxes */}
          <label className="check-question">Device Compability</label>
          <div className="checkboxes">
            <div className="input-check">
              <input type="checkbox" checked={surveyData?.device_suitability?.desktop} onChange={(e)=>{
                HandleDeviceSuitability(e,'desktop')
              }} />
              <label>Desktop/Laptop</label>
            </div>
            <div className="input-check">
              <input type="checkbox" checked={surveyData?.device_suitability?.mobile} onChange={(e)=>{HandleDeviceSuitability(e,'mobile')}}/>
              <label>Mobile</label>
            </div>
            <div className="input-check">
              <input type="checkbox" checked={surveyData?.device_suitability?.tablet} onChange={(e)=>{HandleDeviceSuitability(e,'tablet')}}/>
              <label>Tablet</label>
            </div>
            <div className="input-check">
              <input type="checkbox" checked={surveyData?.device_suitability?.tv} onChange={(e)=>{HandleDeviceSuitability(e,'tv')}}/>
              <label>TV</label>
            </div>
            <div className="input-check">
              <input type="checkbox" checked={surveyData?.device_suitability?.webcam} onChange={(e)=>{HandleDeviceSuitability(e,'webcam')}}/>
              <label>Requires Webcam</label>
            </div>
          </div>
        </div>
      </div>
      <div className="next_btn_container">
        {!insertLoading ? (
          <button onClick={metricsData} className="next_btn">
            Next
          </button>
        ) : (
          <Loading type="spinner" size="lg" className="insert_loading" />
        )}
      </div>
    </>
  );
};

export default MetricsAndData;
