import { Alert, Snackbar } from "@mui/material";
import React, { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { addBlockedData } from "../../utils/firebaseQueries";
import styles from "./Security.module.css";
const RidExclusions = () => {
  const [blockedRids, setBlockedRids] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { surveyID } = useParams();
  const inputFileRef = useRef();

  const readFile = (e) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const rids = e.target.result;
      setBlockedRids(rids.split("\r\n"));
    };
    reader.readAsText(e.target.files[0]);
  };

  const handleSaveBtn = () => {
    const body = { blocked_rids: blockedRids };
    if (blockedRids.length) {
      addBlockedData(surveyID, body)
        .then(() => {
          setOpenSnackbar(true);
        })
        .catch((err) => console.log("error occured ", err.message));
      inputFileRef.current.value = null;
      setBlockedRids([]);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };
  return (
    <>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          RID exclusions added successfully!
        </Alert>
      </Snackbar>

      <div className={styles.exclusion_page}>
        <h2 className={styles.legend}>RID Exclusion</h2>
        <div className={styles.exclusions_container}>
          <h3>Instructions:</h3>
          <div className={styles.instructions}>
            <p>1. Ensure file in .txt format</p>
            <p>
              2. Seperate each RID's in one line{" "}
              <a href="#">(View Sample Code)</a>
            </p>
            <p>3. A blank line will be considered an invalid entry</p>
            <p>4. Maximum number of RID's are 4K</p>
          </div>

          {/* <div className={styles.supplier_input}>
            <label>SUPPLIER</label>
            <select>
              <options></options>
            </select>
          </div> */}
          <div className={styles.file_input}>
            <label>
              Upload file <span style={{ color: "Red" }}>*</span>
            </label>
            <input
              type="file"
              className={styles.input}
              onChange={readFile}
              ref={inputFileRef}
            />
          </div>
          <div className={styles.exclusions_btns}>
            <button onClick={handleSaveBtn} className={styles.save_btn}>
              Save
            </button>
            <button className={styles.delete_records_btn}>
              Delete All Records
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RidExclusions;
