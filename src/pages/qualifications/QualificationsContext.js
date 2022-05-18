import { doc, getDoc, getDocs } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { db } from "../../firebase";
import {
  getQuestion,
  updateQualificationQuestion,
} from "../../utils/firebaseQueries";

const QualificationContext = createContext();

export const useQualificationsContext = () => {
  return useContext(QualificationContext);
};

const QualificationContextProvider = ({ children }) => {
  const { surveyID } = useParams();

  const [qualifications, setQualifications] = useState([]);
  const [displayOpt, setDisplayOpt] = useState();
  const [editQuestion, setEditQuestion] = useState({});
  const [compulsaryOpt, setCompulsaryOpt] = useState([]);
  const [allowedOpt, setAllowedOpt] = useState([]);
  const [allowedResponses, setAllowedResponses] = useState([
    { from: "", to: "" },
    { from: "", to: "" },
  ]);

  const [allowedTextAns, setAllowedTextAns] = useState("");
  const [minMaxCondition, setMinMaxCondition] = useState({});

  const [fetchingQualifications, setFetchingQualifications] = useState(false);

  const handleMinMaxCondition = (value, type) => {
    if (type === "min")
      setMinMaxCondition({ ...minMaxCondition, min: parseInt(value) });
    else setMinMaxCondition({ ...minMaxCondition, max: parseInt(value) });
  };

  //fetch all the questions from database
  useEffect(() => {
    const func = async () => {
      setFetchingQualifications(true);
      getDoc(doc(db, "mirats", "surveys", "survey", surveyID))
        .then((res) => {
          res.data()?.qualifications?.questions?.map(async (question) => {
            const qid = question?.question_id;
            if (!question?.status) return;
            const questionData = await getQuestion(qid);
            setQualifications((prevData) => [
              ...prevData,
              {
                ...question,
                ...questionData.data()?.lang["ENG-IN"],
                question_type: questionData.data()?.question_type,
                question_name: questionData.data()?.name,
                conditions: question?.conditions ? question?.conditions : null,
              },
            ]);
          });
          setFetchingQualifications(false);
        })
        .catch((err) => console.log(err.message));
    };
    func();
  }, []);

  // set the fields
  useEffect(() => {
    setDisplayOpt(editQuestion?.display_options);
    setCompulsaryOpt(editQuestion?.conditions?.valid_options);
    setAllowedOpt(editQuestion?.conditions?.valid_options);
    setAllowedResponses(editQuestion?.conditions?.valid_responses);
    setAllowedTextAns(editQuestion?.conditions?.valid_ans);
  }, [editQuestion]);

  const handleSaveBtn = () => {
    let body = {
      question_id: editQuestion?.question_id,
      status: true,
    };
    switch (editQuestion?.question_type) {
      case "Numeric - Open-end":
        body["conditions"] = {
          valid_responses: allowedResponses,
        };
        editQualificationQuestion(body);
        break;
      case "Single Punch":
        body["conditions"] = {
          valid_options: compulsaryOpt,
        };
        body["display_options"] = displayOpt;
        editQualificationQuestion(body);
        break;
      case "Text - Open-end":
        body["conditions"] = {
          valid_ans: allowedTextAns,
        };
        editQualificationQuestion(body);
        break;
      case "Multi Punch":
        body["display_options"] = displayOpt;
        body["conditions"] = {
          how_many: minMaxCondition,
          valid_options: compulsaryOpt,
        };
        editQualificationQuestion(body);
        break;
      default:
        return;
    }
  };

  const editQualificationQuestion = (body) => {
    updateQualificationQuestion(body, surveyID)
      .then(() => console.log("Question edited..."))
      .catch((err) => console.log(err.message));
  };

  const value = {
    qualifications,
    editQuestion,
    setEditQuestion,
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
    fetchingQualifications,
  };

  return (
    <QualificationContext.Provider value={value}>
      {children}
    </QualificationContext.Provider>
  );
};

export default QualificationContextProvider;
