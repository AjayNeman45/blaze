import { normalWeights } from "@nextui-org/react";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import { hashids } from "../../index";
import {
  getAllSessions,
  getAllTestSessions,
  getSessionBasedOnType,
  getSuppier,
  getSurvey,
  updateSession,
} from "../../utils/firebaseQueries";

function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100);
  var seconds = Math.floor((duration / 1000) % 60);
  var minutes = Math.floor((duration / (1000 * 60)) % 60);
  var hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds + ":" + milliseconds;
}

const EndPoint = () => {
  const history = useHistory();
  const [staticRedirectUrl, setStaticRedirectUrl] = useState();
  const { id, status } = useParams();

  const decodedID = hashids.decode(id.includes("Test") ? id.split("-")[1] : id);
  useEffect(() => {
    let gamma = ""; // flag = true means the id does not contain Test word
    if (id.includes("Test")) {
      gamma = "alpha";
    }

    // getting appropriate session and inserting client status, survey_end_time and all other details
    getAllSessions(decodedID[0], gamma)
      .then((sessions) => {
        sessions.forEach((session) => {
          const sd = session.data(); // session data
          if (
            sd.supplier_account_id === decodedID[1] &&
            sd.rid === decodedID[2]
          ) {
            const total_survey_time = msToTime(
              new Date() - sd.survey_start_time.toDate()
            );
            const body = {
              survey_end_time: new Date(),
              total_survey_time,
              client_status: parseInt(status),
              is_reconciled: false,
            };
            updateSession(decodedID[0], session.id, gamma, body)
              .then(() => {
                console.log("session updated");
              })
              .catch((err) => console.log(err.message));

            getSurvey(decodedID[0]).then((res) => {
              res?.external_suppliers.map((supp) => {
                if (supp?.supplier_account_id === decodedID[1]) {
                  console.log("supplier found..!");

                  // if global redirects is false then redirect with static_redirect
                  if (!supp?.global_redirect) {
                    RedirectFunction(
                      status,
                      supp?.static_redirect,
                      decodedID[2],
                      decodedID[0]
                    );
                  } else {
                    getSuppier(decodedID[1]).then((data) => {
                      RedirectFunction(
                        status,
                        data?.global_redirects,
                        decodedID[2],
                        decodedID[0]
                      );
                    });
                  }
                }
              });
            });
          }
        });
      })
      .catch((err) => console.log(err.message));
  }, [decodedID]);

  return <div>EndPoint</div>;
};

export default EndPoint;

const RedirectFunction = (status, redirects, rid, surveyID) => {
  console.log(surveyID);
  let x, y;
  switch (String(status)) {
    case "10":
      x = redirects?.complete;
      if (redirects?.complete.includes("surveyNumber")) {
        x = redirects?.complete.split("[%surveyNumber%]")[0] + surveyID;
      }
      console.log(x);
      y = x.split("[%rid%]")[0] + rid + x.split("[%rid%]")[1];
      break;
    case "20":
      x = redirects?.terminate;
      if (redirects?.complete.includes("surveyNumber")) {
        x = redirects?.complete.split("[%surveyNumber%]")[0] + surveyID;
      }

      y = x.split("[%rid%]")[0] + rid + x.split("[%rid%]")[1];
      break;
    case "30":
      if (redirects?.hasOwnProperty("quality_terminate")) {
        x = redirects?.quality_terminate;
        if (redirects?.quality_terminate.includes("surveyNumber")) {
          x =
            redirects?.quality_terminate.split("[%surveyNumber%]")[0] +
            surveyID;
        }
        y = x.split("[%rid%]")[0] + rid + x.split("[%rid%]")[1];
      } else {
        x = redirects?.terminate;
        if (redirects?.terminate.includes("surveyNumber")) {
          x = redirects?.terminate.split("[%surveyNumber%]")[0] + surveyID;
        }
        y = x.split("[%rid%]")[0] + rid + x.split("[%rid%]")[1];
      }
      break;
    case "40":
      x = redirects?.quota_full;
      if (redirects?.quota_full.includes("surveyNumber")) {
        x = redirects?.quota_full.split("[%surveyNumber%]")[0] + surveyID;
      }
      y = x.split("[%rid%]")[0] + rid + x.split("[%rid%]")[1];
      break;
    default:
      return;
  }
  console.log(y);
};
