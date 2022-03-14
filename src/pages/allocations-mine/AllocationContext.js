import { arrayUnion, doc, getDoc, setDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import { getSurvey } from "../../utils/firebaseQueries";

const AllocationContext = createContext();

export const useAllocationContext = () => {
  return useContext(AllocationContext);
};

const AllocationContextProvider = ({ children }) => {
  const [survey, setSurvey] = useState(null);
  const { surveyID } = useParams();
  const [externalSuppliers, setExternalSuppliers] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [err, setErr] = useState(null);
  const [supplierModal, setSupplierModal] = useState(false);
  const handleSupplierModal = () => {
    setSupplierModal(!supplierModal);
  };

  const [supplierData, setSupplierData] = useState({
    unreserved_completes: false,
    supplier_account_id: Math.floor(1000000000 + Math.random() * 9000000000),
  });

  const handleSnackbar = () => {
    setOpenSnackbar(!openSnackbar);
  };

  const handleAddSupplierDetails = async () => {
    if (
      !supplierData?.supplier_account ||
      !supplierData?.allocation?.number ||
      !supplierData?.allocation?.percentage ||
      !supplierData?.tcpi ||
      !supplierData?.supply_manager ||
      !supplierData?.project_manager
    ) {
      setErr("* fields are required");
    } else if (survey?.client_info?.client_cpi < supplierData?.tcpi) {
      setErr(
        "CPI should be lesser than client cpi (" +
          survey?.client_info?.client_cpi +
          ") "
      );
    } else {
      setErr("");
      handleSupplierModal();
      await setDoc(
        doc(db, "mirats", "surveys", "survey", surveyID),
        { external_suppliers: arrayUnion(supplierData) },
        { merge: true }
      )
        .then((res) => {
          getAllTheExternalSuppliers();
          handleSnackbar();
          console.log("external supply added in database");
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    getAllTheExternalSuppliers();
    getSurvey(surveyID)
      .then((data) => setSurvey(data))
      .catch((err) => console.log(err.message));
  }, []);

  const getAllTheExternalSuppliers = async () => {
    await getDoc(doc(db, "mirats", "surveys", "survey", surveyID))
      .then((res) => setExternalSuppliers(res.data().external_suppliers))
      .catch((err) => console.log(err.message));
  };

  const value = {
    externalSuppliers,
    supplierData,
    setSupplierData,
    handleAddSupplierDetails,
    err,
    supplierModal,
    handleSupplierModal,
    handleSnackbar,
    openSnackbar,
    survey,
  };
  return (
    <AllocationContext.Provider value={value}>
      {children}
    </AllocationContext.Provider>
  );
};

export default AllocationContextProvider;
