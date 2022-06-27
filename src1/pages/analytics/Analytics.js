import React from "react";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import Header from "../../components/header/Header";
import Subheader from "../../components/subheader/Subheader";
import SurveyInfo from "../../components/survey-info/SurveyInfo";
import styles from "./Analytics.module.css";
import { useAanalyticsContext } from "./AnalyticsContext";
import Audience from "./Audience";
import AudienceResponse from "./AudienceResponse";
import RealtimeOverview from "./RealtimeOverview";
import SupplierOverview from "./supplier-overview/SupplierOverview";
import SupplierOverviewContextProvider from "./supplier-overview/SupplierOverviewContext";

const Analytics = () => {
  const { navigationTab, surveyID } = useParams();
  const { setLastPresentTime, survey } = useAanalyticsContext();

  return (
    <>
      <Header />
      <Subheader />
      <SurveyInfo />
      <div className={styles.analytics_page}>
        <AnalyticsNavigationTabs
          navigationTab={navigationTab}
          setLastPresentTime={setLastPresentTime}
          surveyID={surveyID}
          survey={survey}
        />

        {(() => {
          switch (navigationTab) {
            case "audience":
              return <Audience />;
            case "audience-response":
              return <AudienceResponse />;
            case "realtime-overview":
              return <RealtimeOverview />;
            case "supplier-overview":
              return <SupplierOverview />;
          }
        })()}
      </div>
    </>
  );
};

export const AnalyticsNavigationTabs = ({
  navigationTab,
  setLastPresentTime,
  surveyID,
  survey,
}) => {
  return (
    <div className={styles.navigation_tabs}>
      <div className={styles.tab}>
        <NavLink
          className={
            navigationTab === "audience"
              ? styles.navigation_active_tab
              : styles.navigation_tab_link
          }
          to={`/surveys/analytics/audience/${surveyID}/`}
        >
          <span>Audience</span>
          <span className={styles.border_bottom}></span>
        </NavLink>
      </div>
      <div className={styles.tab}>
        <NavLink
          className={
            navigationTab === "audience-response"
              ? styles.navigation_active_tab
              : styles.navigation_tab_link
          }
          to={`/surveys/analytics/audience-response/${surveyID}/`}
        >
          <span>Audience Response</span>
          <span className={styles.border_bottom}></span>
        </NavLink>
      </div>
      <div className={styles.tab}>
        <NavLink
          className={
            navigationTab === "realtime-overview"
              ? styles.navigation_active_tab
              : styles.navigation_tab_link
          }
          to={`/surveys/analytics/realtime-overview/${surveyID}/`}
        >
          <span>Realtime Overview</span>
          <span className={styles.border_bottom}></span>
        </NavLink>
      </div>
      <div className={styles.tab}>
        <NavLink
          className={
            navigationTab === "supplier-overview"
              ? styles.navigation_active_tab
              : styles.navigation_tab_link
          }
          to={`/surveys/analytics/supplier-overview/${surveyID}/${survey?.external_suppliers?.[0]?.supplier_account_id}`}
        >
          <span>Supplier Overview</span>
          <span className={styles.border_bottom}></span>
        </NavLink>
      </div>

      {navigationTab === "realtime-overview" && (
        <select
          onChange={(e) => setLastPresentTime(e.target.value)}
          className={styles.timeChooseSelect}
        >
          <option value="30">last 30 minutes</option>
          <option value="60">last 60 minutes</option>
          <option value="180">last 3 hours</option>
          <option value="360">last 6 hour</option>
          <option value="720">last 12 hour</option>
        </select>
      )}
    </div>
  );
};

export default Analytics;
