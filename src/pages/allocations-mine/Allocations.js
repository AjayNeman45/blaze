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
import { v4 as uuid } from "uuid";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 650,
  bgcolor: "background.paper",
  borderRadius: "25px",
  outline: "none",
  boxShadow: 24,
  p: 4,
};

const suppliers = [
  {
    label: "AdGate Media",
    value: "AdGate Media",
  },
  {
    label: "Adperio Israel",
  },
  {
    label: "Africa Field agents",
  },
  {
    label: "Beachside Ads",
  },
];

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Allocations = () => {
  const {
    externalSuppliers,
    handleSupplierModal,
    openSnackbar,
    handleSnackbar,
    survey,
  } = useAllocationContext();

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
      </div>

      {/* add supplier modal  */}
      <AddSupplierModal />

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
          External Supplier Added successfully
        </Alert>
      </Snackbar>
    </>
  );
};

const AddSupplierModal = () => {
  const {
    supplierData,
    setSupplierData,
    supplierModal,
    handleSupplierModal,
    handleAddSupplierDetails,
    err,
    survey,
  } = useAllocationContext();

  console.log(supplierData);

  const handleAllocationChange = (e) => {
    const user_res = e.target.value;
    const body = {};
    if (e.target.name === "percentage") {
      body.percentage = user_res;
      body.number = Math.round((user_res / 100) * survey?.no_of_completes);
    } else {
      body.percentage = (user_res * 100) / survey?.no_of_completes;
      body.number = user_res;
    }
    setSupplierData({
      ...supplierData,
      allocation: {
        ...supplierData.allocation,
        ...body,
      },
    });
  };
  return (
    <div>
      <Modal
        keepMounted
        open={supplierModal}
        onClose={handleSupplierModal}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
          <div className={styles.header}>Add Supplier</div>
          <div>
            <label>
              Supplier Account
              <span className={styles.required}>Required</span>
            </label>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={suppliers}
              onChange={(e, value) =>
                setSupplierData({
                  ...supplierData,
                  supplier_account: value.label,
                })
              }
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Select..." />
              )}
              className={styles.supplier_account_field}
            />
          </div>
          <div className={styles.allocations}>
            <label>
              Allocation
              <span className={styles.required}>Required</span>
            </label>
            <div className={styles.allocation_inputs}>
              <OutlinedInput
                type="number"
                name="percentage"
                value={supplierData?.allocation?.percentage}
                onChange={handleAllocationChange}
                className={styles.allocation_input}
                endAdornment={<InputAdornment position="end">%</InputAdornment>}
              />
              <OutlinedInput
                type="number"
                name="number"
                value={supplierData?.allocation?.number}
                onChange={handleAllocationChange}
                className={styles.allocation_input}
                endAdornment={<InputAdornment position="end">#</InputAdornment>}
              />
            </div>
          </div>

          <div className={styles.cpi_and_unreserved_container}>
            <div className={styles.cpi}>
              <label>
                CPI <span className={styles.required}>Required</span>
              </label>
              <input
                onChange={(e) =>
                  setSupplierData({
                    ...supplierData,
                    tcpi: e.target.value,
                  })
                }
                type="text"
                className={styles.cpi_field}
              />
            </div>
            <div className={styles.unreserved_completes}>
              <label>Access to unreserved completes</label>
              <div style={{ marginTop: ".8rem" }}>
                <UseSwitchBasic setSupplierData={setSupplierData} />
              </div>
            </div>
          </div>

          <div className={styles.supply_manager}>
            <label>
              Supply Manager <span className={styles.required}>Required</span>
            </label>
            <input
              type="text"
              onChange={(e) =>
                setSupplierData({
                  ...supplierData,
                  supply_manager: e.target.value,
                })
              }
            />
          </div>
          <div className={styles.project_manager}>
            <label>
              Project Manager <span className={styles.required}>Required</span>
            </label>
            <input
              type="text"
              onChange={(e) =>
                setSupplierData({
                  ...supplierData,
                  project_manager: e.target.value,
                })
              }
            />
          </div>
          <div className={styles.modal_footer}>
            <button
              className={styles.save_btn}
              onClick={handleAddSupplierDetails}
            >
              Save
            </button>
            <button className={styles.cancel_btn} onClick={handleSupplierModal}>
              Cancel
            </button>
          </div>
          <small style={{ color: "red" }}>Error: {err}</small>
        </Box>
      </Modal>
    </div>
  );
};

export default Allocations;
