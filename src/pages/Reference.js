import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/loader/Loader";
import { decryptText } from "../utils/enc-dec.utils";
import { updateSession } from "../utils/firebaseQueries";

const Reference = () => {
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
  }, []);
  return (
    <>
      <Loader msg="reference" />
    </>
  );
};

export default Reference;
