import React from "react";
import ErrSvg from "../ErrSvg";
import { AiOutlineCopyrightCircle } from "react-icons/ai";
import styles from "./ErrorPage.module.css";
const ErrorPage = ({ errCode, errMsg }) => {
  return (
    <div className={styles.err_page}>
      <div style={{ display: "flex", marginTop: "12rem" }}>
        <span className={styles.err_code}>{errCode}</span>
        <div
          style={{
            width: "30vw",
            marginTop: "-12rem",
          }}
        >
          <ErrSvg />
        </div>
      </div>

      <div className={styles.error}>
        <p
          className={styles.err_desc}
          dangerouslySetInnerHTML={{ __html: errMsg }}
        ></p>
      </div>
      <div className={styles.powered_text}>
        <span>Copyright</span> &nbsp;
        <AiOutlineCopyrightCircle size={17} /> &nbsp; 2021 by &nbsp;
        <span style={{ color: "tomato", fontSize: "16.5px" }}>
          Mirats Insights
        </span>
      </div>
      <div className={styles.terms}>
        <span>
          <a href="#">Privacy Policy</a> | <a href="#">General Terms</a>
        </span>
      </div>
    </div>
  );
};

export default ErrorPage;
