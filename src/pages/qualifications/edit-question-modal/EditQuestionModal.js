import React, { useEffect, useRef, useState } from "react";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import styles from "./EditQuestionModal.module.css";
import { MdInfoOutline } from "react-icons/md";
import Tooltip from "@mui/material/Tooltip";
import { IconButton } from "@mui/material";
import TextField from "@mui/material/TextField";
import { v4 as uuid } from "uuid";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { TiDeleteOutline } from "react-icons/ti";
import { useQualificationsContext } from "../QualificationsContext";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70%",
  bgcolor: "background.paper",
  borderRadius: "30px",
  boxShadow: 24,
  p: 4,
  outline: "none",
  overflow: "scroll",
  height: "90%",
  display: "block",
};

const EditQuestionModal = ({ openEditModal, setOpenEditModal }) => {
  const {
    editQuestion,
    displayOpt,
    setDisplayOpt,
    allowedOpt,
    setAllowedOpt,
    compulsaryOpt,
    setCompulsaryOpt,
    allowedResponses,
    setAllowedResponses,
    handleSaveBtn,
    handleMinMaxCondition,
    allowedTextAns,
    setAllowedTextAns,
  } = useQualificationsContext();

  useEffect(() => {
    setCompulsaryOpt(compulsaryOpt);
  }, [compulsaryOpt]);

  return (
    <div>
      <Modal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ overflow: "scroll" }}
      >
        <Box sx={style}>
          <div className={styles.modal_header}>
            <label className={styles.legend}>Edit Qualification</label>{" "}
            <span className={styles.question_name}>
              {editQuestion?.question_name}
            </span>
          </div>
          <div className={styles.question_name_and_text}>
            <p className={styles.question_text}>
              {editQuestion?.question_text}
            </p>
          </div>
          <div className={styles.allowed_responses}>
            {(() => {
              switch (editQuestion?.question_type) {
                case "Single Punch":
                  return (
                    <div>
                      <OptionsToDisplay
                        question={editQuestion}
                        displayOpt={displayOpt}
                        setDisplayOpt={setDisplayOpt}
                      />
                      <Conditions
                        question={editQuestion}
                        displayOpt={displayOpt}
                        compulsaryOpt={compulsaryOpt}
                        setCompulsaryOpt={setCompulsaryOpt}
                        handleMinMaxCondition={handleMinMaxCondition}
                      />
                      <Description desc={editQuestion?.question_name} />
                    </div>
                  );
                case "Multi Punch":
                  return (
                    <div>
                      <OptionsToDisplay
                        question={editQuestion}
                        displayOpt={displayOpt}
                        setDisplayOpt={setDisplayOpt}
                      />
                      <Conditions
                        question={editQuestion}
                        displayOpt={displayOpt}
                        compulsaryOpt={compulsaryOpt}
                        setCompulsaryOpt={setCompulsaryOpt}
                        handleMinMaxCondition={handleMinMaxCondition}
                      />
                      <Description desc={editQuestion?.question_name} />
                    </div>
                  );
                case "Numeric - Open-end":
                  return (
                    <div>
                      <AllowedResponses
                        allowed_responses={allowedResponses}
                        set_allowed_responses={setAllowedResponses}
                      />
                      <Description desc={editQuestion?.question_name} />
                    </div>
                  );
                case "Text - Open-end":
                  return (
                    <div>
                      <AllowedAns
                        editQuestion={editQuestion}
                        allowedTextAns={allowedTextAns}
                        setAllowedTextAns={setAllowedTextAns}
                      />
                      <Description desc={editQuestion?.question_name} />
                    </div>
                  );
                default:
                  return;
              }
            })()}
          </div>
          <div className={styles.modal_footer}>
            <button className={styles.save_btn} onClick={handleSaveBtn}>
              Save
            </button>
            <button
              className={styles.cancel_btn}
              onClick={() => setOpenEditModal(false)}
            >
              Cancel
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export const OptionsToDisplay = ({ question, displayOpt, setDisplayOpt }) => {
  const handleDisplayOptionsChange = (checked, index) => {
    setDisplayOpt((prevArr) => {
      return !checked
        ? prevArr.filter((opt) => opt != index)
        : [...prevArr, index];
    });
  };

  return (
    <div className={styles.edit_display_options}>
      <label htmlFor="all" className={styles.legend}>
        Display Options
      </label>

      <div className={styles.options}>
        {question?.options?.map((option, index) => (
          <div key={uuid()}>
            <FormControlLabel
              control={<Checkbox checked={displayOpt?.includes(index)} />}
              onChange={(e, checked) =>
                handleDisplayOptionsChange(checked, index)
              }
              label={option}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// for mulitpunch editQuestion
export const Conditions = ({
  question,
  displayOpt,
  compulsaryOpt,
  setCompulsaryOpt,
  handleMinMaxCondition,
}) => {
  const handleCheckboxChange = (checked, option) => {
    setCompulsaryOpt((prevArr) => {
      return !checked
        ? prevArr.filter((opt) => opt != option)
        : [...prevArr, option];
    });
  };
  return (
    <div className={styles.conditions_container}>
      {question?.question_type === "Multi Punch" && (
        <>
          <label className={styles.legend}>Conditions</label>
          <div className={styles.textfields}>
            <TextField
              id="outlined-basic"
              label="Minimum"
              variant="outlined"
              type="number"
              InputProps={{
                classes: { input: styles.textfield },
              }}
              onChange={(e) => handleMinMaxCondition(e.target.value, "min")}
              defaultValue={question?.conditions?.how_many?.min}
            />
            &nbsp; &nbsp;
            <TextField
              id="outlined-basic"
              label="Maximum"
              variant="outlined"
              type="number"
              InputProps={{
                classes: { input: styles.textfield },
              }}
              onChange={(e) => handleMinMaxCondition(e.target.value, "max")}
              defaultValue={question?.conditions?.how_many?.max}
            />
          </div>
        </>
      )}

      <div className={styles.compulsary_options_container}>
        <label className={styles.legend}>One or More from</label>
      </div>
      <div className={styles.compulsary_options}>
        {!displayOpt?.length ? (
          <span style={{ color: "gray" }}>
            Select display options first to make it complusary
          </span>
        ) : (
          displayOpt?.map((option, index) => {
            return (
              <div key={uuid()}>
                <FormControlLabel
                  control={
                    <Checkbox
                      defaultChecked={compulsaryOpt?.includes(option)}
                    />
                  }
                  onChange={(_, checked) =>
                    handleCheckboxChange(checked, option)
                  }
                  label={`${question?.options?.[option]}`}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

// for numeric open end editQuestion
export const AllowedResponses = ({
  allowed_responses,
  set_allowed_responses,
}) => {
  const handleInputChange = (e, index) => {
    const newArr = [...allowed_responses];
    newArr[index][e.target.name] = parseInt(e.target.value);
    set_allowed_responses(newArr);
  };

  const handleRemoveInputBtn = (index) => {
    set_allowed_responses((prevData) => {
      return prevData?.filter((data, i) => i !== index);
    });
  };

  console.log(allowed_responses);

  return (
    <div className={styles.response_container}>
      <div className={styles.responses}>
        <label className={styles.legend}>Allowed Responses</label>
        {!allowed_responses.length ? (
          <p className={styles.no_condition_text}>
            You have no conditions specified
          </p>
        ) : (
          allowed_responses.map((response, index) => {
            return (
              <div key={response.id} className={styles.response_inputs}>
                <input
                  type="number"
                  name="from"
                  value={response?.from}
                  onChange={(e) => handleInputChange(e, index)}
                />
                &nbsp; <span>to</span> &nbsp;
                <input
                  type="number"
                  name="to"
                  value={response.to}
                  onChange={(e) => handleInputChange(e, index)}
                />
                <TiDeleteOutline
                  size={30}
                  onClick={() => {
                    handleRemoveInputBtn(index);
                  }}
                />
              </div>
            );
          })
        )}
      </div>

      <div className={styles.add_condition_btn}>
        <AiOutlinePlusCircle
          size={26}
          onClick={() => {
            set_allowed_responses((prevData) => {
              return [...prevData, { from: "", to: "" }];
            });
          }}
          id="add-btn"
        />{" "}
        &nbsp; &nbsp;
        <label htmlFor="add-btn">Add Condition</label>
      </div>
    </div>
  );
};

// for text open end editQuestion
export const AllowedAns = ({ allowedTextAns, setAllowedTextAns }) => {
  return (
    <div className={styles.allowed_ans}>
      <label className={styles.legend}>Allowed response</label>
      <input
        type="Text"
        value={allowedTextAns}
        onChange={(e) => setAllowedTextAns(e.target.value)}
      />
    </div>
  );
};

const Description = ({ desc }) => {
  const [description, setDescription] = useState(desc);
  return (
    <div className={styles.description}>
      <label>Description</label>
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
    </div>
  );
};

export default EditQuestionModal;
