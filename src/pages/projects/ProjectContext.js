import { createContext, useContext, useEffect, useState } from "react";
import {
  addDoc,
  collection,
  getDoc,
  getDocs,
  query,
  setDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { getAllSessions, getClients } from "../../utils/firebaseQueries";

const ProjectContext = createContext();

export const useProjectContext = () => {
  return useContext(ProjectContext);
};

const ProjectContextProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [completedSessions, setCompletedSessions] = useState([]);
  useEffect(() => {
    const func = async () => {
      const querySnapshot = await getDocs(
        collection(db, "mirats", "surveys", "survey")
      );
      querySnapshot.docs.reverse().forEach(async (doc) => {
        let completes = 0;
        let survey = doc.data();
        let sid = survey?.survey_id;
        let cpiSum = 0;
        const result = await getAllSessions(sid);
        result.forEach((res) => {
          if (res.data()?.client_status === 10) {
            cpiSum += parseInt(res.data()?.client_cpi);
            completes++;
          }
        });

        survey["completes"] = completes;
        survey["hits"] = result.docs.length;
        survey["avg_cpi"] = (cpiSum / completes).toFixed(2);
        setProjects((prevData) => {
          return [...prevData, survey];
        });
      });

      const clients = await getClients();
      clients?.forEach((client) => {
        setClients((prevData) => [...prevData, client.data()]);
      });
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
    projects,
    clients,
    getCompletedSessions,
    completedSessions,
  };
  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
};

export default ProjectContextProvider;
