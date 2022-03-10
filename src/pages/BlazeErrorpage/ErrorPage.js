import React from "react";
import styles from "./ErrorPage.module.css";
import Logo from "../../assets/images/insights.png";
import khaby_lame from "../../assets/images/khaby_lame.png";
function ErrorPage() {
  return (
    <>
      <div className={styles.container}>
        {/* <h1>Hi</h1> */}
        <div className={styles.errorcard}>
          <div className={styles.leftcontainer}>
            <img src={Logo} alt="" className={styles.logo} />
            <p className={styles.legend1}>Something Went Wrong,</p>
            <p className={styles.legend2}>You Lost in space.</p>
            <p className={styles.error_msg}>
              Khaby is showing you some error messages.
            </p>
            <a
              href="support_globalsurveys@miratsinsights.com"
              className={styles.email_link}
            >
              support_globalsurveys@miratsinsights.com
            </a>
            <br />
            <button className={styles.contact_support_btn}>
              Contact Support
            </button>
          </div>
          <div className={styles.rightcontainer}>
            <img src={khaby_lame} alt="" />
            <p className={styles.four_four}>404</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default ErrorPage;
