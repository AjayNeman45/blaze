import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import {
  getAllSessions,
  getAllSurveys,
  getClients,
  getMiratsInsightsTeam,
} from "../../utils/firebaseQueries";
import { useParams } from "react-router-dom";
import { useBaseContext } from "../../context/BaseContext";

const SurveyContext = createContext();

export const useSurveyContext = () => {
  return useContext(SurveyContext);
};

const SurveyContextProvider = ({ children }) => {
  const [surveys, setSurveys] = useState([]);
  const [clients, setClients] = useState([]);
  const [completedSessions, setCompletedSessions] = useState([]);
  const [teams, setTeams] = useState({});
  useEffect(() => {
    const func = async () => {
      const allSurveys = await getAllSurveys();
      // ------>>>>  storing the status cnts (live, awarded, paused,.....) of the surveys
      allSurveys?.forEach(async (doc) => {
        let completes = 0,
          inClients = 0;
        let survey = doc.data();
        let sid = survey?.survey_id;
        let cpiSum = 0;

        const result = await getAllSessions(sid);

        result.forEach((res) => {
          if (res.data()?.client_status === 10) {
            cpiSum += parseInt(res.data()?.client_cpi);
            completes++;
          }
          if (res.data()?.mirats_status === 3) {
            inClients++;
          }
        });
        survey["completes"] = completes;
        survey["hits"] = result.docs.length;
        survey["avg_cpi"] = (cpiSum / completes).toFixed(2);
        survey["ir"] = ((completes / inClients) * 100).toFixed(2);
        setSurveys((prevData) => [...prevData, survey]);
      });

      let clientsTmp = [];
      const clients = await getClients();
      clients?.forEach((client) => {
        clientsTmp.push(client.data());
      });
      setClients(clientsTmp);

      // fectch all the pms, sms, ams
      getMiratsInsightsTeam()
        .then((data) => {
          setTeams(data);
        })
        .catch((err) => console.log(err.message));
    };
    func();
  }, []);

  const getCompletedSessions = async (sid) => {
    const sessions = await getAllSessions(sid);
    sessions?.forEach((session) => {
      if (session.data()?.client_status === 10) {
        setCompletedSessions((prevData) => {
          return [...prevData, session.data()];
        });
      }
    });
  };

  const value = {
    surveys,
    clients,
    getCompletedSessions,
    completedSessions,
    teams,
  };
  return (
    <SurveyContext.Provider value={value}>{children}</SurveyContext.Provider>
  );
};

export default SurveyContextProvider;
