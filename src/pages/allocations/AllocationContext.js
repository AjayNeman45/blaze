import { arrayUnion, doc, getDoc, setDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import { getSurvey } from "../../utils/firebaseQueries";

const AllocationContext = createContext();

export const useAllocationContext = () => {
  return useContext(AllocationContext);
};

const project_manager = "Shivam Yadav";
const supplier_account = "Mirats Quanto";
const supply_manager = "Janhavi Kishor Rajput";

const AllocationContextProvider = ({ children }) => {
  const [survey, setSurvey] = useState(null);
  const { surveyID } = useParams();
  const [externalSuppliers, setExternalSuppliers] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [err, setErr] = useState(null);
  const [supplierModal, setSupplierModal] = useState(false);

  const [internalSuppliers, setInternalSuppliers] = useState([]);
  const [internalsupplierModal, setinternalSupplierModal] = useState(false);

  const handleSupplierModal = () => {
    setSupplierModal(!supplierModal);
  };
  const handleInternalSupplierModal = () => {
    setinternalSupplierModal(!internalsupplierModal);
  };
  // console.log(internalsupplierModal);
  console.log(
    typeof parseInt(survey?.client_info?.client_cpi * 0.5),
    parseInt(survey?.client_info?.client_cpi * 0.5)
  );
  const [supplierData, setSupplierData] = useState({
    unreserved_completes: false,
    supplier_account_id: Math.floor(1000000000 + Math.random() * 9000000000),
  });
  const [internalSupplierState, setInternalSupplierState] = useState({
    unreserved_completes: false,
    supplier_account_id: 1234567890,
    project_manager: project_manager,
    supplier_account: supplier_account,
    supply_manager: supply_manager,
    // tcpi:{survey?.client_info?.client_cpi * 0.5}
  });
  console.log("Internal Supplier state", internalSupplierState);
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

  const AddInternalSupplierDetails = async () => {
    if (
      !internalSupplierState?.allocation?.number ||
      !internalSupplierState?.allocation?.percentage
      // !internalSupplierState?.tcpi
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
      handleInternalSupplierModal();
      await setDoc(
        doc(db, "mirats", "surveys", "survey", surveyID),
        { internal_suppliers: arrayUnion(internalSupplierState) },
        { merge: true }
      )
        .then((res) => {
          getAllTheInternalSuppliers();
          handleSnackbar();
          console.log("Internal supply added in database");
        })
        .catch((err) => console.log(err));
    }
  };

  async function handleAddInternalSupplierDetails() {
    handleInternalSupplierModal();
  }

  useEffect(() => {
    getAllTheExternalSuppliers();
    getAllTheInternalSuppliers();
    getSurvey(surveyID)
      .then((data) => setSurvey(data))
      .catch((err) => console.log(err.message));
  }, []);

  const getAllTheExternalSuppliers = async () => {
    await getDoc(doc(db, "mirats", "surveys", "survey", surveyID))
      .then((res) => setExternalSuppliers(res.data().external_suppliers))
      .catch((err) => console.log(err.message));
  };
  const getAllTheInternalSuppliers = async () => {
    await getDoc(doc(db, "mirats", "surveys", "survey", surveyID))
      .then((res) => setInternalSuppliers(res.data().internal_suppliers))
      .catch((err) => console.log(err.message));
  };
  console.log(internalSuppliers);
  const value = {
    externalSuppliers,
    internalSuppliers,
    supplierData,
    setSupplierData,
    setInternalSupplierState,
    internalSupplierState,
    handleAddSupplierDetails,
    AddInternalSupplierDetails,
    handleAddInternalSupplierDetails,
    err,
    supplierModal,
    handleSupplierModal,
    handleInternalSupplierModal,
    internalsupplierModal,
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
