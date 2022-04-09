import React, { createContext, useContext, useState } from "react";

import { db } from "../../firebase";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { encryptText, decryptText } from "../../utils/enc-dec.utils";
import { useLocation } from "react-router-dom";
import {
  addSurvey,
  getAllSurveys,
  getClients,
} from "../../utils/firebaseQueries";

const CreateNewProjectContext = createContext();
export const useCreateNewProject = () => {
  return useContext(CreateNewProjectContext);
};

const CreateNewProjectProvider = ({ children }) => {
  const [surveyData, setSurveyData] = useState({ internal_status: "ongoing" });
  const [insertLoading, setInsertLoading] = useState(false);
  const [snackbar, setSnackbar] = useState(false);
  const [snackbarData, setSnackbarData] = useState({});
  const [error, setError] = useState(null);
  const history = useHistory();
  const location = useLocation();
  const encryptedID = new URLSearchParams(location.search).get("id");

  var DOC = db.collection("mirats").doc("surveys").collection("survey");

  const handleSnackbar = () => {
    setSnackbar(!snackbar);
  };

  const insertBasicData = async () => {
    setInsertLoading(true);
    const allSurveys = await getAllSurveys();
    let maxSurveyId = 0;
    let maxProjectId = 0;
    // this loop gives the last surveyID and projectID
    allSurveys.forEach((survey) => {
      if (survey.data()?.survey_id > maxSurveyId) {
        maxSurveyId = survey.data()?.survey_id;
      }
      if (survey.data()?.project_id > maxProjectId) {
        maxProjectId = survey.data()?.project_id;
      }
    });
    const newSurveyId = maxSurveyId ? maxSurveyId + 1 : 10000001;
    const newProjectId = maxProjectId ? maxProjectId + 1 : 10000001;

    // check the existance of the project
    const checkProjectExistance = (projectPreExist) => {
      allSurveys.docs.every((survey) => {
        console.log(survey.data()?.project, surveyData?.project);

        if (survey.data()?.project === surveyData?.project) {
          projectPreExist = true;
          return false;
        } else return true;
      });
      return projectPreExist;
    };

    if (surveyData?.existing_project_checked) {
      if (checkProjectExistance(false)) {
        createSurvey(newSurveyId, newProjectId);
        setInsertLoading(false);
      } else {
        setError("No Project Found ... ! You have to create new project");
        setInsertLoading(false);
      }
    } else {
      if (checkProjectExistance(false)) {
        setError(
          "Project with project name (" +
            surveyData?.project +
            ") already exist"
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
              console.log("Error in saving Setup Requirements", er);
              console.log("here..........");
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
                clients_team: surveyData?.clients_team,
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
              },
              { merge: true }
            )
            .then(() => {
              history.push(`/projects/settings/${survey_id}`);
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
  };
  return (
    <CreateNewProjectContext.Provider value={value}>
      {children}
    </CreateNewProjectContext.Provider>
  );
};

export default CreateNewProjectProvider;
