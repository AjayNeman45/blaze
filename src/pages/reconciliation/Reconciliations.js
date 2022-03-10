import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom/cjs/react-router-dom.min";
import Header from "../../components/header/Header";
import Subheader from "../../components/subheader/Subheader";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import styles from "./Reconciliations.module.css";
import DataAnalysis from "./DataAnalysis";
import RespondantAnswer from "./RespondantAnswer";
import Reconcile from "./Reconcile";
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

const Reconciliations = () => {
  const [value, setValue] = useState(0);
  // for left tab panel
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Header />
      <Subheader />
      <div className={styles.reconciliation_page}>
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
            <Tab label="Data Analysis" {...a11yProps(0)} />
            <Tab label="Reconciliations" {...a11yProps(1)} />
            <Tab label="Respondant answer" {...a11yProps(2)} />
            <Tab label="Term Details" {...a11yProps(3)} />
          </Tabs>
          <TabPanel value={value} index={0} style={{ width: "80%" }}>
            <DataAnalysis />
          </TabPanel>
          <TabPanel value={value} index={1} style={{ width: "80%" }}>
            <Reconcile />
          </TabPanel>
          <TabPanel value={value} index={2} style={{ width: "80%" }}>
            <RespondantAnswer />
          </TabPanel>
          <TabPanel value={value} index={3} style={{ width: "80%" }}>
            <div className={styles.term_details_section}>
              <div className={styles.term_details_select_fields}>
                <div className={styles.section}>
                  <span>Supplier</span>
                  <select>
                    <option>Please Select a supplier</option>
                  </select>
                </div>
                <div className={styles.section}>
                  <span>Link Type</span>
                  <select>
                    <option>--All--</option>
                    <option>APIDelivered / Standalone</option>
                    <option>Offerwall / Standalone</option>
                    <option>Passthrough / Standalone</option>
                    <option>Targeted / Standalone</option>
                    <option>Yeild Management / Standalone</option>
                  </select>
                </div>
                <div className={styles.section}>
                  <span>Target Type</span>
                  <select>
                    <option>--All</option>
                    <option>Targeted</option>
                    <option>Route</option>
                  </select>
                </div>
              </div>
              <div className={styles.generate_report_btn}>
                <button>Generate Report</button>
              </div>
            </div>
          </TabPanel>
        </div>
      </div>
    </>
  );
};

export const ReconciliationTable = ({ sessionsCopy, showTable }) => {
  return (
    <>
      {!sessionsCopy.length ? (
        <p style={{ textAlign: "center", color: "gray" }}>No Result Found</p>
      ) : (
        <table id="table-to-xls" style={{ display: showTable ? "" : "none" }}>
          <thead>
            <tr>
              <th>RID</th>
              <th>SRC ID</th>
              <th>Survey Number</th>
              <th>Survey Name</th>
              <th>Client Status</th>
              <th>IP</th>
              <th>Mirats Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {sessionsCopy?.map((session) => {
              if (Object.keys(session).length) {
                return (
                  <tr>
                    <td>{session?.session_data?.rid}</td>
                    <td>{session?.session_data?.srcid}</td>
                    <td>{session?.survey_id}</td>
                    <td>{session?.survey_name}</td>
                    <td>{session?.session_data?.client_status}</td>
                    <td>{session?.session_data?.geo_data?.ip}</td>
                    <td>{session?.session_data?.mirats_status}</td>
                    <td>
                      {new Date(
                        session?.session_data?.date?.seconds * 1000
                      ).toLocaleDateString("en-US")}
                    </td>
                  </tr>
                );
              }
            })}
          </tbody>
        </table>
      )}
    </>
  );
};

export default Reconciliations;
