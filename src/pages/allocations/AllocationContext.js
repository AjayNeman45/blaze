import { arrayUnion, doc, getDoc, setDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import {
  getAllSuppliers,
  getSurvey,
  updateSupplier,
  updateSurvey,
} from "../../utils/firebaseQueries";

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
  const [internalSuppliers, setInternalSuppliers] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [err, setErr] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [supplierModal, setSupplierModal] = useState(false);
  const [internalsupplierModal, setinternalSupplierModal] = useState(false);
  const [staticRedirectsModal, setStaticRedirectsModal] = useState(false);
  const [snackbarData, setSnackbarData] = useState("");
  const [supplierData, setSupplierData] = useState({
    unreserved_completes: false,
    global_redirect: true,
  });

  const handleInternalSupplierModal = () => {
    setinternalSupplierModal(!internalsupplierModal);
  };
  // console.log(internalsupplierModal);

  const [internalSupplierState, setInternalSupplierState] = useState({
    vendor_status: "active",
    unreserved_completes: false,
    supplier_account_id: 1234567890,
    project_manager: project_manager,
    supplier_account: supplier_account,
    supply_manager: supply_manager,
    // tcpi:{survey?.client_info?.client_cpi * 0.5}
  });
  const handleSnackbar = () => {
    setOpenSnackbar(!openSnackbar);
  };

  // handle next btn of external supplier modal
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
      setSupplierModal(false);
      for (let i = 0; i < suppliers.length; i++) {
        if (
          suppliers[i]?.company_name === supplierData?.supplier_account &&
          !suppliers[i].global_redirect
        ) {
          setStaticRedirectsModal(true);
          return;
        }
      }
      insertExternalSupplier();
    }
  };

  // insert external supplier in the database
  const insertExternalSupplier = async (staticRedirects) => {
    console.log(supplierData);
    await setDoc(
      doc(db, "mirats", "surveys", "survey", surveyID),
      { external_suppliers: arrayUnion(supplierData) },
      { merge: true }
    )
      .then(() => {
        getAllTheExternalSuppliers();
        setSnackbarData({
          msg: "Supplier added successfully...",
          severity: "success",
        });
        handleSnackbar();
      })
      .catch((err) => {
        setSnackbarData({
          msg: err.message,
          severity: "error",
        });
        handleSnackbar();
      });
    setSupplierData({});
  };

  const handleUpdateSupplier = async () => {
    updateSupplier(survey, supplierData)
      .then(() => {
        setSnackbarData({
          msg: "Supplier updated successfully...",
          severity: "success",
        });
        handleSnackbar();
      })
      .catch((err) => {
        setSnackbarData({
          msg: "Oops!. something went wrong. try again.",
          severity: "error",
        });
        handleSnackbar();
      });
  };

  // insert internal supplier in database
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
          setOpenSnackbar(true);
          setSnackbarData({
            msg: "Internal supplier added successfully...",
            severity: "success",
          });
          console.log("Internal supply added in database");
        })
        .catch((err) => {
          setOpenSnackbar(false);
          setSnackbarData({
            msg: "Oops! something went wrong",
            severity: "error",
          });
        });
    }
  };

  const handleSupplierDelete = (supplier, setDeleteSupplierModal) => {
    setDeleteSupplierModal(false);
    const surveyTmp = survey;
    const externalSuppTmp = survey?.external_suppliers?.filter((es) => {
      return es?.supplier_account_id !== supplier;
    });
    surveyTmp["external_suppliers"] = externalSuppTmp;
    updateSurvey(surveyID, surveyTmp)
      .then(() => {
        setOpenSnackbar(true);
        setSnackbarData({
          msg: "Supplier deleted successfully...",
          severity: "success",
        });
        console.log("supplier deleted");
      })
      .catch((err) => {
        console.log(err.message);
      });
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

    getAllSuppliers().then((res) => {
      res.forEach((result) => {
        let data = { ...result.data(), supplier_id: result.id };
        setSuppliers((prevArr) => [...prevArr, data]);
      });
    });
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
    setSupplierModal,
    handleInternalSupplierModal,
    internalsupplierModal,
    handleSnackbar,
    openSnackbar,
    survey,
    suppliers,
    staticRedirectsModal,
    setStaticRedirectsModal,
    insertExternalSupplier,
    snackbarData,
    handleSupplierDelete,
    handleUpdateSupplier,
  };
  return (
    <AllocationContext.Provider value={value}>
      {children}
    </AllocationContext.Provider>
  );
};

export default AllocationContextProvider;
