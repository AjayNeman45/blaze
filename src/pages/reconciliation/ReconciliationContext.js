import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import {
  getAllSessions,
  getStatusDesc,
  getSurvey,
} from "../../utils/firebaseQueries";

const ReconciliationContext = createContext();

export const useReconcileContext = () => {
  return useContext(ReconciliationContext);
};

const ReconciliationContextProvider = ({ children }) => {
  const { surveyID } = useParams();
  const [allSuppliers, setAllSuppliers] = useState([]);
  const [survey, setSurvey] = useState({});

  const [termDetailsSessions, setTermDetailsSessions] = useState([]);

  useEffect(() => {
    getSurvey(surveyID).then((data) => {
      setSurvey(data);
      setAllSuppliers(() => {
        let external_supp = data?.external_suppliers
          ? data?.external_suppliers
          : [];
        let internal_supp = data?.internal_suppliers
          ? data?.internal_suppliers
          : [];
        return [...external_supp, ...internal_supp];
      });
    });
  }, [surveyID]);

  const handleGenerateReport = (supplier, termType, setTableLoading) => {
    setTermDetailsSessions([]);
    getAllSessions(surveyID).then((res) => {
      res.forEach(async (session) => {
        if (
          session.data()?.supplier_account_id === supplier?.supplier_account_id
        ) {
          let statuses_desc = {
            mirats_status_desc: await getStatusDesc(
              "mirats_codes",
              session.data()?.mirats_status
            ),
            client_status_desc: await getStatusDesc(
              "client_codes",
              session.data()?.client_status
            ),
          };
          if (termType === "all") {
            setTermDetailsSessions((prevData) => [
              ...prevData,
              {
                session_data: session.data(),
                survey_id: surveyID,
                survey_name: survey?.survey_name,
                statuses_desc,
              },
            ]);
          } else if (termType === "quality_terminate") {
            if (session.data()?.client_status === 30) {
              setTermDetailsSessions((prevData) => [
                ...prevData,
                {
                  session_data: session.data(),
                  survey_id: surveyID,
                  survey_name: survey?.survey_name,
                  statuses_desc,
                },
              ]);
            }
          } else if (termType === "terminate") {
            if (session.data()?.client_status === 20) {
              setTermDetailsSessions((prevData) => [
                ...prevData,
                {
                  session_data: session.data(),
                  survey_id: surveyID,
                  survey_name: survey?.survey_name,
                  statuses_desc,
                },
              ]);
            }
          }
          setTableLoading(false);
        }
      });
    });
  };

  const value = { allSuppliers, termDetailsSessions, handleGenerateReport };
  return (
    <ReconciliationContext.Provider value={value}>
      {children}
    </ReconciliationContext.Provider>
  );
};

export default ReconciliationContextProvider;
