import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getAllSessions,
  getSurvey,
  updateSurvey,
} from "../../utils/firebaseQueries";

const surveyDashboardContext = createContext();

export const useSurveyDashboardContext = () => {
  return useContext(surveyDashboardContext);
};

const SurveyDashboardContextProvider = ({ children }) => {
  const { surveyID } = useParams();
  const [allSessions, setAllSessions] = useState([]);
  const [survey, setSurvey] = useState({});
  const [surveyData, setSurveyData] = useState({});
  const [statusesCnt, setStatusesCnt] = useState(0);
  const [surveyNameEditModal, setSurveyNameEditModal] = useState(false);
  const [changedSurveyName, setChangeSurveyName] = useState("");
  const [newSurveyName, setNewSurveyName] = useState("");
  const [snackbar, setSnackbar] = useState(false);
  const [snackbarData, setSnackbarData] = useState("");
  const [completedSessions, setCompletedSessions] = useState([]);
  const [finacialRev, setFinancialRev] = useState({});
  const [inClientSurveySessions, setInClientSurveySessions] = useState(0);

  useEffect(() => {
    getSurvey(surveyID)
      .then((data) => {
        let copyData = data;
        setChangeSurveyName(data?.survey_name);
        setNewSurveyName(data?.survey_name);
        let sum = 0;
        copyData?.qualifications?.questions?.forEach((que) => {
          if (que?.conditions.hasOwnProperty("quotas")) {
            sum += Object.keys(que?.conditions?.quotas).length;
          }
        });

        let tmp_external_supp = [];
        getAllSessions(surveyID).then((res) => {
          data?.external_suppliers?.forEach((supp) => {
            let all_sessions_for_vendor = [];
            let completed = 0;
            res.forEach((session) => {
              if (
                session.data()?.supplier_account_id ===
                supp?.supplier_account_id
              ) {
                if (session.data()?.client_status === 10) completed += 1;
                all_sessions_for_vendor.push(session.data());
              }
            });
            tmp_external_supp.push({
              supplier: supp,
              sessions: all_sessions_for_vendor,
              completed,
            });
          });
          setSurveyData({
            ...data,
            quotas: sum,
            external_suppliers: tmp_external_supp.sort((a, b) =>
              a?.completed > b?.completed ? -1 : 1
            ),
          });
        });
      })
      .catch((err) => console.log(err.message));

    getAllSessions(surveyID).then((res) => {
      setStatusesCnt((prevData) => {
        return { ...prevData, hits: res.docs.length };
      });

      res.forEach((session) => {
        let status = session.data()?.client_status;
        let miratsStatus = session.data()?.mirats_status;
        if (miratsStatus === 3) {
          setInClientSurveySessions((prevData) => prevData + 1);
        }
        if (status === 40) {
          setStatusesCnt((prevData) => {
            return {
              ...prevData,
              overQuota: (prevData?.overQuota ? prevData?.overQuota : 0) + 1,
            };
          });
        } else if (status === 30) {
          setStatusesCnt((prevData) => {
            return {
              ...prevData,
              securityTerm:
                (prevData?.securityTerm ? prevData?.securityTerm : 0) + 1,
            };
          });
        } else if (status === 20) {
          setStatusesCnt((prevData) => {
            return {
              ...prevData,
              term: (prevData?.term ? prevData?.term : 0) + 1,
            };
          });
        } else if (status === 10) {
          setStatusesCnt((prevData) => {
            return {
              ...prevData,
              completed: (prevData?.completed ? prevData?.completed : 0) + 1,
            };
          });
          setCompletedSessions((prevData) => {
            return [...prevData, session.data()];
          });
        }
      });
    });
  }, []);

  const handleChangeSurveyNameBtn = (e) => {
    e.preventDefault();
    setSurveyNameEditModal(false);
    const body = {
      survey_name: changedSurveyName,
    };
    updateSurvey(surveyID, body)
      .then(() => {
        console.log("survey name updated");
        setSnackbarData({
          msg: "survey name is updated",
          severity: "success",
        });
        setSnackbar(true);
        setNewSurveyName(changedSurveyName);
      })
      .catch((err) =>
        setSnackbarData({
          msg: "Could not update survey name...!",
          severity: "error",
        })
      );
  };

  const value = {
    survey: surveyData,
    allSessions,
    statusesCnt,
    handleChangeSurveyNameBtn,
    surveyNameEditModal,
    setSurveyNameEditModal,
    newSurveyName,
    changedSurveyName,
    setChangeSurveyName,
    newSurveyName,
    snackbarData,
    setSnackbarData,
    snackbar,
    setSnackbar,
    completedSessions,
    inClientSurveySessions,
  };
  return (
    <surveyDashboardContext.Provider value={value}>
      {children}
    </surveyDashboardContext.Provider>
  );
};

export const getAvgLOI = (completedSessions, total) => {
  let sum = 0;
  completedSessions?.forEach((session) => {
    sum += parseInt(session?.total_survey_time.split(":")[1]);
  });
  return (sum / total).toFixed(0);
};

export const getAvgCPI = (completedSessions, total) => {
  let sum = 0;
  completedSessions?.forEach((session) => {
    sum += parseInt(session?.client_cpi);
  });
  if (!sum) return 0;
  return (sum / total).toFixed(2);
};

export const getSupplAvgCPI = (completedSessions, total) => {
  let sum = 0;
  completedSessions?.forEach((session) => {
    sum += parseInt(session?.vendor_cpi);
  });
  if (!sum) return 0;
  return (sum / total).toFixed(2);
};

export const getFinancialOverview = (
  financialOverviewFor,
  statusesCnt,
  completedSessions,
  setFinancialOverview
) => {
  setFinancialOverview({
    total_rev: (
      statusesCnt?.completed *
      getAvgCPI(completedSessions, statusesCnt?.completed)
    ).toFixed(2),
    supply_cost: (
      statusesCnt?.completed *
      getSupplAvgCPI(completedSessions, statusesCnt?.completed)
    ).toFixed(2),
    profit: (
      statusesCnt?.completed *
        getAvgCPI(completedSessions, statusesCnt?.completed) -
      statusesCnt?.completed *
        getSupplAvgCPI(completedSessions, statusesCnt?.completed)
    ).toFixed(2),
    avg_supply_cpi: getSupplAvgCPI(completedSessions, statusesCnt?.completed),
    avg_client_cpi: getAvgCPI(completedSessions, statusesCnt?.completed),
  });
};

export default SurveyDashboardContextProvider;
