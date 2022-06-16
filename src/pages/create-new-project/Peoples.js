import { Loading } from "@nextui-org/react";
import { useCreateNewProject } from "./CreateNewProjectContext";
import Select from "react-select";
import { useLocation } from "react-router-dom";
import { encryptText, decryptText } from "../../utils/enc-dec.utils";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  getClients,
  getMiratsInsightsTeam,
  getSurvey,
} from "../../utils/firebaseQueries";
import { selectStyle } from "./BasicSurveyInfo";
import { positions } from "@mui/system";
const miratsoptions = [
  { value: "Moinnudin S.", label: "Moinnudin S." },
  { value: "Mahmood A.", label: "Mahmood A." },
  { value: "Mayank K.", label: "Mayank K." },
  { value: "Amit K. C.", label: "Amit K. C." },
];

const gmooptions = [];

const Peoples = () => {
  const { surveyData, setSurveyData, insertPeoplesData, insertLoading } =
    useCreateNewProject();
  const location = useLocation();
  const [peoples, setPeoples] = useState({});
  const [disabledBtn, setDisabledBtn] = useState(true);
  const encryptedID = new URLSearchParams(location.search).get("id");

  useEffect(() => {
    window.scrollTo(0, 0);

    getMiratsInsightsTeam().then((data) => {
      setPeoples(data);
    });
  }, []);

  useEffect(() => {
    if (
      surveyData?.client_info?.client_cpi &&
      surveyData?.client_info?.client_cost_currency &&
      surveyData?.mirats_insights_team?.project_managers?.length &&
      surveyData?.mirats_insights_team?.sales_managers?.length &&
      surveyData?.mirats_insights_team?.account_managers?.length
    )
      setDisabledBtn(false);
    else setDisabledBtn(true);
  }, [surveyData]);

  const handleInputChange = (e, teamName, positionInTeam) => {
    let peoples = [];
    e.forEach(({ label, value }) => {
      peoples.push(value);
    });

    setSurveyData((prevData) => {
      return {
        ...prevData,
        [teamName]: {
          ...prevData?.[teamName],
          [positionInTeam]: peoples,
        },
      };
    });
  };
  console.log(surveyData, disabledBtn);

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
              <label>Client CPI</label> &nbsp;
              <span className="required_tag">requierd</span>
              <input
                type="number"
                placeholder="Please enter client CPI"
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
              <label>Client Cost Currency</label> &nbsp;
              <span className="required_tag">required</span>
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
                <option value="" hidden disabled selected>
                  select currency
                </option>
                <option value="USD">USD</option>
                <option value="INR">INR</option>
                <option value="EURO">EURO</option>
              </select>
            </div>
          </div>
          <div className="column">
            <label>PO Number</label>
            <input type="text" value={surveyData?.survey_id} disabled />
          </div>
          <div className="column">
            <label>Client's PO Number (optional)</label>
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
            <div>
              <label>Lead Project Manager</label> &nbsp;
              <span className="required_tag">required</span>
            </div>

            <br />
            <Select
              onChange={(e) => {
                handleInputChange(
                  e,
                  "mirats_insights_team",
                  "project_managers"
                );
              }}
              styles={selectStyle}
              isMulti
              options={peoples?.project_managers}
            />
          </div>
          <div className="column">
            <div>
              <label>Sales Manager</label> &nbsp;
              <span className="required_tag">required</span>
            </div>
            <br />
            <Select
              onChange={(e) => {
                handleInputChange(e, "mirats_insights_team", "sales_managers");
              }}
              styles={selectStyle}
              isMulti
              options={peoples?.sales_managers}
            />
          </div>
          <div className="column">
            <div>
              <label>Account Manager</label> &nbsp;
              <span className="required_tag">required</span>
            </div>
            <br />
            <Select
              onChange={(e) => {
                handleInputChange(
                  e,
                  "mirats_insights_team",
                  "account_managers"
                );
              }}
              styles={selectStyle}
              isMulti
              options={peoples?.account_managers}
            />
          </div>

          {/****** clients team info  */}
          {/* <h2>{surveyData?.client_info?.client_name} Team</h2>
          <div className="column">
            <label>Lead Project Manager</label> <br />
            <Select
              styles={selectStyle}
              isMulti
              options={clientInfo?.leadProjectManagers}
              onChange={(e) =>
                handleInputChange(e, "clients_team", "project_managers")
              }
            />
          </div>
          <div className="column">
            <label>Sales Manager</label> <br />
            <Select
              styles={selectStyle}
              isMulti
              options={clientInfo?.salesManagers}
              onChange={(e) =>
                handleInputChange(e, "clients_team", "sales_managers")
              }
            />
          </div>
          <div className="column">
            <label>Account Manager</label> <br />
            <Select
              styles={selectStyle}
              isMulti
              options={clientInfo?.accountManagers}
              onChange={(e) =>
                handleInputChange(e, "clients_team", "account_managers")
              }
            />
          </div> */}
        </div>
      </div>

      <div className="next_btn_container">
        {!insertLoading ? (
          <button onClick={insertPeoplesData} disabled={disabledBtn}>
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
