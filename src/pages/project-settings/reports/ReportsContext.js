import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAllSessions } from "../../utils/firebaseQueries";

const reportsContext = createContext();
export const useReportsContext = () => {
  return useContext(reportsContext);
};

const ReportsContextProvider = ({ children }) => {
  const { surveyID } = useParams();
  const [statusesCnt, setStatusesCnt] = useState({});
  useEffect(() => {
    getAllSessions(surveyID).then((res) => {
      setStatusesCnt((prevData) => {
        return { ...prevData, hits: res.docs.length };
      });

      res.forEach((session) => {
        let status = session.data()?.client_status;
        if (status === 40) {
          setStatusesCnt((prevData) => {
            return {
              ...prevData,
              overQuota: prevData?.overQuota ? prevData?.overQuota : 0 + 1,
            };
          });
        } else if (status === 30) {
          setStatusesCnt((prevData) => {
            return {
              ...prevData,
              securityTerm: prevData?.securityTerm
                ? prevData?.securityTerm
                : 0 + 1,
            };
          });
        } else if (status === 20) {
          setStatusesCnt((prevData) => {
            return {
              ...prevData,
              term: prevData?.term ? prevData?.term : 0 + 1,
            };
          });
        } else if (status === 10) {
          setStatusesCnt((prevData) => {
            return {
              ...prevData,
              completed: prevData?.completed ? prevData?.completed : 0 + 1,
            };
          });
        }
      });
    });
  }, [surveyID]);
  const value = { statusesCnt };
  return (
    <reportsContext.Provider value={value}>{children}</reportsContext.Provider>
  );
};

export default ReportsContextProvider;
