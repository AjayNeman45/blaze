import { collection, doc, onSnapshot } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import { decryptText } from "../../utils/enc-dec.utils";

export const ProjectSettingContext = createContext();

const ProejctSettingProvider = ({ children }) => {
  const { surveyID } = useParams();

  let [surveyData, setSurveyData] = useState({});

  useEffect(() => {
    const DB = db.collection("mirats").doc("surveys").collection("survey");
    const unsub = onSnapshot(
      doc(db, "mirats", "surveys", "survey", String(surveyID)),
      (doc) => {
        setSurveyData(doc.data());
      }
    );
  }, []);

  useEffect(() => {
    console.log(
      "https://gifted-visvesvaraya-89e692.netlify.app/blaze/" +
        surveyData?.encrypt?.sid +
        "-" +
        surveyData?.encrypt?.pid +
        "-" +
        surveyData?.encrypt?.cid +
        `/lightningUrl?SRCID=Vv5JQoX&RID=794639`
    );
  }, [surveyData]);

  return (
    <ProjectSettingContext.Provider
      value={{ surveyData, setSurveyData, surveyID }}
    >
      {children}
    </ProjectSettingContext.Provider>
  );
};

export default ProejctSettingProvider;
