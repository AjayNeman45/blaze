import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import styles from "./BuildUrlModal.module.css";
import cx from "classnames";
import { updateSurvey } from "../../../utils/firebaseQueries";
import { useParams } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "white",
  boxShadow: 24,
  p: 4,
};

const BuildUrlModal = ({
  openModal,
  setOpenModal,
  sData,
  setSData,
  changedBy,
  setChanges,
}) => {
  const [tab, setTab] = useState(0);
  const [surveyUrl, setSurveyUrl] = useState();
  const [responseID, setResponseID] = useState();
  const [finalUrl, setFinalUrl] = useState();
  const [variables, setVariables] = useState({
    response_ID: { status: true, value: "" },
  });
  const { surveyID } = useParams();

  const handleVariableCatChange = (e, variablCat) => {
    setVariables((prevData) => {
      if (e.target.checked) {
        return {
          ...prevData,
          [variablCat]: { status: true, value: "" },
        };
      } else {
        return {
          ...prevData,
          [variablCat]: { status: false, value: "" },
        };
      }
    });
  };

  function replaceQueryParam(param, newval, search) {
    var regex = new RegExp("([?;&])" + param + "[^&;]*[;&]?");
    var query = search.replace(regex, "$1").replace(/&$/, "");

    return (
      (query.length > 2 ? query + "&" : "?") +
      (newval ? param + "=" + newval : "")
    );
  }

  const handleCreateUrl = () => {
    if (responseID) {
      if (surveyUrl.includes(responseID)) {
        let url = replaceQueryParam(responseID, "[%rid%]", surveyUrl);
        setFinalUrl(url);
      } else {
        let url = surveyUrl + `&${responseID}=[%rid%]`;
        setFinalUrl(url);
      }
    }
  };

  const handleApplyUrl = () => {
    let surveyType = !tab ? "live_url" : "test_url";
    let changes = sData?.changes ? sData?.changes : [];
    changedBy.changed_by["updated_at"] = new Date();
    changes.push({
      ...changedBy,
      [surveyType]: {
        changed_to: finalUrl,
        previous_change: sData[surveyType],
      },
    });
    let body = { [surveyType]: finalUrl, changes };
    updateSurvey(String(surveyID), body)
      .then(() => {
        setSData((prevData) => {
          return {
            ...prevData,
            [surveyType]: finalUrl,
          };
        });
        setResponseID();
        setSurveyUrl();
        setFinalUrl();
        setOpenModal(false);
      })
      .catch((err) => {
        console.log(err.message);
        setResponseID();
        setSurveyUrl();
        setFinalUrl();
        setOpenModal(false);
      });
  };

  return (
    <Modal
      open={openModal}
      onClose={() => {
        setSurveyUrl();
        setResponseID();
        setFinalUrl();
        setOpenModal(false);
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div className={styles.tab_container}>
          <Tabs
            value={tab}
            onChange={(e, newValue) => setTab(newValue)}
            aria-label="basic tabs example"
          >
            <Tab label="Live URL" {...a11yProps(0)} />
            <Tab label="Test URL" {...a11yProps(1)} />
          </Tabs>
        </div>

        <TabPanel value={tab} index={0}>
          <div>
            <div className={styles.head_container}>
              <p className={styles.legend}>What your survey's Live URL?</p>
              <small className={styles.desc}>
                Marketplace requires a valid url eg. http://wwww.luc.id
              </small>
              <input
                type="text"
                value={surveyUrl}
                onChange={(e) => setSurveyUrl(e.target.value)}
              />
            </div>

            <div className={styles.variables_container}>
              <p className={styles.legend}>Variables</p>
              <div className={styles.middle_of_variable_container}>
                <small className={styles.desc}>
                  These are URL parameters for respondent or survey-level data
                  that will be passed along when a respondent gets sent to your
                  survey. <a href="#">Learn More</a>
                </small>
                <div className={styles.add_varibale_btn}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Add variable
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value=""
                      label="Add variable"
                      style={{ width: "200px" }}
                    >
                      <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>
              <div className={styles.variable_input_container}>
                <div
                  className={cx(styles.response_id_varaible, styles.container)}
                >
                  <p>
                    Response ID <span className="required">*</span>
                  </p>
                  <input
                    type="text"
                    value={responseID}
                    onChange={(e) => setResponseID(e.target.value)}
                    className={styles.variable_input}
                  />
                </div>
                <div
                  className={cx(styles.paneList_id_variable, styles.container)}
                >
                  <div>
                    <input
                      type="checkbox"
                      id="panelist_id"
                      checked={variables?.paneList_ID?.status}
                      onChange={(e) => {
                        handleVariableCatChange(e, "paneList_ID");
                      }}
                    />
                    &nbsp;
                    <label htmlFor="panelist_id">Panelist ID</label>
                  </div>

                  <input
                    type="text"
                    disabled={!variables?.paneList_ID?.status}
                    className={styles.variable_input}
                  />
                </div>
                <div
                  className={cx(styles.supplier_id_variable, styles.container)}
                >
                  <div>
                    <input
                      type="checkbox"
                      id="supplier_id"
                      checked={variables?.supplier_ID?.status}
                      onChange={(e) => {
                        handleVariableCatChange(e, "supplier_ID");
                      }}
                    />{" "}
                    &nbsp;
                    <label htmlFor="supplier_id">Supplier ID</label>
                  </div>
                  <input
                    type="text"
                    disabled={!variables?.supplier_ID?.status}
                    className={styles.variable_input}
                  />
                </div>
              </div>
            </div>
            <div className={styles.verify_callback_container}>
              <p className={styles.legend}>Verify Callback</p>
              <small className={styles.desc}>
                This variable allows survey-specific redirects by passing the
                survey number into the survey link and requiring that the value
                is passed back in the redirect. This can be disabled on the{" "}
                <a href="#">security page</a>
              </small>
              <input type="text" className={styles.callback_variable_input} />
            </div>
            <hr style={{ background: "black" }} />
            <div className={styles.final_url_container}>
              <textarea
                rows={3}
                value={finalUrl}
                disabled
                onChange={(e) => setFinalUrl(e.target.value)}
              />
              <div className={styles.btns}>
                <button
                  className={styles.create_url_btn}
                  onClick={handleCreateUrl}
                >
                  Create URL
                </button>
                <button
                  className={styles.apply_url_btn}
                  onClick={handleApplyUrl}
                  disabled={finalUrl ? false : true}
                >
                  Apply URL
                </button>
              </div>
            </div>
          </div>
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <div>
            <div className={styles.head_container}>
              <p className={styles.legend}>What your survey's Test URL?</p>
              <small className={styles.desc}>
                Marketplace requires a valid url eg. http://wwww.luc.id
              </small>
              <input
                type="text"
                value={surveyUrl}
                onChange={(e) => setSurveyUrl(e.target.value)}
              />
            </div>

            <div className={styles.variables_container}>
              <p className={styles.legend}>Variables</p>
              <div className={styles.middle_of_variable_container}>
                <small className={styles.desc}>
                  These are URL parameters for respondent or survey-level data
                  that will be passed along when a respondent gets sent to your
                  survey. <a href="#">Learn More</a>
                </small>
                <div className={styles.add_varibale_btn}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Add variable
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      // value={10}
                      label="Add variable"
                      style={{ width: "200px" }}
                    >
                      <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>
            </div>
            <div className={styles.variable_input_container}>
              <div
                className={cx(styles.response_id_varaible, styles.container)}
              >
                <p>
                  Response ID <span className="required">*</span>
                </p>
                <input
                  type="text"
                  value={responseID}
                  onChange={(e) => setResponseID(e.target.value)}
                  className={styles.variable_input}
                />
              </div>
              <div
                className={cx(styles.paneList_id_variable, styles.container)}
              >
                <div>
                  <input
                    type="checkbox"
                    id="panelist_id"
                    checked={variables?.paneList_ID?.status}
                    onChange={(e) => {
                      handleVariableCatChange(e, "paneList_ID");
                    }}
                  />
                  &nbsp;
                  <label htmlFor="panelist_id">Panelist ID</label>
                </div>

                <input
                  type="text"
                  disabled={!variables?.paneList_ID?.status}
                  className={styles.variable_input}
                />
              </div>
              <div
                className={cx(styles.supplier_id_variable, styles.container)}
              >
                <div>
                  <input
                    type="checkbox"
                    id="supplier_id"
                    checked={variables?.supplier_ID?.status}
                    onChange={(e) => {
                      handleVariableCatChange(e, "supplier_ID");
                    }}
                  />{" "}
                  &nbsp;
                  <label htmlFor="supplier_id">Supplier ID</label>
                </div>
                <input
                  type="text"
                  disabled={!variables?.supplier_ID?.status}
                  className={styles.variable_input}
                />
              </div>
            </div>
            <div className={styles.verify_callback_container}>
              <p className={styles.legend}>Verify Callback</p>
              <small className={styles.desc}>
                This variable allows survey-specific redirects by passing the
                survey number into the survey link and requiring that the value
                is passed back in the redirect. This can be disabled on the{" "}
                <a href="#">security page</a>
              </small>
              <input type="text" className={styles.callback_variable_input} />
            </div>

            <hr style={{ background: "black" }} />
            <div className={styles.final_url_container}>
              <textarea
                rows={4}
                value={finalUrl}
                disabled
                onChange={(e) => setFinalUrl(e.target.value)}
              />
              <div className={styles.btns}>
                <button
                  className={styles.create_url_btn}
                  onClick={handleCreateUrl}
                >
                  Create URL
                </button>
                <button
                  className={styles.apply_url_btn}
                  onClick={handleApplyUrl}
                  disabled={finalUrl ? false : true}
                >
                  Apply URL
                </button>
              </div>
            </div>
          </div>
        </TabPanel>
      </Box>
    </Modal>
  );
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
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

export default BuildUrlModal;
