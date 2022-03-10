import React, { useEffect, useRef, useState } from "react";
import styles from "./SurveyInfo.module.css";
import { GoPrimitiveDot } from "react-icons/go";
import {
  FormControl,
  MenuItem,
  Modal,
  Select,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useParams } from "react-router-dom";
import { getSurvey, updateSurvey } from "../../utils/firebaseQueries";
import cx from "classnames";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  height: 250,
  bgcolor: "white",
  border: "none",
  outline: "none",
  borderRadius: "30px",
  boxShadow: 24,
  p: 4,
};

const options = [
  "Archieved",
  "Awarded",
  "Bidding",
  "Canceled Non chagred",
  "Canceled with charge",
  "complete",
  "Live",
  "paid",
  "pending",
  "ready to invoice",
  "Invoiced",
  "Titania",
  "Triton",
  "Umbriel",
];

function SurveyInfo() {
  const [openEditNameModal, setOpenEditNameModal] = useState(false);
  const [newSurveyName, setNewSurveyName] = useState();
  const [disabledSaveBtn, setDisabledSaveBtn] = useState(true);
  const [changedSurveyName, setChangeSurveyName] = useState();
  const { surveyID } = useParams();
  const [survey, setSurvey] = useState({});
  const handleEditSurveyNameModal = () => {
    setOpenEditNameModal(!openEditNameModal);
  };

  useEffect(() => {
    getSurvey(surveyID)
      .then((data) => {
        setSurvey(data);
        setChangeSurveyName(data?.survey_name);
        setNewSurveyName(data?.survey_name);
      })
      .catch((err) => console.log(err.message));
  }, []);

  const handleChangeSurveyNameBtn = () => {
    setOpenEditNameModal(false);
    const body = {
      survey_name: changedSurveyName,
    };
    updateSurvey(surveyID, body)
      .then(() => {
        console.log("survey name updated");
        setNewSurveyName(changedSurveyName);
      })
      .catch((err) => console.log(err.message));
  };

  console.log(survey.status);

  return (
    <>
      <div className={styles.survey_info_container}>
        <div className={styles.survey_info_left}>
          <div className={styles.survey_info_name}>
            <h1>{newSurveyName}</h1>
            <span
              className={styles.edit_btn}
              onClick={handleEditSurveyNameModal}
            >
              Edit
            </span>
          </div>

          <div className={styles.survey_info}>
            <span className={styles.title}>Project Number </span>
            <span className={styles.value}>{survey.project_id}</span>/
            <span className={styles.title}>Survey Number</span>
            <span className={styles.value}>{survey?.survey_id}/</span>
            <div className={styles.live}>
              <GoPrimitiveDot /> {survey?.status}
            </div>
          </div>
        </div>

        <div className={styles.survey_info_right}>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <Select
              onChange={(e) => console.log(e.target.value)}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              value={survey?.status}
              className={styles.status_select_field}
            >
              {options?.map((option) => (
                <MenuItem value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <select className={styles.action_select_field}>
            <option value="" disabled selected hidden>
              Action
            </option>
            <option>Test Survey</option>
            <option>Clone Survey</option>
            <option>Set External Name</option>
          </select>
        </div>
      </div>

      <Modal
        open={openEditNameModal}
        onClose={handleEditSurveyNameModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h3>Change Survey Name</h3> <br />
          <form onSubmit={handleChangeSurveyNameBtn}>
            <input
              type="text"
              value={changedSurveyName}
              className={styles.change_survey_name_input}
              onChange={(e) => {
                setChangeSurveyName(e.target.value);
                setDisabledSaveBtn(false);
              }}
            />
            <div className={styles.btns}>
              <button
                className={
                  disabledSaveBtn ? styles.deactivate_btn : styles.change_btn
                }
                disabled={disabledSaveBtn}
                type="submit"
              >
                Change
              </button>
              <button
                className={styles.cancel_btn}
                onClick={() => {
                  setOpenEditNameModal(false);
                  setChangeSurveyName(survey?.survey_name);
                  setDisabledSaveBtn(true);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </Box>
      </Modal>
    </>
  );
}

export default SurveyInfo;
