import React, { useEffect, useState } from "react";
import styles from "./createSurveyGroup.module.css";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

// Autocomplete MuI
import PropTypes from "prop-types";
import { useAutocomplete } from "@mui/base/AutocompleteUnstyled";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import Select from "react-select";
import { useSurveyGroupContext } from "../SurveyGroupContext";
import { getSurveyGrpData } from "../../../utils/firebaseQueries";

//  Modal Mui
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "998px",
  height: "auto",
  bgcolor: "#FFFFFF",
  border: "1px solid #F1F1F1",
  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
  borderRadius: "40px",
  p: 5,
};

// Auto Complete

const Root = styled("div")(
  ({ theme }) => `
    color: ${
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.65)"
        : "rgba(0,0,0,.85)"
    };
    font-size: 14px;
  `
);

const Label = styled("label")`
  padding: 0 0 4px;
  line-height: 1.5;
  display: none;
`;

const InputWrapper = styled("div")(
  ({ theme }) => `
    width: 100%;
    height: 55.19px;
    border: 1px solid #959595;
    background-color: #ffffff;
    border-radius: 43px;
    padding: 14px;
    display: flex;
    flex-wrap: wrap;
    margin-top:10px;
  
  
    
   
    & input {
      background-color: ${theme.palette.mode === "dark" ? "#141414" : "#fff"};
      color: ${
        theme.palette.mode === "dark"
          ? "rgba(255,255,255,0.65)"
          : "rgba(0,0,0,.85)"
      };
      height: 30px;
      box-sizing: border-box;
      padding: 4px 6px;
      width: 0;
      min-width: 30px;
      flex-grow: 1;
      border: 0;
      margin: 0;
      outline: 0;
    }
  `
);

function Tag(props) {
  const { label, onDelete, ...other } = props;
  return (
    <div {...other}>
      <span>{label}</span>
      <CloseIcon onClick={onDelete} />
    </div>
  );
}

Tag.propTypes = {
  label: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export const surveySelectStyle = {
  menu: (provided, state) => ({
    ...provided,
    width: "100%",
    borderBottom: "1px dotted pink",
    color: state.selectProps.menuColor,
    padding: 10,
  }),
  control: (styles) => ({
    ...styles,
    width: "100%",
    borderRadius: "30px",
    border: "1px solid gray",
  }),
  input: (styles) => ({
    ...styles,
    height: "45px",
  }),
  option: (styles) => ({
    ...styles,
    borderRadius: "20px",
  }),
  multiValue: (styles) => {
    return {
      ...styles,
      borderRadius: "30px",
      padding: "3px 7px",
    };
  },
  multiValueRemove: (styles) => ({
    ...styles,
    borderRadius: "50%",
    ":hover": {
      backgroundColor: "white",
      color: "gray",
    },
  }),
};

function CreateSurveyGroupModal({
  openModal,
  setOpenModal,
  surveyGrpNumber,
  setSelectedGrpsCnt,
  setSelectedSurveyGrps,
}) {
  const {
    surveyIdsOptions,
    setSurveyIdsOptions,
    surveyGrpData,
    setSurveyGrpData,
    insertSurveyGrpData,
    updateSurveyGroup,
  } = useSurveyGroupContext();

  const [btnDisabled, setBtnDisabled] = useState(true);

  useEffect(() => {
    surveyGrpNumber.length &&
      getSurveyGrpData(surveyGrpNumber[0])
        .then((res) => {
          setSurveyGrpData(res.docs[0].data());
        })
        .catch((err) => {
          console.log(err.message);
        });
  }, [surveyGrpNumber]);

  const handleSurveyGrpDataChange = (val, key) => {
    setSurveyGrpData((prevData) => {
      return {
        ...prevData,
        [key]: val,
      };
    });
  };

  useEffect(() => {
    if (
      surveyGrpData?.survey_group_name &&
      surveyGrpData?.survey_group_number &&
      surveyGrpData?.surveys?.length &&
      surveyGrpData?.description &&
      surveyGrpData.hasOwnProperty("survey_group_status")
    ) {
      setBtnDisabled(false);
    } else {
      setBtnDisabled(true);
    }
  }, [surveyGrpData]);

  console.log(surveyGrpData);

  return (
    <div>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div>
            <h1 className={styles.createSurveyGroup_title}>
              Create Survey Group
            </h1>
            <div className={styles.createSurveyGroup_mainContainer}>
              <div className={styles.createSurveyGroup_leftSide}>
                <div className={styles.inputFild_container}>
                  <p>Survey Group Number</p>
                  <input
                    type="number"
                    value={surveyGrpData?.survey_group_number}
                    onChange={(e) =>
                      handleSurveyGrpDataChange(
                        parseInt(e.target.value),
                        "survey_group_number"
                      )
                    }
                  />
                </div>
                <div className={styles.inputFild_container}>
                  <p>Survey Group Name</p>
                  <input
                    type="text"
                    value={surveyGrpData?.survey_group_name}
                    onChange={(e) =>
                      handleSurveyGrpDataChange(
                        e.target.value,
                        "survey_group_name"
                      )
                    }
                  />
                </div>
                <div className={styles.inputFild_container}>
                  <p>Include Surveys</p>
                  {/* <AutoCompText /> */}
                  <Select
                    isMulti
                    name="colors"
                    options={surveyIdsOptions}
                    value={surveyGrpData?.surveys?.map((sid) => {
                      return {
                        label: sid,
                        value: sid,
                      };
                    })}
                    styles={surveySelectStyle}
                    className={styles.survey_id_select}
                    onChange={(e) => {
                      let surveys = [];
                      e?.map((obj) => surveys.push(obj?.value));
                      setSurveyGrpData((prevData) => {
                        return {
                          ...prevData,
                          surveys,
                        };
                      });
                    }}
                  />
                </div>
                <p className={styles.subtitle}>
                  {surveyGrpData?.surveys?.length} surveys included
                </p>
              </div>

              <div className={styles.createSurveyGroup_rightSide}>
                <div className={styles.inputFild_container}>
                  <p>Description</p>
                  <textarea
                    rows="5"
                    cols="50"
                    value={surveyGrpData?.description}
                    onChange={(e) =>
                      handleSurveyGrpDataChange(e.target.value, "description")
                    }
                  />
                </div>
                <div className={styles.inputFild_container}>
                  <p>Survey Group Status</p>

                  <select
                    onChange={(e) => {
                      let val;
                      if (e.target.value === "true") val = true;
                      else val = false;
                      handleSurveyGrpDataChange(val, "survey_group_status");
                    }}
                    value={surveyGrpData?.survey_group_status}
                  >
                    <option selected disabled hidden>
                      Select Survey Group status
                    </option>
                    <option value="true">Active</option>
                    <option value="false">In Active</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          {surveyGrpNumber.length === 1 ? (
            <button
              className={
                btnDisabled
                  ? styles.disbaled_addSurvey_btn
                  : styles.addSurvery_btn
              }
              onClick={() =>
                updateSurveyGroup(setSelectedGrpsCnt, setSelectedSurveyGrps)
              }
              disabled={btnDisabled}
            >
              + Update Survey Group
            </button>
          ) : (
            <button
              className={
                btnDisabled
                  ? styles.disbaled_addSurvey_btn
                  : styles.addSurvery_btn
              }
              onClick={insertSurveyGrpData}
              disabled={btnDisabled}
            >
              {" "}
              + Add Survey Group{" "}
            </button>
          )}
        </Box>
      </Modal>
    </div>
  );
}

export default CreateSurveyGroupModal;
