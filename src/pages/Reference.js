import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Loader from "../components/loader/Loader";
import { decryptText } from "../utils/enc-dec.utils";
import {
  getSessionBasedOnType,
  getSessionID,
  getSurvey,
  updateSession,
} from "../utils/firebaseQueries";

const Reference = () => {
  const history = useHistory();
  const [gamma, setGamma] = useState(localStorage.getItem("gamma"));
  const [sessionID, setSessionID] = useState(
    localStorage.getItem("session_id")
  );
  const { encryptedID } = useParams();
  const surveyID = decryptText(encryptedID.split("-")[0]);
  console.log(decryptText(encryptedID.split("-")[2]));

  useEffect(() => {
    setGamma(localStorage.getItem("gamma"));
    setSessionID(localStorage.getItem("session_id"));
  }, []);

  useEffect(() => {
    const body = {
      survey_start_time: new Date(),
    };
    console.log(surveyID, sessionID, gamma, body);
    updateSession(surveyID, sessionID, gamma, body)
      .then(() => {
        console.log("survey start time updated");
      })
      .catch((err) => console.log(err.message));

    getSurvey(surveyID)
      .then((data) => {
        getSessionBasedOnType(surveyID, sessionID, "Sessions").then(
          (sessionData) => {
            console.log(sessionData.data());
            const x = data?.live_url.split("[%rid%]")[0];
            const y = data?.live_url.split("[%rid%]")[1];
            let z = x + sessionData.data()?.ref_id + y;
            console.log(z);
            window.location.href(z);
          }
        );
      })
      .catch((err) => console.log(err.message));
  }, []);

  return (
    <>
      <Loader msg="reference" />
    </>
  );
};

export default Reference;
