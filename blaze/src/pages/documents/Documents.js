import React, { useEffect, useRef } from "react";
import styles from "./Documents.module.css";
import Header from "../../components/header/Header";
import Subheader from "../../components/subheader/Subheader";
import { useState } from "react";
import { storage } from "../../firebase";
import { listAll, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useParams } from "react-router-dom";
import SurveyInfo from "../../components/survey-info/SurveyInfo";
import { CircularProgress, Tab, Tabs, Typography } from "@mui/material";
import { v4 as uuid } from "uuid";
import { Box } from "@mui/system";
import PropTypes from "prop-types";
import { IoMdClose } from "react-icons/io";
import { Loading } from "@nextui-org/react";

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [documentLoading, setDocumentLoading] = useState(true);
  const { surveyID } = useParams();
  const surveyInputFileRef = useRef();
  const [value, setValue] = useState(0);
  // for left tab panel
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleFileChange = (e) => {
    setDocuments(e.target.files);
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

  const fetchSurveyDocuments = () => {
    setDocumentLoading(true);
    setUploadedDocuments([]);
    const folderRef = ref(storage, `Survey-attachement-documents/${surveyID}`);
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
                          &nbsp; <IoMdClose />
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
            <div className={styles.recontacts}>
              <p className={styles.legend}>recontacts</p>
              <div className={styles.content}>
                <p>
                  Marketplace Interface's Recontact Solution makes it easy for
                  you to reach the respondents you need by seamlessly
                  integrating Lucid Marketplace in the process.
                </p>
                <a href="#">Learn More</a>
                <h5>Upload IDs</h5>
                <span>
                  Upload a list of the IDs you need to recontact. You can use
                  the RID and original Survey Number to upload your file or you
                  can use the PID and Supplier ID.
                </span>
                <br />
                <a href="#">Example File</a> <br />
                <br />
                <span>One of the two is required:</span>
                <br />
                <ol>
                  <li>RID and original Survey Number</li>
                  <li>PID and Supplier ID</li>
                </ol>
                <p>
                  If you are recontacting respondents from more than three
                  months ago, you will need to include the Supplier ID and PID.
                </p>
                <div className={styles.select_file_section}>
                  <input type="file" id="upload-file" />
                  <button>Upload</button> &nbsp; <span>or</span> &nbsp;
                  <button>Cancel</button>
                </div>
                <p>
                  For more information on additional recontact options,
                  including how to pass PID-specific variables, visit the
                  <a href="#">Knowledge Hub</a>.
                </p>
                <p>
                  Once you launch your survey, suppliers will be able to target
                  the specific IDs you have uploaded.
                </p>
                <h5>Download Details</h5>
                <p>
                  Recontact details include RID, PID, Supplier ID, Supplier
                  Name, and Additional Parameters.
                </p>
                <button className={styles.download_details_btn}>
                  Download Detials
                </button>
              </div>
            </div>
          </TabPanel>
        </div>
      </div>
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
