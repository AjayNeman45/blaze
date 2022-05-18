import React, { useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import Header from "../../components/header/Header";
import Subheader from "../../components/subheader/Subheader";
import styles from "./Allocations.module.css";
import { useAllocationContext } from "./AllocationContext";
import { BiChevronDown, BiEdit } from "react-icons/bi";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import SurveyInfo from "../../components/survey-info/SurveyInfo";
import { AiOutlinePlusCircle } from "react-icons/ai";
import AddSupplierModal from "./AddSupplierModal";
import InternalSupplierModal from "./InternalSupplierModal";
import { v4 as uuid } from "uuid";
import AddStaticRedirectsModal from "./AddStaticRedirectsModal";
import SnackbarMsg from "../../components/Snackbar";
import { getAllSessions } from "../../utils/firebaseQueries";
import { RiDeleteBin5Line } from "react-icons/ri";
import { Menu, MenuItem, Modal } from "@mui/material";
import { Box } from "@mui/system";
import { MdDeleteOutline } from "react-icons/md";
import SupplierEditModal from "./supplier-edit-modal/SupplierEditModal";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Allocations = () => {
  const {
    externalSuppliers,
    internalSuppliers,
    setSupplierModal,
    handleInternalSupplierModal,
    supplierModal,
    openSnackbar,
    handleSnackbar,
    internalsupplierModal,
    staticRedirectsModal,
    setStaticRedirectsModal,
    snackbarData,
    survey,
  } = useAllocationContext();
  let [sessions, setSessions] = useState([]);
  const [deletSupplierModal, setDeleteSupplierModal] = useState(false);
  const [supplierTableMenu, setSupplierTableMenu] = React.useState(null);
  const [supplierIDToDelete, setSupplierIDToDelete] = useState();
  const [supplierToEdit, setSuppplierToEdit] = useState({});
  const [supplierEditModal, setSupplierEditModal] = useState(false);

  useEffect(() => {
    getAllSessions(survey?.survey_id).then((querysnapshot) => {
      querysnapshot.forEach((doc) => {
        setSessions((prear) => [...prear, doc.data()]);
      });
    });
  }, [survey]);

  function CalculateTotalCompletes() {
    let count = 0;
    sessions?.map((session) => {
      if (session?.client_status === 10) {
        count += 1;
      }
    });
    return count;
  }
  function CalculateCompletes(supplier_account_id) {
    let count = 0;
    sessions?.map((session) => {
      if (session?.supplier_account_id === supplier_account_id) {
        if (session?.client_status === 10) {
          count += 1;
        }
      }
    });
    return count;
  }
  function CountConversion(supplier_account_id) {
    let count = 0;
    sessions?.map((session) => {
      if (session?.supplier_account_id === supplier_account_id) {
        if (session?.mirats_status === 3) {
          count++;
        }
      }
    });
    return (CalculateCompletes(supplier_account_id) / count).toFixed(2);
  }
  function CountTotalConversion() {
    let count = 0;
    sessions?.map((session) => {
      if (session?.mirats_status === 3) {
        count++;
      }
    });
    return ((CalculateTotalCompletes() / count) * 100).toFixed(2);
  }
  function CalculatePreScreener(supplier_account_id) {
    let count = 0;
    sessions?.map((session) => {
      if (session?.supplier_account_id === supplier_account_id) {
        if (
          session?.mirats_status === 1 ||
          session?.mirats_status === 120 ||
          session?.mirats_status === 122 ||
          session?.mirats_status === 123 ||
          session?.mirats_status === 124 ||
          session?.mirats_status === 125 ||
          session?.mirats_status === 126 ||
          session?.mirats_status === 21 ||
          session?.mirats_status === 23 ||
          session?.mirats_status === 237 ||
          session?.mirats_status === 24 ||
          session?.mirats_status === 3 ||
          session?.mirats_status === 40
        ) {
          count += 1;
        }
      }
    });
    return count;
  }
  const open = Boolean(supplierTableMenu);
  const handleTableRowEditMenu = (event) => {
    setSupplierTableMenu(event.currentTarget);
  };
  const handleClose = () => {
    setSupplierTableMenu(null);
  };
  return (
    <>
      <Header />
      <Subheader />
      <div>
        <SurveyInfo />
        {/* <ProjectInfo surveyStatus={survey?.status} /> */}
        <div className={styles.allocations_info}>
          <div className={styles.allocations_info_left}>
            <div className={styles.allocations_info_section}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <label>calculation type</label> &nbsp;
                <FaInfoCircle color="gray" />
              </div>
              <div>
                <span>Completes</span> &nbsp;
                <span style={{ color: "blue" }}>edit</span>
              </div>
            </div>
            <div className={styles.allocations_info_section}>
              <label>quota</label> &nbsp;
              <span>{survey?.no_of_completes}</span>
            </div>
            <div className={styles.allocations_info_section}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <label>field end date</label>&nbsp;
                <FaInfoCircle color="gray" />
              </div>
              <span>-</span>
            </div>
            <div className={styles.allocations_info_section}>
              <label>completes</label>&nbsp;
              <span>{CalculateTotalCompletes()} </span>
            </div>
            <div className={styles.allocations_info_section}>
              <label>conversion</label>&nbsp;
              <span>{CountTotalConversion()}%</span>
            </div>
            <div className={styles.allocations_info_section}>
              <label>survey cpi</label>&nbsp;
              <span>$ {survey?.client_info?.client_cpi}</span>
            </div>
          </div>
        </div>
        <div className={styles.external_supply_sources}>
          <div className={styles.top}>
            <p className={styles.title}>External Supply Sources</p>

            <button
              className={styles.add_supplier_btn}
              onClick={() => setSupplierModal(true)}
            >
              <AiOutlinePlusCircle size={25} /> &nbsp; Add Supplier
            </button>
          </div>
          <div style={{ overflow: "auto" }}>
            <table className={styles.external_supply_sources_table}>
              <thead>
                <tr>
                  <th>
                    Supplier <BiChevronDown />
                  </th>
                  <th>
                    TCPI <BiChevronDown />
                  </th>
                  <th>
                    Last Complete Date <BiChevronDown />
                  </th>
                  <th>
                    Allocation <BiChevronDown />
                  </th>
                  <th>
                    Prescreens <BiChevronDown />
                  </th>
                  <th>
                    Completes <BiChevronDown />
                  </th>
                  <th>
                    Allocation Remaining <BiChevronDown />
                  </th>
                  <th>
                    Total Remaining <BiChevronDown />
                  </th>
                  <th>
                    Conversion <BiChevronDown />
                  </th>
                  <th>
                    Block Optimzer <BiChevronDown />
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {externalSuppliers?.map((supplier) => {
                  return (
                    <tr key={uuid()}>
                      <td>{supplier?.supplier_account}</td>
                      <td>{supplier?.tcpi}</td>
                      <td></td>
                      <td>{supplier?.allocation?.number}</td>
                      <td>
                        {CalculatePreScreener(supplier?.supplier_account_id)}
                      </td>
                      <td>
                        {CalculateCompletes(supplier?.supplier_account_id)}
                      </td>
                      <td>
                        {supplier?.allocation?.number -
                          CalculateCompletes(supplier?.supplier_account_id)}
                      </td>
                      <td>
                        {survey?.no_of_completes -
                          CalculateCompletes(supplier?.supplier_account_id)}
                      </td>
                      <td>{CountConversion(supplier?.supplier_account_id)}</td>
                      <td>0</td>
                      <td>
                        {/* {CalculateCompletes(supplier?.supplier_account_id) ? ( */}
                        <a>
                          <RiDeleteBin5Line
                            className={styles.delete_icon}
                            onClick={() => {
                              setDeleteSupplierModal(true);
                              setSupplierIDToDelete(
                                supplier?.supplier_account_id
                              );
                            }}
                          />
                        </a>
                        {/* // ) : null} */}
                        &nbsp;
                        <a>
                          <BiEdit
                            className={styles.edit_icon}
                            onClick={() => {
                              setSupplierEditModal(true);
                              setSuppplierToEdit(supplier);
                            }}
                          />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Internale supply source  */}
        <div className={styles.external_supply_sources}>
          <div className={styles.top}>
            <p className={styles.title}>Internal Supply Sources</p>

            <button
              className={styles.add_supplier_btn}
              onClick={handleInternalSupplierModal}
              disabled={internalSuppliers?.length}
            >
              <AiOutlinePlusCircle size={25} /> &nbsp; Add Internal Supply
            </button>
          </div>
          <div style={{ overflow: "auto" }}>
            <table className={styles.external_supply_sources_table}>
              <thead>
                <tr>
                  <th>
                    Supplier <BiChevronDown />
                  </th>
                  <th>
                    TCPI <BiChevronDown />
                  </th>
                  <th>
                    Last Complete Date <BiChevronDown />
                  </th>
                  <th>
                    Allocation <BiChevronDown />
                  </th>
                  <th>
                    Prescreens <BiChevronDown />
                  </th>
                  <th>
                    Completes <BiChevronDown />
                  </th>
                  <th>
                    Allocation Remaining <BiChevronDown />
                  </th>
                  <th>
                    Total Remaining <BiChevronDown />
                  </th>
                  <th>
                    Conversion <BiChevronDown />
                  </th>
                  <th>
                    Block Optimzer <BiChevronDown />
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {internalSuppliers?.map((supplier) => {
                  return (
                    <tr key={uuid()}>
                      <td>{supplier?.supplier_account}</td>
                      <td>{supplier?.tcpi}</td>
                      <td></td>
                      <td>{supplier?.allocation?.number}</td>
                      <td>0</td>
                      <td>0</td>
                      <td>0</td>
                      <td>0</td>
                      <td>0</td>
                      <td>0%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* add external supplier modal  */}
      {supplierModal && <AddSupplierModal />}

      {/* add internal supplier modal  */}
      {internalsupplierModal && <InternalSupplierModal />}

      {/* supplier edit modal  */}
      {supplierEditModal && (
        <SupplierEditModal
          open={supplierEditModal}
          handleClose={() => setSupplierEditModal(false)}
          defaultData={supplierToEdit}
        />
      )}

      {/* global redirects modal  */}
      <AddStaticRedirectsModal
        addStaticRedirectsModal={staticRedirectsModal}
        setAddStaticRedirectsModal={setStaticRedirectsModal}
      />

      {/* snackbar  */}
      <SnackbarMsg
        msg={snackbarData?.msg}
        severity={snackbarData?.severity}
        open={openSnackbar}
        handleClose={handleSnackbar}
      />

      <DeleteConfirmationModal
        open={deletSupplierModal}
        handleCloseDeleteModal={() => setDeleteSupplierModal(false)}
        supplier={supplierIDToDelete}
        setDeleteSupplierModal={setDeleteSupplierModal}
      />
    </>
  );
};

const DeleteConfirmationModal = ({
  open,
  handleCloseDeleteModal,
  supplier,
  setDeleteSupplierModal,
}) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "white",
    borderRadius: "20px",
    boxShadow: 24,
    p: 4,
  };

  console.log(supplier);
  const { handleSupplierDelete } = useAllocationContext();

  return (
    <Modal
      open={open}
      onClose={handleCloseDeleteModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div className={styles.confirmDelete_Modal}>
          <MdDeleteOutline fontSize={50} color={"#f15e5e"} />
          <p className={styles.modal_title}>Are you sure ? </p>
          <p className={styles.modal_text}> You want to delete</p>

          <div className={styles.btn_container}>
            <button onClick={handleCloseDeleteModal}>Cancel</button>
            <button
              className={styles.btn_active}
              onClick={() => {
                handleSupplierDelete(supplier, setDeleteSupplierModal);
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default Allocations;
