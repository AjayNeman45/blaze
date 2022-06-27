import React, { useState, useEffect } from "react";
import styles from "./surveydashboardinfo.module.css";
import {
  addSurvey,
  getAllSurveys,
  getSurvey,
  updateSurvey,
} from "../../../../utils/firebaseQueries";
import {
  FormControl,
  MenuItem,
  Modal,
  Select,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { Box } from "@mui/system";
function SurveyDashboardInfo() {
  const { surveyID } = useParams();

  const [survey, setSurvey] = useState({});
  const [surveyStatus, setSurveyStatus] = useState("");
  const [changedSurveyName, setChangeSurveyName] = useState("");
  const [newSurveyName, setNewSurveyName] = useState();

  useEffect(() => {
    getSurvey(surveyID)
      .then((data) => {
        setSurvey(data);
        setSurveyStatus(data?.status);
        setChangeSurveyName(data?.survey_name);
        setNewSurveyName(data?.survey_name);
      })
      .catch((err) => console.log(err.message));
  }, []);

  return <></>;
}

//change Name Model
const NameModal = ({
  title,
  changeName,
  setChangeName,
  handleSaveBtn,
  openModal,
  setOpenModal,
}) => {
  const [prevName, setPrevName] = useState(changeName);
  const [disabledSaveBtn, setDisabledSaveBtn] = useState(true);

  const handleChange = (e) => {
    setChangeName(e.target.value);
    if (e.target.value && e.target.value !== prevName) {
      setDisabledSaveBtn(false);
    } else {
      setDisabledSaveBtn(true);
    }
  };

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

  return (
    <Modal
      open={openModal}
      onClose={() => setOpenModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <h3>{title}</h3> <br />
        <form onSubmit={handleSaveBtn}>
          <input
            type="text"
            value={changeName}
            className={styles.change_survey_name_input}
            onChange={handleChange}
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
                setOpenModal(false);
                setDisabledSaveBtn(true);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default SurveyDashboardInfo;
