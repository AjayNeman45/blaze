import { collection, doc, onSnapshot } from "firebase/firestore";
import { useContext } from "react";
import { createContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import { decryptText, encryptText } from "../../utils/enc-dec.utils";
import { hashids } from "../../index";
import { getClients } from "../../utils/firebaseQueries";

const ProjectSettingContext = createContext();

export const useProjectSettingsContext = () => {
  return useContext(ProjectSettingContext);
};

const ProejctSettingProvider = ({ children }) => {
  const { surveyID } = useParams();

  let [surveyData, setSurveyData] = useState({});
  const [changes, setChanges] = useState({ updated_date: new Date() });
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const DB = db.collection("mirats").doc("surveys").collection("survey");
    const unsub = onSnapshot(
      doc(db, "mirats", "surveys", "survey", String(surveyID)),
      (doc) => {
        setSurveyData(doc.data());
      }
    );

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
  }, []);

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

  return (
    <ProjectSettingContext.Provider
      value={{
        surveyData,
        setSurveyData,
        surveyID,
        changes,
        setChanges,
        clients,
      }}
    >
      {children}
    </ProjectSettingContext.Provider>
  );
};

export default ProejctSettingProvider;
