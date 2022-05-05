import React, { createContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getSurvey } from "../../utils/firebaseQueries";
import { db } from "../../firebase";
const SourceContext = createContext();

function SourcesContextProvider({ children }) {
  let { surveyID } = useParams();
  let [surveydata, setSurveydata] = useState();
  useEffect(() => {
    if (surveyID) {
      getSurvey(surveyID).then((data) => {
        setSurveydata(data);
      });
    }
  }, []);

  const ChangeVendorStatus = async (index, status, survey_id) => {
    setSurveydata(preob=>{
      let suppliers=preob?.external_suppliers
      suppliers[index].vendor_status=status
      return preob
    })
    await setDoc(
      doc(db, "mirats", "surveys", "survey", String(survey_id)),
      {
        external_suppliers: surveydata?.external_suppliers,
      },
      { merge: true }
    );
    getSurvey(survey_id).then((data) => {
      setSurveydata(data);
    });
  };

  return (
    <SourceContext.Provider
      value={{ surveydata, setSurveydata, ChangeVendorStatus }}
    >
      {children}
    </SourceContext.Provider>
  );
}

export default SourcesContextProvider;
export { SourceContext };
