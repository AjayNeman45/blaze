import { useEffect } from "react";
import { useState } from "react";
import { createContext, useContext } from "react";
import { useParams } from "react-router-dom";
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

  const { surveyID } = useParams();
  const handleMinMaxCondition = (value, type) => {
    if (type === "min")
      setMinMaxCondition({ ...minMaxCondition, min: parseInt(value) });
    else setMinMaxCondition({ ...minMaxCondition, max: parseInt(value) });
  };
  // fetch all the questions from question library
  //   useEffect(() => {
  //     getQuestions("All")
  //       .then((res) => {
  //         setDropDownQuestions(res);
  //       })
  //       .catch((err) => console.log(err.message));
  //   }, []);

  // fetch the question according the question type change
  const handleQuestionTypeSelect = (e) => {
    setQuestionType(e.target.value);
    getQuestions(e.target.value)
      .then((res) => {
        setDropDownQuestions(res);
      })
      .catch((err) => console.log(err.message));
    setSelectedQuestion({});
  };

  const handleSetQuestionBtn = () => {
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
    addQualificationQuestion(body, surveyID)
      .then(() => console.log("Question added successfully"))
      .catch((err) => console.log(err.message));
  };

  useEffect(() => {
    let options = [];
    selectedQuestion?.options?.map((_, index) => {
      options.push(index);
    });
    setDisplayOpt(options);
  }, [selectedQuestion]);

  console.log(allowedTextAns);
  //   console.log(selectedQuestion, displayOpt, minMaxCondition, compulsaryOpt);

  const value = {
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
  };
  return (
    <addQualificationContext.Provider value={value}>
      {children}
    </addQualificationContext.Provider>
  );
};

export default AddQualificationContextProvider;
