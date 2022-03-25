import React from "react";
import styles from "./sessionsSchedule.module.css";

function SessionsSchedule() {
  return (
    <div className={styles.sessionsSchedule_container}>
      <div className={styles.sessionsSchedule_div}>
        <h3>First Session</h3>
        <p>01:06 AM 17 Mar</p>
      </div>
      <div className={styles.sessionsSchedule_div}>
        <h3>Last Session</h3>
        <p>01:06 AM 17 Mar</p>
      </div>
      <div className={styles.sessionsSchedule_div}>
        <h3>First Complete</h3>
        <p> 01:06 AM 17 Mar</p>
      </div>

      <div className={styles.sessionsSchedule_div}>
        <h3>Last Complete</h3>
        <p>01:06 AM 17 Mar</p>
      </div>
    </div>
  );
}

export default SessionsSchedule;
