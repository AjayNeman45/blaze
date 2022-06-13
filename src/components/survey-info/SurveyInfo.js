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
import {
  mainStatusWithInternalStatuses,
  statusOptions,
} from "../../utils/commonData";
import ChangeInternalStatusModal from "./ChangeInternalStatusModal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "white",
  border: "none",
  outline: "none",
  borderRadius: "20px",
  boxShadow: 24,
  p: 4,
};

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
  const [snackbar, setSnackbar] = useState(false);
  const [snackbarData, setSnackbarData] = useState({});
  const [newSurveyID, setNewSurveyID] = useState("");
  const [internalStatusChangeModal, setInternalStatusChangeModal] =
    useState(false);

  const { surveyID } = useParams();
  const [survey, setSurvey] = useState({});
  const [batti, setBatti] = useState();

  useEffect(() => {
    handleActiveLight();
  }, []);

  const handleActiveLight = () => {
    getSurvey(surveyID)
      .then((data) => {
        setSurvey(data);
        setSurveyStatus(data?.status);
        setChangeSurveyName(data?.survey_name);
        setNewSurveyName(data?.survey_name);

        if (data?.status?.toLowerCase() === "bidding") {
          setBatti(1);
        } else if (data?.status?.toLowerCase() === "awarded") {
          setBatti(2);
        } else if (data?.status?.toLowerCase() === "live") {
          if (data?.internal_status.toLowerCase() === "soft launch")
            setBatti(3);
          else if (data?.internal_status.toLowerCase() === "full launch")
            setBatti(4);
        } else if (data?.status?.toLowerCase() === "complete") {
          setBatti(5);
        } else if (data?.status?.toLowerCase() === "billed") {
          setBatti(6);
        }
      })
      .catch((err) => console.log(err.message));
  };

  const handleChangeSurveyNameBtn = (e) => {
    e.preventDefault();
    setSurveyNameEditModal(false);
    const body = {
      survey_name: changedSurveyName,
    };
    updateSurvey(surveyID, body)
      .then(() => {
        console.log("survey name updated");
        setSnackbar(true);
        setSnackbarData({ msg: "survey name is updated", severity: "success" });
        setNewSurveyName(changedSurveyName);
      })
      .catch((err) => {
        setSnackbar(false);
        setSnackbarData({
          msg: "Oops! something went wrong try again..",
          severity: "error",
        });
      });
  };
  const handleSetExternalSurveyNameBtn = (e) => {
    e.preventDefault();
    setSurveyExterNameModal(false);
    const body = {
      external_survey_name: externalSurveyName,
    };
    updateSurvey(surveyID, body)
      .then(() => {
        setSnackbar(true);
        setSnackbarData({
          msg: "External Name for the survey is updated",
          severity: "success",
        });
        console.log("external project name updated");
      })
      .catch((err) => console.log(err.message));
  };

  const handleSurveyClone = () => {
    let lastSurveyID = 0;
    let body = {};
    getAllSurveys().then((surveys) => {
      surveys.forEach((survey) => {
        if (survey.id === surveyID) {
          body = survey.data();
        }
        if (parseInt(survey.id) > lastSurveyID) {
          lastSurveyID = parseInt(survey.id);
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
      addSurvey(lastSurveyID + 1, body)
        .then(() => {
          setSurveyCloneModal(true);
          console.log("survey cloned successfully....");
        })
        .catch((err) => console.log(err.message));
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

  const handleConfirmButton = (internalStatus) => {
    updateSurvey(surveyID, {
      status: surveyStatus,
      internal_status: internalStatus,
    })
      .then(() => {
        setSnackbar(true);
        setSnackbarData({
          msg: "survey status and internal status updated successfully.",
          severity: "success",
        });
        handleActiveLight();
      })
      .catch((err) => {
        {
          setSnackbar(true);
          setSnackbarData({
            msg: "Oops! something went wrong",
            severity: "error",
          });
        }
      });
  };

  // ---->>> handle when the status of the survey changes and it does not have the internal status
  const handleStatusChange = (changedStatus) => {
    updateSurvey(surveyID, { status: changedStatus, internal_status: "" })
      .then(() => {
        setSnackbar(true);
        setSnackbarData({
          msg: "survey status updated successfully",
          severity: "success",
        });
        handleActiveLight();
      })
      .catch((err) => {
        setSnackbar(true);
        setSnackbarData({
          msg: "Oops! something went wrong",
          severity: "error",
        });
      });
  };

  return (
    <>
      <ChangeInternalStatusModal
        openModal={internalStatusChangeModal}
        setOpenModal={setInternalStatusChangeModal}
        mainStatus={surveyStatus}
        handleConfirmButton={handleConfirmButton}
      />

      <SnackbarMsg
        msg={snackbarData?.msg}
        open={snackbar}
        severity={snackbarData?.severity}
        setSnackbar={setSnackbar}
      />
      <div className={styles.survey_info_container}>
        <div className={styles.survey_name_and_btns}>
          <div className={styles.survey_info_name}>
            <h1 onClick={() => setSurveyNameEditModal(!surveyNameEditModal)}>
              {newSurveyName}
              <span
                className={styles.edit_btn}
                onClick={() => setSurveyNameEditModal(!surveyNameEditModal)}
              >
                Edit
              </span>
            </h1>
          </div>

          <div className={styles.btns}>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <Select
                onChange={(e) => {
                  setSurveyStatus(e.target.value);
                  if (
                    !mainStatusWithInternalStatuses.hasOwnProperty(
                      e.target.value
                    )
                  )
                    handleStatusChange(e.target.value);
                  else setInternalStatusChangeModal(true);
                }}
                inputProps={{ "aria-label": "Without label" }}
                className={styles.status_select_field}
                value={surveyStatus}
              >
                {statusOptions?.map((option) => (
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
              onClick={() => history.push(`/surveys/reports/${surveyID}`)}
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
              <li className={batti >= 4 ? styles.active : style.inactive}>
                <GoPrimitiveDot />
                full launch
              </li>
              <li className={batti >= 5 ? styles.active : style.inactive}>
                <GoPrimitiveDot />
                reconciliation
              </li>
              <li className={batti >= 6 ? styles.active : style.inactive}>
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
            <p>Survey Clone successfully.</p>
            <div className={styles.btns}>
              <button onClick={() => setSurveyCloneModal(false)}>Close</button>
              <p
                className={styles.go_to_settings_btn}
                onClick={() => history.push(`/surveys/settings/${newSurveyID}`)}
              >
                Go to Settings
              </p>
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
          title="Edit Survey name"
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
        <div className={styles.change_survey_name_modal}>
          <p className={styles.modal_title}>{title}</p> <br />
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
                  setChangeName(prevName);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Box>
    </Modal>
  );
};

export default SurveyInfo;
