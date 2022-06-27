import {
  Autocomplete,
  InputAdornment,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import UseSwitchBasic from "../../../components/switch";
import { useAllocationContext } from "../AllocationContext";
import styles from "./SupplierEditModal.module.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 650,
  bgcolor: "white",
  borderRadius: "25px",
  outline: "none",
  boxShadow: 24,
  p: 4,
};

const SupplierEditModal = ({ open, handleClose, defaultData }) => {
  const {
    suppliers,
    supplierData,
    setSupplierData,
    survey,
    handleUpdateSupplier,
  } = useAllocationContext();
  const [supplyManager, setSupplyManager] = useState([]);
  const [projectManager, setProjectManager] = useState([]);

  useEffect(() => {
    setSupplierData(defaultData);
    suppliers?.map((supp) => {
      if (supp?.company_name === defaultData?.supplier_account) {
        supp?.supply_manager?.map((smanager) => {
          setSupplyManager((prevArr) => [
            ...prevArr,
            { label: smanager.name, value: smanager.name },
          ]);
        });

        supp?.project_manager?.map((pmanager) => {
          setProjectManager((prevArr) => [
            ...prevArr,
            { label: pmanager.name, value: pmanager.name },
          ]);
        });
      }
    });
  }, [defaultData]);

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
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h3>Edit Supply source</h3>
          <div className={styles.allocations}>
            <label>Allocation</label>
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
              <label>CPI</label>
              <input
                value={supplierData?.tcpi ? supplierData?.tcpi : null}
                onChange={(e) =>
                  setSupplierData({
                    ...supplierData,
                    tcpi: parseInt(e.target.value),
                  })
                }
                type="text"
                className={styles.cpi_field}
              />
            </div>
            <div className={styles.cpi} style={{ marginLeft: "10px" }}>
              <label>Status</label>

              <Select
                labelId="vendor_status"
                id="demo-simple-select"
                value={supplierData?.vendor_status}
                label="Vendor status"
                sx={{ marginTop: "10px" }}
                onChange={(e, value) => {
                  setSupplierData({
                    ...supplierData,
                    vendor_status: e.target.value,
                  });
                }}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="paused">Paused</MenuItem>
                <MenuItem value="closed">Closed</MenuItem>
              </Select>
            </div>
            <div className={styles.unreserved_completes}>
              <label>Access to unreserved completes</label>
              <div style={{ marginTop: ".8rem" }}>
                <UseSwitchBasic
                  checked={supplierData?.unreserved_completes}
                  setSupplierData={setSupplierData}
                />
              </div>
            </div>
          </div>

          <div className={styles.supply_manager}>
            <label>Supply Manager</label>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={supplyManager}
              onChange={(e, value) =>
                setSupplierData((prevData) => {
                  return { ...prevData, supply_manager: value.label };
                })
              }
              disabled={
                !supplierData.hasOwnProperty("supplier_account") ? true : false
              }
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Select..." />
              )}
              className={styles.supplier_account_field}
            />
          </div>
          <div className={styles.project_manager}>
            <label>Project Manager</label>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={projectManager}
              onChange={(e, value) =>
                setSupplierData({
                  ...supplierData,
                  project_manager: value.label,
                })
              }
              disabled={
                !supplierData.hasOwnProperty("supplier_account") ? true : false
              }
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Select..." />
              )}
              className={styles.supplier_account_field}
            />
          </div>
          <div className={styles.modal_footer}>
            <button
              className={styles.next_btn}
              onClick={() => {
                handleClose();
                handleUpdateSupplier();
              }}
            >
              Next
            </button>

            <button className={styles.cancel_btn} onClick={handleClose}>
              Cancel
            </button>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default SupplierEditModal;
