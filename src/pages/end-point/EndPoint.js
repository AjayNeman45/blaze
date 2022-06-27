import styles from "./EndPoint.module.css";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import { hashids } from "../../index";
import {
  getAllSessions,
  getSuppier,
  getSurvey,
  updateSession,
} from "../../utils/firebaseQueries";
import Logo from "../../assets/images/insights.png";

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
  // const [wrongIdMSg]
  const { id, status } = useParams();

  const decodedID = hashids.decode(id.includes("Test") ? id.split("-")[1] : id);
  useEffect(() => {
    if (!decodedID.length) {
      return;
    }
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
            sd?.supplier_account_id === decodedID[1] &&
            sd?.tid === decodedID[2]
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
                console.log("session updated with client response");
              })
              .catch((err) => console.log(err.message));

            getSurvey(decodedID[0]).then((res) => {
              res?.external_suppliers.map((supp) => {
                if (supp?.supplier_account_id === decodedID[1]) {
                  // if global redirects is false then redirect with static_redirect
                  if (!supp?.global_redirect) {
                    console.log("redirecting with static redirects");
                    RedirectFunction(
                      status,
                      supp?.static_redirects,
                      sd?.rid,
                      decodedID[0]
                    );
                  } else {
                    console.log("redirecting with global redirects");
                    getSuppier(decodedID[1]).then((data) => {
                      RedirectFunction(
                        status,
                        data?.global_redirects,
                        sd?.rid,
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

  console.log(
    !decodedID?.length
      ? "ID Dosen't exist in the database"
      : "tid exist in the db"
  );
  return (
    <>
      <div className={styles.header}>
        <div className={styles.left}>
          <a href="https://miratsinsights.com" target="_blank">
            <img src={Logo} alt="" />
          </a>
        </div>
        <div className={styles.right}>
          <ul>
            <li>
              <a
                className={styles.header_link}
                href="https://miratsinsights.com"
                target="_blank"
              >
                Corporate Website
              </a>
            </li>
            <li>
              <a
                className={styles.header_link}
                href="https://miratsquanto.com"
                target="_blank"
              >
                Mirats Quanto
              </a>
            </li>
            <li>
              <a
                className={styles.header_link}
                href="https://mail.google.com/mail/?view=cm&fs=1&to=support_globalsurvey@miratsinsights.com"
                target="_blank"
              >
                Support
              </a>
            </li>
            <li className={styles.apply_now_btn}>
              <a href="https://quanto.mirats.in" target="_blank">
                Apply Now
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.survey_complete_page}>
        <div className={styles.thank_you_container}>
          <h1 className={styles.title}>
            {(() => {
              switch (status) {
                case "10":
                  return "Thank you, this survey is now completed.";
                case "20":
                  return "Thank You. But  unfortunately the survey is terminated.";
                case "30":
                  return "Thank You. But  unfortunately the survey is terminated due to quality reasons.";
                case "40":
                  return "Thank You. But unfortunately the quota is full for the survey";
                default:
                  break;
              }
            })()}
          </h1>
          {/* <p className={styles.id_dosent_exist_msg}>
            {!decodedID?.length ? "ID Dosen't exist" : null}
          </p> */}
          <p className={styles.desc}>
            Thank you very much for your participation. Your points will credit
            in your account. We appreciate you inputs. In case of any issue
            you've faced during the survey or you want to submit feedback to our
            team, please email us at
          </p>
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=support_globalsurvey@miratsinsights.com"
            target="_blank"
            className={styles.mail_id}
          >
            support_globalsurvey@miratsinsights.com
          </a>
        </div>

        <div className={styles.middle_cards}>
          <a
            href="https://miratsquanto.com/join"
            target="_blank"
            className={styles.card1}
          >
            <p>Join Mirats Quanto panel to provide insights</p>
          </a>
          <a
            href="https://miratsquanto.com"
            target="_blank"
            className={styles.card2}
          >
            <p> Get rewards by providing your valuable insights</p>
          </a>
        </div>
        <div
          className={styles.thank_you_card}
          onClick={() => window.open("https://miratsinsights.com", "_blank")}
        >
          <p>
            {/* <a href='https://miratsinsights.com' target='_blank'> */}
            Thank you <br /> for your valuable insights.
            {/* </a> */}
          </p>
        </div>
      </div>
    </>
  );
};

export default EndPoint;

const RedirectFunction = (status, redirects, rid, surveyID) => {
  let x, y;
  switch (String(status)) {
    case "10":
      x = redirects?.complete;
      if (redirects?.complete.includes("surveyNumber")) {
        x = redirects?.complete.split("[%surveyNumber%]")[0] + surveyID;
      }
      y = x.split("[%rid%]")[0] + rid + x.split("[%rid%]")[1];
      break;
    case "20":
      x = redirects?.terminate;
      if (redirects?.terminate.includes("surveyNumber")) {
        x = redirects?.terminate.split("[%surveyNumber%]")[0] + surveyID;
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
  // window.location.href = y;
};
