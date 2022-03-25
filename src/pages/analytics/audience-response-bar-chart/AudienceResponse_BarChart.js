import React, { useState } from "react";
import styles from "./audienceResponse_BarChart.module.css";

// Chart js

// import BarChart from "./components/BarChart";
import ApexCharts from "apexcharts";
import Chart from "react-apexcharts";

function AudienceResponse_BarChart() {
  return (
    <div className={styles.AudiResBarChart_container}>
      <div className={styles.AudiResBarChart_heading}>
        <h4>Age vs Suplliers vs</h4>
        <select>
          <option>Completes</option>
        </select>
      </div>
      <Chart
        type="bar"
        width={749}
        height={456}
        series={[
          {
            name: "Lucid AB",
            data: [400, 200, 300, 100],
            color: "#FFCFA3",
          },
          {
            name: "PureSpectrum",
            data: [200, 100, 200, 50],
            color: "#6DFFCB",
          },
          {
            name: "Prodege",
            data: [400, 100, 0, 50],
            color: "#FFBEBE",
          },
        ]}
        options={{
          chart: {
            stacked: true,
            toolbar: false,
          },
        }}
      ></Chart>
    </div>
  );
}

export default AudienceResponse_BarChart;
