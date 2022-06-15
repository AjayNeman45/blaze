import React, { useContext, useEffect, useRef, useState } from "react";
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
import ExportAsModal from "./components/exportAsModal/ExportAsModal";
import { utils, writeFile } from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { projectBaseURL } from "../../utils/commonData";
import { hashids } from "../../index";
import SurveyLogsPdfFormat from "./components/surveyLogsPdfFormat/SurveyLogsPdfFormat";
import { v4 as uuid } from "uuid";
function LiveSurveyLogs() {
  let {
    liveSurveyLogsFilter,
    setLiveSurveyLogsFilter,
    HandleArrayFilters_LiveSurveyLog,
    miratsCodes,
    clientCodes,
    surveydata,
    questionLibrary,
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
  let location = useLocation();
  let [allSessions, setAllSessions] = useState([]);
  let [filteredSessions, setFilteredSessions] = useState([]);
  let [allSuppliers, setAllSuppliers] = useState([]);
  const [openExportAsModal, setOpenExportAsModal] = useState(false);
  const logtype = new URLSearchParams(location.search).get("logtype");
  let [particularSupplierData, setParticularSupplierdata] = useState({});
  const supplier_id = new URLSearchParams(location.search).get("supplier_id");
  let [browsers, setBrowsers] = useState([]);
  let [OS, setOS] = useState([]);
  const [showPdfFormatModal, setShowPdfFormatModal] = useState(false);
  const supplierID = new URLSearchParams(location.search).get("supplier_id");

  // Set All the filters after useeffect and set all the sessions
  useEffect(() => {
    setAllSessions([]);
    if (!liveSurveyLogsFilter?.logtype) {
      if (logtype === "test")
        setLiveSurveyLogsFilter((preob) => ({
          ...preob,
          logtype: "test",
        }));
      else
        setLiveSurveyLogsFilter((preob) => ({
          ...preob,
          logtype: "live",
        }));
    }
    getAllSessions(surveyID, logtype === "test" ? "alpha" : "").then(
      (querysnapshot) => {
        querysnapshot.forEach((doc) => {
          setAllSessions((prear) => [...prear, doc.data()]);
          if (doc.data()?.supplier_account_id === parseInt(supplier_id)) {
            setFilteredSessions((prear) => [...prear, doc.data()]);
          }
        });
      }
    );
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
  }, [logtype, supplier_id]);
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
  }, [liveSurveyLogsFilter]);

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

  useEffect(() => {
    setAllSuppliers([]);
    // Links
    if (supplier_id) {
      let tmpSuppliers = [];
      surveydata?.external_suppliers?.map((supplier) => {
        tmpSuppliers.push(supplier);
      });
      surveydata?.internal_suppliers?.map((supplier) => {
        tmpSuppliers.push(supplier);
      });
      setAllSuppliers(tmpSuppliers);
      let encryptedSrcID = hashids.encode([parseInt(supplier_id)]);
      setLinks({
        live_link: `${projectBaseURL}/blaze/${surveydata?.encrypt?.sid}-${surveydata?.encrypt?.pid}-${surveydata?.encrypt?.cid}/lightningStart?SRCID=${encryptedSrcID}&RID=[%rid%]`,
        test_link: `${projectBaseURL}/blaze/${surveydata?.encrypt?.sid}-${surveydata?.encrypt?.pid}-${surveydata?.encrypt?.cid}/lightningStart?SRCID=${encryptedSrcID}&gamma=alpha&RID=$[%rid%]`,
      });
    } else {
      setLinks({
        live_link: `${projectBaseURL}/${surveydata?.encrypt?.sid}-${surveydata?.encrypt?.pid}-${surveydata?.encrypt?.cid}/lightningStart?SRCID=${surveydata?.internal_suppliers?.[0]?.supplier_account_id}&RID=[%rid%]`,
        test_link: `${projectBaseURL}/${surveydata?.encrypt?.sid}-${surveydata?.encrypt?.pid}-${surveydata?.encrypt?.cid}/lightningStart?SRCID=${surveydata?.internal_suppliers?.[0]?.supplier_account_id}}&gamma=alpha&RID=$[%rid%]`,
      });
    }
  }, [surveydata, liveSurveyLogsFilter]);

  useEffect(() => {
    if (supplier_id) {
      allSuppliers?.map((supplier) => {
        if (supplier?.supplier_account_id === parseInt(supplier_id)) {
          setParticularSupplierdata(supplier);
        }
      });
    }
  }, [allSuppliers]);

  const DownloadAsExcel = () => {
    let logsData = getAllLogsData(allSessions);
    var wb = utils.book_new(),
      ws = utils.json_to_sheet(logsData);

    utils.book_append_sheet(wb, ws, "Sheet1");
    writeFile(wb, `survey-logs-${surveyID}-${supplierID}.xlsx`);
  };
  const surveyLogTable = useRef();

  const DownloadToPDF = () => {
    let input = document.getElementById("survey-log-pdf-template");
    const pdf = new jsPDF("p", "pt", [1200, 1400]);
    pdf.html(input, {
      margin: [0, 0, 0, 0],
      callback: function (doc) {
        doc.save(`survey-logs-${surveyID}-${supplierID}`);
      },
    });
  };
  return (
    <>
      {openExportAsModal ? (
        <ExportAsModal
          visible={openExportAsModal}
          handleClose={() => setOpenExportAsModal(false)}
          downloadAsExcel={DownloadAsExcel}
          downloadToPDF={DownloadToPDF}
          setShowPdfFormatModal={setShowPdfFormatModal}
        />
      ) : null}
      {opensnackbar?.show ? (
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
      ) : null}

      {showPdfFormatModal ? (
        <SurveyLogsPdfFormat
          downloadToPDF={DownloadToPDF}
          survey={surveydata}
          sessions={filteredSessions}
          logType={logtype}
          clientCodes={clientCodes}
          miratsCodes={miratsCodes}
          setShowPdfFormatModal={setShowPdfFormatModal}
        />
      ) : (
        <>
          <Header />
          <Subheader />
          <SurveyInfo />
          <div className={styles.livesurveylogs_container}>
            {/* Left container  */}
            <div className={styles.left_container}>
              <h1 className={styles.title}>Live Survey Logs</h1>
              <div className={styles.filters_attendancelog_container}>
                <h1 className={styles.filter_title}>
                  Filters for Attendance Log
                </h1>

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
                        return (
                          <option value={code?.code} key={uuid()}>
                            {code?.m_desc}
                          </option>
                        );
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
                        return (
                          <option value={code?.code} key={uuid()}>
                            {code?.m_desc}
                          </option>
                        );
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
                        <option value={browser} key={uuid()}>
                          {browser}
                        </option>
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
                        <option value={os} key={uuid()}>
                          {os}
                        </option>
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
                <button
                  className={styles.download_logbtn}
                  onClick={() => setOpenExportAsModal(true)}
                >
                  Download Logs
                </button>
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
                  <p className={styles.card_title}>
                    Sources / Traffic Channels
                  </p>
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
                        <option
                          value={supplier?.supplier_account_id}
                          key={uuid()}
                        >
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
                <div
                  className={cx(styles.linkbody, styles.live_link_container)}
                >
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
                <div
                  className={cx(styles.linkbody, styles.test_link_container)}
                >
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
                surveyLogTableRef={surveyLogTable}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}

const getAllLogsData = (allSessions) => {
  const logsData = [];
  allSessions?.map((session) => {
    let responses = [];
    session?.responses?.map((resp) => {
      let questionCode = `qid_${resp?.question_id}`;
      responses.push({ [questionCode]: resp?.user_response });
    });
    logsData.push({
      date: session?.date?.toDate(),
      surveyStartTime: session?.survey_start_time.toDate().toLocaleString(),
      surveyEndTime: session?.survey_end_time.toDate().toLocaleString(),
      totalSurveyTime: session?.total_survey_time,
      clientCpi: session?.client_cpi,
      browserName: session?.session_technical_details?.browser_name,
      cookieEnabled: session?.session_technical_details?.cookie_enabled,
      deviceType: session?.session_technical_details?.deviceType,
      language: session?.session_technical_details?.language,
      os: session?.session_technical_details?.os,
      platform: session?.session_technical_details?.platform,
      userAgent: session?.session_technical_details?.user_agent,
      version: session?.session_technical_details?.version,
      rid: session?.rid,
      tid: session?.tid,
      clientStatus: session?.client_status,
      miratsStatus: session?.mirats_status,
      ip: session?.geo_data?.ip,
      city: session?.geo_data?.city,
      region: session?.geo_data?.region,
      country: session?.geo_data?.country,
      ...responses[0],
    });
    responses.map((res) => {
      let key = Object.keys(res)[0];
      logsData[logsData.length - 1][key] = res[key];
    });
    console.log(responses);
  });
  return logsData;
};

export default LiveSurveyLogs;
