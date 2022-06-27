import Header from "../../components/header/Header";
import styles from "./Dashboard.module.css";
import { Chart } from "chart.js";
import { Line } from "react-chartjs-2";
import ProjectServiceCard from "./components/projectDashboardCard/ProjectServiceCard";
import AnalyticsUserCountCard from "../../components/analyticsUserCountCard/AnalyticsUserCountCard";
import cx from "classnames";
import { DashboardContext } from "./DashboardContext";
import { useContext, useEffect, useState } from "react";
import { DateRangePicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import { addDays, subDays } from "date-fns";
import { v4 as uuid } from "uuid";
import NewManagerEnd from "../managerend/NewManagerEnd";
import ReactApexChart from "react-apexcharts";
// Chart.register(...registerables);

const series = [
  {
    name: "Desktops",
    data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
  },
];

const options = {
  chart: {
    height: 350,
    type: "line",
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "straight",
  },
  title: {
    text: "Product Trends by Month",
    align: "left",
  },
  grid: {
    row: {
      colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
      opacity: 0.5,
    },
  },
  xaxis: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
  },
};

const Dashboard = () => {
  let { allSurveys, basicStats, financialOverview, dailyData, graphData } =
    useContext(DashboardContext);

  const [showGraphFor, setShowGraphFor] = useState("completes");
  const [xAxisData, setXaxisData] = useState([]);
  const [yAxisData, setYaxisData] = useState([]);
  function CountProject() {
    let project = new Set();
    allSurveys?.map((survey) => project.add(survey?.project_id));
    return project.size;
  }
  const big_bar_status = [
    {
      name: "Surveys Created",
      value: "surveys_created",
      count: allSurveys?.length,
    },
    {
      name: "projects created",
      value: "projects_created",
      count: CountProject(),
    },
    {
      name: "your live projects",
      value: "live_projects",
      count: 34,
    },
    {
      name: "closed projects",
      value: "closedproj",
      count: 112,
    },
  ];

  return (
    <>
      <Header />
      <div className={styles.dashboard}>
        <div className={styles.dashboard_left_container}>
          <h1>Dashboard</h1>
          <div className={styles.all_status_container}>
            <div className={styles.big_bar_container}>
              {big_bar_status?.map(({ name, value, count }) => {
                return (
                  <div className={styles.b_bar} key={uuid()}>
                    <p className={styles.b_title}>{name}</p>
                    <p className={styles.b_count}>
                      {/* {statusesCnt?.[value] ? statusesCnt?.[value] : "-"} */}{" "}
                      {basicStats?.[value] ? basicStats?.[value] : "-"}
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
            {/* <div className={styles.small_bar_container}>
              {small_bar_status.map((value) => {
                return (
                  <div className={styles.s_bar}>
                    <p>
                      {" "}
                      <span style={{ fontWeight: 600 }}>
                        {value.percentage}
                      </span>{" "}
                      <span>{value.name}</span>{" "}
                    </p>
                  </div>
                );
              })}
            </div> */}
          </div>
          {/* Financial Overview  */}
          <div className={styles.financial_overview_container}>
            <div className={styles.financial_overview_header}>
              <div className={styles.left_container}>
                <h1 className={styles.title}>Financial Overview</h1>
              </div>
              <div className={styles.right_container}>
                <div>
                  <DateRangePicker
                    appearance="default"
                    placeholder="Default"
                    style={{ width: 230 }}
                    ranges={[
                      {
                        label: "Yesterday",
                        value: [
                          addDays(new Date(), -1),
                          addDays(new Date(), -1),
                        ],
                      },
                      {
                        label: "Today",
                        value: [new Date(), new Date()],
                      },
                      {
                        label: "Last 7 days",
                        value: [subDays(new Date(), 6), new Date()],
                      },
                      {
                        label: "Last 1 Month",
                        value: [subDays(new Date(), 30), new Date()],
                      },
                      {
                        label: "Last 6 Month",
                        value: [subDays(new Date(), 180), new Date()],
                      },
                    ]}
                  />
                  {/* <button className={styles.predicted_btn}>01/03/2022</button> */}
                </div>
                {/* <div>
                  <button className={styles.predicted_btn}>01/04/2022</button>
                </div> */}
                {/* <div>
                  <button className={styles.actual_btn}>Actual</button>
                </div> */}
              </div>
            </div>
            <div className={styles.financial_data_container_bigcard}>
              <div className={styles.big_card}>
                <h1 className={styles.title}>Total Rev</h1>
                <h3 className={styles.count}>
                  ${(financialOverview?.total_rev).toFixed(2)}
                </h3>
              </div>
              <div className={styles.big_card}>
                <h1 className={styles.title}>Supply Cost</h1>
                <h3 className={styles.count}>
                  ${(financialOverview?.supply_cost).toFixed(2)}
                </h3>
              </div>
              <div className={styles.big_card}>
                <h1 className={styles.title}>Profit Cost</h1>
                <h3 className={styles.count}>
                  ${(financialOverview?.profit).toFixed(2)}
                </h3>
              </div>
            </div>
            <div className={styles.financial_data_container_smallcard}>
              <div className={styles.small_card}>
                <p className={styles.title}>Avg Supply CPI</p>
                <p className={styles.count}>
                  $
                  {(
                    financialOverview?.avg_supply_cpi / allSurveys?.length
                  ).toFixed(2)}
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
                  ${financialOverview?.epc_vendor.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          {/* graph */}
          <div className={styles.graph1}>
            <div className={styles.graph1_stats}>
              <div
                className={cx(styles.users_stat, styles.active_stat)}
                onClick={() => showGraphFor("completes")}
              >
                <label className={styles.stat_label}>Daily Completes</label>
                <span className={styles.stat_number}>
                  {dailyData?.completes}{" "}
                  <span className={styles.percent}>
                    +
                    {!dailyData?.yesterdayCompleted
                      ? dailyData?.completes * 100
                      : ((dailyData?.completes -
                          dailyData?.yesterdayCompleted) /
                          dailyData?.yesterdayCompleted) *
                        100}
                    %
                  </span>
                </span>
              </div>

              <div
                className={cx(styles.engaged_sessions_stat)}
                onClick={() => setShowGraphFor("sessions")}
              >
                <label className={styles.stat_label}>Daily Sessions</label>
                <span className={styles.stat_number}>
                  {dailyData?.hits}{" "}
                  <span className={styles.percent}>
                    {!dailyData?.yesterdayHits
                      ? dailyData?.hits * 100
                      : 0 +
                        ((dailyData?.hits - dailyData?.yesterdayHits) /
                          dailyData?.yesterdayHits) *
                          100}
                    %
                  </span>
                </span>
              </div>
            </div>
            {showGraphFor ? (
              <DailyDataGraph series={series} options={options} />
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className={styles.dashboard_right_container}>
          <div className={styles.completes}>
            <p className={styles.completes_text}>
              Completes in last <strong>30 minutes</strong>
            </p>
            <p className={styles.completes_num}>144</p>
          </div>
          <ProjectServiceCard />
          {/* survey client stats */}
          <div className={styles.client_survey_percent}>
            <div className={styles.surveyCreaetedToday_container}>
              <p>Survey Created Today </p>
              <div className={styles.survey_numbers}>
                <h1>
                  <span>
                    {!dailyData?.surveyCreatedYesterDayCnt
                      ? dailyData?.surveyCreatedTodayCnt * 100
                      : ((dailyData?.surveyCreatedTodayCnt -
                          dailyData?.surveyCreatedYesterDayCnt) /
                          dailyData?.surveyCreatedYesterDayCnt) *
                        100}
                    %
                  </span>
                  {dailyData?.surveyCreatedTodayCnt}
                </h1>
              </div>
            </div>
            <div className={styles.surveyCreaetedToday_container}>
              <p>Client Onboarded </p>
              <div className={styles.survey_numbers}>
                <h1>
                  <span>1.34%</span>122
                </h1>
              </div>
            </div>
          </div>

          <div className={styles.dash_analytics}>
            {/* <AnalyticsUserCountCard
              cardTitle="Completed by Suppliers"
              cardSubtitle={["Suppliers", "Completes"]}
              data={completedBySuppliers}
            /> */}
          </div>
        </div>
      </div>
    </>
  );
};

const DailyDataGraph = ({ series, options }) => {
  return (
    <>
      <div id="chart">
        <ReactApexChart
          options={options}
          series={series}
          type="line"
          height={350}
        />
      </div>
    </>
  );
};

export default Dashboard;
