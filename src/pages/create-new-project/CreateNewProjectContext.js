import React, { createContext, useContext, useState } from "react";

import { db } from "../../firebase";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { encryptText, decryptText } from "../../utils/enc-dec.utils";
import { useLocation } from "react-router-dom";
import { addSurvey, getAllSurveys } from "../../utils/firebaseQueries";

const CreateNewProjectContext = createContext();
export const useCreateNewProject = () => {
  return useContext(CreateNewProjectContext);
};

const CreateNewProjectProvider = ({ children }) => {
  const [surveyData, setSurveyData] = useState({ internal_status: "ongoing" });
  const [insertLoading, setInsertLoading] = useState(false);
  const [error, setError] = useState(null);
  const history = useHistory();
  const location = useLocation();
  const encryptedID = new URLSearchParams(location.search).get("id");

  var DOC = db.collection("mirats").doc("surveys").collection("survey");

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

    if (surveyData?.existing_project_checked === "Yes") {
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
        console.log("survey added successfully");
        history.push(
          `/create-new-project/setup-requirements?id=${encryptedText}`
        );
      })
      .catch((err) => console.log(err.message));
  };

  const insertSetupRequirementData = () => {
    setInsertLoading(true);
    const survey_id = decryptText(encryptedID.split("-")[0]);
    const project_id = decryptText(encryptedID.split("-")[1]);
    const country_id = decryptText(encryptedID.split("-")[2]);

    var docker = DOC.where("project_id", "==", parseInt(project_id))
      .where("survey_id", "==", parseInt(survey_id))
      .get();
    docker.then((doc) => {
      doc.docs.forEach((data) => {
        data.ref
          .set(
            {
              study_type: surveyData.study_type,
              business_unit: surveyData.business_unit,
              industry: surveyData.industry,
              collect_user_data: surveyData.collect_user_data,
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
            setInsertLoading(false);
          });
      });
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
    docker.then((doc) => {
      doc.docs.forEach((data) => {
        data.ref
          .set(
            {
              expected_incidence_rate: parseFloat(
                surveyData.expected_incidence_rate
              ),
              expected_completion_loi: parseFloat(
                surveyData.expected_completion_loi
              ),
              status: "bidding",
              internal_status: surveyData.internal_status,
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
    });
  };

  const insertPeoplesData = () => {
    setInsertLoading(true);
    const survey_id = decryptText(encryptedID.split("-")[0]);
    const project_id = decryptText(encryptedID.split("-")[1]);
    var docker = DOC.where("project_id", "==", parseInt(project_id))
      .where("survey_id", "==", parseInt(survey_id))
      .get();
    docker.then((doc) => {
      doc.docs.forEach((data) => {
        data.ref
          .set(
            {
              project_manager: surveyData.project_manager,
              account_executive: surveyData.account_executive,
              alternate_project_manager: surveyData.alternate_project_manager,
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
              device_suitability: {
                mobile: true,
                tablet: true,
                desktop: true,
                tv: false,
                webcam: false,
              },
              external_project_name: "",
              survey_group: "",
              client_info: {
                client_pm_email: "",
                client_project_manager: "",
                client_cpi: "",
              },
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
    });
  };

  // const insertProjectData = () => {}
  const value = {
    surveyData,
    setSurveyData,
    insertBasicData,
    insertSetupRequirementData,
    metricsData,
    insertPeoplesData,
    error,
    insertLoading,
  };
  return (
    <CreateNewProjectContext.Provider value={value}>
      {children}
    </CreateNewProjectContext.Provider>
  );
};

export default CreateNewProjectProvider;
