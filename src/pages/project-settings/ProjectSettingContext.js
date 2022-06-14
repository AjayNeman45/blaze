import { collection, doc, onSnapshot } from "firebase/firestore";
import { useContext } from "react";
import { createContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import { decryptText, encryptText } from "../../utils/enc-dec.utils";
import { hashids } from "../../index";
import {
  getAllSessions,
  getClients,
  getUserData,
} from "../../utils/firebaseQueries";
import { useBaseContext } from "../../context/BaseContext";

const ProjectSettingContext = createContext();

export const useProjectSettingsContext = () => {
  return useContext(ProjectSettingContext);
};

const ProejctSettingProvider = ({ children }) => {
  const { userData } = useBaseContext();
  const { surveyID } = useParams();

  let [surveyData, setSurveyData] = useState({});
  const [changes, setChanges] = useState({ updated_date: new Date() });
  const [clients, setClients] = useState([]);
  const [completedSessions, setCompletedSessions] = useState([]);
  const [createdByData, setCreatedByData] = useState({});

  useEffect(() => {
    let name = userData?.basicinfo?.firstname + userData?.basicinfo?.lastname;
    setChanges({
      updated_date: new Date(),
      changed_by: { name, email: userData?.basicinfo?.email },
    });
  }, [userData]);
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "miratsinsights", "blaze", "surveys", String(surveyID)),
      (doc) => {
        setSurveyData(doc.data());
        getUserData(doc.data()?.created_by).then((res) => {
          setCreatedByData(res.data());
        });
      }
    );
    getAllSessions(surveyID).then((sessions) => {
      let completedSessionsTmp = [];
      sessions?.forEach((session) => {
        if (session.data()?.client_status === 10)
          completedSessionsTmp.push(session.data());
      });
      setCompletedSessions(completedSessionsTmp);
    });

    getClients().then((clients) => {
      clients.docs.forEach((client) => {
        setClients((prevData) => [
          ...prevData,
          {
            label: client.data()?.company_name,
            value: client.data()?.company_name,
          },
        ]);
      });
    });

    //-------- GMOR  --->>>  1234567900
    //-------- Google Inc  --->>>  1234567899
    //-------- ABC Enterprises  --->>>  1234567890
    //-------- ZYX  --->>>  1234567888
    //-------- MPL  --->>>  1234567901
    //-------- Mirats  --->>>  1234567907

    console.log(hashids.encode([1234567899]));
  }, [surveyID]);

  useEffect(() => {
    console.log(
      "https://gifted-visvesvaraya-89e692.netlify.app/blaze/" +
        surveyData?.encrypt?.sid +
        "-" +
        surveyData?.encrypt?.pid +
        "-" +
        surveyData?.encrypt?.cid +
        `/lightningStart?SRCID=NGA2xo2&RID=vdfvfsd`
    );
  }, [surveyData]);

  console.log(changes);
  return (
    <ProjectSettingContext.Provider
      value={{
        surveyData,
        setSurveyData,
        surveyID,
        changes,
        setChanges,
        clients,
        completedSessions,
        createdByData,
      }}
    >
      {children}
    </ProjectSettingContext.Provider>
  );
};

export default ProejctSettingProvider;
