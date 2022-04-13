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
import { encryptText } from "../../utils/enc-dec.utils";
import { BsCheckCircle } from "react-icons/bs";
import { useHistory } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "white",
  border: "none",
  outline: "none",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

const clonedMsgModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  height: 300,
  bgcolor: "white",
  border: "none",
  outline: "none",
  borderRadius: "30px",
  boxShadow: 24,
  p: 4,
};

export const options = [
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
  const history = useHistory();
  const [surveyNameEditModal, setSurveyNameEditModal] = useState(false);
  const [newSurveyName, setNewSurveyName] = useState();
  const [changedSurveyName, setChangeSurveyName] = useState("");
  const [externalSurveyName, setExternalSurveyName] = useState("");
  const [surveyStatus, setSurveyStatus] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [surveyCloneModal, setSurveyCloneModal] = useState(false);
  const [surveyExterNameModal, setSurveyExterNameModal] = useState(false);

  const [newSurveyID, setNewSurveyID] = useState("");

  const handleSnackbar = () => {
    setOpenSnackbar(!openSnackbar);
  };

  const { surveyID } = useParams();
  const [survey, setSurvey] = useState({});
  const [batti, setBatti] = useState();

  useEffect(() => {
    getSurvey(surveyID)
      .then((data) => {
        setSurvey(data);
        setSurveyStatus(data?.status);
        setChangeSurveyName(data?.survey_name);
        setNewSurveyName(data?.survey_name);

        if (data?.status?.toLowerCase() === "bidding") {
          setBatti(1);
        } else if (data?.status?.toLowerCase() === "testing") {
          setBatti(2);
        } else if (data?.status?.toLowerCase() === "live") {
          setBatti(3);
        } else if (
          data?.status?.toLowerCase() === "complete_with_reconciliation"
        ) {
          setBatti(4);
        } else if (data?.status?.toLowerCase() === "billed") {
          setBatti(5);
        }
      })
      .catch((err) => console.log(err.message));
  }, []);

  const handleChangeSurveyNameBtn = (e) => {
    e.preventDefault();
    setSurveyNameEditModal(false);
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
  const handleSetExternalSurveyNameBtn = (e) => {
    e.preventDefault();
    setSurveyExterNameModal(false);
    const body = {
      external_survey_name: externalSurveyName,
    };
    updateSurvey(surveyID, body)
      .then(() => {
        setSnackbarMsg("External Name for the survey is updated");
        handleSnackbar();
        console.log("external project name updated");
      })
      .catch((err) => console.log(err.message));
  };

  const handleSurveyClone = () => {
    let lastSurveyID = 0;
    let body = {};
    getAllSurveys().then((surveys) => {
      surveys.forEach((survey) => {
        if (parseInt(survey.id) > lastSurveyID) {
          lastSurveyID = parseInt(survey.id);
          body = survey.data();
        }
      });
      setNewSurveyID(lastSurveyID + 1);
      delete body?.external_suppliers;
      delete body?.changes;
      body.survey_id = lastSurveyID + 1;
      if (body?.encrypt?.sid !== encryptText(String(lastSurveyID + 1))) {
        console.log("different ids....");
      }
      body.encrypt.sid = encryptText(String(lastSurveyID + 1));
      setSurveyCloneModal(true);
      // addSurvey(lastSurveyID + 1, body)
      //   .then(() => {
      //     setSurveyCloneModal(true);
      //     console.log("survey cloned successfully....");
      //   })
      //   .catch((err) => console.log(err.message));
    });
  };

  const handleSurveyActionChange = (e) => {
    switch (e.target.value) {
      case "clone_survey":
        handleSurveyClone();
        break;
      case "set_external_name":
        setSurveyExterNameModal(true);
        break;
      default:
        return;
    }
  };

  return (
    <>
      <SnackbarMsg
        msg={snackbarMsg}
        severity="success"
        open={openSnackbar}
        handleClose={handleSnackbar}
      />
      <div className={styles.survey_info_container}>
        <div className={styles.survey_name_and_btns}>
          <div className={styles.survey_info_name}>
            <h1 onClick={() => setSurveyNameEditModal(!surveyNameEditModal)}>
              {newSurveyName}
            </h1>
            <span
              className={styles.edit_btn}
              onClick={() => setSurveyNameEditModal(!surveyNameEditModal)}
            >
              Edit
            </span>
          </div>

          <div className={styles.btns}>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <Select
                onChange={(e) => setSurveyStatus(e.target.value)}
                inputProps={{ "aria-label": "Without label" }}
                className={styles.status_select_field}
                value={surveyStatus}
              >
                {options?.map((option) => (
                  <MenuItem value={option.value} key={uuid()}>
                    <span>
                      <GoPrimitiveDot size={20} /> &nbsp;
                      {option.label}
                    </span>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <button
              className={styles.get_resports_btn}
              onClick={() => history.push(`/projects/reports/${surveyID}`)}
            >
              Get Reports
            </button>

            <select
              className={styles.action_select_field}
              value=""
              onChange={handleSurveyActionChange}
            >
              <option value="" disabled hidden>
                Actions
              </option>
              <option value="test_survey">Test Survey</option>
              <option value="clone_survey">Clone Survey</option>
              <option value="set_external_name">Set External Name</option>
            </select>
          </div>
        </div>

        <div className={styles.survey_numbers_and_status}>
          <div className={styles.survey_info}>
            <div className={styles.project_name}>
              <span className={styles.title}>Project Number </span>
              <span className={styles.value}>{survey.project_id}</span>
            </div>

            <div className={styles.survey_number}>
              <span className={styles.title}>Survey Number</span>
              <span className={styles.value}>{survey?.survey_id}</span>
            </div>
            {/* <div className={styles.live}>
              <GoPrimitiveDot /> {survey?.status}
            </div> */}
          </div>
          <div className={styles.status}>
            <ul>
              <li className={batti >= 1 ? styles.active : styles.inactive}>
                <GoPrimitiveDot /> order recieved
              </li>
              <li className={batti >= 2 ? styles.active : style.inactive}>
                <GoPrimitiveDot />
                awarded
              </li>
              <li className={batti >= 3 ? styles.active : style.inactive}>
                <GoPrimitiveDot />
                soft launch
              </li>
              <li className={batti >= 3 ? styles.active : style.inactive}>
                <GoPrimitiveDot />
                full launch
              </li>
              <li className={batti >= 4 ? styles.active : style.inactive}>
                <GoPrimitiveDot />
                reconciliation
              </li>
              <li className={batti >= 5 ? styles.active : style.inactive}>
                <GoPrimitiveDot />
                closed & billed{" "}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {surveyCloneModal && (
        <Modal
          open={surveyCloneModal}
          onClose={() => setSurveyCloneModal(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <div className={styles.clonedMsgModalStyle}>
            <BsCheckCircle size={100} color="#45e645" />
            <h2>Survey Clone successfully.</h2>
            <div className={styles.btns}>
              <button onClick={() => setSurveyCloneModal(false)}>Close</button>
              <a
                href={`localhost:3000/projects/settings/${newSurveyID}`}
                target="_blank"
              >
                Go to Settings
              </a>
            </div>
          </div>
        </Modal>
      )}

      {surveyExterNameModal && (
        <NameModal
          title="Set External Project name"
          changeName={externalSurveyName}
          setChangeName={setExternalSurveyName}
          handleSaveBtn={handleSetExternalSurveyNameBtn}
          openModal={surveyExterNameModal}
          setOpenModal={setSurveyExterNameModal}
        />
      )}
      {surveyNameEditModal && (
        <NameModal
          title="Change Survey name"
          changeName={changedSurveyName}
          setChangeName={setChangeSurveyName}
          handleSaveBtn={handleChangeSurveyNameBtn}
          openModal={surveyNameEditModal}
          setOpenModal={setSurveyNameEditModal}
        />
      )}
    </>
  );
}

export const NameModal = ({
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

export default SurveyInfo;
