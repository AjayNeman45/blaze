import { collection, doc, onSnapshot } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import { decryptText } from "../../utils/enc-dec.utils";

export const ProjectSettingContext = createContext();

const ProejctSettingProvider = ({ children }) => {
  const { surveyID } = useParams();
  // let survey_id = decryptText(encryptedID.split("-")[0])
  // let project_id = decryptText(encryptedID.split("-")[1])
  // let country = decryptText(encryptedID.split("-")[2])

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
  console.log(surveyData);

  return (
    <ProjectSettingContext.Provider value={{ surveyData, surveyID }}>
      {children}
    </ProjectSettingContext.Provider>
  );
};

export default ProejctSettingProvider;
