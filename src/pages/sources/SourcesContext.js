import React, { createContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
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

  return (
    <SourceContext.Provider value={{ surveydata, setSurveydata }}>
      {children}
    </SourceContext.Provider>
  );
}

export default SourcesContextProvider;
export { SourceContext };
