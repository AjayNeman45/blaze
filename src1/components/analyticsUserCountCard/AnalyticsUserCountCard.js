import React from "react";
import styles from "./userAnalytcs.module.css";
import { Progress } from "@nextui-org/react";
import LinearProgress from "@mui/material/LinearProgress";
import { v4 as uuid } from "uuid";

function AnalyticsUserCountCard({
  cardTitle,
  cardSubtitle,
  data,
  inClientSessions,
  last30MinutesCard,
  lastPresentTime,
}) {
  return (
    <div className={styles.UserAnalytics_container}>
      <div className={styles.legend}>
        <p className={styles.cardTitle}>{cardTitle}</p>
        {last30MinutesCard && (
          <p className={styles.time}>
            users in last{"   "}
            {lastPresentTime === "30"
              ? `${lastPresentTime} minutes`
              : ` ${parseInt(lastPresentTime) / 60}  hrs`}
          </p>
        )}
      </div>
      <div className={styles.UserAnalytics_header}>
        <h4>{cardSubtitle[0]}</h4>
        <h4>{cardSubtitle[1]}</h4>
      </div>
      {Object.keys(data)?.length
        ? Object.keys(data).map((key) => {
            return (
              <div key={uuid()}>
                <div className={styles.platform_type}>
                  <p>{key}</p> <p>{data[key]}</p>
                </div>

                <LinearProgress
                  color="inherit"
                  variant="determinate"
                  value={
                    (data[key] /
                      (inClientSessions.hasOwnProperty(key)
                        ? inClientSessions[key]
                        : inClientSessions)) *
                    100
                  }
                  // value={item.progress}
                />
              </div>
            );
          })
        : "No Data Found"}
    </div>
  );
}

export default AnalyticsUserCountCard;
