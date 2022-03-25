import React from "react";
import styles from "./realtimeoverviewdoughnutchart.module.css";
import ReactApexChart from "react-apexcharts";



const chartData = {
    series: [92.3, 7.7],
  
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
          }
        }
      }
    }
  };
  




const RealtimeOverviewDoughnutChart = () => {
//   const data = [
//     { argument: "Monday", value: 92.7 , chartColor:"black"},
//     { argument: "Tuesday", value: 7.7 , chartColor:"#E1E1E1"},
    
//   ];
  return (
    <>
      <div className={styles.card_container}>
        <h2>USERS IN LAST 30 MINUTES</h2>
        <h1>98</h1>

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


        <div className="App">
      <ReactApexChart className={styles.chart}
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
            <h2>92.3%</h2>
          </div>

          <div className={styles.gray_circle}>
            <h4>
              
              <span className={styles.grat_dot}>.</span> MOBILE
            </h4>
            <h2>7.7%</h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default RealtimeOverviewDoughnutChart;
