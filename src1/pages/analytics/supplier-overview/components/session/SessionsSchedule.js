import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useAanalyticsContext } from "../../../AnalyticsContext";
import { useSupplierOverviewContext } from "../../SupplierOverviewContext";
import styles from "./sessionsSchedule.module.css";

function SessionsSchedule() {
  const { allSessions } = useAanalyticsContext();
  const { supplierID } = useParams();
  const [sessionDate, setSessionDates] = useState({});

  useEffect(() => {
    let firstSessionDate,
      lastSessionDate,
      firstCompleteSessionDate,
      lastCompleteSessionDate,
      sessionsBySupplier = [];

    // ---->>> first off all get all the sessions of particular suppliers and store it in tmp variable
    allSessions?.forEach((session) => {
      const sd = session.data();
      if (sd?.supplier_account_id === parseInt(supplierID)) {
        sessionsBySupplier.push(sd);
      }
    });

    // ---->>> sort the stored sessions by date
    sessionsBySupplier?.sort((a, b) => {
      return a?.date.toDate() - b?.date.toDate();
    });

    // ---->>>> set the first and last session date from stored sessions arrays (0, and last index)
    firstSessionDate = sessionsBySupplier[0]?.date.toDate();
    lastSessionDate =
      sessionsBySupplier[sessionsBySupplier.length - 1]?.date.toDate();

    // ----->>> logic for getting the first and last completed session date
    let f = false;
    sessionsBySupplier?.map((session) => {
      if (!f && session?.client_status === 10) {
        firstCompleteSessionDate = session?.date.toDate();
        lastCompleteSessionDate = session?.date.toDate();
        f = true;
      } else if (f && session?.date.toDate() === 10) {
        lastCompleteSessionDate = session?.date.toDate();
      }
    });

    // ----> setting state with all the date.
    setSessionDates({
      firstSessionDate,
      lastSessionDate,
      firstCompleteSessionDate,
      lastCompleteSessionDate,
    });
  }, [allSessions, supplierID]);

  return (
    <div className={styles.sessionsSchedule_container}>
      <div className={styles.sessionsSchedule_div}>
        <h3>First Session</h3>
        <p>{sessionDate?.firstSessionDate?.toDateString()}</p>
      </div>
      <div className={styles.sessionsSchedule_div}>
        <h3>Last Session</h3>
        <p>{sessionDate?.lastSessionDate?.toDateString()}</p>
      </div>
      <div className={styles.sessionsSchedule_div}>
        <h3>First Complete</h3>
        <p>{sessionDate?.firstCompleteSessionDate?.toDateString()}</p>
      </div>

      <div className={styles.sessionsSchedule_div}>
        <h3>Last Complete</h3>
        <p>{sessionDate?.lastCompleteSessionDate?.toDateString()}</p>
      </div>
    </div>
  );
}

export default SessionsSchedule;
