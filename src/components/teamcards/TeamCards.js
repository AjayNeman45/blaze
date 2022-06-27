import React from "react";
import styles from "./teamcards.module.css";
import { v4 as uuid } from "uuid";
const TeamCards = ({ title, teams, allPeoples }) => {
  return (
    <>
      <div className={styles.Teamcard}>
        <h1>{title}</h1>
        {teams === undefined ? (
          <span>No peoples to show</span>
        ) : (
          <div>
            {teams?.project_managers && <h2>Lead Project Managers</h2>}
            <div className={styles.names}>
              {teams?.project_managers &&
                teams?.project_managers?.map((choosePm) => {
                  return allPeoples.project_managers.map((pm) => {
                    if (pm?.value === choosePm) {
                      return (
                        <div className={styles.name} key={uuid()}>
                          <p>{pm.label}</p>
                        </div>
                      );
                    }
                  });
                })}
            </div>

            {teams?.account_managers && <h2>Account Managers</h2>}
            <div className={styles.names}>
              {teams?.account_managers &&
                teams?.account_managers?.map((chooseAm) => {
                  return allPeoples.account_managers.map((am) => {
                    if (am?.value === chooseAm) {
                      return (
                        <div className={styles.name} key={uuid()}>
                          <p>{am.label}</p>
                        </div>
                      );
                    }
                  });
                })}
            </div>

            {teams?.sales_managers && <h2>Sales Managers</h2>}

            <div className={styles.names}>
              {teams?.sales_managers &&
                teams?.sales_managers?.map((chooseSm) => {
                  return allPeoples.sales_managers.map((sm) => {
                    if (sm?.value === chooseSm) {
                      return (
                        <div className={styles.name} key={uuid()}>
                          <p>{sm.label}</p>
                        </div>
                      );
                    }
                  });
                })}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TeamCards;
