import cx from "classnames";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import styles from "./Analytics.module.css";
Chart.register(...registerables);

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

export const AudienceGraph1 = () => {
  return (
    <div className={styles.graph1}>
      <div className={styles.graph1_stats}>
        <div className={cx(styles.users_stat, styles.active_stat)}>
          <label className={styles.stat_label}>Users</label>
          <span className={styles.stat_number}>85K</span>
        </div>
        <div className={cx(styles.engaged_sessions_stat)}>
          <label className={styles.stat_label}>Engaged Sessions</label>
          <span className={styles.stat_number}>80K</span>
        </div>
        <div className={cx(styles.conversions_stat)}>
          <label className={styles.stat_label}>conversions</label>
          <span className={styles.stat_number}>5K</span>
        </div>
      </div>
      <div className={styles.graph}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export const AudiencesGraph2 = () => {
  return (
    <div className={styles.graph2}>
      <div className={styles.graph1_stats}>
        <div className={cx(styles.users_stat, styles.active_stat)}>
          <label className={styles.stat_label}>Users</label>
          <span className={styles.stat_number}>85K</span>
        </div>
        <div className={cx(styles.engaged_sessions_stat)}>
          <label className={styles.stat_label}>Engaged Sessions</label>
          <span className={styles.stat_number}>80K</span>
        </div>
        <div className={cx(styles.conversions_stat)}>
          <label className={styles.stat_label}>conversions</label>
          <span className={styles.stat_number}>5K</span>
        </div>
      </div>
      <div className={styles.graph}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};
