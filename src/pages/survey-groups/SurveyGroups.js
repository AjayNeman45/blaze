import React, { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import styles from "./SurveyGroups.module.css";
import { v4 as uuid } from "uuid";
import CreateSurveyGroupModal from "./CreateSurveyGroup/CreateSurveyGroupModal";
import { useSurveyGroupContext } from "./SurveyGroupContext";
import SnackbarMsg from "../../components/Snackbar";
import { useHistory } from "react-router-dom";
import { Tooltip } from "@nextui-org/react";
import { off } from "rsuite/esm/DOMHelper";
import { Box } from "@mui/system";
import { Modal } from "@mui/material";
import { MdDeleteOutline } from "react-icons/md";

const SurveyGroups = () => {
  const {
    addSurveyGrpModal,
    setAddSurveyGroupModal,
    snackbarData,
    handleCloseSnackbar,
    surveyGrps,
    handleSurveyGroupSearch,
  } = useSurveyGroupContext();

  const [selectedGrpsCnt, setSelectedGrpsCnt] = useState(0);
  const [selectedSurveyGrps, setSelectedSurveyGrps] = useState([]);
  const [deleteSurveyGrpModal, setDeleteSureveyGrpModal] = useState(false);
  const [checkRows, setCheckRows] = useState([]);

  const history = useHistory();

  const handleSelect = (e) => {
    if (e.target.checked) {
      // setCountCheckProjects(countCheckedProjects + 1);
      setCheckRows([...checkRows, e.target.name]);
    } else {
      // setCountCheckProjects(countCheckedProjects - 1);
      setCheckRows((checkRows) => {
        return checkRows.filter((row) => row != e.target.name);
      });
    }
  };

  useEffect(() => {
    document.querySelectorAll("tr").forEach((tr) => {
      const first_cell = tr.querySelector("td");
      if (
        checkRows?.includes(
          first_cell?.querySelector("input").getAttribute("name")
        )
      ) {
        tr.style.backgroundColor = "rgb(222, 222, 230)";
      } else {
        tr.style.backgroundColor = "";
      }
    });
  }, [checkRows]);
  return (
    <>
      {snackbarData?.show ? (
        <SnackbarMsg
          open={snackbarData?.show}
          msg={snackbarData?.msg}
          severity={snackbarData?.severity}
          handleClose={handleCloseSnackbar}
        />
      ) : null}

      {/* add survey group modal  */}
      {addSurveyGrpModal ? (
        <CreateSurveyGroupModal
          openModal={addSurveyGrpModal}
          setOpenModal={setAddSurveyGroupModal}
          surveyGrpNumber={checkRows}
          setSelectedGrpsCnt={setSelectedGrpsCnt}
          setSelectedSurveyGrps={setSelectedSurveyGrps}
        />
      ) : null}

      <Header />
      <div className={styles.survey_groups_page}>
        <div className={styles.header_container}>
          <div className={styles.header_container_left}>
            <p className={styles.page_title}>survey groups</p>
          </div>
          <div className={styles.header_container_right}>
            <button onClick={() => setAddSurveyGroupModal(true)}>
              Add Survey Groups
            </button>
            <input
              type="search"
              placeholder="search survey groups"
              onChange={handleSurveyGroupSearch}
            />
          </div>
        </div>

        <div
          style={{ overflowX: "auto", marginTop: "2rem" }}
          className={styles.project_table_div}
        >
          <table className={styles.survey_grp_table} id="survey_grp_table">
            <thead style={{ width: "100%" }}>
              <tr className={styles.cell_large}>
                <th>
                  Name
                  <p className="headingDescription">Survey Group Number</p>
                </th>
                <th>No of Surveys Included</th>
                <th>survey included</th>
                <th>Description</th>
                <th>SurveyGroup ID</th>
              </tr>
            </thead>
            <tbody>
              {surveyGrps?.map((sg) => {
                return (
                  <tr key={uuid()}>
                    <td className={styles.first_column}>
                      <input
                        type="checkbox"
                        // checked={selectedSurveyGrps.includes(
                        //   sg?.survey_group_number
                        // )}
                        checked={checkRows?.includes(
                          String(sg?.survey_group_number)
                        )}
                        name={sg?.survey_group_number}
                        onChange={
                          handleSelect
                          // (e) => {
                          //   if (e.target.checked) {
                          //     setSelectedGrpsCnt((preNum) => preNum + 1);
                          //     setSelectedSurveyGrps((prevData) => [
                          //       ...prevData,
                          //       sg?.survey_group_number,
                          //     ]);
                          //   } else {
                          //     setSelectedGrpsCnt((preNum) => preNum - 1);
                          //     setSelectedSurveyGrps((prevData) => {
                          //       return prevData?.filter((num) => {
                          //         return num !== sg?.survey_group_number;
                          //       });
                          //     });
                          //   }
                          // }
                        }
                      />
                      <div className={styles.first_col_container}>
                        <Tooltip content={<p>{sg?.survey_group_name}</p>}>
                          <p className={styles.survey_grp_name}>
                            {sg?.survey_group_name}
                          </p>
                        </Tooltip>

                        <div className={styles.survey_grp_no_and_status}>
                          <span>#{sg?.survey_group_number}</span>
                          <sapn
                            className={
                              sg?.survey_group_status
                                ? styles.active_survey_grp_status
                                : styles.inactive_survey_grp_status
                            }
                          >
                            {sg?.survey_group_status ? "Active" : "Inactive"}
                          </sapn>
                        </div>
                      </div>
                    </td>
                    <td>{sg?.surveys?.length}</td>
                    <td className={styles.survey_included_column}>
                      {[...sg?.surveys.slice(0, 3)].map((surveyID) => (
                        <span
                          className={styles.surveys_included_box}
                          onClick={() =>
                            history.push(`/surveys/dashboard/${surveyID}`)
                          }
                        >
                          {surveyID}
                        </span>
                      ))}
                      {sg?.surveys?.length > 3 && (
                        <Tooltip
                          content={<TooltipForSurveyID sids={sg?.surveys} />}
                          placement="right"
                        >
                          <span>+{sg?.surveys?.length - 3}</span>
                        </Tooltip>
                      )}
                    </td>
                    <td>
                      <p className={styles.description}>{sg?.description}</p>
                    </td>
                    <td>{sg?.survey_grp_id}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteConfirmModal
        open={deleteSurveyGrpModal}
        handleCloseDeleteModal={() => setDeleteSureveyGrpModal(false)}
        data={checkRows}
        setCheckRows={setCheckRows}
      />

      {/* edit / delete footer popup  */}
      {checkRows?.length ? (
        <div className={styles.delete_edit_popup}>
          <p className={styles.selected_grps_cnt}>{checkRows?.length}</p>
          <button onClick={() => setDeleteSureveyGrpModal(true)}>Delete</button>
          {checkRows?.length > 1 ? null : (
            <button onClick={() => setAddSurveyGroupModal(true)}>Edit</button>
          )}
        </div>
      ) : null}
    </>
  );
};

const TooltipForSurveyID = ({ sids }) => {
  return (
    <>
      {[...sids.slice(3, sids.length)].map((sid) => {
        return <p>{sid}</p>;
      })}
    </>
  );
};

const DeleteConfirmModal = ({
  open,
  handleCloseDeleteModal,
  data,
  setCheckRows,
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

  const { handleDeleteSurveyGrps } = useSurveyGroupContext();
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

          {data?.map((sg) => (
            <div className={styles.selected_dataContainer}>
              <sapn className={styles.selected_data}>{sg}</sapn>
            </div>
          ))}

          <div className={styles.btn_container}>
            <button onClick={handleCloseDeleteModal}>Cancel</button>
            <button
              className={styles.btn_active}
              onClick={() => {
                handleCloseDeleteModal();
                handleDeleteSurveyGrps(data, setCheckRows);
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

export default SurveyGroups;
