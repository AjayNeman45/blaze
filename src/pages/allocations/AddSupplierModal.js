import React from "react";
import { useAllocationContext } from "./AllocationContext";
import styles from "./Allocations.module.css";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import UseSwitchBasic from "../../components/switch";

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

function AddSupplierModal() {
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
}

export default AddSupplierModal;
