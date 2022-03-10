import React, { useReducer, useState } from "react";
import Header from "../../components/header/Header";
import Subheader from "../../components/subheader/Subheader";
import styles from "./Security.module.css";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { Alert, Snackbar } from "@mui/material";
import IpExclusions from "./IpExclusions";
import RidExclusions from "./RidExclusions";

import { v4 as uuid } from "uuid";
import SecuritySettings from "./SecuritySettings";
import SurveyInfo from "../../components/survey-info/SurveyInfo";

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

const screenerSide = [
  {
    name: "completes",
    not_allowed: true,
    single_survey: "block",
    survey_grp: "block",
  },
  {
    name: "terminates",
    not_allowed: false,
    single_survey: "block",
    survey_grp: "block",
  },
  {
    name: "security failures",
    not_allowed: false,
    single_survey: "block",
    survey_grp: "block",
  },
  {
    name: "overquota",
    not_allowed: false,
    single_survey: "block",
    survey_grp: "block",
  },
  {
    name: "in screener/ drops",
    not_allowed: false,
    single_survey: "block",
    survey_grp: "block",
  },
  {
    name: "pre client survey processes",
    not_allowed: false,
    single_survey: "block",
    survey_grp: "block",
  },
  {
    name: "financial terms",
    not_allowed: false,
    single_survey: "allow",
    survey_grp: "allow",
  },
];

const clientSide = [
  {
    name: "completes",
    not_allowed: false,
    single_survey: "block",
    survey_grp: "block",
  },
  {
    name: "terminates",
    not_allowed: false,
    single_survey: "block",
    survey_grp: "block",
  },
  {
    name: "security failures",
    not_allowed: false,
    single_survey: "block",
    survey_grp: "block",
  },
  {
    name: "overquota",
    not_allowed: false,
    single_survey: "block",
    survey_grp: "block",
  },
];

const Security = () => {
  const [value, setValue] = useState(0); // for left side tab panel
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <>
      <Header />
      <Subheader />
      <div className={styles.security_page}>
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
            <Tab label="Security Settings" {...a11yProps(0)} />
            <Tab label="Re-Entry Configuration" {...a11yProps(1)} />
            <Tab label="IP Address Exclusion" {...a11yProps(2)} />
            <Tab label="RID Exclusion" {...a11yProps(3)} />
          </Tabs>
          <TabPanel value={value} index={0} style={{ width: "80%" }}>
            <SecuritySettings setOpenSnackbar={setOpenSnackbar} />
          </TabPanel>
          <TabPanel value={value} index={1} style={{ width: "80%" }}>
            <div className={styles.ReEntryConfig_div}>
              <div className={styles.Screener_Side}>
                <p>Screener Side</p>
                <table>
                  <tr>
                    <td></td>
                    <td>Single Survey</td>
                    <td>Single Group</td>
                  </tr>
                  <tr>
                    <td>Completes</td>
                    <td>
                      <select name="select">
                        <option>Bolck</option>
                      </select>
                    </td>
                    <td>
                      <select name="select">
                        <option>Bolck</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>Terminates</td>
                    <td>
                      <select name="select">
                        <option>Bolck</option>
                      </select>
                    </td>
                    <td>
                      <select name="select">
                        <option>Bolck</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>Security Failuar</td>
                    <td>
                      <select name="select">
                        <option>Bolck</option>
                      </select>
                    </td>
                    <td>
                      <select name="select">
                        <option>Bolck</option>
                      </select>
                    </td>
                  </tr>

                  <tr>
                    <td>Overquota</td>
                    <td>
                      <select name="select">
                        <option>Bolck</option>
                      </select>
                    </td>
                    <td>
                      <select name="select">
                        <option>Bolck</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>In Screener/Drops</td>
                    <td>
                      <select name="select">
                        <option>Bolck</option>
                      </select>
                    </td>
                    <td>
                      <select name="select">
                        <option>Bolck</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>Pre Client Survey Processes</td>
                    <td>
                      <select name="select">
                        <option>Bolck</option>
                      </select>
                    </td>
                    <td>
                      <select name="select">
                        <option>Bolck</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>Financial Terms</td>
                    <td>
                      <select name="select">
                        <option>Bolck</option>
                      </select>
                    </td>
                    <td>
                      <select name="select">
                        <option>Bolck</option>
                      </select>
                    </td>
                  </tr>
                </table>
              </div>

              {/* Client Side  */}

              <div className={styles.Client_Side}>
                <p>Client Side</p>
                <table>
                  <tr>
                    <td></td>
                    <td>Single Survey</td>
                    <td>Single Group</td>
                  </tr>
                  <tr>
                    <td>Completes</td>
                    <td>
                      <select name="select">
                        <option>Bolck</option>
                      </select>
                    </td>
                    <td>
                      <select name="select">
                        <option>Bolck</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>Terminates</td>
                    <td>
                      <select name="select">
                        <option>Bolck</option>
                      </select>
                    </td>
                    <td>
                      <select name="select">
                        <option>Bolck</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>Security Failuar</td>
                    <td>
                      <select name="select">
                        <option>Bolck</option>
                      </select>
                    </td>
                    <td>
                      <select name="select">
                        <option>Bolck</option>
                      </select>
                    </td>
                  </tr>

                  <tr>
                    <td>Overquota</td>
                    <td>
                      <select name="select">
                        <option>Bolck</option>
                      </select>
                    </td>
                    <td>
                      <select name="select">
                        <option>Bolck</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>In Screener/Drops</td>
                    <td>
                      <select name="select">
                        <option>Bolck</option>
                      </select>
                    </td>
                    <td>
                      <select name="select">
                        <option>Bolck</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>Pre Client Survey Processes</td>
                    <td>
                      <select name="select">
                        <option>Bolck</option>
                      </select>
                    </td>
                    <td>
                      <select name="select">
                        <option>Bolck</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>Financial Terms</td>
                    <td>
                      <select name="select">
                        <option>Bolck</option>
                      </select>
                    </td>
                    <td>
                      <select name="select">
                        <option>Bolck</option>
                      </select>
                    </td>
                  </tr>
                </table>
              </div>
              <div className={styles.btn_container}>
                <button type="Submit" className={styles.submit_btn}>
                  Save
                </button>
                <button type="button" className={styles.delete_btn}>
                  Delete All Records
                </button>
              </div>
            </div>
          </TabPanel>
          <TabPanel value={value} index={2} style={{ width: "80%" }}>
            <IpExclusions />
          </TabPanel>
          <TabPanel value={value} index={3} style={{ width: "80%" }}>
            <RidExclusions />
          </TabPanel>
        </div>
      </div>

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
          Security settings changed successfully
        </Alert>
      </Snackbar>
    </>
  );
};

export default Security;
