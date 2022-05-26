import { createContext, useContext, useEffect, useState } from "react";
import {
  addQuestion,
  deleteLangFromQualification,
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
    getAllQuestionLibraryQuestions().then((res) => {
      let maxQuestionID = 0,
        questionsTmp = [];
      res.forEach((question) => {
        if (parseInt(question.data()?.question_id) > maxQuestionID) {
          maxQuestionID = parseInt(question.data()?.question_id);
        }
        questionsTmp.push(question.data());
      });
      setQuestions(questionsTmp);
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

  const handleQualificationDelete = (
    data,
    setSelectedQueCnt,
    setSelectedQues
  ) => {
    setSelectedQueCnt(0);
    setSelectedQues([]);
    data?.map((queCode) => {
      let questionID = queCode.slice(6);
      let questionCountryLang = queCode.slice(0, 6);

      let deletedLangQue;
      setQuestions(() => {
        return questions?.map((que) => {
          if (que?.question_id === parseInt(questionID)) {
            delete que.lang[questionCountryLang];
            deletedLangQue = que;
          }
          return que;
        });
      });
      deleteLangFromQualification(questionID, deletedLangQue)
        .then(() => {
          console.log("question deleted");
          setSnackbarData({
            msg: "Qualifications deleted successfully...",
            severity: "success",
            show: true,
          });
        })
        .catch((err) => {
          setSnackbarData({
            msg: "Qualification updated successfully...",
            severity: "error",
            show: true,
          });
          console.log(err.message);
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
    handleQualificationDelete,
  };
  return (
    <QualificationContext.Provider value={value}>
      {children}
    </QualificationContext.Provider>
  );
};

export default QualificationLibraryContextProvider;
