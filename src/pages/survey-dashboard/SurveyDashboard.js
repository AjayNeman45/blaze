import React, { ReactDOM, useEffect, useState } from "react";
import styles from "./surveydashboard.module.css";
import Header from "../../components/header/Header";
import Subheader from "../../components/subheader/Subheader";
import SurveyInfo, { NameModal } from "../../components/survey-info/SurveyInfo";
import TeamCards from "../../components/teamcards/TeamCards";
import { Progress } from "@nextui-org/react";
import Badge from "@mui/material/Badge";
import { IoAdd } from "react-icons/io5";
import classnames from "classnames";
import SupplyOverViewBigCard from "./components/supply-overview-bigcard/SupplyOverViewBigCard";
import NerdySpecs from "./components/nerdy-Specs/NerdySpecs";
import DateRangePicker from "rsuite/DateRangePicker";
import Loader from "rsuite/Loader";
import {
  getAvgCPI,
  getFinancialOverview,
  getSupplAvgCPI,
  useSurveyDashboardContext,
} from "./SurveyDashboardContext";
import SnackbarMsg from "../../components/Snackbar";
import { getAvgLOI } from "./SurveyDashboardContext";
import {
  mainStatusWithInternalStatuses,
  statusOptions,
} from "../../utils/commonData";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { updateSurvey } from "../../utils/firebaseQueries";
import ChangeInternalStatusModal from "../../components/survey-info/ChangeInternalStatusModal";

const big_bar_status = [
  {
    name: "hits",
    value: "hits",
  },
  {
    name: "completes",
    value: "completed",
  },
  {
    name: "terminates",
    value: "term",
  },
  {
    name: "security term",
    value: "securityTerm",
  },
  {
    name: "over quotas",
    value: "overQuota",
  },
];
function SurveyDashboard() {
  const {
    survey,
    statusesCnt,
    handleChangeSurveyNameBtn,
    surveyNameEditModal,
    setSurveyNameEditModal,
    changedSurveyName,
    setChangeSurveyName,
    newSurveyName,
    snackbarData,
    setSnackbarData,
    snackbar,
    setSnackbar,
    completedSessions,
    inClientSurveySessions,
  } = useSurveyDashboardContext();

  const [financialOverview, setFinancialOverview] = useState({});
  const [batti, setBatti] = useState();
  const { surveyID } = useParams();
  const history = useHistory();
  const [surveyStatus, setSurveyStatus] = useState();
  const [internalStatusChangeModal, setInternalStatusChangeModal] =
    useState(false);

  useEffect(() => {
    getFinancialOverview(
      "actual",
      statusesCnt,
      completedSessions,
      setFinancialOverview
    );
  }, [statusesCnt, completedSessions]);

  useEffect(() => {
    setSurveyStatus(survey?.status);

    handleActiveLight(survey?.status, survey?.internal_status);
  }, [survey]);

  const handleActiveLight = (mainStatus, internalStatus) => {
    console.log(mainStatus, internalStatus);
    if (mainStatus?.toLowerCase() === "bidding") {
      setBatti(1);
    } else if (mainStatus?.toLowerCase() === "awarded") {
      setBatti(2);
      console.log("awarded choose");
    } else if (mainStatus?.toLowerCase() === "live") {
      if (internalStatus.toLowerCase() === "soft_launch") setBatti(3);
      else if (internalStatus.toLowerCase() === "full_launch") setBatti(4);
    } else if (mainStatus?.toLowerCase() === "complete") {
      console.log("completed status hit");
      setBatti(5);
    } else if (mainStatus?.toLowerCase() === "billed") {
      console.log("billed status hit");
      setBatti(6);
    } else {
      setBatti();
    }
  };

  const handleConfirmButton = (internalStatus) => {
    updateSurvey(surveyID, {
      status: surveyStatus,
      internal_status: internalStatus,
    })
      .then(() => {
        setSnackbar(true);
        setSnackbarData({
          msg: "survey status and internal status updated successfully.",
          severity: "success",
        });
        handleActiveLight(surveyStatus, internalStatus);
      })
      .catch((err) => {
        {
          setSnackbar(true);
          setSnackbarData({
            msg: "Oops! something went wrong",
            severity: "error",
          });
        }
      });
  };

  // ---->>> updates the status of the survey
  const handleStatusChange = (changedStatus) => {
    updateSurvey(surveyID, { status: changedStatus, internal_status: "" })
      .then(() => {
        setSnackbar(true);
        setSnackbarData({
          msg: "survey status updated successfully...",
          severity: "success",
        });
        handleActiveLight(changedStatus, "");
      })
      .catch((err) => {
        setSnackbar(true);
        setSnackbarData({
          msg: "Oops! something went wrong",
          severity: "error",
        });
        console.log(err.message);
      });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <ChangeInternalStatusModal
        openModal={internalStatusChangeModal}
        setOpenModal={setInternalStatusChangeModal}
        mainStatus={surveyStatus}
        handleConfirmButton={handleConfirmButton}
      />
      <SnackbarMsg
        msg={snackbarData?.msg}
        open={snackbar}
        setSnackbar={setSnackbar}
        severity={snackbarData.severity}
      />

      <Header />
      <Subheader />

      <div className={styles.container}>
        <div className={styles.left_container}>
          <div className={styles.head_container}>
            <div className={styles.title_cont}>
              <div className={styles.title}>
                <h1>{newSurveyName}</h1>
                <p onClick={() => setSurveyNameEditModal(true)}>edit</p>
              </div>
              <div className={styles.status_conatainer}>
                <select
                  value={surveyStatus}
                  onChange={(e) => {
                    setSurveyStatus(e.target.value);
                    if (
                      !mainStatusWithInternalStatuses.hasOwnProperty(
                        e.target.value
                      )
                    )
                      handleStatusChange(e.target.value);
                    else setInternalStatusChangeModal(true);
                  }}
                >
                  {statusOptions?.map((option) => (
                    <option value={option?.value} style={{ color: "green" }}>
                      {option?.label}
                    </option>
                  ))}
                  {/* <option style={{ color: "green" }}>Live</option>
                  <option style={{ color: "green" }}>Live</option>
                  <option style={{ color: "green" }}>Live</option> */}
                </select>
              </div>
            </div>

            <div className={styles.all_status_container}>
              <div className={styles.big_bar_container}>
                {big_bar_status?.map(({ name, value }) => {
                  return (
                    <div className={styles.b_bar}>
                      <p className={styles.b_title}>{name}</p>
                      <p className={styles.b_count}>
                        {statusesCnt?.[value] ? statusesCnt?.[value] : "-"}
                      </p>
                    </div>
                  );
                })}
                {/* {big_bar_status.map(value => {
									return (
										<div className={styles.b_bar}>
											<p className={styles.b_title}>
												{value.name}
											</p>
											<p className={styles.b_count}>
												{value.count}
											</p>
										</div>
									)
								})} */}
              </div>
              <div className={styles.small_bar_container}>
                <div className={styles.s_bar}>
                  <p>
                    {" "}
                    <span style={{ fontWeight: 600 }}>
                      {(
                        (statusesCnt?.completed / statusesCnt?.hits) *
                        100
                      ).toFixed(0)}{" "}
                      %
                    </span>{" "}
                    <span>conversion</span>{" "}
                  </p>
                </div>
                <div className={styles.s_bar}>
                  <p>
                    {" "}
                    <span style={{ fontWeight: 600 }}>
                      {
                        // ***** statusesCnt?.completed / no_of_session with mirtas status 3  ---> actual formula
                        (
                          (statusesCnt?.completed / inClientSurveySessions) *
                          100
                        ).toFixed(0)
                      }{" "}
                      %
                    </span>{" "}
                    <span>incidence</span>{" "}
                  </p>
                </div>
                <div className={styles.s_bar}>
                  <p>
                    {" "}
                    <span style={{ fontWeight: 600 }}>
                      {getAvgLOI(completedSessions, statusesCnt?.completed)}{" "}
                      mins
                    </span>{" "}
                    <span>avg LOI</span>{" "}
                  </p>
                </div>
                <div className={styles.s_bar}>
                  <p>
                    {" "}
                    <span style={{ fontWeight: 600 }}>
                      {
                        // **** statusesCnt?.overQuota / sessions with mirats status 3  --->  actual formula
                        (
                          (statusesCnt?.overQuota / inClientSurveySessions) *
                          100
                        ).toFixed(0)
                      }{" "}
                      %
                    </span>{" "}
                    <span>overquota</span>{" "}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Progress container  */}
          <div className={styles.progress_container}>
            <div className={styles.progress_number}>
              <div className={styles.progress}>
                <p>
                  Progress:{" "}
                  <span
                    style={{
                      color: "rgba(30, 111, 221, 1)",
                    }}
                  >
                    {(
                      (statusesCnt?.completed * 100) /
                      survey?.no_of_completes
                    ).toFixed(0)}{" "}
                    %
                  </span>{" "}
                </p>
              </div>
              <div className={styles.count}>
                <p>
                  {statusesCnt?.completed} &nbsp;/ {survey?.no_of_completes}
                </p>
              </div>
            </div>
            <div className={styles.progress_bar}>
              <Progress
                value={(statusesCnt?.completed * 100) / survey?.no_of_completes}
                color="primary"
                size="md"
              />
            </div>
            <div className={styles.below_progressbar_container}>
              <div className={styles.internal_status_container}>
                <div className={styles.internal_status}>
                  <div className={batti >= 1 ? styles.active : styles.inactive}>
                    <span className={classnames(styles.round)}></span>
                    <span>Order received</span>
                  </div>
                  <div className={batti >= 2 ? styles.active : styles.inactive}>
                    <span className={classnames(styles.round)}></span>
                    <span>Awarded</span>
                  </div>
                  <div className={batti >= 3 ? styles.active : styles.inactive}>
                    <span className={classnames(styles.round)}></span>
                    <span>Soft Launch</span>
                  </div>

                  <div className={batti >= 4 ? styles.active : styles.inactive}>
                    <span className={classnames(styles.round)}></span>
                    <span>full launch</span>
                  </div>
                  <div className={batti >= 5 ? styles.active : styles.inactive}>
                    <span
                      className={classnames(styles.round, styles.disabled)}
                    ></span>
                    <span>Reconcillation</span>
                  </div>
                  <div className={batti >= 6 ? styles.active : styles.inactive}>
                    <span className={classnames(styles.round)}></span>
                    <span>Closed and Billed</span>
                  </div>
                </div>
                <div className={styles.cpi}>
                  <div className={styles.dark}>
                    <p>AVG.CPI</p>
                    <p style={{ fontWeight: 600 }}>
                      {getAvgCPI(completedSessions, statusesCnt?.completed)}{" "}
                      {survey?.client_info?.client_cost_currency}
                    </p>
                  </div>
                  <div className={styles.light}>
                    <p>EPC</p>
                    <p style={{ fontWeight: 600 }}>
                      {(
                        (getAvgCPI(completedSessions, statusesCnt?.completed) *
                          statusesCnt?.completed) /
                        statusesCnt?.hits
                      ).toFixed(2)}{" "}
                      {survey?.client_info?.client_cost_currency}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Supply overview  */}
          <div className={styles.supply_overview_container}>
            <div className={styles.supply_overview_header}>
              <h1>Supply Overview</h1>
              <button className={styles.add_icon}>
                <IoAdd
                  color="white"
                  size={20}
                  onClick={() =>
                    history.push(`/surveys/allocations/${surveyID}`)
                  }
                />
              </button>
            </div>
            <div className={styles.big_card_container}>
              {survey?.external_suppliers?.slice(0, 3).map((supp) => (
                <SupplyOverViewBigCard supp={supp} />
              ))}
            </div>
            <div className={styles.small_card_container}>
              {/* <div>
								<p>PureSpectrum</p>
								<p style={{ fontWeight: "600" }}>02/50</p>
							</div>
							<div>
								<p>PureSpectrum</p>
								<p style={{ fontWeight: "600" }}>02/50</p>
							</div>
							<div>
								<p>PureSpectrum</p>
								<p style={{ fontWeight: "600" }}>02/50</p>
							</div> */}
            </div>
          </div>
          {/* Financial Overview  */}
          <div className={styles.financial_overview_container}>
            <div className={styles.financial_overview_header}>
              <div className={styles.left_container}>
                <h1 className={styles.title}>Financial Overview</h1>
              </div>
              <div className={styles.right_container}>
                {/* <div>
									<DateRangePicker
										appearance='default'
										placeholder='Default'
									/>
								</div> */}
                {/* <div>
									<button
										className={styles.predicted_btn}
										onClick={() =>
											getFinancialOverview(
												"predicted",
												statusesCnt,
												completedSessions,
												setFinancialOverview
											)
										}
									>
										Predicted
									</button>
								</div> */}
                <div>
                  <button
                    className={styles.actual_btn}
                    onClick={() =>
                      getFinancialOverview(
                        "actual",
                        statusesCnt,
                        completedSessions,
                        setFinancialOverview
                      )
                    }
                  >
                    Actual
                  </button>
                </div>
              </div>
            </div>
            <div className={styles.financial_data_container_bigcard}>
              <div className={styles.big_card}>
                <h1 className={styles.title}>Total Rev</h1>
                <h3 className={styles.count}>
                  {survey?.client_info?.client_cost_currency_symbol}{" "}
                  {financialOverview?.total_rev}
                </h3>
              </div>
              <div className={styles.big_card}>
                <h1 className={styles.title}>Supply Cost</h1>
                <h3 className={styles.count}>
                  {survey?.client_info?.client_cost_currency_symbol}{" "}
                  {statusesCnt?.completed *
                    getSupplAvgCPI(completedSessions, statusesCnt?.completed)}
                </h3>
              </div>
              <div className={styles.big_card}>
                <h1 className={styles.title}>Profit</h1>
                <h3 className={styles.count}>
                  {survey?.client_info?.client_cost_currency_symbol}{" "}
                  {statusesCnt?.completed *
                    getAvgCPI(completedSessions, statusesCnt?.completed) -
                    statusesCnt?.completed *
                      getSupplAvgCPI(completedSessions, statusesCnt?.completed)}
                </h3>
              </div>
            </div>
            <div className={styles.financial_data_container_smallcard}>
              <div className={styles.small_card}>
                <p className={styles.title}>Avg Supply CPI</p>
                <p className={styles.count}>
                  {survey?.client_info?.client_cost_currency_symbol}{" "}
                  {getSupplAvgCPI(completedSessions, statusesCnt?.completed)}
                </p>
              </div>
              <div className={styles.small_card}>
                <p className={styles.title}>Avg Client CPI</p>
                <p className={styles.count}>
                  {survey?.client_info?.client_cost_currency_symbol}{" "}
                  {getAvgCPI(completedSessions, statusesCnt?.completed)}
                </p>
              </div>
              <div className={styles.small_card}>
                <p className={styles.title}>EPC Vendor</p>
                <p className={styles.count}>
                  {survey?.client_info?.client_cost_currency_symbol}{" "}
                  {(
                    (statusesCnt?.completed *
                      getSupplAvgCPI(
                        completedSessions,
                        statusesCnt?.completed
                      )) /
                    statusesCnt?.hits
                  ).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.right_container}>
          <TeamCards
            title="Mirats Insights team"
            co_ordinators={survey?.mirats_insights_team}
          />
          <TeamCards
            title="Clients Team"
            co_ordinators={survey?.clients_team}
          />
          <NerdySpecs />
          <div className={styles.small_cards}>
            <div className={styles.cpi_and_required}>
              <div className={styles.right_small_cards}>
                <p className={styles.title}>CPI</p>
                <p className={styles.count}>
                  $ {survey?.client_info?.client_cpi}
                </p>
              </div>
              <div className={styles.right_small_cards}>
                <p className={styles.title}>Required</p>
                <p className={styles.count}>{survey?.no_of_completes}</p>
                <p className={styles.green_year}>
                  {survey?.no_of_completes - statusesCnt?.completed} left
                </p>
              </div>
            </div>
            <div className={styles.q_and_q}>
              <div className={styles.right_small_cards}>
                <p className={styles.title}>Qualification</p>
                <p className={styles.count}>
                  {survey?.qualifications?.questions?.length} Ques
                </p>
              </div>
              <div className={styles.right_small_cards}>
                <p className={styles.title}>Quotas</p>
                <p className={styles.count}>{survey?.quotas} Quota</p>
              </div>
            </div>
            <div className={styles.stud_and_sur}>
              <div className={styles.right_small_cards}>
                <p className={styles.title}>Study Type</p>
                <p className={styles.count}>{survey?.study_type}</p>
              </div>
              <div className={styles.right_small_cards}>
                <p className={styles.title}>Survey Type</p>
                <p className={styles.count}>B2B</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* changed survey name edit modal  */}
      <NameModal
        title="Change Survey Name"
        changeName={changedSurveyName}
        setChangeName={setChangeSurveyName}
        handleSaveBtn={handleChangeSurveyNameBtn}
        openModal={surveyNameEditModal}
        setOpenModal={setSurveyNameEditModal}
      />

      {/* snackar  */}
      <SnackbarMsg
        msg={snackbarData.msg}
        severity={snackbarData?.severity}
        open={snackbar}
        setSnackbar={setSnackbar}
      />
    </>
  );
}

export default SurveyDashboard;
