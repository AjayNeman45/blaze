import React, { ReactDOM, useEffect, useState } from "react";
import styles from "./supplieroverview.module.css";
import Header from "../../../components/header/Header";
import Subheader from "../../../components/subheader/Subheader";
import SurveyInfo from "../../../components/survey-info/SurveyInfo";
import TeamCards from "../../../components/teamcards/TeamCards";
import { Progress } from "@nextui-org/react";
import Badge from "@mui/material/Badge";
import { IoAdd } from "react-icons/io5";
import classnames from "classnames";
import SupplyOverViewBigCard from "./components/supply-overview-bigcard/SupplyOverViewBigCard";
import SessionSchedule from "./components/session/SessionsSchedule";
import AnalyticsUserCountCard from "../../../components/analyticsUserCountCard/AnalyticsUserCountCard";
import { useSupplierOverviewContext } from "./SupplierOverviewContext";
import { useAanalyticsContext } from "../AnalyticsContext";
import {
  getAvgCPI,
  getAvgLOI,
  getFinancialOverview,
} from "../../survey-dashboard/SurveyDashboardContext";
// import "rsuite/dist/styles/rsuite-default.css";

let co_ordinators = [
  {
    title: "Project Coordinator",
    members: ["Vinay S", "Vijay K"],
  },
  {
    title: "Sales Coordinator",
    members: ["Ram S"],
  },
  {
    title: "Account Manager",
    members: ["Vivek G"],
  },
];
const big_bar_status = [
  {
    name: "hits",
    value: "hits",
    count: 344,
  },
  {
    name: "completes",
    value: "completed",

    count: 210,
  },
  {
    name: "terminates",
    value: "term",
    count: 100,
  },
  {
    name: "security term",
    value: "securityTerm",
    count: 14,
  },
  {
    name: "over quotas",
    value: "overQuota",
    count: 20,
  },
];
const small_bar_status = [
  {
    name: "conversion",
    value: "conversion",
  },
  {
    name: "incidence",
    value: "incidence",
  },
  {
    name: "avg LOI",
    value: "avg_loi",
  },
  {
    name: "overquota",
    value: "overquota",
  },
];

const gender_by_completes_data = [
  {
    name: "male",
    count: "200",
    progress: "57",
  },
  {
    name: "female",
    count: "111",
    progress: "57",
  },
  {
    name: "other",
    count: "67",
    progress: "57",
  },
];

const completes_by_employees = [
  {
    name: "1-100",
    count: "210/300",
    progress: "45",
  },
  {
    name: "500-1000",
    count: "210/300",
    progress: "45",
  },
  {
    name: "1000",
    count: "210/300",
    progress: "45",
  },
];

function SupplierOverview() {
  const {
    statusesCnt,
    inClientSurveySessions,
    completedSessionOfSupplier,
    supplierData,
    selectedSupplier,
    setSelectedSupplier,
  } = useSupplierOverviewContext();
  const [financialOverview, setFinancialOverview] = useState({});
  const { survey } = useAanalyticsContext();

  useEffect(() => {
    getFinancialOverview(
      "actual",
      statusesCnt,
      completedSessionOfSupplier,
      setFinancialOverview
    );
  }, [statusesCnt, completedSessionOfSupplier]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.left_container}>
          <div className={styles.head_container}>
            <div className={styles.title_cont}>
              <div className={styles.title}>
                <select
                  className={styles.supp_name_select}
                  onChange={(e) =>
                    setSelectedSupplier(parseInt(e.target.value))
                  }
                >
                  {survey?.external_suppliers?.map((supp) => (
                    <option value={supp?.supplier_account_id}>
                      {supp?.supplier_account}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.status_conatainer}>
                <button className={styles.download_btn}>
                  Download Overview Report
                </button>
                <select>
                  <option style={{ color: "green" }}> Live</option>
                  <option style={{ color: "green" }}>Live</option>
                  <option style={{ color: "green" }}>Live</option>
                  <option style={{ color: "green" }}>Live</option>
                </select>
              </div>
            </div>

            <div className={styles.all_status_container}>
              <div className={styles.big_bar_container}>
                {big_bar_status.map((data) => {
                  return (
                    <div className={styles.b_bar}>
                      <p className={styles.b_title}>{data.name}</p>
                      <p className={styles.b_count}>
                        {statusesCnt[data?.value]}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className={styles.small_bar_container}>
                <div className={styles.s_bar}>
                  <p>
                    {" "}
                    <span style={{ fontWeight: 600 }}>
                      {(statusesCnt?.completed / statusesCnt?.hits).toFixed(2) *
                        100}{" "}
                      %
                    </span>{" "}
                    <span>conversion</span>{" "}
                  </p>
                </div>
                <div className={styles.s_bar}>
                  <p>
                    {" "}
                    <span style={{ fontWeight: 600 }}>
                      {(
                        (statusesCnt?.completed / inClientSurveySessions) *
                        100
                      ).toFixed(2)}{" "}
                      %
                    </span>{" "}
                    <span>incidence</span>{" "}
                  </p>
                </div>
                <div className={styles.s_bar}>
                  <p>
                    {" "}
                    <span style={{ fontWeight: 600 }}>
                      {getAvgLOI(
                        completedSessionOfSupplier,
                        statusesCnt?.completed
                      )}{" "}
                      mins
                    </span>{" "}
                    <span>avg LOI</span>{" "}
                  </p>
                </div>
                <div className={styles.s_bar}>
                  <p>
                    {" "}
                    <span style={{ fontWeight: 600 }}>
                      {(
                        (statusesCnt?.overQuota / inClientSurveySessions) *
                        100
                      ).toFixed(2)}{" "}
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
                  <span style={{ color: "rgba(30, 111, 221, 1)" }}>
                    {(
                      (statusesCnt?.completed / inClientSurveySessions) *
                      100
                    ).toFixed(0)}{" "}
                    %
                  </span>{" "}
                </p>
              </div>
              <div className={styles.count}>
                <p>
                  {statusesCnt?.completed}/ {inClientSurveySessions}
                </p>
              </div>
            </div>
            <div className={styles.progress_bar}>
              <Progress
                value={(statusesCnt?.completed / inClientSurveySessions) * 100}
                color="primary"
                size="md"
              />
            </div>
          </div>

          {/* Financial Overview  */}
          <div className={styles.financial_overview_container}>
            <div className={styles.financial_overview_header}>
              <div className={styles.left_container}>
                <h1 className={styles.title}>Financial Overview</h1>
              </div>
              <div className={styles.right_container}>
                <div>
                  {/* <DateRangePicker
                    appearance="default"
                    placeholder="Default"
                    style={{ width: 230 }}
                  /> */}
                  <button className={styles.predicted_btn}>Last 7 days</button>
                </div>
                <div>
                  <button className={styles.predicted_btn}>Prediced</button>
                </div>
                <div>
                  <button className={styles.actual_btn}>Actual</button>
                </div>
              </div>
            </div>
            <div className={styles.financial_data_container_bigcard}>
              <div className={styles.big_card}>
                <h1 className={styles.title}>Total Rev</h1>
                <h3 className={styles.count}>
                  ${financialOverview?.total_rev}
                </h3>
              </div>
              <div className={styles.big_card}>
                <h1 className={styles.title}>Supply Cost</h1>
                <h3 className={styles.count}>
                  ${financialOverview?.supply_cost}
                </h3>
              </div>
              <div className={styles.big_card}>
                <h1 className={styles.title}>Profit</h1>
                <h3 className={styles.count}>${financialOverview?.profit}</h3>
              </div>
            </div>
            <div className={styles.financial_data_container_smallcard}>
              <div className={styles.small_card}>
                <p className={styles.title}>Avg Supply CPI</p>
                <p className={styles.count}>
                  ${financialOverview?.avg_supply_cpi}
                </p>
              </div>
              <div className={styles.small_card}>
                <p className={styles.title}>Avg Client CPI</p>
                <p className={styles.count}>
                  ${financialOverview?.avg_client_cpi}
                </p>
              </div>
              <div className={styles.small_card}>
                <p className={styles.title}>EPC Vendor</p>
                <p className={styles.count}>
                  $
                  {(
                    (getAvgCPI(
                      completedSessionOfSupplier,
                      statusesCnt?.completed
                    ) *
                      statusesCnt?.completed) /
                    statusesCnt?.hits
                  ).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          <div className={styles.session_container}>
            <SessionSchedule />
          </div>
        </div>

        <div className={styles.right_container}>
          <TeamCards title="Client AB Team" co_ordinators={co_ordinators} />
          <div className={styles.small_cards}>
            <div className={styles.cpi_and_required}>
              <div className={styles.right_small_cards}>
                <p className={styles.title}>Avg. CPI</p>
                <p className={styles.count}>
                  $
                  {getAvgCPI(
                    completedSessionOfSupplier,
                    statusesCnt?.completed
                  )}
                </p>
              </div>
              <div className={styles.right_small_cards}>
                <p className={styles.title}>Allocation</p>
                <p className={styles.count}>
                  {supplierData?.allocation?.number}
                </p>
                <p className={styles.green_year}>
                  {supplierData?.allocation?.number -
                    completedSessionOfSupplier?.length}{" "}
                  left
                </p>
              </div>
            </div>
            <div className={styles.q_and_q}>
              <div className={styles.right_small_cards}>
                <p className={styles.title}>Completes</p>
                <p className={styles.count}>
                  {completedSessionOfSupplier?.length}
                </p>
              </div>
              <div className={styles.right_small_cards}>
                <p className={styles.title}>IR</p>
                <p className={styles.count}>32%</p>
              </div>
            </div>
            <div className={styles.stud_and_sur}>
              <div className={styles.right_small_cards}>
                <p className={styles.title}>Conversion</p>
                <p className={styles.count}>
                  {(
                    (completedSessionOfSupplier?.length /
                      inClientSurveySessions) *
                    100
                  ).toFixed(0)}
                  %
                </p>
              </div>
              <div className={styles.right_small_cards}>
                <p className={styles.title}>Term Rate</p>
                <p className={styles.count}>32%</p>
              </div>
            </div>
            <div className={styles.button_container}>
              <button>Download Overview Report</button>
              <button>Download Reconcillation Report</button>
              <button>Download Term Report</button>
              <button>Download Financial Report</button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.qualification_analysis}>
        <p className={styles.title}>Qualification Analysis</p>
        <div className={styles.qualification_analysis_container}>
          <div className={styles.gender_by_completes_card}>
            {/* <AnalyticsUserCountCard
              cardTitle="gender by completes"
              cardSubtitle={["gender", "completes"]}
              data={gender_by_completes_data}
            /> */}
          </div>

          <div className={styles.completes_by_employees_card}>
            {/* <AnalyticsUserCountCard
              cardTitle="completes by employees"
              cardSubtitle={["no of employees", "users"]}
              data={completes_by_employees}
            /> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default SupplierOverview;