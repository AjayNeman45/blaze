import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/header/Header";
import { useQualificationsContext } from "../qualifications/QualificationsContext";
import styles from "./QuestionLibrary.module.css";
import { styled } from "@mui/system";
import { useQualificationLibraryContext } from "./QuestionLibraryContext";
import { v4 as uuid } from "uuid";
import { Pagination, Stack, TablePagination } from "@mui/material";
import TablePaginationUnstyled from "@mui/base/TablePaginationUnstyled";
import CreateQualifications from "./CreateQualifications/CreateQualifications";
import countryList from "react-select-country-list";
import Select from "react-select";
import SnackbarMsg from "../../components/Snackbar";

const countrySelectStyle = {
  menu: (provided, state) => ({
    ...provided,
    width: "10rem",
    borderBottom: "1px dotted pink",
    color: state.selectProps.menuColor,
  }),
  control: (styles) => ({
    ...styles,
    width: "10rem",
    border: "1px solid gray",
  }),
  input: (styles) => ({
    ...styles,
    height: "38px",
  }),
  option: (styles) => ({
    ...styles,
  }),
};

const QuestionLibrary = () => {
  const {
    questions,
    addQualModal,
    setAddQualModal,
    snackbarData,
    handleCloseSnackbar,
  } = useQualificationLibraryContext();
  const [allQuestions, setAllQuestions] = useState([]);
  const [allQuestionsCopy, setAllQuestionsCopy] = useState([]);
  const [filtersApplied, setFiltersApplied] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const countries = useMemo(() => countryList().getData(), []);

  useEffect(() => {
    console.log(questions[0]);
    questions?.map((que) => {
      Object.keys(que?.lang)?.map((key) => {
        let body = {
          ...que?.lang[key],
          lang: key,
          is_core_demographic: que?.is_core_demographic,
          name: que?.name,
          question_id: que?.question_id,
          question_type: que?.question_type,
        };
        setAllQuestions((prevData) => [...prevData, { ...body }]);
        setAllQuestionsCopy((prevData) => [...prevData, { ...body }]);
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
    let value = e.target.value.toLowerCase();
    let filteredQue = [];

    allQuestionsCopy?.map((que) => {
      if (que?.question_text.toLowerCase().includes(value)) {
        filteredQue.push(que);
      }
    });

    setAllQuestions(filteredQue);
    // var filter, table, tr, td, i, txtValue;
    // filter = e.target.value.toUpperCase();
    // table = document.getElementById("qualification_table");
    // tr = table.getElementsByTagName("tr");
    // for (i = 0; i < tr.length; i++) {
    //   td = tr[i].getElementsByTagName("td")[0];
    //   if (td) {
    //     txtValue = td.textContent || td.innerText;
    //     if (txtValue.toUpperCase().indexOf(filter) > -1) {
    //       tr[i].style.display = "";
    //     } else {
    //       tr[i].style.display = "none";
    //     }
    //   }
    // }
  }

  useEffect(() => {
    // allQuestionsCopy?.map((que) => {
    //   Object.keys(filtersApplied)?.map((filter) => {
    //     switch (filter) {
    //       case "question_text":
    //         filteredQue.push(que);
    //     }
    //   });
    // });
  }, [filtersApplied]);

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  console.log(filtersApplied);

  return (
    <>
      <SnackbarMsg
        msg={snackbarData?.msg}
        severity={snackbarData?.severity}
        open={snackbarData?.show}
        handleClose={handleCloseSnackbar}
      />
      <CreateQualifications
        openModal={addQualModal}
        setOpenModal={setAddQualModal}
      />
      <Header />
      <div className={styles.question_library_page}>
        <div className={styles.header_container}>
          <div className={styles.header_container_left}>
            <p className={styles.page_title}>Question Library</p>
          </div>
          <div className={styles.header_container_right}>
            <button
              className={styles.create_new_quali_btn}
              onClick={() => setAddQualModal(true)}
            >
              Create New Qualification
            </button>
          </div>
        </div>
        <div className={styles.filters_container}>
          {/* <select
            onChange={(e) => {
              setFiltersApplied((prevData) => {
                return {
                  ...prevData,
                  status: e.target.value,
                };
              });
            }}
          >
            <option selected disabled hidden>
              status
            </option>
            <option value="active">Active</option>
            <option value="inactive">In Active</option>
          </select> */}
          {/* <select
            onChange={(e) => {
              setFiltersApplied((prevData) => {
                return {
                  ...prevData,
                  question_type: e.target.value,
                };
              });
            }}
          >
            <option selected disabled hidden>
              Question Type
            </option>
            <option>Single Punch</option>
            <option>Multi Punch</option>
            <option>Numeric - Open-end</option>
            <option>Text - Open-end</option>
          </select> */}
          {/* <Select
            options={countries}
            styles={countrySelectStyle}
            onChange={(e) => {
              setFiltersApplied((prevData) => {
                return {
                  ...prevData,
                  country: e.value,
                };
              });
            }}
          /> */}
          {/* <select
            onChange={(e) => {
              setFiltersApplied((prevData) => {
                return {
                  ...prevData,
                  language: e.target.value,
                };
              });
            }}
          >
            <option selected disabled hidden>
              Language
            </option>
            <option value="ENG">English</option>
            <option value="FRA">French</option>
            <option value="GER">German</option>
            <option value="JPN">Japanese</option>
            <option value="ESP">Spanish</option>
          </select> */}
          <input
            className={styles.question_search_input}
            type="search"
            placeholder="search question library"
            onChange={(e) => handleTableInputSearch(e)}
          />
        </div>

        <div style={{ overflowX: "auto" }} className={styles.project_table_div}>
          <table className="project_table" id="qualification_table">
            <thead style={{ width: "100%" }}>
              <tr className={styles.cell_large}>
                <th
                  style={{
                    width: "50%",
                    textAlign: "center",
                  }}
                >
                  Qualification Text
                  <p className="headingDescription">Question Type</p>
                </th>
                <th>Question Name</th>
                <th>status</th>
                <th>Question ID</th>
                <th>Is Core Demographic</th>
                <th>Country & Language</th>
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
                    <input
                      type="checkbox"
                      name="firstCol"
                      value={que?.question_id}
                      id={que?.question_id}
                    />
                    <div className="coldiv">
                      <label
                        style={{
                          color: "black",
                          fontWeight: 100,
                          fontSize: "12px",
                        }}
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
                          {que?.status ? "Active" : "Inactive"}
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
