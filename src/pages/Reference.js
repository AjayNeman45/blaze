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
import { hashids } from "../index";

const Reference = () => {
  const history = useHistory();
  const [gamma, setGamma] = useState(localStorage.getItem("gamma"));
  const [sessionID, setSessionID] = useState(
    localStorage.getItem("session_id")
  );
  const { encryptedID } = useParams();
  const surveyID = decryptText(encryptedID.split("-")[0]);

  useEffect(() => {
    setGamma(localStorage.getItem("gamma"));
    setSessionID(localStorage.getItem("session_id"));
  }, []);

  useEffect(() => {
    const body = {
      survey_start_time: new Date(),
    };
    updateSession(surveyID, sessionID, gamma, body)
      .then(() => {
        console.log("survey start time updated");
      })
      .catch((err) => console.log(err.message));

    getSurvey(surveyID)
      .then((data) => {
        getSessionBasedOnType(surveyID, sessionID, "Sessions").then(
          (sessionData) => {
            const x = data?.live_url?.split("[%rid%]")?.[0]
              ? data?.live_url?.split("[%rid%]")?.[0]
              : "";
            const y = data?.live_url?.split("[%rid%]")?.[1]
              ? data?.live_url?.split("[%rid%]")?.[1]
              : "";
            let url = x + sessionData.data()?.ref_id + y;
            window.location.href = url;
            // window.open(url, "_blank");
            // console.log(
            //   "endpoint is ",
            //   `https://mirats-blaze.netlify.app/7e08091a73b14e034889265e41ba796f91c766ad/${url}/10`
            // );
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
