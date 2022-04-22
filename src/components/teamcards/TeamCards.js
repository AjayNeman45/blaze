import React from "react";
import styles from "./teamcards.module.css";
import { v4 as uuid } from "uuid";
const TeamCards = ({ title, co_ordinators }) => {
  console.log(co_ordinators);
  return (
    <>
      <div className={styles.Teamcard}>
        <h1>{title}</h1>
        <div>
          {co_ordinators?.lead_project_managers && (
            <h2>Lead Project Managers</h2>
          )}
          <div className={styles.names}>
            {co_ordinators?.lead_project_managers &&
              co_ordinators?.lead_project_managers?.map((pm, index) => (
                <div className={styles.name} key={uuid()}>
                  <h3>{pm}</h3>
                </div>
              ))}
          </div>

          {co_ordinators?.account_manager && <h2>Accoount Managers</h2>}
          <div className={styles.names}>
            {co_ordinators?.account_manager && (
              <div className={styles.name} key={uuid()}>
                <h3>{co_ordinators?.account_manager}</h3>
              </div>
            )}
          </div>

          {co_ordinators?.sales_manager && <h2>Sales Managers</h2>}

          <div className={styles.names}>
            {co_ordinators?.sales_manager && (
              <div className={styles.name} key={uuid()}>
                <h3>{co_ordinators?.sales_manager}</h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TeamCards;
