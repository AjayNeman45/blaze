import React from "react";
import styles from "./Analytics.module.css";
import AnalyticsUserCountCard from "../../components/analyticsUserCountCard/AnalyticsUserCountCard";
import { AudienceGraph1, AudiencesGraph2 } from "./AudienceGraphs";
import { useAanalyticsContext } from "./AnalyticsContext";

const Audience = () => {
  const {
    usersByOs,
    usersByDeviceTypes,
    usersByBrowsers,
    usersByDeviceBrands,
    statusesCnt,
    suppliers,
  } = useAanalyticsContext();
  return (
    <div className={styles.audience_page}>
      <div className={styles.container1}>
        <div className={styles.left}>
          <AudienceGraph1 statusesCnt={statusesCnt} />
          <AudiencesGraph2 statusesCnt={statusesCnt} />
        </div>
        <div className={styles.right}>
          <AnalyticsUserCountCard
            cardTitle="Users by OS, with version"
            cardSubtitle={["os with version", "users"]}
            data={usersByOs}
            inClientSessions={statusesCnt?.hits}
          />
          <AnalyticsUserCountCard
            cardTitle="Users by device types"
            cardSubtitle={["device types", "users"]}
            data={usersByDeviceTypes}
            inClientSessions={statusesCnt?.hits}
          />
          <AnalyticsUserCountCard
            cardTitle="Users by device brands"
            cardSubtitle={["device types", "users"]}
            data={usersByDeviceBrands}
            inClientSessions={statusesCnt?.hits}
          />
        </div>
      </div>

      <div className={styles.container2}>
        {/* users by browsers card */}
        <div className={styles.users_by_browsers_card}>
          <AnalyticsUserCountCard
            cardTitle="Users by Browsers"
            cardSubtitle={["Browsers", "users"]}
            data={usersByBrowsers}
            inClientSessions={statusesCnt?.hits}
          />
        </div>

        {/* supplier by comlpetes by average time  */}
        <div className={styles.supplier_by_completes_card}>
          <h1>supplier by completes by average time</h1>
          <div className={styles.supplier_by_completes_table}>
            <table>
              <thead>
                <tr>
                  <th style={{ width: "420px" }}>supplier</th>
                  <th>completes</th>
                  <th>avg. complete time</th>
                </tr>
              </thead>
              <tbody>
                {suppliers?.map((supp) => (
                  <tr>
                    <td>{supp?.supplier}</td>
                    <td>{supp?.completes}</td>
                    <td>{supp?.avgCompleteTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Audience;
