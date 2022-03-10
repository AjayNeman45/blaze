import React from "react";
import MiratsQuantoHeader from "../MiratsQuatoHeader/MiratsQuantoHeader";
import styles from "./ThankYouPage.module.css";

const ThankYouPage = () => {
  return (
    <>
      <MiratsQuantoHeader />
      <div className={styles.survey_complete_page}>
        <div className={styles.thank_you_container}>
          <h1 className={styles.title}>
            Thank you, this survey is now completed.
          </h1>
          <p className={styles.desc}>
            This survey is completed, thank you very much for your
            participation. Your points will credit in your account. We
            appreciate you inputs. Thank you very much. In case of any issue
            you've faced during the survey or you want to submit feedback to our
            team, please email us at
          </p>
          <a href="#" className={styles.mail_id}>
            support_globalsurvey@miratsinsights.com
          </a>
        </div>

        <div className={styles.middle_cards}>
          <div className={styles.card1}>
            <p>Join Mirats Quanto panel to provide insights</p>
          </div>
          <div className={styles.card2}>
            <p>Get rewards by providing your valuable insights.</p>
          </div>
        </div>
        <div className={styles.thank_you_card}>
          <p>
            Thank you <br /> for your valuable insights.
          </p>
        </div>
      </div>
    </>
  );
};

export default ThankYouPage;
