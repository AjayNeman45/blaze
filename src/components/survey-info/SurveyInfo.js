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
import {
  addSurvey,
  getAllSurveys,
  getSurvey,
  updateSurvey,
} from "../../utils/firebaseQueries";
import { v4 as uuid } from "uuid";
import SnackbarMsg from "../Snackbar";
import { setDoc } from "firebase/firestore";
import { encryptText } from "../../utils/enc-dec.utils";

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
  {
    label: "Archieved",
    value: "awarded",
  },
  {
    label: "Awarded",
    value: "awarded",
  },
  {
    label: "Bidding",
    value: "bidding",
  },
  {
    label: "Canceled Non charged",
    value: "canceled_non_charged",
  },
  {
    label: "Canceled with charge",
    value: "canceled_with_charge",
  },
  {
    label: "Complete",
    value: "complete",
  },
  {
    label: "Live",
    value: "live",
  },
  {
    label: "Paid",
    value: "paid",
  },
  {
    label: "Pending",
    value: "pending",
  },
  {
    label: "Ready to Invoice",
    value: " ready_to_invoice",
  },
  {
    label: "Invoiced",
    value: "invoiced",
  },
  {
    label: "Titanic",
    value: "titanic",
  },
  {
    label: "Triton",
    value: "triton",
  },
  {
    label: "Umbriel",
    value: "umbriel",
  },
];

function SurveyInfo() {
  const [openEditNameModal, setOpenEditNameModal] = useState(false);
  const [newSurveyName, setNewSurveyName] = useState();
  const [disabledSaveBtn, setDisabledSaveBtn] = useState(true);
  const [changedSurveyName, setChangeSurveyName] = useState("");
  const [setExternalSurveyName, setExternalProjectName] = useState("");
  const [surveyStatus, setSurveyStatus] = useState("");
  const [surveyAction, setSurveyAction] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [surveyCloneModal, setSurveyCloneModal] = useState(false);

  const handleSnackbar = () => {
    setOpenSnackbar(!openSnackbar);
  };

  const { surveyID } = useParams();
  const [survey, setSurvey] = useState({});
  const handleEditSurveyNameModal = () => {
    setSurveyAction("");
    setOpenEditNameModal(!openEditNameModal);
  };

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

  const handleChangeSurveyNameBtn = () => {
    setOpenEditNameModal(false);
    const body = {
      survey_name: changedSurveyName,
    };
    updateSurvey(surveyID, body)
      .then(() => {
        console.log("survey name updated");
        setSnackbarMsg("survey name is updated");
        handleSnackbar();
        setNewSurveyName(changedSurveyName);
      })
      .catch((err) => console.log(err.message));
  };
  const handleSetExternalSurveyNameBtn = () => {
    setOpenEditNameModal(false);
    const body = {
      external_survey_name: setExternalSurveyName,
    };
    updateSurvey(surveyID, body)
      .then(() => {
        setSnackbarMsg("External Name for the survey is updated");
        handleSnackbar();
        console.log("external project name updated");
      })
      .catch((err) => console.log(err.message));
  };
  const handleSurveyStatusChange = (e) => {
    setSurveyStatus(e.target.value);
  };

  useEffect(() => {
    let lastSurveyID = 0;
    let body = {};
    if (surveyAction === "clone_survey") {
      getAllSurveys().then((surveys) => {
        surveys.forEach((survey) => {
          if (parseInt(survey.id) > lastSurveyID) {
            lastSurveyID = parseInt(survey.id);
            body = survey.data();
          }
        });
        delete body?.external_suppliers;
        delete body?.changes;
        body.survey_id = lastSurveyID + 1;
        if (body?.encrypt?.sid !== encryptText(String(lastSurveyID + 1))) {
          console.log("different ids....");
        }
        body.encrypt.sid = encryptText(String(lastSurveyID + 1));
        // addSurvey(lastSurveyID + 1, body)
        //   .then(() => {
        //     setSurveyCloneModal(true);
        //     console.log("survey cloned successfully....");
        //   })
        //   .catch((err) => console.log(err.message));
      });
    }
  }, [surveyAction]);

  return (
    <>
      <SnackbarMsg
        msg={snackbarMsg}
        severity="success"
        open={openSnackbar}
        handleClose={handleSnackbar}
      />
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
              onChange={handleSurveyStatusChange}
              inputProps={{ "aria-label": "Without label" }}
              className={styles.status_select_field}
              value={surveyStatus}
            >
              {options?.map((option) => (
                <MenuItem value={option.value} key={uuid()}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <select
            className={styles.action_select_field}
            value=""
            onChange={(e) => {
              setOpenEditNameModal(true);
              setSurveyAction(e.target.value);
            }}
          >
            <option value="" disabled hidden>
              Action
            </option>
            <option value="test_survey">Test Survey</option>
            <option value="clone_survey">Clone Survey</option>
            <option value="set_external_name">Set External Name</option>
          </select>
        </div>
      </div>

      {surveyCloneModal && (
        <Modal>
          <Modal.Body>Survey clone successfully</Modal.Body>
        </Modal>
      )}

      {surveyAction === "set_external_name" ? (
        <NameModal
          title="Set External Project name"
          changeName={setExternalSurveyName}
          setChangeName={setExternalProjectName}
          disabledSaveBtn={disabledSaveBtn}
          setDisabledSaveBtn={setDisabledSaveBtn}
          openEditNameModal={openEditNameModal}
          setOpenEditNameModal={setOpenEditNameModal}
          handleSaveBtn={handleSetExternalSurveyNameBtn}
        />
      ) : (
        <NameModal
          title="Change Survey name"
          changeName={changedSurveyName}
          setChangeName={setChangeSurveyName}
          disabledSaveBtn={disabledSaveBtn}
          setDisabledSaveBtn={setDisabledSaveBtn}
          openEditNameModal={openEditNameModal}
          setOpenEditNameModal={setOpenEditNameModal}
          handleSaveBtn={handleChangeSurveyNameBtn}
        />
      )}
    </>
  );
}

const NameModal = ({
  title,
  changeName,
  setChangeName,
  disabledSaveBtn,
  setDisabledSaveBtn,
  openEditNameModal,
  setOpenEditNameModal,
  handleSaveBtn,
}) => {
  return (
    <Modal
      open={openEditNameModal}
      onClose={() => setOpenEditNameModal(false)}
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
            onChange={(e) => {
              setChangeName(e.target.value);
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

export default SurveyInfo;
