import React from "react";
import { useSurveyDashboardContext } from "../../SurveyDashboardContext";
import styles from "./NerdySpecs.module.css";
import countryList from "react-select-country-list"

const NerdySpecs = () => {
  const { survey } = useSurveyDashboardContext()
  return (
    <>
      <div className={styles.nerdySpecsCard}>
        <h1>Nerdy Specs</h1>
        <div className={styles.SpecsDataContainer}>
          <table className={styles.data_table}>
            <tr>
              <td className={styles.nerdyLeft}>Creation Date</td>
              <td className={styles.nerdyRight}>{survey?.creation_date?.toDate()?.toDateString()}</td>
            </tr>
            <tr>
              <td className={styles.nerdyLeft}>Launch Month</td>
              <td className={styles.nerdyRight}>{survey?.creation_date?.toDate()?.toLocaleString('en-us', { month: "long" })}</td>
            </tr>
            <tr>
              <td className={styles.nerdyLeft}>Year of Project</td>
              <td className={styles.nerdyRight}>{survey?.creation_date?.toDate()?.toLocaleString('en-us')}</td>
            </tr>
            <tr>
              <td className={styles.nerdyLeft}>Device Compability</td>
              <td className={styles.nerdyRight}>
                {
                  survey?.device_suitability?.desktop && "Desktop"
                }, {
                  survey?.device_suitability?.tablet && "Tablet"
                }, {
                  survey?.device_suitability?.mobile && "Mobile"

                }</td>
            </tr>
            <tr>
              <td className={styles.nerdyLeft}>Project Number</td>
              <td className={styles.nerdyRight}>{survey?.project_id}</td>
            </tr>
            <tr>
              <td className={styles.nerdyLeft}>Survey Number</td>
              <td className={styles.nerdyRight}>{survey?.survey_id}</td>
            </tr>
            <tr>
              <td className={styles.nerdyLeft}>Survey Group</td>
              <td className={styles.nerdyRight}>{survey?.survey_group ? survey?.survey_group : "-"}</td>
            </tr>
            <tr>
              <td className={styles.nerdyLeft}>Survey Country</td>
              <td className={styles.nerdyRight}>{countryList().getLabel("IN")}</td>
            </tr>
            <tr>
              <td className={styles.nerdyLeft}>Total Supplier</td>
              <td className={styles.nerdyRight}>{survey?.external_suppliers?.length} suppliers</td>
            </tr>
            <tr>
              <td className={styles.nerdyLeft}>Status</td>
              <td className={styles.nerdyRight}>{survey?.status}</td>
            </tr>
            <tr>
              <td className={styles.nerdyLeft}>Internal Status</td>
              <td className={styles.nerdyRight}>{survey?.internal_status}</td>
            </tr>
            <tr>
              <td className={styles.nerdyLeft}>PII</td>
              <td className={styles.nerdyRight}>false</td>
            </tr>
            <tr>
              <td className={styles.nerdyLeft}>Language</td>
              <td className={styles.nerdyRight}>{survey?.country?.language}</td>
            </tr>
            <tr>
              <td className={styles.nerdyLeft}>External Survey</td>
              <td className={styles.nerdyRight}>{survey?.external_project_name}</td>
            </tr>
          </table>

          {/* 
          <div className={styles.nerdyRight}>
            <h4>Sat, Mar 12, 2022</h4>
            <h4>March</h4>
            <h4>2022</h4>
            <h4>Desktop, Laptop, Tablet</h4>
            <h4>111XXXXXX</h4>
            <h4>111XXXXXX</h4>
            <h4>111XXXXXX</h4>
            <h4>111XXXXXX</h4>
            <h4>India</h4>
            <h4>14 suppliers</h4>
            <h4>Live</h4>
            <h4>Full Launch</h4>
            <h4>false</h4>
            <h4>ENG</h4>
            <h4>Genpop Survey</h4>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default NerdySpecs;
