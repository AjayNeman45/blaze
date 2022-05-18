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

const BuildUrlModal = ({ openModal, setOpenModal }) => {
  const [tab, setTab] = useState(0);
  const [variables, setVariables] = useState({
    response_ID: { status: true, value: "" },
  });

  console.log(variables);
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
  return (
    <Modal
      open={openModal}
      onClose={() => setOpenModal(false)}
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
              <input type="text" />
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
                  <input type="text" className={styles.variable_input} />
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
              <textarea rows={3} />
              <button className={styles.apply_url_btn}>Apply URL</button>
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
              <input type="text" />
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
              <textarea rows={4} />
              <button className={styles.apply_url_btn}>Apply URL</button>
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
