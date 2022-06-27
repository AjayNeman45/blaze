import React, { createContext, useEffect, useState } from "react";
import { getAllSessions, getAllSurveys } from "../../utils/firebaseQueries";
import {
  getAvgCPI,
  getSupplAvgCPI,
} from "../survey-dashboard/SurveyDashboardContext";
let DashboardContext = createContext();
function DashboardContextProvider({ children }) {
  let [allSurveys, setAllSurveys] = useState([]);
  const [basicStats, setBasicStats] = useState({ last30MinutesSessionsCnt: 0 });
  const [financialOverview, setFinancialOverview] = useState({
    total_rev: 0,
    supply_cost: 0,
    profit: 0,
    avg_supply_cpi: 0,
    avg_client_cpi: 0,
    epc_vendor: 0,
  });
  const [dailyData, setDailyData] = useState({
    completes: 0,
    hits: 0,
    yesterdayCompleted: 0,
    yesterdayHits: 0,
  });

  const [graphData, setGraphData] = useState({});

  useEffect(() => {
    getAllSurveys().then((querysnapshot) => {
      let uniqueProjectNumbers = new Set();
      let liveProjectsCnt = 0,
        surveysTmp = [];
      querysnapshot.forEach((doc) => {
        surveysTmp.push(doc.data());
        if (doc.data()?.status === "live") {
          liveProjectsCnt++;
        }
        uniqueProjectNumbers.add(doc.data()?.project_id);
      });
      setAllSurveys(surveysTmp);
      setBasicStats((prevData) => {
        return {
          ...prevData,
          surveys_created: querysnapshot.docs.length,
          projects_created: uniqueProjectNumbers.size,
          live_projects: liveProjectsCnt,
        };
      });
    });
  }, []);

  const handleGraphData = (date, status) => {
    setGraphData((prevData) => {
      return {
        ...prevData,
        [date]: {
          ...prevData[date],
          [status]:
            (prevData?.[date]?.[status] ? prevData?.[date]?.[status] : 0) + 1,
        },
      };
    });
  };

  useEffect(() => {
    let surveyCreatedTodayCnt = 0,
      surveyCreatedYesterDayCnt = 0;
    let graphData = {};
    allSurveys?.map(async (survey) => {
      let completedSessionCnt = 0,
        hitsSessionsCnt = 0,
        dailyCompletedSession = 0,
        dailyHitsSession = 0,
        yesterdayCompletedSessions = 0,
        yesterdayHitsSessions = 0,
        completedSessions = [];

      const yesterday = new Date(
        new Date().setDate(new Date().getDate() - 1)
      ).toDateString();
      if (
        survey?.creation_date?.toDate()?.toDateString() ===
        new Date().toDateString()
      )
        surveyCreatedTodayCnt++;
      if (survey?.creation_date?.toDate()?.toDateString() === yesterday)
        surveyCreatedYesterDayCnt++;
      const allSessions = await getAllSessions(survey?.survey_id);
      hitsSessionsCnt = allSessions.docs.length;
      allSessions?.forEach((session) => {
        let sd = session.data();
        let surveyEndDate = sd?.survey_end_time?.toDate()?.toDateString();
        handleGraphData(surveyEndDate, "hits");
        if (surveyEndDate === new Date().toDateString()) {
          dailyHitsSession++;
        }
        if (surveyEndDate === yesterday) {
          yesterdayHitsSessions++;
        }
        if (sd?.client_status === 10) {
          handleGraphData(surveyEndDate, "completes");
          let ms =
            new Date()?.getTime() - sd?.survey_end_time?.toDate()?.getTime();

          let timeDiff = new Date(ms).toISOString().slice(11, 19);
          if (
            parseInt(timeDiff.split(":")[0]) === 0 &&
            parseInt(timeDiff.split(":")[1]) <= 30
          ) {
            setBasicStats((prevData) => {
              return {
                ...prevData,
                last30MinutesSessionsCnt:
                  prevData?.last30MinutesSessionsCnt + 1,
              };
            });
          }
          if (surveyEndDate === new Date().toDateString()) {
            dailyCompletedSession++;
          }
          if (surveyEndDate === yesterday) {
            yesterdayCompletedSessions++;
          }
          completedSessionCnt++;
          completedSessions.push(session.data());
        }
      });

      let avgCpi = parseFloat(
        getAvgCPI(completedSessions, completedSessionCnt)
      );
      let supplyCost = parseFloat(
        getSupplAvgCPI(completedSessions, completedSessionCnt)
      );
      setFinancialOverview((prevData) => {
        return {
          total_rev: prevData?.total_rev + completedSessionCnt * avgCpi,
          supply_cost: prevData?.supply_cost + completedSessionCnt * supplyCost,
          profit:
            prevData?.total_rev +
            completedSessionCnt * avgCpi -
            (prevData?.supply_cost + completedSessionCnt * supplyCost),
          avg_supply_cpi: prevData?.avg_client_cpi + supplyCost,
          avg_client_cpi: prevData?.avg_client_cpi + avgCpi,
          epc_vendor:
            prevData?.epc_vendor +
            Math.round(
              !hitsSessionsCnt
                ? 0
                : (completedSessionCnt * supplyCost) / hitsSessionsCnt
            ),
        };
      });

      setDailyData((prevData) => {
        return {
          completes: prevData?.completes + dailyCompletedSession,
          hits: prevData?.hits + dailyHitsSession,
          yesterdayCompleted:
            prevData?.yesterdayCompleted + yesterdayCompletedSessions,
          yesterdayHits: prevData?.yesterdayHits + yesterdayHitsSessions,
          surveyCreatedTodayCnt: surveyCreatedTodayCnt,
          surveyCreatedYesterDayCnt: surveyCreatedYesterDayCnt,
        };
      });
    });
  }, [allSurveys]);

  const value = {
    allSurveys,
    basicStats,
    financialOverview,
    dailyData,
    graphData,
  };
  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export default DashboardContextProvider;
export { DashboardContext };
