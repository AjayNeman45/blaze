import React, { useEffect, useState } from "react";
import styles from "./audienceResponse_BarChart.module.css";

// Chart js

// import BarChart from "./components/BarChart";
import ApexCharts from "apexcharts";
import Chart from "react-apexcharts";
import { useAanalyticsContext } from "../AnalyticsContext";

const graphColors = ["#FFCFA3", "#6DFFCB", "#FFBEBE"];

function AudienceResponse_BarChart() {
  const { survey, allSessions } = useAanalyticsContext();
  const [suppliers, setSuppliers] = useState([]);
  const [yAxisData, setYaxisData] = useState([]);
  const [graphStatus, setGraphStatus] = useState("10");
  const xAxisAgeRange = ["18-24", "25-34", "35-44", "44-54"];
  useEffect(() => {
    let suppliersTmp = [];
    survey?.external_suppliers?.map((supp) => {
      suppliersTmp.push({
        name: supp?.supplier_account,
        id: supp?.supplier_account_id,
      });
    });
    survey?.internal_suppliers?.map((supp) => {
      suppliersTmp.push({
        name: supp?.supplier_account,
        id: supp?.supplier_account_id,
      });
    });
    setSuppliers(suppliersTmp);
  }, [survey]);
  // console.log(suppliers);

  useEffect(() => {
    setYaxisData([]);
    suppliers?.map((supp, index) => {
      let tmp = [0, 0, 0, 0];
      allSessions?.forEach((session) => {
        let sd = session.data();
        if (
          sd?.client_status === parseInt(graphStatus) &&
          sd?.supplier_account_id === supp?.id &&
          sd?.responses
        ) {
          let userResponse;
          sd?.responses?.forEach((resp) => {
            if (resp?.question_id === "42") {
              userResponse = parseInt(resp?.user_response);
            }
          });
          xAxisAgeRange?.forEach((range, index) => {
            if (
              parseInt(range.split("-")[0]) <= userResponse &&
              userResponse <= parseInt(range.split("-")[1])
            ) {
              tmp[index]++;
            }
          });
          setYaxisData((prevData) => {
            if (!prevData.find((data) => data["name"] === supp?.name))
              return [
                ...prevData,
                { name: supp.name, data: tmp, color: graphColors[index] },
              ];
            else return [...prevData];
            // return prevData;
          });
        }
      });
    });
  }, [suppliers, allSessions, graphStatus]);

  return (
    <div className={styles.AudiResBarChart_container}>
      <div className={styles.AudiResBarChart_heading}>
        <h4>Age vs Suplliers vs</h4>
        <select onChange={(e) => setGraphStatus(e.target.value)}>
          <option value="10">Completes</option>
          <option value="20">Terminates</option>
          <option value="30">Quality Terminates</option>
          <option value="40">Quota Full</option>
        </select>
      </div>
      <Chart
        type="bar"
        width={749}
        height={456}
        series={yAxisData}
        options={{
          chart: {
            stacked: true,
            toolbar: false,
          },
          xaxis: {
            categories: xAxisAgeRange,
          },
        }}
      ></Chart>
    </div>
  );
}

export default AudienceResponse_BarChart;
