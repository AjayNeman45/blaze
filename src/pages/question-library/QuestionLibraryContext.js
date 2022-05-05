import { createContext, useContext, useEffect, useState } from "react";
import {
  addQuestion,
  getAllQuestionLibraryQuestions,
  getQuestions,
} from "../../utils/firebaseQueries";

const QualificationContext = createContext();

export const useQualificationLibraryContext = () => {
  return useContext(QualificationContext);
};

const QualificationLibraryContextProvider = ({ children }) => {
  const [questions, setQuestions] = useState([]);
  const [addQualModal, setAddQualModal] = useState(false);
  const [qualificationData, setQualificationData] = useState({});
  const [maxQuestionID, setMaxQuestionID] = useState(0);
  const [errMsg, setErrMsg] = useState();
  const [snackbarData, setSnackbarData] = useState({});

  useEffect(() => {
    getAllQuestionLibraryQuestions().then((questions) => {
      console.log(questions);
      let maxQuestionID = 0;
      questions.forEach((question) => {
        if (parseInt(question?.question_id) > maxQuestionID) {
          maxQuestionID = parseInt(question?.question_id);
        }
        setQuestions(questions);
      });
      console.log(maxQuestionID);
      setQualificationData((prevData) => {
        return {
          ...prevData,
          question_id: maxQuestionID + 1,
        };
      });
      setMaxQuestionID(maxQuestionID + 1);
    });
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbarData({ show: false });
  };

  const handleAddQuestionBtn = () => {
    let body = qualificationData;
    delete body?.["country-language"];
    setAddQualModal(false);
    addQuestion(body, maxQuestionID)
      .then(() => {
        setSnackbarData({
          show: true,
          msg: "Question Added successfully...",
          severity: "success",
        });
        console.log(maxQuestionID, "question added successfully");
      })
      .catch((err) => {
        console.log(err.message);
        setSnackbarData({
          show: true,
          msg: "Oops! somethig went wrong...",
          severity: "error",
        });
      });
  };

  const value = {
    questions,
    addQualModal,
    setAddQualModal,
    qualificationData,
    setQualificationData,
    maxQuestionID,
    handleAddQuestionBtn,
    snackbarData,
    handleCloseSnackbar,
  };
  return (
    <QualificationContext.Provider value={value}>
      {children}
    </QualificationContext.Provider>
  );
};

export default QualificationLibraryContextProvider;
