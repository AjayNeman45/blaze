import { MenuItem, Select } from "@mui/material";
import React, { useState } from "react";
import Header from "../../components/header/Header";
import Subheader from "../../components/subheader/Subheader";
import styles from "./Quotas.module.css";
import { FaInfoCircle } from "react-icons/fa";
import { IoMdLock } from "react-icons/io";
import ProjectInfo from "../../components/project-info/ProjectInfo";
import { useQuotasContext } from "./QuotasContext";
import SurveyInfo from "../../components/survey-info/SurveyInfo";

const tableHeadData = {
  field_target: 200,
  quota: 200,
  prescreens: 450,
  completes: 1,
  total_remaining: 199,
  conversion: 1,
};

const tableData = [
  {
    order: 1,
    quota_name: "18 to 24 years old",
    field_target: 30,
    quota: 30,
    prescreens: 163,
    completes: 0,
    total_remaining: 30,
    conversion: 0,
  },
  {
    order: 2,
    quota_name: "25 to 34 years old",
    field_target: 44,
    quota: 44,
    prescreens: 138,
    completes: 1,
    total_remaining: 30,
    conversion: 0,
  },
  {
    order: 3,
    quota_name: "35 to 44 years old",
    field_target: 30,
    quota: 30,
    prescreens: 163,
    completes: 0,
    total_remaining: 30,
    conversion: 0,
  },
];

const Quotas = () => {
  const [status, setStatus] = useState("");
  const { survey } = useQuotasContext();
  console.log(survey?.status);
  return (
    <>
      <Header />
      <Subheader />
      <div>
        <SurveyInfo />
        <div className={styles.quota_info}>
          <div className={styles.quota_info_left}>
            <div className={styles.quota_info_section}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <label>calculation type</label> &nbsp;
                <FaInfoCircle color="gray" />
              </div>
              <div>
                <span>Completes</span> &nbsp;
                <span style={{ color: "blue" }}>edit</span>
              </div>
            </div>
            <div className={styles.quota_info_section}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <label>auto increment</label> &nbsp;
                <FaInfoCircle color="gray" />
              </div>

              <div>
                <span>Off</span>&nbsp;
                <span style={{ color: "blue" }}>edit</span>
              </div>
            </div>
            <div className={styles.quota_info_section}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <label>field end date</label>&nbsp;
                <FaInfoCircle color="gray" />
              </div>
              <span>-</span>
            </div>
            <div className={styles.quota_info_section}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <label>total entrants</label>&nbsp;
                <FaInfoCircle color="gray" />
              </div>
              <span>469</span>
            </div>
          </div>
          <div className={styles.quota_info_right}>
            <button className={styles.add_quota_btn}>Add Quota</button>
            <button className={styles.import_btn}>Import</button>
          </div>
        </div>
        <div className={styles.quota_table}>
          <table>
            <thead>
              <tr>
                <th>Order</th>
                <th>Quota Name</th>
                <th>Field Target</th>
                <th>Quota</th>
                <th>Prescreens</th>
                <th>Completes</th>
                <th>Total Remaining</th>
                <th>Conversion</th>
                <th>Lock</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={2}>Total</td>
                <td>
                  <input
                    className={styles.table_input}
                    type="number"
                    value={tableHeadData.field_target}
                  />
                </td>
                <td>
                  <input
                    className={styles.table_input}
                    type="number"
                    value={tableHeadData.quota}
                  />
                </td>
                <td>{tableHeadData.prescreens}</td>
                <td>{tableHeadData.completes}</td>
                <td>{tableHeadData.total_remaining}</td>
                <td>{tableHeadData.conversion} %</td>
                <td>
                  <IoMdLock size={20} />
                </td>
              </tr>
              {tableData.map((data, index) => (
                <tr>
                  <td>
                    <input type="checkbox" className={styles.checkbo_} />
                    <input
                      className={styles.table_input}
                      type="text"
                      value={data.order}
                    />
                  </td>
                  <td>{data.quota_name}</td>
                  <td>
                    <input
                      className={styles.table_input}
                      type="number"
                      value={data.field_target}
                    />
                  </td>
                  <td>
                    <input
                      className={styles.table_input}
                      type="number"
                      value={data.quota}
                    />
                  </td>
                  <td>{data.prescreens}</td>
                  <td>{data.completes}</td>
                  <td>{data.total_remaining}</td>
                  <td>{data.conversion}</td>
                  <td>
                    <IoMdLock size={20} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Quotas;
