import React, { useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import Header from "../../components/header/Header";
import Subheader from "../../components/subheader/Subheader";
import styles from "./Allocations.module.css";
import { useAllocationContext } from "./AllocationContext";
import { BiChevronDown } from "react-icons/bi";
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
  let [externalsupplierdata, setExternalSupplierData] = useState({});
  useEffect(() => {
    getAllSessions(survey?.survey_id).then((querysnapshot) => {
      querysnapshot.forEach((doc) => {
        setSessions((prear) => [...prear, doc.data()]);
      });
    });
  }, [survey]);
  // console.log("Sessions", sessions);
  // console.log("External suppliers", survey?.external_suppliers);

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
  // function CountTotalRemaining(supplier_account_id){
  //   return
  // }
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
                  <th></th>
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
    </>
  );
};

// const AddSupplierModal = () => {

// };

export default Allocations;
