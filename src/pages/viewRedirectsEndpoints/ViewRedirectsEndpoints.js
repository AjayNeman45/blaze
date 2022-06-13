import React from "react";
import styles from "./viewRedirects.module.css";
import Header from "../../components/header/Header";
import Subheader from "../../components/subheader/Subheader";
import SurveyInfo from "../../components/survey-info/SurveyInfo";
import { projectBaseURL } from "../../utils/commonData";
function ViewRedirectsEndpoints() {
  return (
    <>
      <Header />
      <Subheader />
      <SurveyInfo />
      <div className={styles.viewRedirects_section}>
        <h1>View Redirects/Endpoints</h1>
        <div className={styles.viewRedirects_container}>
          <p>Hi Team,</p>
          <p>
            I will be managing this project for you from our end. Please
            implement the below redirects and let us know if you face any issues
            in doing so.
          </p>

          <table className={styles.first_table}>
            <tr>
              <td>Complete</td>
              <td>
                <a>
                  {projectBaseURL}
                  /7e08091a73b14e034889265e41ba796f91c766ad/I%RID%]/10{" "}
                </a>{" "}
              </td>
            </tr>
            <tr>
              <td>Terminate</td>
              <td>
                <a>
                  {projectBaseURL}
                  /7e08091a73b14e034889265e41ba796f91c766ad/I%RID%]/20{" "}
                </a>{" "}
              </td>
            </tr>
            <tr>
              <td>Over-Quota</td>
              <td>
                <a>
                  {projectBaseURL}
                  /7e08091a73b14e034889265e41ba796f91c766ad/I%RID%]/30{" "}
                </a>{" "}
              </td>
            </tr>
            <tr>
              <td>Security Terminate / Sniff-outs</td>
              <td>
                <a>
                  {projectBaseURL}
                  /7e08091a73b14e034889265e41ba796f91c766ad/I%RID%]/40{" "}
                </a>{" "}
              </td>
            </tr>
          </table>
          <div className={styles.viewRedirects_container_note}>
            <p>
              Please ensure that you have to pass the respondent variable in
              place of xxxx. For example your passing variable is $PID$ then you
              need to enter the redirects like this for complete
              <span className={styles.yellow_highlighter}>
                {" "}
                {projectBaseURL}
                /7e0809la73b14e034889265e4lba796f91c766ad/SPID$/10
              </span>
            </p>
            <p>
              While we set this up, please provide confirmation on the following
              points so that we can best prepare for the successful delivery of
              this project.
              <br />{" "}
              <span className={styles.gray_highlighter}>
                Please Note - If you want to add more redirects, you can visit
                this page to get all the redirects where you can redirect our
                members.
              </span>
            </p>
          </div>
          <table className={styles.second_table}>
            <tr>
              <td>Field End Date</td>
              <td>When would you like to get out this on the field?</td>
            </tr>
            <tr>
              <td>Fielding Status</td>
              <td>Should we soft-launch this project or aim to close asap?</td>
            </tr>
          </table>
        </div>
      </div>
    </>
  );
}

export default ViewRedirectsEndpoints;
