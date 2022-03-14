import React, { useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import Header from "../../components/header/Header";
import Subheader from "../../components/subheader/Subheader";
import styles from "./Allocations.module.css";
import ProjectInfo from "../../components/project-info/ProjectInfo";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import UseSwitchBasic from "../../components/switch";
import { useAllocationContext } from "./AllocationContext";
import { BiChevronDown } from "react-icons/bi";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import SurveyInfo from "../../components/survey-info/SurveyInfo";
import { AiOutlinePlusCircle } from "react-icons/ai";
import AddSupplierModal from "./AddSupplierModal";
import InternalSupplierModal from "./InternalSupplierModal";
import Tooltip from "@mui/material/Tooltip";
import { v4 as uuid } from "uuid";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Allocations = () => {
  const {
    externalSuppliers,
    internalSuppliers,
    handleSupplierModal,
    handleInternalSupplierModal,
    supplierModal,
    openSnackbar,
    handleSnackbar,
    survey,
    internalsupplierModal,
  } = useAllocationContext();
  console.log(internalSuppliers);
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
              <span>99</span>
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
              <span>0</span>
            </div>
            <div className={styles.allocations_info_section}>
              <label>conversion</label>&nbsp;
              <span>0%</span>
            </div>
            <div className={styles.allocations_info_section}>
              <label>survey cpi</label>&nbsp;
              <span>$ 0.50</span>
            </div>
          </div>
        </div>
        <div className={styles.external_supply_sources}>
          <div className={styles.top}>
            <p className={styles.title}>External Supply Sources</p>

            <button
              className={styles.add_supplier_btn}
              onClick={handleSupplierModal}
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

        {/* Internale supply source  */}
        <div className={styles.external_supply_sources}>
          <div className={styles.top}>
            <p className={styles.title}>Internal Supply Sources</p>

            {internalSuppliers?.length ? (
              <button
                className={styles.add_supplier_btn}
                onClick={handleInternalSupplierModal}
              >
                <AiOutlinePlusCircle size={25} /> &nbsp; Add Internal Supply
              </button>
            ) : (
              <button
                className={styles.add_supplier_btn}
                onClick={handleInternalSupplierModal}
              >
                <AiOutlinePlusCircle size={25} /> &nbsp; Add Internal Supply
              </button>
            )}
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

      {/* add supplier modal  */}

      {supplierModal && <AddSupplierModal />}
      {internalsupplierModal && <InternalSupplierModal />}

      {/* snackbar  */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Supplier Added successfully
        </Alert>
      </Snackbar>
    </>
  );
};

// const AddSupplierModal = () => {

// };

export default Allocations;
