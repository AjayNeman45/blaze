import { setInstallerType } from "clientjs/src/vendor/deployJava";
import { useEffect } from "react";
import { useState } from "react";
import { createContext, useContext } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import {
  addQualificationQuestion,
  getQuestions,
  getSurvey,
} from "../../utils/firebaseQueries";

const addQualificationContext = createContext();

export const useAddQualificationContext = () => {
  return useContext(addQualificationContext);
};

const AddQualificationContextProvider = ({ children }) => {
  const [dropDownQuestions, setDropDownQuestions] = useState([]);
  const [questionType, setQuestionType] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState({});
  const [displayOpt, setDisplayOpt] = useState([]);
  const [compulsaryOpt, setCompulsaryOpt] = useState([]);
  const [allowedResponses, setAllowedResponses] = useState([]);
  const [minMaxCondition, setMinMaxCondition] = useState();
  const [allowedTextAns, setAllowedTextAns] = useState(null);
  const [insertLoading, setInsertLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [survey, setSurvey] = useState({});

  const { surveyID } = useParams();
  const handleMinMaxCondition = (value, type) => {
    if (type === "min")
      setMinMaxCondition({ ...minMaxCondition, min: parseInt(value) });
    else setMinMaxCondition({ ...minMaxCondition, max: parseInt(value) });
  };

  const handleSnackbar = () => {
    setOpenSnackbar(!openSnackbar);
  };

  useEffect(() => {
    getSurvey(surveyID).then((res) => {
      setSurvey(res);
    });
  }, [surveyID]);

  // fetch the question according the question type change
  const handleQuestionTypeSelect = (e) => {
    console.log(e.target.innerHTML);
    setQuestionType(e.target.innerHTML);
    getQuestions(e.target.innerHTML, survey)
      .then((res) => {
        let queTmp = [];
        res?.map((que) => {
          que["label"] = que?.lang?.[survey?.country?.code]?.question_text;
          que["value"] = que?.name;
          queTmp.push(que);
        });
        setDropDownQuestions(queTmp);
      })
      .catch((err) => console.log(err.message));
    setSelectedQuestion({});
  };

  const handleSetQuestionBtn = () => {
    setInsertLoading(true);
    setCompulsaryOpt([]);
    let body = {
      question_id: selectedQuestion?.question_id,
      status: true,
    };
    switch (selectedQuestion?.question_type) {
      case "Multi Punch":
        body["display_options"] = displayOpt;
        body["conditions"] = {
          how_many: minMaxCondition,
          valid_options: compulsaryOpt,
        };
        insertQualificationQuestion(body);
        break;
      case "Numeric - Open-end":
        body["conditions"] = {
          valid_responses: allowedResponses,
        };
        insertQualificationQuestion(body);
        break;
      case "Single Punch":
        body["conditions"] = {
          valid_options: compulsaryOpt,
        };
        body["display_options"] = displayOpt;
        insertQualificationQuestion(body);
        break;
      case "Text - Open-end":
        body["conditions"] = {
          valid_ans: allowedTextAns,
        };
        insertQualificationQuestion(body);
        break;
      default:
        return;
    }
  };

  const insertQualificationQuestion = (body) => {
    console.log(body);
    addQualificationQuestion(body, surveyID)
      .then(() => {
        setInsertLoading(false);
        handleSnackbar();
        console.log("Question added successfully");
      })
      .catch((err) => console.log(err.message));
  };

  useEffect(() => {
    let options = [];
    selectedQuestion?.options?.map((_, index) => {
      options.push(index);
    });
    setDisplayOpt(options);
  }, [selectedQuestion]);

  //   console.log(selectedQuestion, displayOpt, minMaxCondition, compulsaryOpt);

  const value = {
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
  };
  return (
    <addQualificationContext.Provider value={value}>
      {children}
    </addQualificationContext.Provider>
  );
};

export default AddQualificationContextProvider;
