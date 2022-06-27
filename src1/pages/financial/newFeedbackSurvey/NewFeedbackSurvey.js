import React from "react";
import styles from "./feedbacksurvey.module.css";
const NewFeedbackSurvey = () => {
  return (
    <>
      <div className={styles.feedbackSurvey_container}>
        <div className={styles.create_invoiceContainer}>
          <p className={styles.invoice_title}>
            Create Invoice is not Available.{" "}
          </p>
          <h3 className={styles.invoice_paragraph}>
            You can’t create any Invoice as this project or it’s one of the
            survey is Live.
          </h3>
        </div>
      </div>
    </>
  );
};

export default NewFeedbackSurvey;
