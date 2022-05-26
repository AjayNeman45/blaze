import { useState } from "react";
import { useEffect } from "react";
import { createContext, useContext } from "react";
import { useParams } from "react-router-dom";
import { getAllSessions, getAllSurveys } from "../../utils/firebaseQueries";
import { useSurveyContext } from "./SurveyContext";

const ProjectContext = createContext();

export const useProjectContext = () => {
  return useContext(ProjectContext);
};

const ProjectContextProvider = ({ children }) => {
  const { activity } = useParams();
  const [projectData, setProjectData] = useState([]);
  const [currentProjects, setCurrentProjects] = useState([]);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    const func = async () => {
      const querySnapshot = await getAllSurveys();
      let projectIDs = new Set();
      querySnapshot.forEach((snap) => {
        projectIDs.add(snap.data()?.project_id);
      });

      projectIDs.forEach((id) => {
        let projectData = {};
        querySnapshot?.forEach((survey) => {
          const sd = survey.data();

          if (sd?.project_id === id) {
            let expected_completion_loi = 0,
              total_survey_time_sum = 0,
              completedSessionsCnt = 0,
              inClientSessionCnt = 0,
              client_cpi_sum = 0;
            projectData.project_name = sd?.project;
            projectData.project_id = sd?.project_id;
            projectData.survey_id = sd?.survey_id;
            projectData.launchDate = new Date();
            // console.log(projectData.launchDate, sd?.creation_date?.toDate());
            if (sd?.creation_date?.toDate() < projectData.launchDate) {
              projectData.launchDate = sd?.creation_date.toDate();
            }
            getAllSessions(sd?.survey_id).then((sessions) => {
              sessions.forEach((session) => {
                if (session?.data()?.client_status === 10)
                  completedSessionsCnt++;
                if (session?.data()?.mirats_status === 3) {
                  inClientSessionCnt++;
                  client_cpi_sum += session.data()?.client_cpi;
                  total_survey_time_sum += parseInt(
                    session.data()?.total_survey_time?.split(":")[1]
                  );
                }
              });
              projectData.avg_cpi = (
                client_cpi_sum / inClientSessionCnt
              ).toFixed(0);
              projectData.completedSessionsCnt = completedSessionsCnt;
              projectData.inClientSessionsCnt = inClientSessionCnt;
              projectData.ir = (
                (completedSessionsCnt / inClientSessionCnt) *
                100
              ).toFixed(0);
              projectData.loi = (
                total_survey_time_sum / inClientSessionCnt
              ).toFixed(0);
              projectData.study_type = sd?.study_type;
              projectData.survey_type = sd?.survey_type;
              projectData.pm = sd?.mirats_insights_team?.lead_project_managers;
              projectData.client = sd?.client_info;
              projectData.country = sd?.country?.country_full_name;
            });
          }
        });
        setProjectData((prevData) => [...prevData, projectData]);
      });
    };

    func();
  }, []);

  useEffect(() => {
    setCurrentProjects(projectData);
  }, [projectData]);

  useEffect(() => {
    if (activity === "projects") filterProjects();
  }, [filters, activity]);

  const filterProjects = () => {
    setCurrentProjects(projectData);
    Object.keys(filters).forEach((key) => {
      if (key === "study_type" || key === "survey_type") {
        setCurrentProjects((prevData) => {
          return prevData.filter((project) => {
            if (project?.[key] === filters[key]) return project;
          });
        });
      } else if (key === "lead_pm") {
        setCurrentProjects((prevData) => {
          return prevData.filter((survey) => {
            if (survey?.pm?.includes(filters[key])) return survey;
          });
        });
      } else if (key === "country") {
        setCurrentProjects((prevData) => {
          return prevData.filter((survey) => {
            if (survey?.country === filters[key]?.label) return survey;
          });
        });
      } else if (key === "client") {
        setCurrentProjects((prevData) => {
          return prevData.filter((survey) => {
            if (survey?.client === filters[key]) return survey;
          });
        });
      } else if (key === "dateRange") {
        setCurrentProjects((prevData) => {
          return prevData?.filter((survey) => {
            if (
              filters?.[key]?.["0"] <= survey?.launchDate &&
              survey?.launchDate <= filters?.[key]["1"]
            )
              return survey;
          });
        });
      }
    });
  };

  const value = { currentProjects, filters, setFilters };

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
};

export default ProjectContextProvider;
