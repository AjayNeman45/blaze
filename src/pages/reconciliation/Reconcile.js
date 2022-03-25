import React, { useRef, useState } from "react";
import styles from "./Reconciliations.module.css";
import { updateReconciliationStatus } from "../../utils/firebaseQueries";
import { InputLabel, MenuItem, Select } from "@mui/material";
import { useParams } from "react-router-dom";
import { Loading } from "@nextui-org/react";
import SnackbarMsg from "../../components/Snackbar";

const Reconcile = () => {
  const [reconciliationType, setReconciliationType] = useState(
    "Completes and Adjusted Termination"
  );
  const [file, setFile] = useState();
  const [ids, setIds] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { surveyID } = useParams();

  const ridsFileRef = useRef();
  const handleFileUpload = (e) => {
    const [textFile] = e.target.files;
    setFile(textFile);
    const reader = new FileReader();

    reader.onload = (e) => {
      const rids = e.target.result;
      setIds(rids.split(/\r\n|\n/));
    };
    reader.readAsBinaryString(textFile);
  };
  // reconcilation continue btn
  const handleContinueBtn = () => {
    setLoading(true);
    if (!file) {
      setLoading(false);
      setError("This field is required");
      return;
    }
    setError(null);
    ridsFileRef.current.value = null;
    updateReconciliationStatus(surveyID, ids, reconciliationType)
      .then((res) => setLoading(false), setOpenSnackbar(true))
      .catch((err) => setLoading(false));
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };
  return (
    <>
      {openSnackbar && (
        <SnackbarMsg
          msg="Reconciliation updated successfully"
          severity="success"
          open={openSnackbar}
          handleClose={handleCloseSnackbar}
        />
      )}
      <p className={styles.setup_reconciliation}>
        Step 1 of 2: Setup Reconciliation
      </p>
      <div className={styles.reconciliations_section}>
        <p className={styles.instruction_legend}>Instructions</p>
        <div className={styles.instructions}>
          <p>
            1. &nbsp; The file to be uploaded with the ids should be in text
            (.txt) format
          </p>
          <p>
            2. &nbsp; Place each ID on one line. Empty lines will be ignored{" "}
            <a to="#">(View Sample format)</a>
          </p>
          <p>3. &nbsp;The maximum size of the file should be 1MB or less.</p>
        </div>
        <div className={styles.middle_container}>
          <div className={styles.reconciliation_type}>
            <span className={styles.legend}>
              Reconciliation Type &nbsp;
              <span style={{ color: "red" }}>*</span>
            </span>
            <div className={styles.input}>
              <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={reconciliationType}
                onChange={(e) => setReconciliationType(e.target.value)}
                className={styles.select_field}
                label="Age"
                variant="filled"
              >
                <MenuItem value="Completes and Adjusted Termination">
                  Completes and Adjusted Termination
                </MenuItem>
                <MenuItem value="Post Survey Termination">
                  Post Survey Termination
                </MenuItem>
                <MenuItem value="Security Disqualification">
                  Security Disqualification
                </MenuItem>
              </Select>
            </div>
          </div>
          <div className={styles.upload_file}>
            <span className={styles.legend}>
              Upload a file &nbsp;
              <span style={{ color: "red" }}>*</span>
            </span>
            <div>
              <div className={styles.file_input}>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  name="reconciliation_file"
                  ref={ridsFileRef}
                  display={false}
                />
              </div>
              <small style={{ color: "red" }}>{error}</small>
            </div>
          </div>
        </div>

        <div className={styles.continue_btn}>
          {loading ? (
            <Loading />
          ) : (
            <button onClick={handleContinueBtn}>Continue</button>
          )}
        </div>
        <div className={styles.note}>
          <span style={{ color: "red" }}>Note:</span> &nbsp;
          <p>
            Please do not reconcile a survey until it has been completed. Doing
            so may cause delays in field. If you have any questions please
            contact our support team.
          </p>
        </div>
      </div>
    </>
  );
};

export default Reconcile;
