import React from "react";
import Header from "../../components/header/Header";
import styles from "./SurveyGroups.module.css";

const SurveyGroups = () => {
  return (
    <>
      <Header />
      <div className={styles.survey_groups_page}>
        <div className={styles.header_container}>
          <div className={styles.header_container_left}>
            <p className={styles.page_title}>survey groups</p>
          </div>
          <div className={styles.header_container_right}>
            <button>add survey groups</button>
            <input type="search" placeholder="search survey groups" />
          </div>
        </div>

        <div
          style={{ overflowX: "auto", marginTop: "2rem" }}
          className={styles.project_table_div}
        >
          <table className="project_table" id="qualification_table">
            <thead style={{ width: "100%" }}>
              <tr className={styles.cell_large}>
                <th style={{ width: "50%", textAlign: "center" }}>
                  Name
                  <p className="headingDescription">survey group number</p>
                </th>
                <th>No of surveys included</th>
                <th>status</th>
                <th>Description</th>
                <th>Survey Group ID</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>

          {/* <Pagination
            count={allQuestions?.length / rowsPerPage}
            page={currentPage}
            onChange={handleChange}
          /> */}
        </div>
      </div>
    </>
  );
};

export default SurveyGroups;
