import React, { useEffect, useRef } from "react";
import styles from "./Documents.module.css";
import Header from "../../components/header/Header";
import Subheader from "../../components/subheader/Subheader";
import { useState } from "react";
import { storage } from "../../firebase";
import {
  listAll,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { useParams } from "react-router-dom";
import SurveyInfo from "../../components/survey-info/SurveyInfo";
import { CircularProgress, Tab, Tabs, Typography } from "@mui/material";
import { v4 as uuid } from "uuid";
import { Box } from "@mui/system";
import PropTypes from "prop-types";
import { IoMdClose } from "react-icons/io";
import { Loading } from "@nextui-org/react";
import SnackbarMsg from "../../components/Snackbar";
import Recontact from "./Recontact";

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [documentLoading, setDocumentLoading] = useState(true);
  const { surveyID } = useParams();
  const surveyInputFileRef = useRef();
  const [value, setValue] = useState(0);
  const [snackbarData, setSnackbarData] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const folderRef = ref(storage, `Survey-attachement-documents/${surveyID}`);
  // for left tab panel
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleFileChange = (e) => {
    setDocuments(e.target.files);
  };
  const handleSnackbar = () => {
    setOpenSnackbar(!openSnackbar);
  };

  const handleFileUpload = async (e) => {
    for (var i = 0; i < documents.length; i++) {
      setLoading(true);
      var file = documents[i];
      const documentRef = ref(
        storage,
        `Survey-attachement-documents/${surveyID}/${file.name}`
      );
      await uploadBytes(documentRef, file)
        .then(async () => {
          setLoading(false);
          fetchSurveyDocuments();
        })
        .catch((err) => console.log(err.message));
    }
    surveyInputFileRef.current.value = null;
    setDocuments([]);
  };

  const handleFileDelete = (fileName) => {
    console.log(fileName);
    const documentRef = ref(
      storage,
      `Survey-attachement-documents/${surveyID}/${fileName}`
    );
    deleteObject(documentRef)
      .then(() => {
        fetchSurveyDocuments();
        setSnackbarData({
          msg: "File deleted successfully...",
          severity: "success",
        });
        handleSnackbar();
        console.log("file deleted successfully");
      })
      .catch((err) => {
        setSnackbarData({
          msg: "Your internet connection is slow or something went wrong from server side...!",
          severity: "error",
        });
        handleSnackbar();
        console.log(err.message);
      });
  };

  const fetchSurveyDocuments = () => {
    setDocumentLoading(true);
    setUploadedDocuments([]);

    listAll(folderRef)
      .then((res) => {
        if (!res.items.length) setDocumentLoading(false);
        else
          res.items.forEach((itemRef) => {
            // All the items under listRef.
            getDownloadURL(itemRef)
              .then((res) => {
                setUploadedDocuments((prevArr) => [
                  ...prevArr,
                  { file_name: itemRef.name, file_url: res },
                ]);
                setDocumentLoading(false);
              })
              .catch((err) => console.log(err));
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchSurveyDocuments();
  }, []);

  console.log(value);

  return (
    <>
      <Header />
      <Subheader />
      <div className={styles.documents_page}>
        <SurveyInfo />
        <div className={styles.main}>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleTabChange}
            aria-label="Vertical tabs example"
            sx={{ borderRight: 1, borderColor: "divider" }}
          >
            <Tab label="Survey Attachments & Documents" {...a11yProps(0)} />
            <Tab label="Recontacts" {...a11yProps(1)} />
          </Tabs>

          <TabPanel value={value} index={0} styles={{ width: "80%" }}>
            <div className={styles.main_container}>
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
                  {loading && (
                    <div
                      styles={{
                        marginTop: "1rem",
                        textAlign: "center",
                      }}
                    >
                      <CircularProgress />
                      <p>Uploading files...</p>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.uploaded_files}>
                <p>Uploaded Files</p>
                <ul>
                  {uploadedDocuments?.length ? (
                    uploadedDocuments.reverse().map((document) => {
                      return (
                        <li key={uuid} className={styles.uploaded_file}>
                          <a
                            href={`${document.file_url}`}
                            target="_blank"
                            className={styles.link}
                          >
                            • &nbsp;
                            {document.file_name}
                          </a>
                          &nbsp;{" "}
                          <IoMdClose
                            onClick={() => handleFileDelete(document.file_name)}
                            className={styles.cross_icon}
                          />
                        </li>
                      );
                    })
                  ) : !documentLoading ? (
                    <p styles={{ color: "gray" }}>No Documents Found</p>
                  ) : (
                    <div className={styles.document_show_loading}>
                      <Loading type="spinner" size="lg" />
                      <p>Loading...</p>
                    </div>
                  )}
                </ul>
              </div>
              <div className={styles.submit_div}>
                <button
                  type="Submit"
                  className={styles.submit_btn}
                  onClick={handleFileUpload}
                >
                  Submit
                </button>
              </div>
            </div>
          </TabPanel>
          <TabPanel value={value} index={1} styles={{ width: "80%" }}>
            <Recontact />
          </TabPanel>
        </div>
      </div>

      <SnackbarMsg
        msg={snackbarData.msg}
        severity={snackbarData.severity}
        open={openSnackbar}
        handleClose={handleSnackbar}
      />
    </>
  );
};

export default Documents;

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}
