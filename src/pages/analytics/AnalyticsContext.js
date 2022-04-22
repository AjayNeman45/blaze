import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAllSessions, getSurvey } from "../../utils/firebaseQueries";

const analyticsContext = createContext();
export const useAanalyticsContext = () => {
  return useContext(analyticsContext);
};

const AnalyticsContextProvider = ({ children }) => {
  const { surveyID } = useParams();
  const [usersByOs, setUsersByOs] = useState([]);
  const [usersByDeviceTypes, setUsersByDeviceTypes] = useState([]);
  const [usersByBrowsers, setUsersByBrowsers] = useState([]);
  const [usersByDeviceBrands, setUsersByDeviceBrands] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [allSessions, setAllSessions] = useState([]);
  const [survey, setSurvey] = useState({});
  const [sessionsDate, setSessionsDate] = useState({});
  const [graphData, setGraphData] = useState({});
  const [statusesCnt, setStatusesCnt] = useState({
    hits: 0,
    inClient: 0,
    completed: 0,
    terminated: 0,
    qualityTerminated: 0,
    quotaFull: 0,
  });

  const [lastPresentTime, setLastPresentTime] = useState("30");

  useEffect(() => {
    getSurvey(surveyID).then((data) => setSurvey(data));
    getAllSessions(surveyID).then((sessions) => {
      setAllSessions(sessions);
    });
  }, [surveyID]);

  const handleStatusCnt = (status) => {
    setStatusesCnt((prevData) => {
      return {
        ...prevData,
        [status]: prevData?.[status] + 1,
      };
    });
  };

  const handleGraphData = (creationDate, status) => {
    setGraphData((prevData) => {
      return {
        ...prevData,
        [creationDate]: {
          ...prevData?.[creationDate],
          [status]:
            (prevData?.[creationDate]?.[status]
              ? prevData?.[creationDate]?.[status]
              : 0) + 1,
        },
      };
    });
  };

  useEffect(() => {
    let os = new Set();
    let deviceTypes = new Set();
    let browsers = new Set();
    let deviceBrand = new Set();
    let dates = new Set();
    allSessions?.forEach((session) => {
      os.add(session.data()?.session_techincal_details?.os);
      deviceTypes.add(session.data()?.session_techincal_details?.deviceType);
      browsers.add(session.data()?.session_techincal_details?.browser_name);
      deviceBrand.add(session.data()?.session_techincal_details?.vendor);

      let creationDate = session.data()?.date.toDate().toDateString();
      if (session.data()?.date?.toDate()?.toDateString() === creationDate) {
        handleGraphData(creationDate, "hits");
      }

      if (session.data()?.mirats_status === 3) {
        dates.add(creationDate);
        handleGraphData(creationDate, "inClient");
        handleStatusCnt("inClient");
        if (session.data()?.client_status === 10) {
          handleStatusCnt("completed");
          handleGraphData(creationDate, "completed");
        } else if (session.data()?.client_status === 20) {
          handleStatusCnt("terminated");
          handleGraphData(creationDate, "terminated");
        } else if (session.data()?.client_status === 30) {
          handleStatusCnt("qualityTerminated");
          handleGraphData(creationDate, "qualityTerminated");
        } else if (session.data()?.client_status === 40) {
          handleStatusCnt("quotaFull");
          handleGraphData(creationDate, "quotaFull");
        }
      }
    });
    dates.forEach((date) => {
      allSessions?.forEach((session) => {
        let creationDate = session.data()?.date.toDate().toDateString();
        if (date === creationDate) {
        }
      });
    });

    setStatusesCnt((prevData) => {
      return {
        ...prevData,
        hits: allSessions?.docs?.length,
      };
    });

    setSessionsDate({
      startDate: allSessions?.docs?.[0]?.data()?.date.toDate(),
      endDate: allSessions?.docs?.[allSessions?.docs?.length - 1]
        ?.data()
        ?.date.toDate(),
    });

    // ---->>>> users by os card
    os.forEach((os) => {
      let cnt = 0;
      allSessions?.forEach((session) => {
        let technicalDetails = session.data()?.session_techincal_details;
        if (technicalDetails?.os === os) {
          cnt++;
        }
      });
      setUsersByOs((prevData) => {
        return {
          ...prevData,
          [os]: cnt,
        };
      });
    });

    // ---->>>> users by browsers card
    browsers.forEach((browser) => {
      let cnt = 0;
      allSessions?.forEach((session) => {
        let technicalDetails = session.data()?.session_techincal_details;
        if (technicalDetails?.browser_name === browser) {
          cnt++;
        }
      });
      setUsersByBrowsers((prevData) => {
        return {
          ...prevData,
          [browser]: cnt,
        };
      });
    });

    // --->>> users by device types card
    deviceTypes?.forEach((deviceType) => {
      let cnt = 0;
      allSessions?.forEach((session) => {
        let technicalDetails = session.data()?.session_techincal_details;
        if (technicalDetails?.deviceType === deviceType) {
          cnt++;
        }
      });
      setUsersByDeviceTypes((prevData) => {
        return {
          ...prevData,
          [deviceType]: cnt,
        };
      });
    });

    // ---->>> users by device brand card
    deviceBrand?.forEach((deviceBrand) => {
      let cnt = 0;
      allSessions?.forEach((session) => {
        let technicalDetails = session.data()?.session_techincal_details;
        if (technicalDetails?.vendor === deviceBrand) {
          cnt++;
        }
      });
      setUsersByDeviceBrands((prevData) => {
        return {
          ...prevData,
          [deviceBrand]: cnt,
        };
      });
    });

    // for supplier by completes card
    getSurvey(surveyID).then((data) => {
      setSuppliers([]);
      data?.external_suppliers?.map((supp) => {
        let completes = 0,
          completeTimeSum = 0;
        allSessions?.forEach((session) => {
          if (
            session.data()?.supplier_account_id === supp?.supplier_account_id &&
            session?.data()?.client_status === 10
          ) {
            completes++;
            completeTimeSum += parseInt(
              session.data()?.total_survey_time.split(":")[1]
            );
          }
        });
        setSuppliers((prevData) => {
          return [
            ...prevData,
            {
              supplier: supp?.supplier_account,
              completes,
              avgCompleteTime: completes ? completeTimeSum / completes : 0,
            },
          ];
        });
      });
    });

    // for completes by employees card
    // allSessions?.docs?.map((session) => {
    //   session.data()?.responses?.map((res) => {
    //     if (res?.question_id === "22467") {
    //       console.log(res?.user_response);
    //       getQuestion("22467").then((res) => {
    //         console.log(res.data()?.lang?.[survey?.country?.code]?.options);
    //       });
    //     }
    //   });
    // });
  }, [allSessions]);

  const value = {
    usersByOs,
    usersByDeviceTypes,
    usersByBrowsers,
    usersByDeviceBrands,
    suppliers,
    allSessions,
    survey,
    statusesCnt,
    sessionsDate,
    graphData,
    lastPresentTime,
    setLastPresentTime,
  };
  return (
    <analyticsContext.Provider value={value}>
      {children}
    </analyticsContext.Provider>
  );
};

export default AnalyticsContextProvider;
