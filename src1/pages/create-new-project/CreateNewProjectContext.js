import React, { createContext, useContext, useEffect, useState } from "react";

import { db } from "../../firebase";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { encryptText, decryptText } from "../../utils/enc-dec.utils";
import { useLocation } from "react-router-dom";
import {
  addSurvey,
  getAllSurveyGroups,
  getAllSurveys,
  getClients,
} from "../../utils/firebaseQueries";
import { useBaseContext } from "../../context/BaseContext";

const CreateNewProjectContext = createContext();
export const useCreateNewProject = () => {
  return useContext(CreateNewProjectContext);
};

const CreateNewProjectProvider = ({ children }) => {
  const { userData } = useBaseContext();
  const [surveyData, setSurveyData] = useState({ internal_status: "ongoing" });
  const [insertLoading, setInsertLoading] = useState(false);
  const [snackbar, setSnackbar] = useState(false);
  const [snackbarData, setSnackbarData] = useState({});
  const [error, setError] = useState(null);
  const [surveys, setSurveys] = useState([]);
  const [surveyGrps, setSurveyGrps] = useState([]);
  const history = useHistory();
  const location = useLocation();
  const encryptedID = new URLSearchParams(location.search).get("id");

  var DOC = db.collection("miratsinsights").doc("blaze").collection("surveys");

  useEffect(() => {
    const func = async () => {
      let sid;
      if (encryptedID) sid = decryptText(encryptedID?.split("-")[0]);
      getAllSurveys().then((surveys) => {
        surveys.forEach((survey) => {
          setSurveys((prevData) => [...prevData, survey.data()]);
          if (survey.data()?.survey_id === parseInt(sid))
            setSurveyData(survey.data());
        });
      });
    };
    func();
  }, [encryptedID]);

  useEffect(() => {
    getAllSurveyGroups().then((sGrps) => {
      let tmp = [];
      sGrps.forEach((group) => {
        tmp.push({
          label: group.data()?.survey_group_number,
          value: group.data()?.survey_group_number,
        });
      });
      setSurveyGrps(tmp);
    });
  }, []);

  const handleSnackbar = () => {
    setSnackbar(!snackbar);
  };

  const insertBasicData = async () => {
    console.log("inerting basic data ");
    setInsertLoading(true);

    let maxSurveyId = 0;
    let maxProjectId = 0;
    // this loop gives the last surveyID and projectID
    surveys.forEach((survey) => {
      if (survey?.survey_id > maxSurveyId) {
        maxSurveyId = survey?.survey_id;
      }
      if (survey?.project_id > maxProjectId) {
        maxProjectId = survey?.project_id;
      }
    });
    const newSurveyId = maxSurveyId ? maxSurveyId + 1 : 10000001;
    const newProjectId = maxProjectId ? maxProjectId + 1 : 10000001;

    // check the existance of the project
    const checkProjectExistance = (checkingFor) => {
      let projectPreExist = false;
      surveys.forEach((survey) => {
        if (survey?.[checkingFor] === surveyData?.[checkingFor])
          projectPreExist = true;
      });
      return projectPreExist;
    };

    if (surveyData?.existing_project_checked) {
      if (checkProjectExistance("project_id")) {
        createSurvey(newSurveyId, parseInt(surveyData?.project_id));
        setInsertLoading(false);
      } else {
        setError("Project not exit with this project ID...");
        setInsertLoading(false);
      }
    } else {
      if (checkProjectExistance("project")) {
        setError(
          "Project already exist with this name. Provide unique name to your project"
        );
        setInsertLoading(false);
      } else {
        createSurvey(newSurveyId, newProjectId);
        setInsertLoading(false);
      }
    }
  };

  const createSurvey = async (newSurveyId, newProjectId) => {
    var encry_sid = encryptText(String(newSurveyId));
    var encry_pid = encryptText(String(newProjectId));
    var encry_cid = encryptText(surveyData?.country?.country);

    const encryptedText = `${encry_sid}-${encry_pid}-${encry_cid}`;
    const body = {
      ...surveyData,
      survey_id: newSurveyId,
      project_id: newProjectId,
      encrypt: {
        pid: encry_pid,
        sid: encry_sid,
        cid: encry_cid,
      },
    };
    addSurvey(newSurveyId, body)
      .then(() => {
        history.push(
          `/create-new-project/setup-requirements?id=${encryptedText}`
        );
      })
      .catch((err) => {
        console.log("eror");
        setSnackbar(true);
        setSnackbarData({
          msg: "Oops..! something went wrong. please try again",
          severity: "error",
        });
      });
  };

  const insertSetupRequirementData = () => {
    setInsertLoading(true);
    const survey_id = decryptText(encryptedID.split("-")[0]);
    const project_id = decryptText(encryptedID.split("-")[1]);
    const country_id = decryptText(encryptedID.split("-")[2]);

    var docker = DOC.where("project_id", "==", parseInt(project_id))
      .where("survey_id", "==", parseInt(survey_id))
      .get();
    docker
      .then((doc) => {
        doc.docs.forEach((data) => {
          data.ref
            .set(
              {
                ...surveyData,
              },
              { merge: true }
            )
            .then(() => {
              console.log("moving to metrics data");
              history.push(
                `/create-new-project/metrics-and-surveyData?id=${encryptedID}`
              );
              setInsertLoading(false);
            })
            .catch((er) => {
              console.log(er.message);
              setInsertLoading(false);
            });
        });
      })
      .catch((err) => {
        setInsertLoading(false);
        console.log(err.message);
      });
  };

  const metricsData = () => {
    setInsertLoading(true);
    const survey_id = decryptText(encryptedID.split("-")[0]);
    const project_id = decryptText(encryptedID.split("-")[1]);
    const country_id = decryptText(encryptedID.split("-")[2]);
    var docker = DOC.where("project_id", "==", parseInt(project_id))
      .where("survey_id", "==", parseInt(survey_id))
      .get();
    docker
      .then((doc) => {
        doc.docs.forEach((data) => {
          data.ref
            .set(
              {
                ...surveyData,
              },
              { merge: true }
            )
            .then(() => {
              history.push(`/create-new-project/peoples?id=${encryptedID}`);
              setInsertLoading(false);
            })
            .catch((er) => {
              console.log("Error in saving Metrics Data", er);
              setInsertLoading(false);
            });
        });
      })
      .catch((err) => {
        console.log(err.message);
        setInsertLoading(false);
      });
  };

  const insertPeoplesData = () => {
    setInsertLoading(true);
    const survey_id = decryptText(encryptedID.split("-")[0]);
    const project_id = decryptText(encryptedID.split("-")[1]);
    var docker = DOC.where("project_id", "==", parseInt(project_id))
      .where("survey_id", "==", parseInt(survey_id))
      .get();
    docker
      .then((doc) => {
        doc.docs.forEach((data) => {
          data.ref
            .set(
              {
                // clients_team: surveyData?.clients_team,
                mirats_insights_team: surveyData?.mirats_insights_team,
                status: "bidding",
                changes: [],
                blocked_ips: [],
                blocked_rids: [],
                blocked_countries: [],
                security_checks: {
                  unique_ip: true,
                  unique_rid: true,
                  unique_fingerprint: true,
                },
                live_url: "",
                test_url: "",
                client_info: surveyData?.client_info,
                creation_date: new Date(),
                created_by: userData?.UserID,
              },
              { merge: true }
            )
            .then(() => {
              history.push(`/surveys/settings/${survey_id}`);
              setInsertLoading(false);
            })
            .catch((er) => {
              console.log(er.message);
              setInsertLoading(false);
            });
        });
      })
      .catch((err) => {
        setInsertLoading(false);
        console.log(err.message);
      });
  };

  const value = {
    surveyData,
    setSurveyData,
    insertBasicData,
    insertSetupRequirementData,
    metricsData,
    insertPeoplesData,
    error,
    insertLoading,
    snackbar,
    snackbarData,
    handleSnackbar,
    surveyGrps,
  };
  return (
    <CreateNewProjectContext.Provider value={value}>
      {children}
    </CreateNewProjectContext.Provider>
  );
};

export default CreateNewProjectProvider;
