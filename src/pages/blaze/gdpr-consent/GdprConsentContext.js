import { createContext, useContext, useEffect, useState } from "react";
import {
  useHistory,
  useLocation,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { decryptText } from "../../../utils/enc-dec.utils";
import {
  getQuestions,
  getSessionBasedOnType,
  getSessionID,
  getSurvey,
  updateSession,
} from "../../../utils/firebaseQueries";

const GdprContext = createContext();

export const useGdprContext = () => {
  return useContext(GdprContext);
};

const GdprCotextProvider = ({ children }) => {
  const [gdprConsent, setGdprConsent] = useState(null);
  const [errCode, setErrCode] = useState(null);
  const [errMsg, setErrMsg] = useState(null);
  const [survey, setSurvey] = useState(null);

  const [sessionID, setSessionID] = useState();
  const [baseLoading, setBaseLoading] = useState(false);
  const { encryptedID } = useParams();
  const surveyID = decryptText(
    encryptedID?.split("-")[0] ? encryptedID?.split("-")[0] : ""
  );
  const history = useHistory();
  const srcID = localStorage.getItem("srcID");
  const rID = localStorage.getItem("rID");
  const gamma = localStorage.getItem("gamma");
  const setErrCodeAndMsg = (code, msg) => {
    setErrCode(code);
    setErrMsg(msg);
    setBaseLoading(false);
  };
  useEffect(() => {
    setSessionID(localStorage.getItem("session_id"));
  }, []);

  // check gdpr consent and insert it in database
  useEffect(() => {
    let sessionType = gamma == "alpha" ? "TestSessions" : "Sessions";
    const func = async () => {
      try {
        let session = await getSessionBasedOnType(
          surveyID,
          sessionID,
          sessionType
        );

        if (
          !session.data()?.gdpr_consent &&
          session.data()?.mirats_status === 236
        ) {
          setErrCodeAndMsg(
            236,
            "EU-based respondent terminated when they did not consent to GDPR"
          );
          return;
        } else if (session.data()?.gdpr_consent) {
          history.goBack();
        }
        if (sessionID && gdprConsent != null) {
          const body = {
            mirats_status: !gdprConsent ? 236 : 0,
            gdpr_consent: !gdprConsent ? false : true,
          };
          await updateSession(surveyID, sessionID, gamma, body);
          if (gdprConsent) {
            getQuestions();
            history.push(`/blaze/${encryptedID}/questions/42`);
          } else {
            if (gamma === "alpha")
              history.push(`/blaze/${encryptedID}/preRedirecturl/gdpr`);
            else
              setErrCodeAndMsg(
                36,
                "EU-based respondent terminated when they did not consent to GDPR"
              );
          }
        }
      } catch (err) {
        console.log(err);
      }
    };

    func();
  }, [gdprConsent, sessionID]);

  // fetch the survey
  useEffect(() => {
    getSurvey(surveyID).then((data) => setSurvey(data));
  }, [surveyID]);
  const value = { setGdprConsent, errCode, errMsg, survey };
  return <GdprContext.Provider value={value}>{children}</GdprContext.Provider>;
};
export default GdprCotextProvider;
