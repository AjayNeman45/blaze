import React from "react";
import styles from "./userAnalytcs.module.css";
import { Progress } from "@nextui-org/react";
import LinearProgress from "@mui/material/LinearProgress";

function AnalyticsUserCountCard({
  cardTitle,
  cardSubtitle,
  data,
  inClientSessions,
}) {
  console.log(data);
  return (
    <div className={styles.UserAnalytics_container}>
      <h1>{cardTitle}</h1>
      <div className={styles.UserAnalytics_header}>
        <h4>{cardSubtitle[0]}</h4>
        <h4>{cardSubtitle[1]}</h4>
      </div>
      {Object.keys(data).map((key) => {
        console.log(data[key], inClientSessions);
        return (
          <>
            <div className={styles.platform_type}>
              <p>{key}</p> <p>{data[key]}</p>
            </div>

            <LinearProgress
              color="inherit"
              variant="determinate"
              value={(data[key] / inClientSessions) * 100}
              // value={item.progress}
            />
          </>
        );
      })}
    </div>
  );
}

export default AnalyticsUserCountCard;
