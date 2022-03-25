import React from "react";
import AnalyticsUserCountCard from "../../components/analyticsUserCountCard/AnalyticsUserCountCard";
import styles from "./Analytics.module.css";
import RealTimeOverViewDoughnutChart from "./realtime-overview-doughnut-chart/RealtimeOverviewDoughnutChart";

const drop_by_suppliers = [
  {
    name: "Cint AB",
    count: "222",
    progress: "45",
  },
  {
    name: "PureSpectrum",
    count: "222",
    progress: "45",
  },
  {
    name: "Prodege",
    count: "222",
    progress: "45",
  },
];

const RealtimeOverview = () => {
  return (
    <>
      <div className={styles.realtime_overview_page}>
        <div className={styles.left}>
          <div className={styles.realtime_doughnut_chart}>
            <RealTimeOverViewDoughnutChart />
          </div>
          <div className={styles.drops_by_suppliers_card}>
            <AnalyticsUserCountCard
              cardTitle="drops by suppliers"
              cardSubtitle={["suppliers", "drops"]}
              data={{}}
            />
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.users_by_suppliers_card}>
            <AnalyticsUserCountCard
              cardTitle="drops by suppliers"
              cardSubtitle={["suppliers", "drops"]}
              data={{}}
            />
          </div>
          <div className={styles.users_by_client_status_card}>
            <AnalyticsUserCountCard
              cardTitle="drops by suppliers"
              cardSubtitle={["suppliers", "drops"]}
              data={{}}
            />
          </div>

          <div className={styles.gender_by_complete_card}>
            <AnalyticsUserCountCard
              cardTitle="drops by suppliers"
              cardSubtitle={["suppliers", "drops"]}
              data={{}}
            />
          </div>
          <div className={styles.completes_by_suppliers}>
            <AnalyticsUserCountCard
              cardTitle="drops by suppliers"
              cardSubtitle={["suppliers", "drops"]}
              data={{}}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default RealtimeOverview;
