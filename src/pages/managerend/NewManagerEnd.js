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

  console.log(dropDownQuestions);
  return (
    <>
      <SnackbarMsg
        msg="Qualification added successfully...!"
        severity="success"
        open={openSnackbar}
        handleClose={handleSnackbar}
      />
      <Header />
      <div className={styles.add_qualification_page}>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="All"
          name="radio-buttons-group"
        >
          <div className={styles.question_types}>
            {questionTypeRawData.map((type) => {
              let id = uuid();
              return (
                <FormControlLabel
                  key={id}
                  value={type?.value}
                  control={<Radio />}
                  label={type?.label}
                  onChange={handleQuestionTypeSelect}
                />
              );
            })}
          </div>
        </RadioGroup>

        <Autocomplete
          // disablePortal
          id="combo-box-demo"
          options={dropDownQuestions}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Question"
              InputProps={{
                ...params.InputProps,
                type: "search",
              }}
            />
          )}
          getOptionLabel={(question) =>
            question?.lang?.["ENG-IN"]?.question_text
          }
          className={styles.questions_dropdown}
          onChange={(event, question) => {
            setSelectedQuestion({
              ...question,
              options: question?.lang["ENG-IN"]?.options,
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
    </>
  );
};

export default NewManagerEnd;
