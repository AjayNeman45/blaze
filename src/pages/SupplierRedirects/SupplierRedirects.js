import React from "react";
import styles from "./supplierRedirects.module.css";

function SupplierRedirects() {
  return (
    <div className={styles.supplierRedirects_container}>
 
      <div className={styles.supplierRedirects_logo}>
        <img src="https://www.miratsinsights.com/logo/transparent/black_rect.png" alt="logo" />
      </div>
      <div className={styles.supplierRedirects}>
        <h1>Supplier Redirects. </h1>{" "}
      </div>

      <div className={styles.supplierRedirects_text}>
        <p> Hi Team,</p>
        <p>
          {" "}
          I will be managing this project for you from our end. Please implement
          the below redirects and let us know if you face any issues in doing
          so.
        </p>
    
     
        <table>
          <tr>
            <td> Complete</td>
            <td>
              {" "}
              https://now.mirats.in/surveyInitiate/redirect?SSID=vkmIg2z7be6tqOlUn2K2&MIRATS_STATUS=3&C_STATUS=10&PID=[xxxx]
            </td>
          </tr>
          <tr>
            <td> Terminate</td>
            <td>
              https://now.mirats.in/surveyInitiate/redirect?SSID=vkmIg2z7be6tqOlUn2K2&MIRATS_STATUS=3&C_STATUS=20&PID=[xxxx]
            </td>
          </tr>
          <tr>
            <td> Over-Quota</td>
            <td>
              https://now.mirats.in/surveyInitiate/redirect?SSID=vkmIg2z7be6tqOlUn2K2&MIRATS_STATUS=3&C_STATUS=40&PID=[xxxx]
            </td>
          </tr>
          <tr>
            <td>Security Terminate / Sniff-outs</td>
            <td>
              https://now.mirats.in/surveyInitiate/redirect?SSID=vkmIg2z7be6tqOlUn2K2&MIRATS_STATUS=3&C_STATUS=30&PID=[xxxx]
            </td>
          </tr>
        </table>

          <p className={styles.italic_text}>
            Please ensure that you have to pass the respondent variable in place
            of <span className={styles.highlight_text}>[xxxx] </span>  or you need to pass the variable after <span className={styles.highlight_text}>&PID= </span> 
          </p>
          <p>
            {" "}
            While we set this up, please provide confirmation on the following
            points so that we can best prepare for the successful delivery of
            this project.
          </p>
      
       
            <table className={styles.table2}> 
                <tr> 
                    <td className={styles.black_cell}>
                    Field End Date
                    </td>
                    <td> 
                    When would you like to get out this on the field?
                    </td>
                </tr>
                <tr>
                    <td className={styles.black_cell}>
                    Fielding Status
                    </td>
                    <td>
                    Should we soft-launch this project or aim to close asap?
                    </td>
                </tr>
            </table>
            </div>
      </div>
       
  );
}

export default SupplierRedirects;
