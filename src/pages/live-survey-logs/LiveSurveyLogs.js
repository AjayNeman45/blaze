import React, { useContext, useEffect, useState } from "react";
import styles from "./livesurveylogs.module.css";
import Header from "../../components/header/Header";
import Subheader from "../../components/subheader/Subheader";
import SurveyInfo from "../../components/survey-info/SurveyInfo";
import LiveSurveyLogsContext from "./LiveSurveyLogsContext";
import { useParams, useLocation } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";
import Table from "./components/table/Table";
import { getAllSessions } from "../../utils/firebaseQueries";
import cx from "classnames";

function LiveSurveyLogs() {
  let {
    liveSurveyLogsFilter,
    setLiveSurveyLogsFilter,
    HandleArrayFilters_LiveSurveyLog,
    miratsCodes,
    clientCodes,
    surveydata,
  } = useContext(LiveSurveyLogsContext);
  // Snackbar
  const [opensnackbar, setOpenSnackbar] = useState({}); //{show:false,severity:'success',msg:"Modify redirects saved successfully"}
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar({});
  };

  let [links, setLinks] = useState({ live_link: "", test_link: "" });

  let { surveyID } = useParams();
  let [allSessions, setAllSessions] = useState([]);
  let [filteredSessions, setFilteredSessions] = useState([]);
  let [allSuppliers, setAllSuppliers] = useState([]);

  const location = useLocation();
  const logtype = new URLSearchParams(location.search).get("logtype");

  const supplier_id = new URLSearchParams(location.search).get("supplier_id");

  // Set All the filters after useeffect and set all the sessions
  useEffect(() => {
    setAllSessions([]);
    if (!liveSurveyLogsFilter?.logtype) {
      if (logtype === "test")
        setLiveSurveyLogsFilter((preob) => ({ ...preob, logtype: "test" }));
      else setLiveSurveyLogsFilter((preob) => ({ ...preob, logtype: "live" }));
    }
    console.log(liveSurveyLogsFilter?.logtype);
    getAllSessions(
      surveyID,
      liveSurveyLogsFilter?.logtype === "test" ? "alpha" : ""
    ).then((querysnapshot) => {
      querysnapshot.forEach((doc) => {
        setAllSessions((prear) => [...prear, doc.data()]);
        setFilteredSessions((prear) => [...prear, doc.data()]);
      });
    });

    if (supplier_id) {
      setLiveSurveyLogsFilter((preob) => ({
        ...preob,
        supplier_id: supplier_id,
      }));
    } else {
      setLiveSurveyLogsFilter((preob) => ({
        ...liveSurveyLogsFilter,
        supplier_id: "all",
      }));
    }
  }, [liveSurveyLogsFilter?.logtype]);
  // Setting the sessions according to live and test
  useEffect(() => {
    setFilteredSessions([]);
    setFilteredSessions(allSessions);
    if (liveSurveyLogsFilter?.supplier_id) {
      if (liveSurveyLogsFilter?.supplier_id != "all") {
        setFilteredSessions((prear) =>
          [...prear].filter((session) => {
            return (
              session?.supplier_account_id ===
              parseInt(liveSurveyLogsFilter?.supplier_id)
            );
          })
        );
      }
    }
    if (liveSurveyLogsFilter?.device_type) {
      if (liveSurveyLogsFilter?.device_type?.length) {
        setFilteredSessions((prear) => {
          return prear.filter((session) => {
            if (
              liveSurveyLogsFilter?.device_type.includes(
                session?.session_techincal_details?.deviceType?.toLowerCase()
              )
            ) {
              return session;
            }
          });
        });
      }
    }

    if (liveSurveyLogsFilter?.client_status) {
      if (liveSurveyLogsFilter?.client_status !== "") {
        setFilteredSessions((prear) => {
          return prear.filter((session) => {
            if (
              session?.client_status ===
              parseInt(liveSurveyLogsFilter?.client_status)
            ) {
              return session;
            }
          });
        });
      }
    }
    if (liveSurveyLogsFilter?.mirats_status) {
      if (liveSurveyLogsFilter?.mirats_status !== "") {
        setFilteredSessions((prear) => {
          return prear.filter((session) => {
            if (
              session?.mirats_status ===
              parseInt(liveSurveyLogsFilter?.mirats_status)
            ) {
              return session;
            }
          });
        });
      }
    }

    if (liveSurveyLogsFilter?.fingerprint_match != undefined) {
      if (liveSurveyLogsFilter?.fingerprint_match !== "") {
        if (liveSurveyLogsFilter?.fingerprint_match === "true") {
          const sess = filteredSessions.reduce((a, e) => {
            a[e.fingerprint] = ++a[e.fingerprint] || 0;
            return a;
          }, {});
          setFilteredSessions((prear) => {
            return prear?.filter((session) => sess[session?.fingerprint] > 0);
          });
          console.log("Lookup is", sess);
        } else {
          const sess = filteredSessions.reduce((a, e) => {
            a[e.fingerprint] = ++a[e.fingerprint] || 0;
            return a;
          }, {});
          setFilteredSessions((prear) => {
            return prear?.filter((session) => sess[session?.fingerprint] === 0);
          });
        }
      }
    }
    if (liveSurveyLogsFilter?.browser != undefined) {
      if (liveSurveyLogsFilter?.browser !== "") {
        setFilteredSessions((prear) => {
          return prear?.filter((session) => {
            return (
              session?.session_techincal_details?.browser_name ===
              liveSurveyLogsFilter?.browser
            );
          });
        });
      }
    }
    if (liveSurveyLogsFilter?.os != undefined) {
      if (liveSurveyLogsFilter?.os !== "") {
        setFilteredSessions((prear) => {
          return prear?.filter((session) => {
            return (
              session?.session_techincal_details?.os ===
              liveSurveyLogsFilter?.os
            );
          });
        });
      }
    }
  }, [liveSurveyLogsFilter, allSessions]);

  // console.log("Sessions", allSessions);

  // console.log(liveSurveyLogsFilter)
  let [browsers, setBrowsers] = useState([]);
  let [OS, setOS] = useState([]);
  // Set browser and OS select option useEffect
  useEffect(() => {
    allSessions?.map((session) => {
      setBrowsers((prear) => {
        if (
          session?.session_techincal_details?.browser_name !== "" ||
          session?.session_techincal_details?.browser_name != undefined
        ) {
          if (
            !prear?.includes(session?.session_techincal_details?.browser_name)
          )
            return [...prear, session?.session_techincal_details?.browser_name];
        }
        return [...prear];
      });

      setOS((prear) => {
        if (
          session?.session_techincal_details?.os !== "" ||
          session?.session_techincal_details?.os != undefined
        ) {
          if (!prear?.includes(session?.session_techincal_details?.os))
            return [...prear, session?.session_techincal_details?.os];
        }
        return [...prear];
      });
    });
  }, [allSessions]);
  // console.log(browsers);

  useEffect(() => {
    setAllSuppliers([]);
    // Links
    if (supplier_id) {
      surveydata?.external_suppliers?.map((supplier) => {
        setAllSuppliers((prear) => [...prear, supplier]);
      });
      setLinks({
        live_link: `Live URL= https://miratsblaze.netlify.com/blaze/${surveydata?.encrypt?.sid}-${surveydata?.encrypt?.pid}-${surveydata?.encrypt?.cid}/lightningStart?SRCID=${supplier_id}&RID=[%rid%]`,
        test_link: `Test URL= https://miratsblaze.netlify.com/blaze/${surveydata?.encrypt?.sid}-${surveydata?.encrypt?.pid}-${surveydata?.encrypt?.cid}/lightningStart?SRCID=${supplier_id}&alpha=gamma&RID=$[%rid%]`,
      });
    } else {
      setLinks({
        live_link: `Live URL= https://miratsblaze.netlify.com/blaze/${surveydata?.encrypt?.sid}-${surveydata?.encrypt?.pid}-${surveydata?.encrypt?.cid}/lightningStart?SRCID=${surveydata?.internal_suppliers?.[0]?.supplier_account_id}&RID=[%rid%]`,
        test_link: `Test URL= https://miratsblaze.netlify.com/blaze/${surveydata?.encrypt?.sid}-${surveydata?.encrypt?.pid}-${surveydata?.encrypt?.cid}/lightningStart?SRCID=${surveydata?.internal_suppliers?.[0]?.supplier_account_id}}&alpha=gamma&RID=$[%rid%]`,
      });
    }
  }, [surveydata, liveSurveyLogsFilter]);

  let [particularSupplierData, setParticularSupplierdata] = useState({});
  useEffect(() => {
    if (supplier_id) {
      allSuppliers?.map((supplier) => {
        if (supplier?.supplier_account_id === parseInt(supplier_id)) {
          setParticularSupplierdata(supplier);
        }
      });
    }
  }, [allSuppliers]);

  return (
    <>
      {opensnackbar?.show && (
        <Snackbar
          open={opensnackbar?.show}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={opensnackbar?.severity}
            sx={{ width: "100%" }}
          >
            {opensnackbar?.msg}
          </Alert>
        </Snackbar>
      )}
      <Header />
      <Subheader />
      <SurveyInfo />
      <div className={styles.livesurveylogs_container}>
        {/* Left container  */}
        <div className={styles.left_container}>
          <h1 className={styles.title}>Live Survey Logs</h1>
          <div className={styles.filters_attendancelog_container}>
            <h1 className={styles.filter_title}>Filters for Attendance Log</h1>

            <div className={styles.filtercontainer}>
              <div className={styles.filtercard}>
                <p className={styles.card_title}>Date</p>
                <select className={styles.card_select}>
                  <option value="">This Month</option>
                  <option value="">Previous Month</option>
                </select>
              </div>
              <div className={styles.filtercard}>
                <p className={styles.card_title}>Mirats Status</p>
                <select
                  className={styles.card_select}
                  onChange={(e) => {
                    console.log(e.target.value);
                    setLiveSurveyLogsFilter({
                      ...liveSurveyLogsFilter,
                      mirats_status: e.target.value,
                    });
                  }}
                >
                  <option value="">Select Mirats Status</option>
                  {miratsCodes?.map((code) => {
                    return <option value={code?.code}>{code?.m_desc}</option>;
                  })}
                </select>
              </div>
              <div className={styles.filtercard}>
                <p className={styles.card_title}>Client Status</p>
                <select
                  className={styles.card_select}
                  onChange={(e) => {
                    console.log(e.target.value);
                    setLiveSurveyLogsFilter({
                      ...liveSurveyLogsFilter,
                      client_status: e.target.value,
                    });
                  }}
                >
                  <option value="">Select Client Status</option>
                  {clientCodes?.map((code) => {
                    return <option value={code?.code}>{code?.m_desc}</option>;
                  })}
                </select>
              </div>
              <div className={styles.filtercard}>
                <p className={styles.card_title}>Fingerprint Match</p>
                <select
                  className={styles.card_select}
                  onChange={(e) =>
                    setLiveSurveyLogsFilter({
                      ...liveSurveyLogsFilter,
                      fingerprint_match: e.target.value,
                    })
                  }
                >
                  <option value="">Both</option>
                  <option value={"true"}>true</option>
                  <option value={"false"}>false</option>
                </select>
              </div>
            </div>
            <div className={styles.filtercontainer}>
              <div className={styles.filtercard}>
                <p className={styles.card_title}>Browser</p>
                <select
                  className={styles.card_select}
                  onChange={(e) =>
                    setLiveSurveyLogsFilter({
                      ...liveSurveyLogsFilter,
                      browser: e.target.value,
                    })
                  }
                >
                  <option value="">Select Browser</option>
                  {browsers?.map((browser) => (
                    <option value={browser}>{browser}</option>
                  ))}
                </select>
              </div>
              <div className={styles.filtercard}>
                <p className={styles.card_title}>OS</p>
                <select
                  className={styles.card_select}
                  onChange={(e) =>
                    setLiveSurveyLogsFilter({
                      ...liveSurveyLogsFilter,
                      os: e.target.value,
                    })
                  }
                >
                  <option value="">Select OS</option>
                  {OS?.map((os) => (
                    <option value={os}>{os}</option>
                  ))}
                </select>
              </div>
              <div className={styles.filtercard} style={{ width: "100%" }}>
                <p className={styles.card_title}>Device Type</p>
                <div>
                  <button
                    className={
                      liveSurveyLogsFilter?.device_type.includes("desktop")
                        ? styles.device_typebtn_active
                        : styles.device_typebtn
                    }
                    onClick={() =>
                      liveSurveyLogsFilter?.device_type.includes("desktop")
                        ? HandleArrayFilters_LiveSurveyLog(
                            "device_type",
                            "desktop",
                            false
                          )
                        : HandleArrayFilters_LiveSurveyLog(
                            "device_type",
                            "desktop",
                            true
                          )
                    }
                  >
                    Desktop
                  </button>
                  <button
                    className={
                      liveSurveyLogsFilter?.device_type.includes("mobile")
                        ? styles.device_typebtn_active
                        : styles.device_typebtn
                    }
                    onClick={() =>
                      liveSurveyLogsFilter?.device_type.includes("mobile")
                        ? HandleArrayFilters_LiveSurveyLog(
                            "device_type",
                            "mobile",
                            false
                          )
                        : HandleArrayFilters_LiveSurveyLog(
                            "device_type",
                            "mobile",
                            true
                          )
                    }
                  >
                    Mobile
                  </button>
                  <button
                    className={
                      liveSurveyLogsFilter?.device_type.includes("tablet")
                        ? styles.device_typebtn_active
                        : styles.device_typebtn
                    }
                    onClick={() =>
                      liveSurveyLogsFilter?.device_type.includes("tablet")
                        ? HandleArrayFilters_LiveSurveyLog(
                            "device_type",
                            "tablet",
                            false
                          )
                        : HandleArrayFilters_LiveSurveyLog(
                            "device_type",
                            "tablet",
                            true
                          )
                    }
                  >
                    Tablet
                  </button>
                  <button
                    className={
                      liveSurveyLogsFilter?.device_type.includes("smarttv")
                        ? styles.device_typebtn_active
                        : styles.device_typebtn
                    }
                    onClick={() =>
                      liveSurveyLogsFilter?.device_type.includes("smarttv")
                        ? HandleArrayFilters_LiveSurveyLog(
                            "device_type",
                            "smarttv",
                            false
                          )
                        : HandleArrayFilters_LiveSurveyLog(
                            "device_type",
                            "smarttv",
                            true
                          )
                    }
                  >
                    Smart TV
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Right Container  */}
        <div className={styles.right_container}>
          <div>
            <button className={styles.download_logbtn}>Download Logs</button>
          </div>
          <div>
            <select
              className={styles.status_select}
              value={particularSupplierData?.vendor_status}
              name=""
              id=""
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div>
            <div className={styles.filtercard}>
              <p className={styles.card_title}>Sources / Traffic Channels</p>
              <select
                className={styles.card_select}
                onChange={(e) => {
                  // console.log("Supplier is", e.target.value);
                  setLiveSurveyLogsFilter({
                    ...liveSurveyLogsFilter,
                    supplier_id: e.target.value,
                  });
                }}
                value={
                  liveSurveyLogsFilter?.supplier_id
                    ? liveSurveyLogsFilter?.supplier_id
                    : "all"
                }
              >
                <option value="all">All Suppliers</option>
                {allSuppliers?.map((supplier) => {
                  return (
                    <option value={supplier?.supplier_account_id}>
                      {supplier?.supplier_account}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div>
            <div className={styles.filtercard}>
              <p className={styles.card_title}>Log Type</p>
              <div style={{ marginTop: "10px", display: "flex" }}>
                <button
                  className={
                    liveSurveyLogsFilter.logtype === "live"
                      ? styles.logType_btn_active
                      : styles.logType_btn
                  }
                  onClick={() =>
                    setLiveSurveyLogsFilter({
                      ...liveSurveyLogsFilter,
                      logtype: "live",
                    })
                  }
                >
                  Live
                </button>
                <button
                  className={
                    // liveSurveyLogsFilter?.log_type.includes("test")
                    //   ? styles.logType_btn_active
                    //   : styles.logType_btn
                    liveSurveyLogsFilter?.logtype === "test"
                      ? styles.logType_btn_active
                      : styles.logType_btn
                  }
                  onClick={() =>
                    setLiveSurveyLogsFilter({
                      ...liveSurveyLogsFilter,
                      logtype: "test",
                    })
                  }
                >
                  Test
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Live Test Link for sessions  */}
      <div className={styles.full_livesurveylog_container}>
        <div className={styles.mainLinkContainer}>
          <div className={styles.linkContainer}>
            <div className={styles.linkHeader}>
              <h1>
                Live / Test Links for Sessions - "
                {supplier_id
                  ? particularSupplierData?.supplier_account
                  : "Mirats Quanto"}
                "
              </h1>
              <CopyToClipboard
                text={`${links?.live_link}\n${links?.test_link}`}
              >
                <button
                  onClick={() => {
                    setOpenSnackbar({
                      severity: "success",
                      show: true,
                      msg: "Link copied",
                    });
                  }}
                >
                  COPY BOTH LINKS
                </button>
              </CopyToClipboard>
            </div>
            <div className={cx(styles.linkbody, styles.live_link_container)}>
              <p>LIVE LINK</p>
              <div className={styles.linkCard}>
                <input
                  type="text"
                  value={links?.live_link}
                  placeholder="Copy Link From  Here "
                  disabled
                />
                <CopyToClipboard text={links?.live_link}>
                  <button
                    onClick={() => {
                      setOpenSnackbar({
                        severity: "success",
                        show: true,
                        msg: "Link copied",
                      });
                    }}
                  >
                    COPY
                  </button>
                </CopyToClipboard>
              </div>
            </div>
            <div className={cx(styles.linkbody, styles.test_link_container)}>
              <p>TEST LINK</p>
              <div className={styles.linkCard}>
                <input
                  type="text"
                  value={links?.test_link}
                  placeholder="Copy Link From  Here "
                  disabled
                />
                <CopyToClipboard text={links?.test_link}>
                  <button
                    onClick={() => {
                      setOpenSnackbar({
                        severity: "success",
                        show: true,
                        msg: "Link copied",
                      });
                    }}
                  >
                    COPY
                  </button>
                </CopyToClipboard>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.table_container}>
          <Table
            // allSessions={allSessions}
            allSessions={filteredSessions}
            surveyid={surveyID}
            project_no={surveydata?.project_id}
            miratsCodes={miratsCodes}
            clientCodes={clientCodes}
          />
        </div>
      </div>
    </>
  );
}

export default LiveSurveyLogs;
