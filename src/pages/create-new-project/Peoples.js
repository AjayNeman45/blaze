import { Loading } from "@nextui-org/react";
import { useCreateNewProject } from "./CreateNewProjectContext";
import Select from "react-select";
import { useLocation } from "react-router-dom";
import { encryptText, decryptText } from "../../utils/enc-dec.utils";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { getSurvey } from "../../utils/firebaseQueries";
const miratsoptions = [
  { value: "Moinnudin S.", label: "Moinnudin S." },
  { value: "Mahmood A.", label: "Mahmood A." },
];

const gmooptions = [
  { value: "Mayank K.", label: "Mayank K." },
  { value: "Amit K. C.", label: "Amit K. C." },
];

const Peoples = () => {
  const { surveyData, setSurveyData, insertPeoplesData, insertLoading } =
    useCreateNewProject();
    const location = useLocation();
const encryptedID = new URLSearchParams(location.search).get("id");

let [peoplesResearchTeam,setPeoplesResearchTeam]=useState('')
  console.log(surveyData)
useEffect(()=>{
  const survey_id = decryptText(encryptedID.split("-")[0]);
  getSurvey(survey_id).then(data=>{
    setPeoplesResearchTeam(data?.client_info?.client_name)
  })
},[encryptedID])
  return (
    <>
      <div className="peoples_info">
        <div className="create_survey_left">
          <p className="title">Financial of the survey.</p>
          <p className="desc">
            Fill this form to store the financials of this survey
          </p>
        </div>
        <div className="create_survey_right">
          <div className="two-column">
            <div className="client_cpi">
              <label>Client CPI</label>
              <input type="text" placeholder="32%" onChange={(e)=>{
                setSurveyData({...surveyData,client_info:{...surveyData?.client_info,client_cpi:e.target.value}})
              }} value={surveyData?.client_info?.client_cpi}/>
            </div>
            <div className="cost_curr">
              <label>Client Cost Currency</label>
              <input type="text" placeholder="United States Dollar"
              onChange={(e)=>{
                setSurveyData({...surveyData,client_info:{...surveyData?.client_info,client_cost_currency:e.target.value}})
              }} 
              value={surveyData?.client_info?.client_cost_currency}
              />
            </div>
            {/* <label>Project Manager</label>
            <select
              value={surveyData?.project_manager}
              onChange={(e) =>
                setSurveyData({
                  ...surveyData,
                  project_manager: e.target.value,
                })
              }
            >
              <option value="--">--</option>
              <option value="unassigned">Unassigned</option>
            </select> */}
          </div>
          <div className="column">
            <label>PO Number</label>
            <input type="text" placeholder="XXXXXXXXXX" 
            onChange={(e)=>{
              setSurveyData({...surveyData,client_info:{...surveyData?.client_info,po_number:e.target.value}})
            }}
            value={surveyData?.client_info?.po_number}
            
            />
            {/* <label>Account Executive</label>
            <select
              value={surveyData?.account_executive}
              onChange={(e) =>
                setSurveyData({
                  ...surveyData,
                  account_executive: e.target.value,
                })
              }
            >
              <option value="--">--</option>
              <option value="unassigned">Unassigned</option>
            </select> */}
          </div>
          <div className="column">
            <label>Client's PO Number</label>
            <input type="text" placeholder="XXXXXXXXXX" 
            onChange={(e)=>{
              setSurveyData({...surveyData,client_info:{...surveyData?.client_info,client_po_number:e.target.value}})
            }}
            value={surveyData?.client_info?.client_po_number}
            
            />
            {/* <label>Alternate Project Manager</label>
            <select
              value={surveyData?.altername_project_manager}
              onChange={(e) =>
                setSurveyData({
                  ...surveyData,
                  alternate_project_manager: e.target.value,
                })
              }
            >
              <option value="--">--</option>
              <option value="unassigned">Unassigned</option>
            </select> */}
          </div>
        </div>
      </div>

      {/* people working on project */}
      <div className="people_working_on_proj">
        <div className="create_survey_left">
          <p className="title">People's working on this project.</p>
          <p className="desc">
            Tell us about your team as well as client's team working on this
            project.
          </p>
        </div>
        <div className="create_survey_right">
          <h2>Mirats Insights Team</h2>
          <div className="column">
            <label className="multiselect">Lead Project Manager</label>
            {/* <select placeholder="Moinnudin S.">
              <option>Moinnudin S.</option>
            </select> */}
            <Select
              value={surveyData?.project_manager}
              onChange={(e) =>
                setSurveyData({
                  ...surveyData,
                  project_manager: e,
                })
              }
              className="country_select"
              isMulti
              options={miratsoptions}
            />
          </div>
          <div className="column">
            <label>Sales Manager</label>
            <input type="text" placeholder="Juhi Saini" onChange={(e)=>setSurveyData({
                  ...surveyData,
                  sales_manager: e.target.value,
                })}/>
          </div>
          <div className="column">
            <label>Account Manager</label>
            <input type="text" placeholder="Janhavi Rajput" onChange={(e)=>setSurveyData({
                  ...surveyData,
                  account_manager: e.target.value,
                })}/>
          </div>
          <h2>{peoplesResearchTeam}</h2>
          <div className="column">
            <label className="multiselect">Lead Project Manager</label>
            <Select className="country_select" isMulti options={gmooptions} />
          </div>
          <div className="column">
            <label>Sales Manager</label>
            <select>
              <option>Ashish Mathur</option>
              <option>Mayank patel</option>

            </select>
          </div>
          <div className="column">
            <label>Account Manager</label>
            <select>
              <option>Mayank patel</option>
              <option>Christopher Taylor</option>

            </select>
          </div>
        </div>
      </div>

      <div className="next_btn_container">
        {!insertLoading ? (
          <button onClick={insertPeoplesData} className="next_btn">
            Finish
          </button>
        ) : (
          <Loading type="spinner" size="lg" className="insert_loading" />
        )}
      </div>
    </>
  );
};

export default Peoples;
