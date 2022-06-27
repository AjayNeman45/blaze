import React, { useEffect } from "react";
import styles from "./realtimeoverviewdoughnutchart.module.css";
import ReactApexChart from "react-apexcharts";
import { useState } from "react";

const RealtimeOverviewDoughnutChart = ({
  data,
  inClientAcLast30Minutes,
  lastPresentTime,
}) => {
  const [deviceTypeUser, setDeviceTypeUsers] = useState([0, 0]);

  useEffect(() => {
    if (inClientAcLast30Minutes) {
      setDeviceTypeUsers([
        (data?.desktop * 100) / inClientAcLast30Minutes,
        (data?.mobile * 100) / inClientAcLast30Minutes,
      ]);
    }
  }, [data, inClientAcLast30Minutes]);
  const chartData = {
    series: deviceTypeUser,

    options: {
      chart: { type: "donut" },
      legend: { show: false },
      dataLabels: { enabled: false },
      tooltip: { enabled: false },
      fill: { colors: ["#323232", "#E1E1E1"] },
      //   states: {
      //     hover: { filter: { type: "lighten", value: 0.5 } },
      //     active: { filter: { type: "none", value: 0 } }
      //   },
      //   stroke: { width: 0 },
      plotOptions: {
        pie: {
          //   expandOnClick: false,
          donut: {
            size: "75%",
            // labels: {
            //   show: true,
            //   name: { show: false },
            //   total: {
            //     show: true,
            //     showAlways: true,
            //     formatter: function (w) {
            //       const totals = w.globals.seriesTotals;

            //       const result = totals.reduce((a, b) => a + b, 0);

            //       return (result / 1000).toFixed(3);
            //     }
            //   }
            // }
          },
        },
      },
    },
  };

  return (
    <>
      <div className={styles.card_container}>
        <h2>users by device types</h2>
        <h3>
          users in last{"   "}
          {lastPresentTime === "30"
            ? `${lastPresentTime} minutes`
            : ` ${parseInt(lastPresentTime) / 60}  hrs`}
        </h3>
        <h1>{data?.desktop + data?.mobile}</h1>

        {/* <div>
            <Chart data={data} className={styles.chart}>
              <PieSeries
                valueField="value"
                argumentField="argument"
                innerRadius={0.72}
                chartColor
              />
            </Chart>
        </div> */}

        <div>
          <ReactApexChart
            className={styles.chart}
            options={chartData.options}
            series={chartData.series}
            type="donut"
          />
        </div>

        <div className={styles.percent_container}>
          <div className={styles.black_circle}>
            <h4>
              <span className={styles.black_dot}>.</span> DESKTOP
            </h4>
            <h2>{deviceTypeUser[0]}%</h2>
          </div>

          <div className={styles.gray_circle}>
            <h4>
              <span className={styles.grat_dot}>.</span> MOBILE
            </h4>
            <h2>{deviceTypeUser[1]}%</h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default RealtimeOverviewDoughnutChart;
