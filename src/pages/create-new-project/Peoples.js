import { Loading } from "@nextui-org/react";
import { useCreateNewProject } from "./CreateNewProjectContext";
import Select from "react-select";
import { useLocation } from "react-router-dom";
import { encryptText, decryptText } from "../../utils/enc-dec.utils";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { getSurvey } from "../../utils/firebaseQueries";
import { selectStyle } from "./BasicSurveyInfo";
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

  let [peoplesResearchTeam, setPeoplesResearchTeam] = useState("");
  console.log(surveyData);
  useEffect(() => {
    const survey_id = decryptText(encryptedID.split("-")[0]);
    getSurvey(survey_id).then((data) => {
      setPeoplesResearchTeam(data?.client_info?.client_name);
    });
  }, [encryptedID]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e, teamName, positionInTeam) => {
    switch (positionInTeam) {
      case "pm":
        let pms = [];
        e.forEach(({ label, value }) => {
          pms.push(value);
        });
        return setSurveyData((prevData) => {
          return {
            ...prevData,
            [teamName]: {
              ...prevData?.[teamName],
              lead_project_managers: pms,
            },
          };
        });
      case "sm":
        return setSurveyData((prevData) => {
          return {
            ...prevData,
            [teamName]: {
              ...prevData?.[teamName],
              sales_manager: e.target.value,
            },
          };
        });
      case "am":
        return setSurveyData((prevData) => {
          return {
            ...prevData,
            [teamName]: {
              ...prevData?.[teamName],
              account_manager: e.target.value,
            },
          };
        });
    }
  };

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
              <input
                type="number"
                placeholder="32%"
                onChange={(e) => {
                  setSurveyData({
                    ...surveyData,
                    client_info: {
                      ...surveyData?.client_info,
                      client_cpi: parseInt(e.target.value),
                    },
                  });
                }}
                value={surveyData?.client_info?.client_cpi}
              />
            </div>
            <div className="cost_curr">
              <label>Client Cost Currency</label>
              <select
                onChange={(e) => {
                  let client_cost_currency_symbol;
                  if (e.target.value === "USD")
                    client_cost_currency_symbol = "$";
                  else if (e.target.value === "INR")
                    client_cost_currency_symbol = "₹";
                  else if (e.target.value === "EURO")
                    client_cost_currency_symbol = "€";
                  setSurveyData({
                    ...surveyData,
                    client_info: {
                      ...surveyData?.client_info,
                      client_cost_currency: e.target.value,
                      client_cost_currency_symbol,
                    },
                  });
                }}
                value={surveyData?.client_info?.client_cost_currency}
              >
                <option value="USD">USD</option>
                <option value="INR">INR</option>
                <option value="EURO">EURO</option>
              </select>
            </div>
          </div>
          <div className="column">
            <label>PO Number</label>
            <input
              type="text"
              placeholder="XXXXXXXXXX"
              onChange={(e) => {
                setSurveyData({
                  ...surveyData,
                  client_info: {
                    ...surveyData?.client_info,
                    po_number: e.target.value,
                  },
                });
              }}
              value={surveyData?.client_info?.po_number}
            />
          </div>
          <div className="column">
            <label>Client's PO Number</label>
            <input
              type="text"
              placeholder="XXXXXXXXXX"
              onChange={(e) => {
                setSurveyData({
                  ...surveyData,
                  client_info: {
                    ...surveyData?.client_info,
                    client_po_number: e.target.value,
                  },
                });
              }}
              value={surveyData?.client_info?.client_po_number}
            />
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
            <Select
              onChange={(e) => {
                handleInputChange(e, "mirats_insights_team", "pm");
              }}
              styles={selectStyle}
              isMulti
              options={miratsoptions}
            />
          </div>
          <div className="column">
            <label>Sales Manager</label>
            <input
              type="text"
              placeholder="Juhi Saini"
              value={surveyData?.mirats_insights_team?.sales_manager}
              onChange={(e) =>
                handleInputChange(e, "mirats_insights_team", "sm")
              }
            />
          </div>
          <div className="column">
            <label>Account Manager</label>
            <input
              type="text"
              placeholder="Janhavi Rajput"
              value={surveyData?.mirats_insights_team?.account_manager}
              onChange={(e) =>
                handleInputChange(e, "mirats_insights_team", "am")
              }
            />
          </div>

          {/****** clients team info  */}
          <h2>{peoplesResearchTeam}</h2>
          <div className="column">
            <label className="multiselect">Lead Project Manager</label>
            <Select
              styles={selectStyle}
              isMulti
              options={gmooptions}
              onChange={(e) => handleInputChange(e, "clients_team", "pm")}
            />
          </div>
          <div className="column">
            <label>Sales Manager</label>
            <select
              value={surveyData?.client_team?.sales_manager}
              onChange={(e) => handleInputChange(e, "clients_team", "sm")}
            >
              <option>Ashish Mathur</option>
              <option>Mayank patel</option>
            </select>
          </div>
          <div className="column">
            <label>Account Manager</label>
            <select
              value={surveyData?.client_team?.sales_manager}
              onChange={(e) => handleInputChange(e, "clients_team", "am")}
            >
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
