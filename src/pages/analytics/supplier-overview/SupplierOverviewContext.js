import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useAanalyticsContext } from "../AnalyticsContext";

const supplierOverviewContext = createContext();

export const useSupplierOverviewContext = () => {
  return useContext(supplierOverviewContext);
};

const SupplierOverviewContextProvider = ({ children }) => {
  const [statusesCnt, setStatusesCnt] = useState({});
  const { allSessions, survey } = useAanalyticsContext();
  const [inClientSurveySessions, setInClientSurveySessions] = useState(0);
  const [completedSessionOfSupplier, setCompletedSessionsOfSupplier] = useState(
    []
  );
  const { supplierID } = useParams();
  const [supplierData, setSupplierData] = useState({});

  useEffect(() => {
    getStatusesCntAccordingSupplier(allSessions, setStatusesCnt, supplierID);
  }, [allSessions, survey, supplierID]);

  const getStatusesCntAccordingSupplier = (
    allSessions,
    setStatusesCnt,
    supplier_id
  ) => {
    const supplierID = parseInt(supplier_id);
    let completed = 0,
      overQuota = 0,
      term = 0,
      securityTerm = 0,
      hits = 0,
      inClientSessionsCnt = 0;
    setCompletedSessionsOfSupplier([]);
    allSessions?.forEach((session) => {
      const status = session.data().client_status;
      const miratsStatus = session.data()?.mirats_status;

      if (session.data()?.supplier_account_id === supplierID) hits++;
      if (
        session.data()?.supplier_account_id === supplierID &&
        miratsStatus === 3
      )
        inClientSessionsCnt++;

      setInClientSurveySessions(inClientSessionsCnt);
      if (session.data()?.supplier_account_id === supplierID && status === 40) {
        overQuota++;
      } else if (
        session.data()?.supplier_account_id === supplierID &&
        status === 30
      ) {
        securityTerm++;
      } else if (
        session.data()?.supplier_account_id === supplierID &&
        status === 20
      ) {
        term++;
      } else if (
        session.data()?.supplier_account_id === supplierID &&
        status === 10
      ) {
        completed += 1;
        setCompletedSessionsOfSupplier((prevData) => {
          return [...prevData, session.data()];
        });
      }

      setStatusesCnt((prevData) => {
        return {
          ...prevData,
          completed,
          overQuota,
          term,
          securityTerm,
          hits,
        };
      });
    });
  };

  useEffect(() => {
    setSupplierData({});
    let supplierExist = false;
    survey?.external_suppliers?.map((supp) => {
      if (supp?.supplier_account_id === parseInt(supplierID)) {
        setSupplierData(supp);
        supplierExist = true;
      }
    });
    if (!supplierExist) {
      survey?.internal_suppliers?.map((supp) => {
        if (supp?.supplier_account_id === parseInt(supplierID)) {
          setSupplierData(supp);
        }
      });
    }
  }, [survey, supplierID]);

  const value = {
    statusesCnt,
    completedSessionOfSupplier,
    inClientSurveySessions,
    supplierData,
    allSessions,
  };

  return (
    <supplierOverviewContext.Provider value={value}>
      {children}
    </supplierOverviewContext.Provider>
  );
};

export default SupplierOverviewContextProvider;
