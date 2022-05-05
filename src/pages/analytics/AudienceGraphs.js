import cx from "classnames";
import { Line } from "react-chartjs-2";
// import { Chart, registerables } from "chart.js";
import styles from "./Analytics.module.css";
import { useEffect, useState } from "react";
import { useAanalyticsContext } from "./AnalyticsContext";
import ReactApexChart from "react-apexcharts";
import { addDays, subDays } from "date-fns";

// Chart.register(...registerables);

export const AudienceGraph1 = ({ statusesCnt }) => {
  const [labels, setLabels] = useState([]);
  const [graphTab, setGraphTab] = useState("hits");
  const [yAxixData, setYAxisData] = useState([]);

  const { graphData } = useAanalyticsContext();

  useEffect(() => {
    setLabels([]);
    setYAxisData([]);
    Object.keys(graphData).map((key) => {
      setLabels((prevData) => [...prevData, key]);
      setYAxisData((prevData) => [
        ...prevData,
        graphData?.[key]?.[graphTab] ? graphData?.[key]?.[graphTab] : 0,
      ]);
    });
  }, [graphData, graphTab]);

  const data = {
    labels: labels,
    datasets: [
      {
        label: graphTab,
        data: yAxixData,
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
        beginAtZero: true,
      },
    },
    xaxis: {
      range: 2,
    },
  };

  return (
    <div className={styles.graph1}>
      <div className={styles.graph1_stats}>
        <div
          className={graphTab === "hits" ? cx(styles.active_stat) : styles.stat}
          onClick={() => setGraphTab("hits")}
        >
          <label className={styles.stat_label}>Users</label>
          <span className={styles.stat_number}>{statusesCnt?.hits}</span>
        </div>
        <div
          className={
            graphTab === "inClient" ? cx(styles.active_stat) : styles.stat
          }
          onClick={() => setGraphTab("inClient")}
        >
          <label className={styles.stat_label}>Engaged Sessions</label>
          <span className={styles.stat_number}>{statusesCnt?.inClient}</span>
        </div>
        <div
          className={
            graphTab === "completed" ? cx(styles.active_stat) : styles.stat
          }
          onClick={() => setGraphTab("completed")}
        >
          <label className={styles.stat_label}>Completed</label>
          <span className={styles.stat_number}>{statusesCnt?.completed}</span>
        </div>
      </div>
      <div className={styles.graph}>
        {/* <Line data={data} options={options} /> */}
        <ReactApexChart
          series={[{ name: graphTab, data: yAxixData }]}
          options={{
            chart: {
              height: 150,
              type: "line",
              zoom: {
                enabled: true,
              },
            },
            dataLabels: {
              enabled: false,
            },
            xaxis: {
              type: "datetime",
              categories: labels,
              // labels: {
              //   formatter: (value) => {
              //     switch (value) {
              //       case "1":
              //         return "January";
              //       case "2":
              //         return "February";
              //       case "3":
              //         return "March";
              //       case "4":
              //         return "April";
              //       case "5":
              //         return "May";
              //       case "6":
              //         return "June";
              //       case "7":
              //         return "July";
              //       case "8":
              //         return "August";
              //       case "9":
              //         return "September";
              //       case "10":
              //         return "October";
              //       case "11":
              //         return "November";
              //       case "12":
              //         return "December";
              //       default:
              //         return "No";
              //     }
              //   },
              // },
            },
          }}
          type="line"
          height={400}
        />
      </div>
    </div>
  );
};

export const AudiencesGraph2 = ({ statusesCnt }) => {
  const [labels, setLabels] = useState([]);
  const [graphTab, setGraphTab] = useState("terminated");
  const [yAxixData, setYAxisData] = useState([]);

  const { graphData } = useAanalyticsContext();

  useEffect(() => {
    setLabels([]);
    setYAxisData([]);
    Object.keys(graphData).map((key) => {
      setLabels((prevData) => [...prevData, key]);
      setYAxisData((prevData) => [
        ...prevData,
        graphData?.[key]?.[graphTab] ? graphData?.[key]?.[graphTab] : 0,
      ]);
    });
  }, [graphData, graphTab]);

  return (
    <div className={styles.graph2}>
      <div className={styles.graph1_stats}>
        <div
          className={
            graphTab === "terminated" ? cx(styles.active_stat) : styles.stat
          }
          onClick={() => setGraphTab("terminated")}
        >
          <label className={styles.stat_label}>Users Terminates</label>
          <span className={styles.stat_number}>{statusesCnt?.terminated}</span>
        </div>
        <div
          className={
            graphTab === "quotaFull" ? cx(styles.active_stat) : styles.stat
          }
          onClick={() => setGraphTab("quotaFull")}
        >
          <label className={styles.stat_label}>Quota Full</label>
          <span className={styles.stat_number}>{statusesCnt?.quotaFull}</span>
        </div>
        <div
          className={
            graphTab === "qualityTerminated"
              ? cx(styles.active_stat)
              : styles.stat
          }
          onClick={() => setGraphTab("qualityTerminated")}
        >
          <label className={styles.stat_label}>Quality Terminates</label>
          <span className={styles.stat_number}>
            {statusesCnt?.qualityTerminated}
          </span>
        </div>
      </div>
      <div className={styles.graph}>
        {/* <Line data={data} options={options} /> */}
        <ReactApexChart
          series={[{ name: graphTab, data: yAxixData }]}
          options={{
            chart: {
              height: 150,
              type: "line",
              zoom: {
                enabled: true,
              },
            },
            dataLabels: {
              enabled: false,
            },

            xaxis: {
              categories: labels,
            },
          }}
          type="line"
          height={400}
        />
      </div>
    </div>
  );
};
