import { collection, doc, onSnapshot } from "firebase/firestore";
import { useContext } from "react";
import { createContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import { decryptText, encryptText } from "../../utils/enc-dec.utils";
import { hashids } from "../../index";

const ProjectSettingContext = createContext();

export const useProjectSettingsContext = () => {
  return useContext(ProjectSettingContext);
};

const ProejctSettingProvider = ({ children }) => {
  const { surveyID } = useParams();

  let [surveyData, setSurveyData] = useState({});
  const [changes, setChanges] = useState({ updated_date: new Date() });

  useEffect(() => {
    const DB = db.collection("mirats").doc("surveys").collection("survey");
    const unsub = onSnapshot(
      doc(db, "mirats", "surveys", "survey", String(surveyID)),
      (doc) => {
        setSurveyData(doc.data());
      }
    );

    console.log(hashids.encode([1234567899]));
  }, []);

  useEffect(() => {
    console.log(
      "https://gifted-visvesvaraya-89e692.netlify.app/blaze/" +
        surveyData?.encrypt?.sid +
        "-" +
        surveyData?.encrypt?.pid +
        "-" +
        surveyData?.encrypt?.cid +
        `/lightningStart?SRCID=5kr34wx&RID=794639`
    );
  }, [surveyData]);

  return (
    <ProjectSettingContext.Provider
      value={{ surveyData, setSurveyData, surveyID, changes, setChanges }}
    >
      {children}
    </ProjectSettingContext.Provider>
  );
};

export default ProejctSettingProvider;
