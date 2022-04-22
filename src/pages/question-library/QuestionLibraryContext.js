import { createContext, useContext, useEffect, useState } from "react";
import { getQuestions } from "../../utils/firebaseQueries";

const QualificationContext = createContext();

export const useQualificationLibraryContext = () => {
  return useContext(QualificationContext);
};

const QualificationLibraryContextProvider = ({ children }) => {
  const [questions, setQuestions] = useState([]);
  useEffect(() => {
    getQuestions("All").then((questions) => {
      questions.forEach((question) => {
        setQuestions(questions);
      });
    });
  }, []);
  const value = { questions };
  return (
    <QualificationContext.Provider value={value}>
      {children}
    </QualificationContext.Provider>
  );
};

export default QualificationLibraryContextProvider;
