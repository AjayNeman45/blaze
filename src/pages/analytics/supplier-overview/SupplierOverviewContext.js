import { createContext, useContext, useEffect, useState } from "react";
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
  const [selectedSupplier, setSelectedSupplier] = useState();
  const [supplierData, setSupplierData] = useState({});
  console.log(selectedSupplier);

  useEffect(() => {
    setSelectedSupplier(survey?.external_suppliers?.[0].supplier_account_id);
  }, [survey]);

  useEffect(() => {
    getStatusesCntAccordingSupplier(
      allSessions,
      setStatusesCnt,
      selectedSupplier
    );
  }, [allSessions, survey, selectedSupplier]);

  const getStatusesCntAccordingSupplier = (
    allSessions,
    setStatusesCnt,
    supplier
  ) => {
    console.log(supplier);
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

      if (
        session.data()?.supplier_account_id === supplier &&
        miratsStatus === 3
      ) {
        hits++;
        inClientSessionsCnt++;
      }

      setInClientSurveySessions(inClientSessionsCnt);
      if (session.data()?.supplier_account_id === supplier && status === 40) {
        overQuota++;
      } else if (
        session.data()?.supplier_account_id === supplier &&
        status === 30
      ) {
        securityTerm++;
      } else if (
        session.data()?.supplier_account_id === supplier &&
        status === 20
      ) {
        term++;
      } else if (
        session.data()?.supplier_account_id === supplier &&
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
    survey?.external_suppliers?.map((supp) => {
      if (supp?.supplier_account_id === selectedSupplier) {
        setSupplierData(supp);
      }
    });
  }, [selectedSupplier]);

  const value = {
    statusesCnt,
    completedSessionOfSupplier,
    inClientSurveySessions,
    selectedSupplier,
    supplierData,
    setSelectedSupplier,
  };

  return (
    <supplierOverviewContext.Provider value={value}>
      {children}
    </supplierOverviewContext.Provider>
  );
};

export default SupplierOverviewContextProvider;
