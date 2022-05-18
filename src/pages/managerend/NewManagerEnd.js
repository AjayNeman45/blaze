import {
  Autocomplete,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import styles from "./NewManagerEnd.module.css";
import { v4 as uuid } from "uuid";
import Header from "../../components/header/Header";
import { getQuestions } from "../../utils/firebaseQueries";
import {
  AllowedAns,
  AllowedResponses,
  Conditions,
  OptionsToDisplay,
} from "../qualifications/edit-question-modal/EditQuestionModal";
import { useAddQualificationContext } from "./AddQualificationContext";
import { Loading } from "@nextui-org/react";
import SnackbarMsg from "../../components/Snackbar";
import Subheader from "../../components/subheader/Subheader";
import Select from "react-select";

const questionTypeRawData = [
  {
    label: "Multi Punch",
    value: "Multi Punch",
  },
  {
    label: "Numeric - Open-end",
    value: "Numeric - Open-end",
  },
  {
    label: "Single Punch",
    value: "Single Punch",
  },
  {
    label: "Text - Open-end",
    value: "Text - Open-end",
  },
];

const NewManagerEnd = () => {
  const {
    survey,
    dropDownQuestions,
    handleQuestionTypeSelect,
    selectedQuestion,
    setSelectedQuestion,
    displayOpt,
    setDisplayOpt,
    compulsaryOpt,
    setCompulsaryOpt,
    allowedResponses,
    setAllowedResponses,
    handleMinMaxCondition,
    handleSetQuestionBtn,
    allowedTextAns,
    setAllowedTextAns,
    questionType,
    insertLoading,
    openSnackbar,
    handleSnackbar,
  } = useAddQualificationContext();

  const selectStyle = {
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
      height: "60px",
      paddingLeft: "10px",
      borderRadius: "40px",
      boxShadow: "1px 0px 20px -2px rgba(0, 0, 0, 0.52)",
    }),
    input: (styles) => ({
      ...styles,
      height: "30px",
      width: "100%",
      textAlign: "center",
    }),
  };

  const questionTypesData = [
    {
      label: "Multi Punch",
      id: uuid(),
    },
    {
      label: "Single Punch",
      id: uuid(),
    },
    {
      label: "Numeric - Open-end",
      id: uuid(),
    },
    {
      label: "Text - Open-end",
      id: uuid(),
    },
  ];

  return (
    <>
      <SnackbarMsg
        msg="Qualification added successfully...!"
        severity="success"
        open={openSnackbar}
        handleClose={handleSnackbar}
      />
      <Header />
      <Subheader />
      <div className={styles.add_qualification_page}>
        <div className={styles.left}>
          <div className={styles.question_type_container}>
            {questionTypesData?.map((type) => (
              <p
                id={type?.id}
                className={
                  questionType === type?.label
                    ? styles.active_question_type
                    : styles.question_type
                }
                onClick={handleQuestionTypeSelect}
              >
                {type?.label}
              </p>
            ))}
          </div>

          {/* <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="All"
            name="radio-buttons-group"
          >
            <div className={styles.question_types}>
              {questionTypeRawData.map((type) => {
                return (
                  <FormControlLabel
                    key={uuid()}
                    value={type?.value}
                    control={<Radio />}
                    label={type?.label}
                    onChange={handleQuestionTypeSelect}
                  />
                );
              })}
            </div>
          </RadioGroup> */}
        </div>

        <div className={styles.right}>
          <Select
            id="combo-box-demo"
            options={dropDownQuestions}
            styles={selectStyle}
            className={styles.questions_dropdown}
            onChange={(e) => {
              let options = e?.lang?.[survey?.country?.code];
              setSelectedQuestion({
                ...options,
                question_type: e?.question_type,
                question_id: e?.question_id,
              });
            }}
          />

          {(() => {
            switch (questionType) {
              case "Multi Punch":
                return (
                  <>
                    <OptionsToDisplay
                      question={selectedQuestion}
                      displayOpt={displayOpt}
                      setDisplayOpt={setDisplayOpt}
                    />
                    <Conditions
                      question={selectedQuestion}
                      displayOpt={displayOpt}
                      compulsaryOpt={compulsaryOpt}
                      setCompulsaryOpt={setCompulsaryOpt}
                      handleMinMaxCondition={handleMinMaxCondition}
                    />
                  </>
                );
              case "Single Punch":
                return (
                  <>
                    <OptionsToDisplay
                      question={selectedQuestion}
                      displayOpt={displayOpt}
                      setDisplayOpt={setDisplayOpt}
                    />
                    <Conditions
                      question={selectedQuestion}
                      displayOpt={displayOpt}
                      compulsaryOpt={compulsaryOpt}
                      setCompulsaryOpt={setCompulsaryOpt}
                    />
                  </>
                );
              case "Numeric - Open-end":
                return (
                  <>
                    <AllowedResponses
                      allowed_responses={allowedResponses}
                      set_allowed_responses={setAllowedResponses}
                    />
                  </>
                );
              case "Text - Open-end":
                return (
                  <>
                    <AllowedAns
                      question={selectedQuestion}
                      allowedTextAns={allowedTextAns}
                      setAllowedTextAns={setAllowedTextAns}
                    />
                  </>
                );
            }
          })()}

          {insertLoading ? (
            <Loading type="spinner" size="lg" />
          ) : (
            <button
              onClick={handleSetQuestionBtn}
              className={styles.set_question_btn}
            >
              Set Question
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default NewManagerEnd;
