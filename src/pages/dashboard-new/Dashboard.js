import Header from "../../components/header/Header";
import styles from "./Dashboard.module.css";
import { Chart } from "chart.js";
import { Line } from "react-chartjs-2";
import ProjectServiceCard from "./components/projectDashboardCard/ProjectServiceCard";
import AnalyticsUserCountCard from "../../components/analyticsUserCountCard/AnalyticsUserCountCard";
import cx from "classnames";
import { DashboardContext } from "./DashboardContext";
import { useContext } from "react";
import { DateRangePicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import { addDays, subDays } from "date-fns";
import { v4 as uuid } from "uuid";
// Chart.register(...registerables);

const data = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],

  datasets: [
    {
      label: "First dataset",
      data: [50, 66, 76, 43, 54, 75, 57, 64, 65],
      fill: false,
      borderColor: "#1765DC",
    },
  ],
};

const options = {
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        display: false,
      },
    },
  },
};

const completedBySuppliers = [
  {
    name: "Cint AB",
    count: "222",
    progress: "75",
  },
  {
    name: "PureSpectrum",
    count: "111",
    progress: "50",
  },
  {
    name: "Prodege",
    count: "100",
    progress: "40",
  },
];

const state = {
  labels: ["January", "February", "March", "April", "May"],
  datasets: [
    {
      label: "Rainfall",
      fill: false,
      lineTension: 0.5,
      backgroundColor: "rgba(75,192,192,1)",
      borderColor: "rgba(0,0,0,1)",
      borderWidth: 2,
      data: [65, 59, 80, 81, 56],
    },
  ],
};

const Dashboard = () => {
  let { allSurveys, FetchTodaySurveyCreated, basicStats } =
    useContext(DashboardContext);
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
  const chartData = {
    displayTitle: true,
    displayLegend: true,
    legendPosition: "right",
    location: "City",
  };
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
                <h3 className={styles.count}>$22</h3>
              </div>
              <div className={styles.big_card}>
                <h1 className={styles.title}>Supply Cost</h1>
                <h3 className={styles.count}>$16</h3>
              </div>
              <div className={styles.big_card}>
                <h1 className={styles.title}>Profit Cost</h1>
                <h3 className={styles.count}>$6</h3>
              </div>
            </div>
            <div className={styles.financial_data_container_smallcard}>
              <div className={styles.small_card}>
                <p className={styles.title}>Avg Supply CPI</p>
                <p className={styles.count}>$4.00</p>
              </div>
              <div className={styles.small_card}>
                <p className={styles.title}>Avg Client CPI</p>
                <p className={styles.count}>$5.00</p>
              </div>
              <div className={styles.small_card}>
                <p className={styles.title}>EPC Vendor</p>
                <p className={styles.count}>$0.23</p>
              </div>
            </div>
          </div>
          {/* graph */}
          <div className={styles.graph1}>
            <div className={styles.graph1_stats}>
              <div className={cx(styles.users_stat, styles.active_stat)}>
                <label className={styles.stat_label}>Daily Completes</label>
                <span className={styles.stat_number}>
                  85K <span className={styles.percent}>+1.6%</span>
                </span>
              </div>
              <div className={cx(styles.engaged_sessions_stat)}>
                <label className={styles.stat_label}>Engaged Sessions</label>
                <span className={styles.stat_number}>
                  99K <span className={styles.percent}>+1.6%</span>
                </span>
              </div>
              {/* <div className={cx(styles.conversions_stat)}>
                <label className={styles.stat_label}>conversions</label>
                <span className={styles.stat_number}>5K</span>
              </div> */}
            </div>
            <div className={styles.graph}>
              {/* <Line data={data} options={options} /> */}
            </div>
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
                  <span>1.34%</span>
                  {FetchTodaySurveyCreated()}
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

export default Dashboard;
