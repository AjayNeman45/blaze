import React, { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import { useQualificationsContext } from "../qualifications/QualificationsContext";
import styles from "./QuestionLibrary.module.css";
import { styled } from "@mui/system";
import { useQualificationLibraryContext } from "./QuestionLibraryContext";
import { v4 as uuid } from "uuid";
import { Pagination, Stack, TablePagination } from "@mui/material";
import TablePaginationUnstyled from "@mui/base/TablePaginationUnstyled";

const QuestionLibrary = () => {
  const { questions } = useQualificationLibraryContext();
  const [allQuestions, setAllQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    console.log(questions[0]);
    questions?.map((que) => {
      Object.keys(que?.lang)?.map((key) => {
        setAllQuestions((prevData) => [
          ...prevData,
          {
            ...que?.lang[key],
            lang: key,
            is_core_demographic: que?.is_core_demographic,
            name: que?.name,
            question_id: que?.question_id,
            question_type: que?.question_type,
          },
        ]);
      });
    });
  }, [questions]);

  // Get current posts
  const indexOfLastPost = currentPage * rowsPerPage;
  const indexOfFirstPost = indexOfLastPost - rowsPerPage;
  const currentQuestions = allQuestions.slice(
    indexOfFirstPost,
    indexOfLastPost
  );

  function handleTableInputSearch(e) {
    var filter, table, tr, td, i, txtValue;
    filter = e.target.value.toUpperCase();
    table = document.getElementById("qualification_table");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[0];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };
  console.log(currentQuestions);

  return (
    <>
      <Header />
      <div className={styles.question_library_page}>
        <div className={styles.header_container}>
          <div className={styles.header_container_left}>
            <p className={styles.page_title}>Question Library</p>
          </div>
          <div className={styles.header_container_right}>
            <button className={styles.create_new_quali_btn}>
              Create New Qualification
            </button>
            <input
              className={styles.question_search_input}
              type="search"
              placeholder="search question library"
              onChange={handleTableInputSearch}
            />
          </div>
        </div>

        <div style={{ overflowX: "auto" }} className={styles.project_table_div}>
          <table className="project_table" id="qualification_table">
            <thead style={{ width: "100%" }}>
              <tr className={styles.cell_large}>
                <th style={{ width: "50%", textAlign: "center" }}>
                  Qualification Name
                  <p className="headingDescription">Question Type</p>
                </th>
                <th>Question</th>
                <th>status</th>
                <th>Question ID</th>
                <th>Is Core Demographic</th>
                <th>Country & Languagae</th>
              </tr>
            </thead>
            <tbody>
              {currentQuestions?.map((que) => (
                <tr className="dataRow" key={uuid()}>
                  <td
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      padding: "40px 20px",
                      width: "100%",
                    }}
                    className="project_table_first_col"
                  >
                    <input type="checkbox" value="Bike" id="vehicle1" />
                    <div className="coldiv">
                      <label
                        style={{
                          color: "black",
                          fontWeight: 100,
                          fontSize: "12px",
                        }}
                        htmlFor="vehicle1"
                      >
                        {que?.question_text}
                      </label>
                      <br />
                      <div className="project_id_and_internal_status">
                        <span>{que?.question_type}</span>

                        <span
                          style={{
                            fontSize: "10px",
                            color: "black",
                            fontWeight: "lighter",
                          }}
                          className={styles.active_question_tag}
                          // className={`survey_status_${project.internal_status} survey_status`}
                        >
                          {que?.status ? "Active" : "Disactive"}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span style={{ fontWeight: "bold" }}>{que?.name}</span>
                  </td>
                  {/* <td>{project.completes}</td> */}
                  <td>
                    <span> {que?.status ? "Active" : "Disactive"}</span>
                  </td>
                  <td>
                    {/* {project.IR} */}
                    <span>{que?.question_id}</span>
                  </td>
                  <td>
                    <span>{que?.is_core_demographic ? "Yes" : "No"}</span>
                  </td>
                  <td>
                    <span>{que?.lang}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination
            count={allQuestions?.length / rowsPerPage}
            page={currentPage}
            onChange={handleChange}
          />
        </div>
      </div>
    </>
  );
};

export default QuestionLibrary;
