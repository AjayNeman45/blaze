import React, { createContext, useEffect, useState } from "react";
import { getAllSurveys } from "../../utils/firebaseQueries";
let DashboardContext = createContext();
function DashboardContextProvider({ children }) {
  let [allSurveys, setAllSurveys] = useState([]);
  const [basicStats, setBasicStats] = useState({});

  useEffect(() => {
    getAllSurveys().then((querysnapshot) => {
      let uniqueProjectNumbers = new Set();
      let liveProjectsCnt = 0;

      querysnapshot.forEach((doc) => {
        setAllSurveys((prear) => [...prear, doc.data()]);
        if (doc.data()?.status === "live") {
          liveProjectsCnt++;
        }
        uniqueProjectNumbers.add(doc.data()?.project_id);
      });
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

  function FetchTodaySurveyCreated() {
    let count = 0;
    allSurveys?.map((survey) => {
      if (
        survey?.creation_date?.toDate()?.toDateString() ===
        new Date().toDateString()
      ) {
        count = count + 1;
      }
    });
    return count;
  }

  const value = { allSurveys, FetchTodaySurveyCreated, basicStats };
  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export default DashboardContextProvider;
export { DashboardContext };
