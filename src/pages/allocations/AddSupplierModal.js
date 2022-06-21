import React, { useEffect, useState } from "react";
import { useAllocationContext } from "./AllocationContext";
import styles from "./Allocations.module.css";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import UseSwitchBasic from "../../components/switch";
import { InputLabel, MenuItem, Select } from "@mui/material";

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

function AddSupplierModal() {
  const {
    supplierData,
    setSupplierData,
    supplierModal,
    setSupplierModal,
    handleAddSupplierDetails,
    err,
    survey,
    suppliers,
  } = useAllocationContext();

  const [supplierAccount, setSupplierAccount] = useState([]);
  const [supplyManager, setSupplyManager] = useState([]);
  const [projectManager, setProjectManager] = useState([]);

  // setting the supplierAccount, supplyManager, projectManager using this useState
  useEffect(() => {
    setSupplierAccount([]);
    setSupplyManager([]);
    setProjectManager([]);
    suppliers.map((supp) => {
      let flag = false;
      //if suppliers are there already then check for the suppliers existance and remove them if they exist
      if (survey?.external_suppliers?.length) {
        for (let i = 0; i < survey?.external_suppliers?.length; i++) {
          let e_supp = survey?.external_suppliers[i];
          if (supp?.company_name === e_supp?.supplier_account) {
            flag = false;
            break;
          } else {
            flag = true;
          }
        }
        if (flag) {
          setSupplierAccount((prevArr) => [
            ...prevArr,
            {
              label: supp.company_name,
              value: supp.company_name,
              supplier_id: supp?.supplier_id,
            },
          ]);
        }
      } else {
        //if external supplier of survey is empty then directly set supplierAccount from suppliers array
        setSupplierAccount((prevArr) => [
          ...prevArr,
          {
            label: supp.company_name,
            value: supp.company_name,
            supplier_id: supp?.supplier_id,
          },
        ]);
      }

      if (supp?.company_name === supplierData?.supplier_account) {
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
  }, [suppliers, supplierData]);

  // handles allocation of supplier in number and percentage is changed by this function
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
        keepMounted
        open={supplierModal}
        onClose={() => setSupplierModal(false)}
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
              options={supplierAccount}
              onChange={(e, value) => {
                setSupplierData({
                  ...supplierData,
                  supplier_account: value.label,
                  supplier_account_id: parseInt(value?.supplier_id),
                });
                setProjectManager([]);
                setSupplyManager([]);
              }}
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
                    tcpi: parseInt(e.target.value),
                  })
                }
                type="number"
                className={styles.cpi_field}
              />
            </div>
            <div className={styles.cpi} style={{ marginLeft: "10px" }}>
              <label>
                Status <span className={styles.required}>Required</span>
              </label>

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
                <UseSwitchBasic setSupplierData={setSupplierData} />
              </div>
            </div>
          </div>

          <div className={styles.supply_manager}>
            <label>
              Supply Manager <span className={styles.required}>Required</span>
            </label>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={supplyManager}
              onChange={(e, value) =>
                setSupplierData({
                  ...supplierData,
                  supply_manager: value.label,
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
            <label>
              Project Manager <span className={styles.required}>Required</span>
            </label>
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
              onClick={handleAddSupplierDetails}
            >
              Next
            </button>

            <button
              className={styles.cancel_btn}
              onClick={() => setSupplierModal(false)}
            >
              Cancel
            </button>
          </div>
          <small style={{ color: "red" }}>{err}</small>
        </Box>
      </Modal>
    </>
  );
}

export default AddSupplierModal;
