import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { createContext, useContext, useState, useEffect } from "react";
import { useLocation, useHistory, useParams } from "react-router-dom";
import { decryptText, encryptText } from "../../utils/enc-dec.utils";
import { ClientJS } from "clientjs";
import {
  addSession,
  addTestSession,
  getAllSurveys,
  getSurvey,
  getAllSessions,
} from "../../utils/firebaseQueries";
import Hashids from "hashids";

const client = new ClientJS();
// const windowClient = new window.ClientJS();

const fingerPrint = client.getFingerprint();
const BlazeContext = createContext();

export const useBlazeContext = () => {
  return useContext(BlazeContext);
};
const hashids = new Hashids("My Project");

var id = hashids.encodeHex("507f1f77bcf86cd799439011"); // y42LW46J9luq3Xq9XMly
var hex = hashids.decodeHex(id);

const BlazeContextProvider = ({ children }) => {
  const { encryptedID } = useParams();
  const [baseLoading, setBaseLoading] = useState(false);
  const [errCode, setErrCode] = useState(null);
  const [errMsg, setErrMsg] = useState(null);
  const [sessionTechnicalDetails, setSessionTechnicalDetails] = useState(null);
  const [geoData, setGeoData] = useState(null);
  const [verificationDone, setVerificationDone] = useState(false);
  const [responses, setResponses] = useState({});
  const [finalVerification, setFinalverification] = useState();
  const [survey, setSurvey] = useState("");
  const [allSurveys, setAllSurveys] = useState([]);
  const [allSessions, setAllSessions] = useState([]);
  const [ip, setIp] = useState(null);

  const location = useLocation();

  const srcID = new URLSearchParams(location.search).get("SRCID");
  const rID = new URLSearchParams(location.search).get("RID");
  let gamma = new URLSearchParams(location.search).get("gamma");
  const default_responses = new URLSearchParams(location.search).get(
    "responses"
  );

  localStorage.setItem("srcID", srcID);
  localStorage.setItem("rID", rID);
  localStorage.setItem("gamma", gamma);
  localStorage.setItem("default_responses", default_responses);

  const history = useHistory();

  const supplier_account_id = parseInt(hashids.decode(srcID)[0]);
  const surveyID = decryptText(
    encryptedID?.split("-")[0] ? encryptedID?.split("-")[0] : ""
  );
  const projectID = decryptText(
    encryptedID?.split("-")[1] ? encryptedID?.split("-")[1] : ""
  );
  const countryID = decryptText(
    encryptedID?.split("-")[2] ? encryptedID?.split("-")[2] : ""
  );

  // setting error code and message
  const setErrCodeAndMsg = (code, msg) => {
    setErrCode(code);
    setErrMsg(msg);
    setBaseLoading(false);
  };

  function check_cookie_name(name) {
    var match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    if (match) {
      return match[2];
    }
    return false;
  }

  useEffect(() => {
    getAllSurveys().then((surveys) => {
      let surveysData = [];
      surveys.forEach((survey) => {
        if (survey.data()?.survey_id === parseInt(surveyID))
          setSurvey(survey.data());
        surveysData.push(survey.data());
      });
      setAllSurveys(surveysData);
    });

    getAllSessions(surveyID, gamma).then((sessions) => {
      let sessionsTmp = [];
      sessions?.forEach((session) => {
        sessionsTmp.push(session.data());
      });
      setAllSessions(sessionsTmp);
    });
  }, [gamma, surveyID]);

  useEffect(() => {
    if (!encryptedID && !srcID && !rID) {
      setErrCode(1005);
      setErrMsg(
        "Uh-oh, You entered wrong URL. <span>Here is a solution:</span> We thank you for showing interest in this opportunity. Go to the invitation portal and get back to us with proper URL or Email us at <span>panel_support@miratsinsights.com</span> with the screenshot and error code."
      );
    } else if (!encryptedID && (!srcID || !rID)) {
      setErrCode(1006);
      setErrMsg(
        "Uh-oh, Your URL seems like it's broken. <span>Here is a solution:</span> We thank you for showing interest in this opportunity. Go to the invitation portal and get back to us with proper URL or Email us at <span>panel_support@miratsinsights.com</span> with the screenshot and error code."
      );
    } else if (!srcID && !rID) {
      setErrCode(1004);
      setErrMsg(
        "Uh-oh, It doesn't looks like you are having proper credential to continue this survey. <br /><span>Here is a solution : </span> We thank you for showing interest in this opportunity. Go to the invitation portal and get back to us with proper URL or Email us at <span>panel_support@miratsinsights.com</span>  with the screenshot and error code."
      );
    } else if (!encryptedID) {
      setErrCode(1003);
      setErrMsg(
        "Uh-oh, Your URL doesn't have any valid project configuration. <span>Here is a solution : </span> We thank you for showing interest in this opportunity. Go to the invitation portal and get back to us with proper URL or Email us at <span>panel_support@miratsinsights.com</span> with the screenshot and error code."
      );
    } else if (!srcID) {
      setErrCode(1002);
      setErrMsg(
        "Uh-oh, Looks like your source you are doing the survey is not configured properly.<span> Here is a solution : </span> We thank you for showing interest in this opportunity. Go to the invitation portal and get back to us with proper URL or Email us at <span>panel_support@miratsinsights.com</span> with the screenshot and error code."
      );
    } else if (!rID) {
      setErrCode(1001);
      setErrMsg(
        "Uh-oh, Looks like your respondent id is not configured properly. <span>Here is a solution : </span> We thank you for showing interest in this opportunity. Go to the invitation portal and get back to us with proper URL or Email us at <span>panel_support@miratsinsights.com</span> with the screenshot and error code."
      );
    } else {
      setBaseLoading(true);
      fetchBackgroundDetails();
    }
  }, [srcID, rID, encryptedID]);

  const fetchBackgroundDetails = () => {
    var os = "";
    if (navigator.appVersion.indexOf("Mac") != -1) os = "Mac OS";

    if (navigator.appVersion.indexOf("Win") != -1) os = "Windows OS";

    if (navigator.appVersion.indexOf("X11") != -1) os = "Unix OS";

    if (navigator.appVersion.indexOf("Linux") != -1) os = "Linus OS";

    //Device Type

    const ua = navigator.userAgent;
    let deviceType = "";
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      deviceType = "Tablet";
    } else if (
      /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
        ua
      )
    ) {
      deviceType = "Mobile";
    } else {
      deviceType = "Desktop";
    }

    async function FetchIP() {
      let url = "https://get.geojs.io/v1/ip.json";
      const response = await fetch(url);
      return response.json();
    }

    async function GEO(IP) {
      let url = `https://get.geojs.io/v1/ip/geo/${IP}.json`;
      const response = await fetch(url);
      return response.json();
    }

    FetchIP()
      .then((data) => {
        setIp(data.ip);
        GEO(data["ip"]).then((data) => {
          setGeoData(data);
          // setBaseLoading(false);
        });
      })
      .catch((err) => {
        console.log(err.message);
      });

    //Browser Detection
    var nAgt = navigator.userAgent;
    var browserName = navigator.appName;
    var fullVersion = "" + parseFloat(navigator.appVersion);
    var majorVersion = parseInt(navigator.appVersion, 10);
    var nameOffset, verOffset, ix;

    // In Opera 15+, the true version is after "OPR/"
    if ((verOffset = nAgt.indexOf("OPR/")) != -1) {
      browserName = "Opera";
      fullVersion = nAgt.substring(verOffset + 4);
    }
    // In older Opera, the true version is after "Opera" or after "Version"
    else if ((verOffset = nAgt.indexOf("Opera")) != -1) {
      browserName = "Opera";
      fullVersion = nAgt.substring(verOffset + 6);
      if ((verOffset = nAgt.indexOf("Version")) != -1)
        fullVersion = nAgt.substring(verOffset + 8);
    }
    // In MSIE, the true version is after "MSIE" in userAgent
    else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
      browserName = "Microsoft Internet Explorer";
      fullVersion = nAgt.substring(verOffset + 5);
    }
    // In Chrome, the true version is after "Chrome"
    else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
      browserName = "Chrome";
      fullVersion = nAgt.substring(verOffset + 7);
    }
    // In Safari, the true version is after "Safari" or after "Version"
    else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
      browserName = "Safari";
      fullVersion = nAgt.substring(verOffset + 7);
      if ((verOffset = nAgt.indexOf("Version")) != -1)
        fullVersion = nAgt.substring(verOffset + 8);
    }
    // In Firefox, the true version is after "Firefox"
    else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
      browserName = "Firefox";
      fullVersion = nAgt.substring(verOffset + 8);
    }
    // In most other browsers, "name/version" is at the end of userAgent
    else if (
      (nameOffset = nAgt.lastIndexOf(" ") + 1) <
      (verOffset = nAgt.lastIndexOf("/"))
    ) {
      browserName = nAgt.substring(nameOffset, verOffset);
      fullVersion = nAgt.substring(verOffset + 1);
      if (browserName.toLowerCase() == browserName.toUpperCase()) {
        browserName = navigator.appName;
      }
    }
    // trim the fullVersion string at semicolon/space if present
    if ((ix = fullVersion.indexOf(";")) != -1)
      fullVersion = fullVersion.substring(0, ix);
    if ((ix = fullVersion.indexOf(" ")) != -1)
      fullVersion = fullVersion.substring(0, ix);

    majorVersion = parseInt("" + fullVersion, 10);
    if (isNaN(majorVersion)) {
      fullVersion = "" + parseFloat(navigator.appVersion);
      majorVersion = parseInt(navigator.appVersion, 10);
    }
    setSessionTechnicalDetails({
      ...sessionTechnicalDetails,
      version: fullVersion,
      os: os,
      deviceType: deviceType,
      browser_name: browserName,
      language: navigator.language,
      is_online: navigator.onLine,
      platform: navigator.platform,
      vendor: navigator.vendor,
      cookie_enabled: navigator.cookieEnabled,
      user_agent: navigator.userAgent,
    });
  };

  useEffect(() => {
    if (ip && sessionTechnicalDetails && geoData) {
      const checkSurveyExistance = async () => {
        if (surveyID == "") {
          setErrCode(131);
          setErrMsg("Encryption Failure");
          setBaseLoading(false);
        }
        // survey exist
        if (survey) {
          if (gamma === "alpha") createTestSession();
          else if (survey?.status !== "live") {
            createSession(42);
            setErrCodeAndMsg(
              42,
              "Respondent attempted to enter a survey that was not Live or Pending status"
            );
          } else verifyTechnicalDetails();
        }
      };

      checkSurveyExistance();
    }
  }, [sessionTechnicalDetails, geoData, ip]);

  const createSessionBody = (errorCode) => {
    let tid = 2000001,
      flag = false; // flag to indicade whether atleast one tid is present or not.

    allSessions?.map((session) => {
      if (session?.tid >= tid) {
        tid = parseInt(session?.tid);
        flag = true;
      }
    });
    if (flag) tid += 1;

    // creating ref id for sending it to the client by using surveyID, supplieriID, and tid.
    let ref_id = hashids.encode([parseInt(surveyID), supplier_account_id, tid]);

    const body = {
      session_technical_details: sessionTechnicalDetails,
      geo_data: geoData,
      srcid: srcID,
      rid: rID,
      tid,
      date: new Date(),
      fingerprint: fingerPrint,
      mirats_status: parseInt(errorCode),
      client_status: -1,
      ref_id: ref_id,
      supplier_account_id: supplier_account_id,
      client_cpi: survey?.client_info?.client_cpi,
      vendor_cpi: getVendorCpi(supplier_account_id),
    };
    return body;
  };

  const createSession = (errorCode) => {
    let body = createSessionBody(errorCode);
    addSession(body, surveyID)
      .then((res) => {
        localStorage.setItem("session_id", res.id);
        console.log("session inserted in database with error code ", errorCode);
        setBaseLoading(false);
      })
      .catch((err) => {
        setVerificationDone(false);
        setBaseLoading(true);
        console.log(err.message);
      });
  };

  const createTestSession = () => {
    let body = createSessionBody(0);
    addTestSession(body, surveyID)
      .then((res) => {
        localStorage.setItem("session_id", res.id);
        console.log("test session inserted in database");
        setBaseLoading(false);
        history.push(`/blaze/${encryptedID}/gdpr-consent`);
      })
      .catch((err) => {
        setVerificationDone(false);
        setBaseLoading(true);
        console.log("error in creating test session");
      });
  };

  //  verify ip, rid , fingerprint for uniqueness
  const verifyTechnicalDetails = async () => {
    console.log("verifying techincal details ");
    let techincalDetailsVerification = true;
    const securityChecks = survey?.security_checks;

    // directly move on to the blocked data verification when there in no session
    if (allSessions.length === 0) techincalDetailsVerification = true;

    // traverse over all the sessions to match ip , rid and all other things
    allSessions?.forEach((doc) => {
      const geoData = doc?.geo_data;
      if (!surveyID || !countryID || !projectID) {
        setErrCodeAndMsg(
          131,
          "Respondent did not enter the Lucid Marketplace with the expected encryption variable"
        );
        techincalDetailsVerification = false;
      }
      // verifying ip
      else if (securityChecks?.unique_ip && geoData?.ip === ip) {
        createSession(30);
        setErrCodeAndMsg(30, "Respodant did not have unique IP");
        techincalDetailsVerification = false;
      }
      // verifying respondant id
      else if (securityChecks?.unique_rid && doc?.rid === rID) {
        createSession(35);
        setErrCodeAndMsg(
          35,
          "Respondent did not have a unique rid for that supplier"
        );
        techincalDetailsVerification = false;
      } else if (
        securityChecks?.unique_fingerprint &&
        fingerPrint === doc?.fingerPrint
      ) {
        createSession(235);
        setErrCodeAndMsg(
          232,
          "TrueSample Fingerprint Risk Level exceeds acceptable threshold"
        );
        techincalDetailsVerification = false;
      }
    });
    techincalDetailsVerification && verifyBlockedData();
  };

  //  verfiy all the blocked data
  const verifyBlockedData = async () => {
    console.log("verifying blocked data");
    if ("blocked_ips" in survey) {
      if (survey?.blocked_ips?.includes(ip)) {
        createSession(133);
        setErrCodeAndMsg(
          133,
          "Respondent attempted to enter on an IP blocked from the survey"
        );
      }
    }
    if ("blocked_rids" in survey) {
      if (survey?.blocked_rids.includes(projectID)) {
        createSession(132);
        setErrCodeAndMsg(
          132,
          "Respondent attempted to enter on a PID blocked from the survey"
        );
      }
    }
    if ("blocked_countries" in survey) {
      if (survey?.blocked_countries.includes(countryID)) {
        createSession(234);
        setErrCodeAndMsg(
          234,
          "Respondent's IP address coming from a country subject to US economic sactions "
        );
      } else {
        otherVerification();
      }
    }
  };

  // verifying device type, device suitability country and cookie
  const otherVerification = async () => {
    console.log("verifying other information");
    const device_type = sessionTechnicalDetails?.deviceType.toLowerCase();
    if (
      survey?.device_suitability?.[device_type] === undefined ||
      !survey?.device_suitability?.[device_type]
    ) {
      createSession(101);
      setErrCodeAndMsg(
        101,
        "device type " + device_type + " dosent allowed to attend the survey"
      );
    } else if (check_cookie_name("blaze")) {
      createSession(36);
      setErrCodeAndMsg(
        36,
        "Respondant cookie indicated they had taken a survey"
      );
    } else if (!survey?.device_suitability?.[`${device_type}`]) {
      createSession(101);
      setErrCodeAndMsg(
        101,
        "device type " + device_type + " dosent allowed to attend the survey"
      );
    } else if (survey?.country?.country !== geoData?.country_code) {
      createSession(37);
      setErrCodeAndMsg(37, "Respondent is not in the country of the survey");
    } else verifySrcId();
  };
  //verify srcid
  const verifySrcId = async () => {
    console.log("verifying src id");
    let flag = false;

    let supplier;
    //----> check whether source is exist AND active or not in external supppliers
    survey?.external_suppliers?.forEach((d) => {
      if (
        d?.vendor_status?.toLowerCase() === "active" &&
        d.supplier_account_id === supplier_account_id
      ) {
        flag = true;
        supplier = d;
      }
    });

    //--->> if supplier not found in external suppliers means (flag = false) then check its status and existability in internal suppliers
    if (!flag) {
      survey?.internal_suppliers?.forEach((d) => {
        if (
          d?.vendor_status?.toLowerCase() === "active" &&
          d.supplier_account_id === supplier_account_id
        ) {
          flag = true;
          supplier = d;
        }
      });
    }

    if (flag) {
      let completedSessionsCnt = 0;
      let srcSpecificCompletedSessionsCnt = 0;
      allSessions?.forEach((session) => {
        if (session?.client_status === 10) {
          completedSessionsCnt++;
          if (session?.supplier_account_id === supplier_account_id) {
            srcSpecificCompletedSessionsCnt++;
          }
        }
      });

      if (completedSessionsCnt >= survey?.no_of_completes) {
        console.log(
          "survey has completed the no of completes hence terminated"
        );
        createSession(43);
        setErrCodeAndMsg(
          43,
          "Respondent attempted to enter a survey whose allocation is completed"
        );
      } else {
        if (srcSpecificCompletedSessionsCnt >= supplier?.allocation?.number) {
          console.log(
            "allocation for the supplier has completed hence terminated"
          );
          createSession(41);
          setErrCode(41);
          setErrMsg(
            "Respondent went over their supplier’s allocation in Marketplace survey"
          );
        } else {
          console.log("src id verification done..");
          verifySurveyGroupData();
        }
      }
    } else {
      createSession(127);
      setErrCodeAndMsg(
        127,
        "Respondent enter from the particular supplier that is not live or the supplier not found"
      );
    }
  };

  //  verify the data according to survey group
  const verifySurveyGroupData = async () => {
    console.log("verifying data according to survey grp number");
    let verified = true;
    allSurveys?.forEach(async (doc) => {
      //  condition to find the survey with same group
      if (
        doc?.survey_group === survey?.survey_group &&
        doc?.survey_id !== parseInt(surveyID)
      ) {
        //  Get the all the sessions for that particular survey to matched ip and all other things
        const allSessions = await getAllSessions(doc?.survey_id, gamma);

        // traverse over all the sessions of that survey
        for (let i = 0; i < allSessions.docs.length; i++) {
          let sessionData = allSessions.docs[i].data();
          if (sessionData?.geo_data?.ip === ip) {
            createSession(230);
            setErrCodeAndMsg(
              230,
              "Respondent did not have a unique IP across the survey group"
            );
            verified = false;
            break;
          } else if (sessionData?.rid === parseInt(rID)) {
            createSession(139);
            setErrCodeAndMsg(
              139,
              "Respondent did not have a unique PID for that supplier across the survey group"
            );
            verified = false;
            break;
          }
        }
      }
    });
    if (verified) {
      createSession(0);
      history.push(`/blaze/${encryptedID}/gdpr-consent`);
    }
  };

  // when finalVerification is true, add all the bakcground verified details in database
  useEffect(() => {
    if (!errCode && !errMsg && finalVerification) {
      let tid = 2000001,
        flag = false; // flag to indicade whether atleast one tid is present or not.

      allSessions?.map((session) => {
        if (session?.tid >= tid) {
          tid = parseInt(session?.tid);
          flag = true;
        }
      });
      if (flag) tid += 1;

      // creating ref id for sending it to the client by using surveyID, supplieriID, and tid.
      let ref_id = hashids.encode([
        parseInt(surveyID),
        supplier_account_id,
        tid,
      ]);
      console.log(
        "all the background verification is done and session is inserted in database"
      );
      const nextURL = `/blaze/${encryptedID}/gdpr-consent`;

      const body = {
        session_technical_details: sessionTechnicalDetails,
        geo_data: geoData,
        srcid: srcID,
        rid: rID,
        tid,
        date: new Date(),
        fingerprint: fingerPrint,
        mirats_status: 0,
        client_status: -1,
        ref_id: ref_id,
        supplier_account_id: supplier_account_id,
        client_cpi: survey?.client_info?.client_cpi,
        vendor_cpi: getVendorCpi(supplier_account_id),
      };

      if (gamma === "alpha") {
        addTestSession(body, surveyID)
          .then((res) => {
            localStorage.setItem("session_id", res.id);
            setVerificationDone(true);
            setBaseLoading(false);
            history.push(nextURL);
          })
          .catch((err) => console.log(err.message));
      } else {
        addSession(body, surveyID)
          .then((res) => {
            setVerificationDone(true);
            setBaseLoading(false);
            history.push(nextURL);
            localStorage.setItem("session_id", res.id);
          })
          .catch((err) => {
            setVerificationDone(false);
            setBaseLoading(true);
            console.log(err.message);
          });
      }
    }
  }, [finalVerification]);

  const getVendorCpi = (srcID) => {
    let cpi = 0,
      flag = false;
    survey?.external_suppliers?.map((supp) => {
      if (supp?.supplier_account_id === parseInt(srcID)) {
        cpi = supp?.tcpi;
        flag = true;
      }
    });
    if (!flag) {
      survey?.internal_suppliers?.map((supp) => {
        if (supp?.supplier_account_id === parseInt(srcID)) {
          cpi = supp?.tcpi;
        }
      });
    }
    return cpi;
  };

  const value = {
    errCode,
    errMsg,
    setErrCodeAndMsg,
    baseLoading,
    setBaseLoading,
    sessionTechnicalDetails,
    verificationDone,
    geoData,
    responses,
    setResponses,
  };
  return (
    <BlazeContext.Provider value={value}>{children}</BlazeContext.Provider>
  );
};

export default BlazeContextProvider;
