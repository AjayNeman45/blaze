import React from "react";
import styles from "./globalredirects.module.css";

const completeredirect = [
  {
    title: "Complete Redirects",
    desc: "https://now.mirats.in/surveyInitiate/endRedirects/[%surveyNumber%]/redirect?PID=[%rid%]&status=complete",
  },
];

const terminateredirects = [
  {
    title: "Terminate Redirects",
    desc: "https://now.mirats.in/surveyInitiate/endRedirects/[%surveyNumber%]/redirect?PID=[%rid%]&status=complete",
  },
];

const qualityredirects = [
  {
    title: "Quality Terminate Redirects",
    desc: "https://now.mirats.in/surveyInitiate/endRedirects/[%surveyNumber%]/redirect?PID=[%rid%]&status=complete",
  },
];

const quotafullredirect = [
  {
    title: "Quotafull Redirects",
    desc: "https://now.mirats.in/surveyInitiate/endRedirects/[%surveyNumber%]/redirect?PID=[%rid%]&status=complete",
  },
];

const Globalredirects = () => {
  return (
    <div className={styles.globalredirectContainer}>
      {completeredirect.map((elem, i) => {
        return (
          <div className={styles.globalContent} key={i}>
            <h2>{elem.title}</h2>

            <div className={styles.globalBox}>
              <a href="#">{elem.desc}</a>
            </div>
          </div>
        );
      })}
      {terminateredirects.map((elem, i) => {
        return (
          <div className={styles.globalContent} key={i}>
            <h2>{elem.title}</h2>

            <div className={styles.globalBox}>
              <a href="#">{elem.desc}</a>
            </div>
          </div>
        );
      })}
      {qualityredirects.map((elem, i) => {
        return (
          <div className={styles.globalContent} key={i}>
            <h2>{elem.title}</h2>

            <div className={styles.globalBox}>
              <a href="#">{elem.desc}</a>
            </div>
          </div>
        );
      })}
      {quotafullredirect.map((elem, i) => {
        return (
          <div className={styles.globalContent} key={i}>
            <h2>{elem.title}</h2>

            <div className={styles.globalBox}>
              <a href="#">{elem.desc}</a>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Globalredirects;
