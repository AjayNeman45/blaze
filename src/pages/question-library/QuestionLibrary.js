import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/header/Header";
import { useQualificationsContext } from "../qualifications/QualificationsContext";
import styles from "./QuestionLibrary.module.css";
import { Box, styled } from "@mui/system";
import { useQualificationLibraryContext } from "./QuestionLibraryContext";
import { v4 as uuid } from "uuid";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Pagination,
  Stack,
  TablePagination,
} from "@mui/material";
import TablePaginationUnstyled from "@mui/base/TablePaginationUnstyled";
import CreateQualifications from "./CreateQualifications/CreateQualifications";
import countryList from "react-select-country-list";
import { default as MuiSelect } from "@mui/material/Select";
import SnackbarMsg from "../../components/Snackbar";
import EditQualification from "./EditQualifications/EditQualification";
import { MdDeleteOutline } from "react-icons/md";

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
  const [filtersApplied, setFiltersApplied] = useState({
    status: "all",
    question_type: "all",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [selectedQues, setSelectedQues] = useState([]);
  const [selectedQueCnt, setSelectedQueCnt] = useState(0);
  const [editQueModal, setEditQueModal] = useState(false);
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);

  useEffect(() => {
    setAllQuestions([]);
    setAllQuestionsCopy([]);
    questions?.map((que) => {
      Object.keys(que?.lang)?.map((key) => {
        let body = {
          ...que?.lang[key],
          lang: key,
          is_core_demographic: que?.is_core_demographic,
          name: que?.name,
          question_id: que?.question_id,
          question_type: que?.question_type,
          question_status: que?.question_status,
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

    setAllQuestions(allQuestionsCopy);

    allQuestionsCopy?.filter((que) => {
      if (que?.name.toLowerCase() === value) {
        filteredQue.unshift(que);
      } else if (que?.question_text.includes(value)) {
        filteredQue.push(que);
      }
    });
    setAllQuestions(filteredQue);
  }

  useEffect(() => {
    setAllQuestions(allQuestionsCopy);

    Object.keys(filtersApplied)?.map((filter) => {
      if (filtersApplied[filter] === "all") return;
      switch (filter) {
        case "status":
          setAllQuestions((prevQues) => {
            return prevQues?.filter((que) => {
              if (que?.question_status === filtersApplied?.status) {
                return que?.question_status;
              }
            });
          });
          break;
        case "question_type":
          setAllQuestions((prevQues) => {
            return prevQues?.filter((que) => {
              if (que?.question_type === filtersApplied?.question_type) {
                return que?.question_status;
              }
            });
          });
          break;
        default:
          return;
      }
    });

    allQuestions?.map((que) => {
      Object.keys(filtersApplied)?.map((filter) => {});
    });
  }, [filtersApplied]);

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <>
      <SnackbarMsg
        msg={snackbarData?.msg}
        severity={snackbarData?.severity}
        open={snackbarData?.show}
        handleClose={handleCloseSnackbar}
      />

      {/* for creating qualification  */}
      <CreateQualifications
        openModal={addQualModal}
        setOpenModal={setAddQualModal}
      />

      {/* for editing qualifications  */}
      {editQueModal ? (
        <EditQualification
          open={editQueModal}
          handleClose={() => setEditQueModal(false)}
          defaultData={selectedQues}
          setSelectedQueCnt={setSelectedQueCnt}
          setSelectedQues={setSelectedQues}
        />
      ) : null}

      {deleteConfirmationModal ? (
        <DeleteConfirmModal
          open={deleteConfirmationModal}
          handleCloseDeleteModal={() => setDeleteConfirmationModal(false)}
          data={selectedQues}
          setSelectedQueCnt={setSelectedQueCnt}
          setSelectedQues={setSelectedQues}
        />
      ) : null}

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
          <div className={styles.left}>
            <FormControl sx={{ width: "200px" }}>
              <InputLabel id="demo-simple-select-label">status</InputLabel>
              <MuiSelect
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={filtersApplied?.status}
                label="status"
                onChange={(e) => {
                  setFiltersApplied((prevData) => {
                    return {
                      ...prevData,
                      status: e.target.value,
                    };
                  });
                }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </MuiSelect>
            </FormControl>
            &nbsp; &nbsp; &nbsp;
            <FormControl sx={{ width: "200px" }}>
              <InputLabel id="demo-simple-select-label">
                Question Type
              </InputLabel>
              <MuiSelect
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={filtersApplied?.question_type}
                label="Question Type"
                onChange={(e) => {
                  setFiltersApplied((prevData) => {
                    return {
                      ...prevData,
                      question_type: e.target.value,
                    };
                  });
                }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="Single Punch">Single Punch</MenuItem>
                <MenuItem value="Multi Punch">Multi Punch</MenuItem>
                <MenuItem value="Numeric - Open-end">
                  Numeric - Open-end
                </MenuItem>
                <MenuItem value="Text - Open-end">Text - Open-end</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>
          <input
            className={styles.question_search_input}
            type="search"
            placeholder="search question library"
            onChange={(e) => handleTableInputSearch(e)}
          />
        </div>

        <div style={{ overflowX: "auto" }} className={styles.project_table_div}>
          <table className="project_table" id="qualification_table">
            <thead>
              <tr className={styles.cell_large}>
                <th>
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
                  <td className={styles.table_first_column}>
                    <input
                      type="checkbox"
                      name="firstCol"
                      checked={selectedQues.includes(
                        que?.lang + que?.question_id
                      )}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedQueCnt((preNum) => preNum + 1);
                          setSelectedQues((prevData) => [
                            ...prevData,
                            que?.lang + que?.question_id,
                          ]);
                        } else {
                          setSelectedQueCnt((preNum) => preNum - 1);
                          setSelectedQues((prevData) => {
                            return prevData?.filter((id) => {
                              return id !== que?.lang + que?.question_id;
                            });
                          });
                        }
                      }}
                      id={que?.question_id}
                    />
                    <div className={styles.coldiv}>
                      <label className={styles.question_text}>
                        {que?.question_text}
                      </label>
                      <br />
                      <div>
                        <span>{que?.question_type}</span>
                        <span
                          className={
                            que?.question_status === "active"
                              ? styles.active_question_tag
                              : styles.inactive_question_tag
                          }
                        >
                          {que?.question_status === "active"
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span style={{ fontWeight: "bold" }}>{que?.name}</span>
                  </td>
                  {/* <td>{project.completes}</td> */}
                  <td>
                    <span> {que?.question_status ? "Active" : "Inactive"}</span>
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

      {/* edit / delete footer popup  */}
      {selectedQueCnt ? (
        <div className={styles.delete_edit_popup}>
          <p className={styles.selected_grps_cnt}>{selectedQueCnt}</p>
          <button
            onClick={() => {
              setDeleteConfirmationModal(true);
            }}
          >
            Delete
          </button>
          {selectedQueCnt > 1 ? null : (
            <button
              onClick={() => {
                setEditQueModal(true);
              }}
            >
              Edit
            </button>
          )}
        </div>
      ) : null}
    </>
  );
};

const DeleteConfirmModal = ({
  open,
  handleCloseDeleteModal,
  data,
  setSelectedQueCnt,
  setSelectedQues,
}) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "white",
    borderRadius: "20px",
    boxShadow: 24,
    p: 4,
  };

  const { handleQualificationDelete } = useQualificationLibraryContext();
  return (
    <Modal
      open={open}
      onClose={handleCloseDeleteModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div className={styles.confirmDelete_Modal}>
          <MdDeleteOutline fontSize={50} color={"#f15e5e"} />
          <p className={styles.modal_title}>Are you sure ? </p>
          <p className={styles.modal_text}>
            {" "}
            You want to delete following <br /> survey groups?
          </p>

          {data?.map((queID) => (
            <div className={styles.selected_dataContainer}>
              <sapn className={styles.selected_data}>{queID.slice(6)}</sapn>
            </div>
          ))}

          <div className={styles.btn_container}>
            <button onClick={handleCloseDeleteModal}>Cancel</button>
            <button
              className={styles.btn_active}
              onClick={() => {
                handleCloseDeleteModal();
                handleQualificationDelete(
                  data,
                  setSelectedQueCnt,
                  setSelectedQues
                );
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default QuestionLibrary;
