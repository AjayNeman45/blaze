import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getAllSessions,
  getQuestion,
  getQuestions,
  getSurvey,
} from "../../utils/firebaseQueries";

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
  const [inClientSurveySessions, setInClientSurveySessions] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [allSessions, setAllSessions] = useState([]);
  const [survey, setSurvey] = useState({});
  const [completedByEmp, setCompletedByEmp] = useState({
    "1-100": 0,
    "500-100": 0,
    "1000+": 0,
  });

  useEffect(() => {
    getSurvey(surveyID).then((data) => setSurvey(data));
    getAllSessions(surveyID).then((sessions) => {
      setAllSessions(sessions);
    });
  }, [surveyID]);

  useEffect(() => {
    let os = new Set();
    let deviceTypes = new Set();
    let browsers = new Set();
    let deviceBrand = new Set();
    let in_client_survey_sessions = 0;
    allSessions?.forEach((session) => {
      os.add(session.data()?.session_techincal_details?.os);
      deviceTypes.add(session.data()?.session_techincal_details?.deviceType);
      browsers.add(session.data()?.session_techincal_details?.browser_name);
      deviceBrand.add(session.data()?.session_techincal_details?.vendor);
      if (session.data()?.mirats_status === 3) {
        in_client_survey_sessions++;
      }
    });

    setInClientSurveySessions(in_client_survey_sessions);

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
    allSessions?.docs?.map((session) => {
      session.data()?.responses?.map((res) => {
        if (res?.question_id === "22467") {
          console.log(res?.user_response);
          getQuestion("22467").then((res) => {
            console.log(res.data()?.lang?.[survey?.country?.code]?.options);
          });
        }
      });
    });
  }, [allSessions]);

  const value = {
    usersByOs,
    usersByDeviceTypes,
    usersByBrowsers,
    usersByDeviceBrands,
    inClientSurveySessions,
    suppliers,
    allSessions,
    survey,
  };
  return (
    <analyticsContext.Provider value={value}>
      {children}
    </analyticsContext.Provider>
  );
};

export default AnalyticsContextProvider;
