import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/header/Header";
import Subheader from "../../components/subheader/Subheader";
import SurveyInfo from "../../components/survey-info/SurveyInfo";
import styles from "./ProjectSettings.module.css";
import { useProjectSettingsContext } from "./ProjectSettingContext";
import { v4 as uuid } from "uuid";
import { Switch } from "@nextui-org/react";
import ChangeLogComponent from "./ChangeLog";
import Select from "react-select";
import countryList from "react-select-country-list";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { updateSurveyData } from "../../utils/firebaseQueries";
import SnackbarMsg from "../../components/Snackbar";
import { statusOptions } from "../../utils/commonData";
import BuildUrlModal from "./build-url-modal/BuildUrlModal";
import {
  mainStatusWithInternalStatuses,
  studyTypesData,
  industryData,
} from "../../utils/commonData";
import { useHistory } from "react-router-dom";
import {
  getAvgCPI,
  getSupplAvgCPI,
} from "../survey-dashboard/SurveyDashboardContext";

const businessUnitData = [
  { label: "MIRATS-API", value: "mirats-api" },
  { label: "MIRATS-OTC", value: "mirats-otc" },
];

const surveyStatusData = statusOptions;
const currencyData = [
  {
    label: "USD",
    value: "USD",
  },
  {
    label: "EURO",
    value: "EURO",
  },
  {
    label: "INR",
    value: "INR",
  },
];
const projectCoordinatorsData = [
  "Mahmood Alam",
  "Shruit s",
  "abc abc",
  "xyz xyx",
];

const NewProjectSettings = () => {
  const history = useHistory();
  const { surveyID } = useParams();
  const { surveyData, changes, setChanges, clients, completedSessions } =
    useProjectSettingsContext();
  const [sData, setSData] = useState();
  const [country, setCountry] = useState("");
  const countries = useMemo(() => countryList().getData(), []);
  const [collectUserData, setCollectUserData] = useState();
  const [showSaveChangesBtn, setShowChangesBtn] = useState(false);
  const [snackbarData, setSnackbarData] = useState("");
  const [snackbar, setSnackbar] = useState(false);
  const [buildUrlModal, setBuildUrlModal] = useState(false);

  useEffect(() => {
    setCollectUserData(surveyData?.collect_user_data);
    setSData(surveyData);
    setCountry({
      label: surveyData?.country?.country_full_name,
      value: surveyData?.country?.country,
    });
  }, [surveyData]);

  const handleInputChange = (e, changingEle, prevVal) => {
    console.log(changingEle, prevVal);
    let resp = e.target.value;
    if (resp === "true") resp = true;
    else if (resp === "false") resp = false; // ---->>> this is just becoz input type radio giving value in string format
    setShowChangesBtn(true);
    setChanges({
      ...changes,
      [changingEle]: {
        changed_to: resp,
        previous_change: prevVal,
      },
    });
    setSData({
      ...sData,
      [changingEle]: resp,
    });
  };

  const handleDeviceCompatibilityChange = (changingEle, value) => {
    setShowChangesBtn(true);
    setChanges({
      ...changes,
      device_suitability: {
        [changingEle]: value,
      },
    });
    setSData({
      ...sData,
      device_suitability: {
        ...sData?.device_suitability,
        [changingEle]: value,
      },
    });
  };

  const handleCancleChangesBtn = () => {
    setChanges({});
    setSData(surveyData);
    setShowChangesBtn(false);
  };

  const handleSaveChangesBtn = () => {
    updateSurveyData(surveyID, sData, changes)
      .then(() => {
        setSnackbar(true);
        setSnackbarData({
          msg: "Project settings changed successfully",
          severity: "success",
        });
      })
      .catch((err) => {
        setSnackbar(true);
        console.log(err.message);
        setSnackbarData({
          msg: "Oops! somethig went wrong try again later",
          severity: "error",
        });
      });
    setShowChangesBtn(false);
  };
  const selectStyle = {
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
      height: "30px",
      border: "none",
      borderRadius: "20px",
      background: "#eeeeeebf",
    }),
    input: (styles) => ({
      ...styles,
      height: "30px",
      width: "100%",
      textAlign: "center",
    }),
  };

  return (
    <>
      <BuildUrlModal
        openModal={buildUrlModal}
        setOpenModal={setBuildUrlModal}
      />

      <Header />
      <Subheader />
      <SurveyInfo />
      <div className={styles.project_settings_container}>
        <div className={styles.left}>
          {/* ***** setup requirements card  */}
          <div className={styles.setup_requirements_card}>
            <p className={styles.legend}>Setup Requirements</p>
            <div className={styles.input_components}>
              <InputFieldCard
                title="study type"
                value="study_type"
                inputType="select"
                dropDownData={studyTypesData}
                selectedData={sData?.study_type}
                handleInputChange={handleInputChange}
              />

              <InputFieldCard
                title="business unit"
                value="business_unit"
                inputType="select"
                dropDownData={businessUnitData}
                selectedData={sData?.business_unit}
                handleInputChange={handleInputChange}
              />

              <InputFieldCard
                title="industry"
                value="industry"
                inputType="select"
                dropDownData={industryData}
                selectedData={sData?.industry}
                handleInputChange={handleInputChange}
              />
              <div className={styles.input_component}>
                <span>Country</span>
                <div style={{ marginTop: ".5rem" }}>
                  <Select
                    options={countries}
                    value={country}
                    styles={selectStyle}
                    onChange={(e) => {
                      setCountry(e);
                      setShowChangesBtn(true);
                      setChanges({
                        ...changes,
                        country_code: {
                          changed_to: e.value.toUpperCase(),
                          previous_change: surveyData?.country?.code,
                        },
                      });
                      setSData({
                        ...sData,
                        country: {
                          ...sData.country,
                          country: e.value.toUpperCase(),
                          country_full_name: e.label,
                          code: sData?.country?.language + "-" + e.value,
                        },
                      });
                    }}
                  />
                </div>
              </div>
              <div className={styles.input_component}>
                <label>Country - Language</label>
                <select
                  value={sData?.country?.language}
                  onChange={(e) => {
                    setShowChangesBtn(true);
                    setChanges({
                      ...changes,
                      country_code: {
                        changed_to: e.target.value,
                        previous_change: surveyData?.country?.code,
                      },
                    });
                    setSData({
                      ...sData,
                      country: {
                        ...sData.country,
                        code: e.target.value + "-" + sData?.country?.country,
                        language: e.target.value,
                      },
                    });
                  }}
                >
                  <option value="_">Select the country and Language</option>
                  <option value="FRA">French</option>
                  <option value="ENG">English</option>
                  <option value="GER">German</option>
                  <option value="JPN">Japanese</option>
                  <option value="ESP">Spanish</option>
                </select>
              </div>
              <InputFieldCard
                title="survey status"
                value="status"
                inputType="select"
                dropDownData={surveyStatusData}
                selectedData={sData?.status}
                handleInputChange={handleInputChange}
              />
              <InputFieldCard
                title="internal status"
                value="internal_status"
                inputType="select"
                dropDownData={mainStatusWithInternalStatuses?.[sData?.status]}
                selectedData={sData?.internal_status}
                handleInputChange={handleInputChange}
              />
              <div className={styles.input_component}>
                <label>currency</label>
                <select
                  value={`${sData?.client_info?.client_cost_currency}-${sData?.client_info?.client_cost_currency_symbol}`}
                  onChange={(e) => {
                    setShowChangesBtn(true);
                    setChanges({
                      ...changes,
                      client_cost_currency: {
                        changed_to: e.target.value.split("-")[0],
                        previous_change:
                          surveyData?.client_info?.client_cost_currency,
                      },
                    });
                    setSData({
                      ...sData,
                      client_info: {
                        ...sData?.client_info,
                        client_cost_currency: e.target.value.split("-")[0],
                        client_cost_currency_symbol:
                          e.target.value.split("-")[1],
                      },
                    });
                  }}
                >
                  <option value="USD-$">USD</option>
                  <option value="INR-₹">INR</option>
                  <option value="EURO-€">EURO</option>
                </select>
              </div>
              <InputFieldCard
                title="external survey name"
                value="external_survey_name"
                inputType="input"
                defaultVal={sData?.external_survey_name}
                handleInputChange={handleInputChange}
              />
            </div>
          </div>

          {/* ***** url setup & cost  */}
          <div className={styles.url_setup_cost_card}>
            <p className={styles.legend}>URL Setup & Costs</p>
            <div className={styles.input_components}>
              {/* <InputFieldCard
                title="client"
                inputType="select"
                dropDownData={clients}
                selectedData={sData?.client_info?.client_name}
                handleInputChange={handleInputChange}
              /> */}
              <div className={styles.input_component}>
                <label>client</label>
                <select
                  value={sData?.client_info?.client_name}
                  onChange={(e) => {
                    setShowChangesBtn(true);
                    setChanges({
                      ...changes,
                      client_name: {
                        changed_to: e.target.value,
                        previous_change: surveyData?.client_info?.client_name,
                      },
                    });
                    setSData({
                      ...sData,
                      client_info: {
                        ...sData.client_info,
                        client_name: e.target.value,
                      },
                    });
                  }}
                >
                  {clients?.map((client) => (
                    <option value={client?.value} key={uuid()}>
                      {client.label}
                    </option>
                  ))}
                </select>
              </div>
              <InputFieldCard
                title="client avg cost"
                inputType="input"
                defaultVal={`${
                  sData?.client_info?.client_cost_currency_symbol
                } ${getAvgCPI(completedSessions, completedSessions.length)}`}
                disabled={true}
              />
              <InputFieldCard
                title="supply avg cost"
                inputType="input"
                defaultVal={`${
                  sData?.client_info?.client_cost_currency_symbol
                } ${getSupplAvgCPI(
                  completedSessions,
                  completedSessions.length
                )} `}
                disabled={true}
              />
              <InputFieldCard
                title="client coverage email"
                inputType="select"
              />
              <InputFieldCard
                title="Live URL"
                value="live_url"
                inputType="input"
                handleInputChange={handleInputChange}
                defaultVal={sData?.live_url}
              />
              <InputFieldCard
                title="Test URL"
                value="test_url"
                handleInputChange={handleInputChange}
                inputType="input"
                defaultVal={sData?.test_url}
              />
            </div>
          </div>

          {/* ***** expected metrics  */}
          <div className={styles.expected_metrics_card}>
            <p className={styles.legend}>Expected Metrics</p>
            <div className={styles.input_components}>
              <InputFieldCard
                title="required N"
                value="no_of_completes"
                inputType="input"
                defaultVal={sData?.no_of_completes}
                handleInputChange={handleInputChange}
              />
              <InputFieldCard
                title="expected IR"
                value="expected_incidence_rate"
                inputType="input"
                defaultVal={sData?.expected_incidence_rate}
                handleInputChange={handleInputChange}
              />
              <InputFieldCard
                title="expected loi"
                value="expected_completion_loi"
                inputType="input"
                defaultVal={sData?.expected_completion_loi}
                handleInputChange={handleInputChange}
              />
              <InputFieldCard
                title="expected end date"
                value="expected_end_date"
                inputType="date"
                defaultVal=""
                handleInputChange={handleInputChange}
                defaultVal={sData?.expected_end_date?.toDate()}
              />
            </div>
          </div>

          {/*****  survey basics  */}
          <div className={styles.survey_basics_card}>
            <p className={styles.legend}>Survey Basics</p>
            <div className={styles.input_components}>
              <InputFieldCard
                title="survey name"
                inputType="input"
                defaultVal={sData?.survey_name}
              />
              <InputFieldCard
                title="expected start date"
                inputType="date"
                defaultVal={sData?.expected_start_date?.toDate()}
              />
              <InputFieldCard
                title="insights bid number"
                inputType="date"
                defaultVal=""
              />
              <InputFieldCard
                title="survey number"
                inputType="input"
                defaultVal={sData?.survey_id}
              />
              <InputFieldCard
                title="project number"
                inputType="input"
                defaultVal={sData?.survey_id}
              />
              <InputFieldCard
                title="survey group number"
                inputType="input"
                defaultVal={sData?.survey_group}
              />
              <InputFieldCard
                title="PO number"
                inputType="input"
                defaultVal={sData?.client_info?.po_number}
              />
            </div>
          </div>
        </div>

        {/******** mirats team and client team card  */}
        <div className={styles.right}>
          <TeamCard
            title="mirats team"
            projectCoo={projectCoordinatorsData}
            salesCoo={["Juhi Saini"]}
            accountManager={["Janhavi R"]}
          />
          <TeamCard
            title="clients team"
            projectCoo={surveyData?.clients_team?.lead_project_managers}
            salesCoo={surveyData?.clients_team?.sales_managers}
            accountManager={surveyData?.clients_team?.account_managers}
          />
          {/* ****** PII Collection  */}
          <div className={styles.personal_info_collection_input}>
            <h2 className={styles.legend}>PII Collection</h2>
            <span>
              <input
                type="radio"
                id="yes"
                defaultValue={true}
                name="pii_collection"
                checked={collectUserData ? true : false}
                onChange={(e) => {
                  setCollectUserData(true);
                  handleInputChange(e, "collect_user_data", "false");
                }}
              />
              <label htmlFor="yes">Yes</label>
            </span>
            <span>
              <input
                type="radio"
                id="no"
                defaultValue={false}
                name="pii_collection"
                checked={!collectUserData ? true : false}
                onChange={(e) => {
                  setCollectUserData(false);
                  handleInputChange(e, "collect_user_data", "true");
                }}
              />
              <label htmlFor="no">No</label>
            </span>
          </div>
          {/* ******* build client url and view redirect buttons  */}
          <div className={styles.black_btns}>
            <button
              className={styles.black_btn}
              onClick={() => setBuildUrlModal(true)}
            >
              Build Client's URL
            </button>{" "}
            <br />
            <button
              className={styles.black_btn}
              onClick={() => history.push(`/viewredirects/${surveyID}`)}
            >
              View Redirect/Endpoints
            </button>
          </div>

          {/* ******** device suitability  Collection  */}
          <div className={styles.device_compatibility_card}>
            <h2>Device Compatibility</h2>
            <div className={styles.device_compatibility_switch}>
              <p> Suitable for Mobile</p>
              <Switch
                checked={sData?.device_suitability?.mobile}
                onChange={(e) =>
                  handleDeviceCompatibilityChange("mobile", e.target.checked)
                }
              />
            </div>
            <div className={styles.device_compatibility_switch}>
              <p> Suitable for Desktop/Laptop</p>
              <Switch
                checked={sData?.device_suitability?.desktop}
                onChange={(e) =>
                  handleDeviceCompatibilityChange("dektop", e.target.checked)
                }
              />
            </div>
            <div className={styles.device_compatibility_switch}>
              <p> Suitable for Tablets</p>
              <Switch
                checked={sData?.device_suitability?.tablet}
                onChange={(e) =>
                  handleDeviceCompatibilityChange("tablet", e.target.checked)
                }
              />
            </div>
            <div className={styles.device_compatibility_switch}>
              <p> Suitable for Smart TV</p>
              <Switch
                checked={sData?.device_suitability?.tv}
                onChange={(e) =>
                  handleDeviceCompatibilityChange("tv", e.target.checked)
                }
              />
            </div>
            <div className={styles.device_compatibility_switch}>
              <p>Requires Webcam</p>
              <Switch
                checked={sData?.device_suitability?.webcam}
                onChange={(e) =>
                  handleDeviceCompatibilityChange("webcam", e.target.checked)
                }
              />
            </div>
          </div>
          {/* ******* createdBy_container */}
          <div className={styles.createdBy_container}>
            <h2>Created By</h2>
            <p>Ayaan Ali</p>
            <p>Head of Global Sales</p>
            <a href="http://"> ayaan.ali@miratsinsights.com</a>
            <span>Created on 12/03/2022 2:00 AM</span>
          </div>
        </div>
      </div>

      {/******** changes save and cancel button  */}
      {showSaveChangesBtn ? (
        <div className={styles.save_and_cancel_btn}>
          <button className={styles.save_btn} onClick={handleSaveChangesBtn}>
            Save
          </button>
          <button
            className={styles.cancel_btn}
            onClick={handleCancleChangesBtn}
          >
            Cancel
          </button>
        </div>
      ) : null}

      <ChangeLogComponent />

      {/* snackbar  */}
      <SnackbarMsg
        msg={snackbarData?.msg}
        severity={snackbarData?.severity}
        open={snackbar}
        handleClose={() => setSnackbar(false)}
      />
    </>
  );
};

const InputFieldCard = ({
  title,
  value,
  inputType,
  dropDownData,
  selectedData,
  defaultVal,
  handleInputChange,
  disabled,
}) => {
  const [prevVal, setPrevVal] = useState();
  useEffect(() => {
    setPrevVal(defaultVal ? defaultVal : selectedData);
  }, [defaultVal, selectedData]);
  const { surveyData } = useProjectSettingsContext();

  let mydate = new Date(defaultVal);
  mydate =
    mydate.getFullYear() +
    "-" +
    ("0" + (mydate.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + mydate.getDate()).slice(-2);

  return (
    <div className={styles.input_component}>
      <span>{title}</span>
      {(() => {
        switch (inputType) {
          case "select":
            return (
              <select
                value={selectedData}
                onChange={(e) =>
                  handleInputChange(e, value, surveyData?.[value])
                }
              >
                <option value="" disabled hidden>
                  Select {title}
                </option>
                {dropDownData?.map((data) => {
                  return (
                    <option key={uuid()} value={data?.value}>
                      {data.label}
                    </option>
                  );
                })}
              </select>
            );
          case "input":
            return (
              <input
                type="text"
                value={defaultVal}
                onChange={(e) =>
                  handleInputChange(e, value, surveyData?.[value])
                }
                disabled={disabled}
              />
            );
          case "date":
            return <input type="date" value={mydate} />;
        }
      })()}
    </div>
  );
};

const TeamCard = ({ title, projectCoo, salesCoo, accountManager }) => {
  return (
    <div className={styles.Teamcard}>
      <h1>{title}</h1>
      <div className={styles.sub_container}>
        <h2>Project Coordinators</h2>
        <select>
          {projectCoo?.map((coordinator) => (
            <option key={uuid()}>{coordinator}</option>
          ))}
        </select>
        <select>
          {projectCoo?.map((coordinator) => (
            <option key={uuid()}>{coordinator}</option>
          ))}
        </select>
      </div>
      <div className={styles.sub_container}>
        <h2>Sales Coordinator</h2>
        <select>
          {salesCoo?.map((coordinator) => (
            <option key={uuid()}>{coordinator}</option>
          ))}
        </select>
      </div>
      <div className={styles.sub_container}>
        <h2>Account Manager</h2>
        <select>
          {accountManager?.map((accManager) => (
            <option key={uuid()}>{accManager}</option>
          ))}
        </select>
      </div>
    </div>
    // <div className={styles.Teamcard}>
    // 	<h1>{title}</h1>
    // 	<div>
    // 		{co_ordinators?.map(value => {
    // 			return (
    // 				<>
    // 					<h2>{value.title}</h2>
    // 					<div className={styles.subMenuBtn}>
    // 						<select>
    // 							{value.members.map(member => {
    // 								return <option>{member}</option>
    // 							})}
    // 						</select>
    // 					</div>
    // 				</>
    // 			)
    // 		})}
    // 	</div>
    // </div>
  );
};

export default NewProjectSettings;
