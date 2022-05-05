import React, { createContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getErrorCodesForClientStatus,
  getErrorCodesForMiratsStatus,
  getSurvey,
} from "../../utils/firebaseQueries";
const LiveSurveyLogsContext = createContext();

function LiveSurveyLogsContextProvider({ children }) {
  let { surveyID } = useParams();

  let [liveSurveyLogsFilter, setLiveSurveyLogsFilter] = useState({
    device_type: [],
    // log_type: "live",
  });
  // let [errorCodes, setErrorCodes] = useState({
  //   client_codes: [],
  //   mirats_codes: [],
  // });
  let [clientCodes, setClientCodes] = useState([]);
  let [miratsCodes, setMiratsCodes] = useState([]);
  let [surveydata, setSurveyData] = useState({});
  const HandleArrayFilters_LiveSurveyLog = (key, val, addOrRemove) => {
    if (addOrRemove) {
      setLiveSurveyLogsFilter({
        ...liveSurveyLogsFilter,
        [key]: [...liveSurveyLogsFilter?.[key], val],
      });
    } else {
      setLiveSurveyLogsFilter((preobj) => {
        let keys = preobj[key];
        let arr = keys.filter((k) => k != val);
        return { ...preobj, [key]: arr };
      });
    }
  };

  useEffect(() => {
    console.log("Entered this useEffect");
    getErrorCodesForClientStatus().then((querysnapshot) => {
      querysnapshot.forEach((doc) => {
        // setErrorCodes({
        //   ...errorCodes,
        //   client_codes: [...errorCodes?.client_codes, doc.data()?.code],
        // });
        setClientCodes((prear) => [...prear, doc.data()]);
      });
    });
    getErrorCodesForMiratsStatus().then((querysnapshot) => {
      querysnapshot.forEach((doc) => {
        setMiratsCodes((prear) => [...prear, doc.data()]);
      });
    });
    getSurvey(surveyID).then((data) => {
      setSurveyData(data);
    });
  }, []);
  return (
    <LiveSurveyLogsContext.Provider
      value={{
        liveSurveyLogsFilter,
        setLiveSurveyLogsFilter,
        HandleArrayFilters_LiveSurveyLog,
        miratsCodes,
        clientCodes,
        surveydata,
      }}
    >
      {children}
    </LiveSurveyLogsContext.Provider>
  );
}

export default LiveSurveyLogsContext;
export { LiveSurveyLogsContextProvider };
