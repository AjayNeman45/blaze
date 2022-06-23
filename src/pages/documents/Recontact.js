import React, { useState, useRef } from "react";
import styles from "./Documents.module.css";
import { storage } from "../../firebase";
import { useParams } from "react-router-dom";
import { getSurvey } from "../../utils/firebaseQueries";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import SnackbarMsg from "../../components/Snackbar";
import { ref } from "firebase/storage";

function Recontact() {
  const [documents, setDocuments] = useState();
  const { surveyID } = useParams();
  const surveyInputFileRef = useRef();
  const [snackbarData, setSnackbarData] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const handleFileChange = (e) => {
    setDocuments(e.target.files[0]);
  };
  const handleSnackbar = () => {
    setOpenSnackbar(!openSnackbar);
  };

  async function loadFile(file) {
    let text = await file.text();
    return text;
  }
  async function StoreRecontacts(recontact_array) {
    getSurvey(surveyID).then(async (data) => {
      if (data?.study_type === "recontact") {
        await setDoc(
          doc(db, "mirats", "surveys", "survey", surveyID),
          {
            recontact_ids: recontact_array,
          },
          { merge: true }
        );
        setDocuments();
        setOpenSnackbar(true);
        setSnackbarData({
          msg: "Recontact ids file is uploaded",
          severity: "success",
        });
      } else {
        setOpenSnackbar(true);
        setSnackbarData({
          msg: "Study type should be recontact",
          severity: "error",
        });
      }
    });
  }

  async function recontactSubmit() {
    if (documents) {
      loadFile(documents).then((text) => {
        let split_text_recontacts = text.split("\n");
        StoreRecontacts(split_text_recontacts).then((data) => {});
      });
    } else {
      setOpenSnackbar(true);
      setSnackbarData({
        msg: "Upload documents to store recontact ",
        severity: "error",
      });
    }
  }

  return (
    <div className={styles.main_container}>
      {openSnackbar ? (
        <SnackbarMsg
          msg={snackbarData.msg}
          severity={snackbarData.severity}
          open={openSnackbar}
          handleClose={handleSnackbar}
        />
      ) : null}

      <div className={styles.instruction}>
        <p>Instructions:</p>
        <ol>
          <li>Ensure file in .txt format.</li>
          <li>
            Seprate each Client Code in one line (
            <a href=""> View Sample Code</a> )
          </li>
          <li>A Blank line will be considered an invalid entry.</li>
          <li>Maximum upload size: 5,000 Client Codes or 1,536 KB</li>
        </ol>
      </div>

      <div className={styles.file_upload}>
        <p>
          Select text File <span style={{ color: "red" }}>*</span>
          &nbsp; &nbsp;
        </p>
        <div className={styles.input_upload}>
          <input
            type="file"
            ref={surveyInputFileRef}
            multiple
            onChange={handleFileChange}
          />
          {/* {loading && (
            <div
              styles={{
                marginTop: "1rem",
                textAlign: "center",
              }}
            >
              <CircularProgress />
              <p>Uploading files...</p>
            </div>
          )} */}
        </div>
      </div>

      <div className={styles.uploaded_files}>
        <p>Uploaded Files</p>
      </div>
      <div className={styles.submit_div}>
        <button
          type="Submit"
          className={styles.submit_btn}
          onClick={recontactSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default Recontact;
