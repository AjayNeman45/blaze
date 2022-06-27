import React from "react";
import styles from "./biddingquota.module.css";
import Header from "../../components/header/Header";
import Subheader from "../../components/subheader/Subheader";
import SurveyInfo from "../../components/survey-info/SurveyInfo";
function BiddingQuota() {
  return (
    <>
      <Header />
      <Subheader />
      <SurveyInfo />
      <div className={styles.container}>
        <div className={styles.title}>
          <h1>Bidding Quota</h1>
        </div>
        <div className={styles.description}>
          <p>Hi [client_name]</p>
          <p>
            Thankyou for sending your request to Mirats. Looping in our bids
            management team to get full coverage. <br />
            Below is the quote of the study. Let me know if you need anything
            else.
          </p>
          <table className={styles.first_table}>
            <tr>
              <th>Country</th>
              <th>LOI (average)</th>
              <th>IR (assumed)</th>
              <th>Target Audience</th>
              <th>Overall Sample</th>
              <th>Feasibility</th>
              <th>Timeline</th>
              <th>CPI</th>
              <th>Total Cost</th>
            </tr>
          </table>
          <p>
            While we are in the initial stage of setting up, please provide
            confirmation on the following points so that we can best prepare for
            the successfull delivery of this project
          </p>
          <table className={styles.second_table}>
            <tr>
              <td>Quotas</td>
              <td>Is there any quotas or profiling which we need to target</td>
            </tr>
            <tr>
              <td>Exclusion List</td>
              <td>
                Is there exclusion list or completes/terminates which you want
                to exclude the survey
              </td>
            </tr>
            <tr>
              <td>Personal Identifiable Information</td>
              <td>
                I am assuming there is no PII collection. Please confirm the
                same.
              </td>
            </tr>
            <tr>
              <td>Questionnare Availability</td>
              <td>
                Can you please share the screening criteria or questionnaire if
                available?
              </td>
            </tr>
            <tr>
              <td>Device Agnostic</td>
              <td>
                Is it going to run on all devices or any particular devices?
              </td>
            </tr>
            <tr>
              <td>Started Date</td>
              <td>When would you like us to start fielding the survey?</td>
            </tr>
          </table>
          <p style={{ marginBottom: "30px" }}>
            Please see the below points and keep a note of them --
          </p>
          <ul style={{ padding: "0 20px", fontStyle: "italic" }}>
            <li>
              If the Length of Interview (LOl) and/or the Incidence Rate (IR)
              changes by more than 25 percent during the project, this may
              affect the Cost Per Interview (CPI). A new CPI resulting from a
              change will be based on both the Actual LOl and Actual IR
              according to the rate card.{" "}
              <span className={styles.highlighter}>
                {" "}
                For example, if the Actual IR changes by more than 25 %, this
                will cause a reprice. The new CPI will be based on the Actual IR
                of 5 % and Actual LOl of 9min.
              </span>
            </li>
            <li>
              We expects our IDs within two weeks from the date of closing the
              fieldwork.
            </li>
            <li>
              Rejects on the basis of Non sensical responses can be reconciled
              at the end of the field, provided you can provide us with the full
              questionnaire of the study, as well as each rejected participant's
              complete participation data if rejected IDs are more than 10%, if
              not we will invoice for all completes registered at our end.
            </li>
            <li>
              Once the study link is closed, any erroneous data should be
              communicated to us within 4 days otherwise all interviews will be
              considered as correct and full project management and incentives
              will be charged for those interviews
            </li>
          </ul>
          <p style={{ marginTop: "30px" }}>
            {" "}
            <span className={styles.highlighter}>
              Please note that - Commissioning the study means vou are acceptina
              all the above terms & conditions.
            </span>{" "}
          </p>
        </div>
      </div>
    </>
  );
}

export default BiddingQuota;
