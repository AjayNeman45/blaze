import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import styles from "./supply_overviewbigcard.module.css";
function SupplyOverViewBigCard({ supp }) {
  const [vendorSessionStatusesCnt, setVendorSessionStatusesCnt] = useState({
    terminated: 0,
    quotaFull: 0,
  });

  const { surveyID } = useParams();
  const [timeDetails, setTimeDetails] = useState({
    sum_of_completed_time: 0,
    sum_of_terminated_time: 0,
  });
  const [completedSessionsTotalTime, setCompletedSessionsTotalTime] =
    useState(0);

  const history = useHistory();
  useEffect(() => {
    supp?.sessions?.forEach((session) => {
      if (session?.client_status === 40) {
        setTimeDetails((prevData) => {
          return {
            ...prevData,
            sum_of_terminated_time:
              timeDetails?.sum_of_terminated_time +
              parseInt(session?.total_survey_time.split(":")[1]),
          };
        });
        setVendorSessionStatusesCnt((prevData) => {
          return {
            ...prevData,
            terminated: prevData?.terminated + 1,
          };
        });
      } else if (session?.client_status === 20) {
        setVendorSessionStatusesCnt((prevData) => {
          return {
            ...prevData,
            quotaFull: prevData?.quotaFull + 1,
          };
        });
      } else if (session?.client_status === 10) {
        // const hrs = session?.total_survey_time.split(":")[0] * 3600
        // const mins = session?.total_survey_time.split(":")[1] * 60
        // const secs = session?.total_survey_time.split(":")[2]

        setTimeDetails((prevData) => {
          return {
            ...prevData,
            sum_of_completed_time:
              timeDetails?.sum_of_completed_time +
              parseInt(session?.total_survey_time.split(":")[1]),
          };
        });
      }
    });
  }, []);

  console.log(supp);

  return (
    <div
      className={styles.container}
      onClick={() =>
        history.push(
          `/surveys/analytics/supplier-overview/${surveyID}/${supp?.supplier?.supplier_account_id}`
        )
      }
    >
      <h1 className={styles.title}>{supp?.supplier?.supplier_account}</h1>
      <h1 className={styles.count}>
        {supp?.completed}/{supp?.supplier?.allocation?.number}
      </h1>
      <div className={styles.conversion}>
        <p>
          <span style={{ fontWeight: 600 }}>
            {" "}
            {(
              (supp?.completed / supp?.supplier?.allocation?.number) *
              100
            ).toFixed(0)}
            %
          </span>{" "}
          conversion
        </p>
      </div>
      <div className={styles.ctqf}>
        <span>{supp?.completed} C</span>
        <span>{vendorSessionStatusesCnt?.terminated} T</span>
        <span>{vendorSessionStatusesCnt?.quotaFull} QF</span>
      </div>

      <div className={styles.hits}>
        <span style={{ color: "#27D44D" }}>
          {supp?.completed === 0
            ? 0
            : (timeDetails?.sum_of_completed_time / supp?.completed).toFixed(0)}
          m
        </span>
        <span style={{ color: "#F4554A" }}>
          {vendorSessionStatusesCnt?.terminated === 0
            ? 0
            : (
                timeDetails?.sum_of_terminated_time /
                vendorSessionStatusesCnt?.terminated
              ).toFixed(0)}
          m
        </span>
        <span style={{ color: "#606060" }}>{supp?.sessions?.length} hits</span>
      </div>
    </div>
  );
}

export default SupplyOverViewBigCard;
