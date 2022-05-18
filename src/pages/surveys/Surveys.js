import Header from "../../components/header/Header";
import {
  Link,
  useHistory,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
import { MdEdit } from "react-icons/md";
import { MdContentCopy } from "react-icons/md";
import { FiDownload } from "react-icons/fi";
import "./Surveys.css";
import { useEffect, useState } from "react";
import Subheader from "../../components/subheader/Subheader";
import { useSurveyContext } from "./SurveyContext";
import Hashids from "hashids";
import styles from "./Survey.module.css";
import { AiOutlineSearch } from "react-icons/ai";
import facewithmask from "../../assets/images/facewithmask.png";
import { Switch, Tooltip } from "@nextui-org/react";
import { getAvgCPI } from "../survey-dashboard/SurveyDashboardContext";
import {
  studyTypesData,
  surveyTypesData,
  projectManagersData,
} from "../../utils/commonData";
import countryList from "react-select-country-list";
import { useMemo } from "react";
import Select from "react-select";
import { default as Muiselect } from "@mui/material/Select";
import { FormControl, InputLabel, MenuItem } from "@mui/material";
import { DateRangePicker } from "rsuite";
import { addDays, subDays } from "date-fns";
import { useParams } from "react-router-dom";
import { useProjectContext } from "./ProjectContext";

const selectCountryStyle = {
  menu: (provided, state) => ({
    ...provided,
    width: "100%",
    color: state.selectProps.menuColor,
    padding: "20px",
    zIndex: "999",
  }),
  control: (styles) => ({
    ...styles,
    width: "95%",
    border: "1px solid lightgray",
    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
    margin: "0.5rem 0.5rem",
  }),
  input: (styles) => ({
    ...styles,
    height: "2.8rem",
    width: "95%",
  }),
};

const Surveys = () => {
  const [countCheckedProjects, setCountCheckProjects] = useState(0);
  const [checkRows, setCheckRows] = useState([]);
  const location = useLocation();
  const history = useHistory();
  const view = new URLSearchParams(location.search).get("view");
  const [statusesCnt, setStatusesCnt] = useState({});
  const [currentSurveys, setCurrentSurveys] = useState([]);
  const { surveys, clients } = useSurveyContext();
  const { currentProjects, filters, setFilters } = useProjectContext();
  const countries = useMemo(() => countryList().getData(), []);
  const { activity } = useParams();

  useEffect(() => {
    setCurrentSurveys(
      surveys.sort((a, b) => {
        return (
          a.creation_date.toDate().getTime() -
          b.creation_date.toDate().getTime()
        );
      })
    );

    // ------>>>>  storing the status cnts (live, awarded, paused,.....) of the surveys
    let tmp = {};

    surveys?.map((survey) => {
      tmp[survey?.status] =
        (tmp?.[survey?.status] ? tmp?.[survey?.status] : 0) + 1;
    });
    Object.keys(tmp).map((key) => {
      tmp["all"] = (tmp["all"] ? tmp["all"] : 0) + tmp[key];
    });
    console.log(tmp);
    setStatusesCnt(tmp);
    // ------->>>>> End status cnt storing

    changedFilters();
  }, [surveys]);

  useEffect(() => {
    changedFilters();
  }, [view]);

  const changedFilters = () => {
    if (view !== "all") {
      setCurrentSurveys(surveys);
      filterByStatus(view);
      filterSurveys();
    } else {
      setCurrentSurveys(surveys);
      filterSurveys();
    }
  };

  // ---->>>> for checkbox of every row
  const handleSelect = (e) => {
    if (e.target.checked) {
      setCountCheckProjects(countCheckedProjects + 1);
      setCheckRows([...checkRows, e.target.name]);
    } else {
      setCountCheckProjects(countCheckedProjects - 1);
      setCheckRows((checkRows) => {
        return checkRows.filter((row) => row != e.target.name);
      });
    }
  };

  useEffect(() => {
    document.querySelectorAll("tr").forEach((tr) => {
      const first_cell = tr.querySelector("td");
      if (
        checkRows?.includes(
          first_cell?.querySelector("input").getAttribute("name")
        )
      ) {
        tr.style.backgroundColor = "rgb(222, 222, 230)";
      } else {
        tr.style.backgroundColor = "";
      }
    });
  }, [checkRows]);

  //seting the currentSurveys after filter is apply
  useEffect(() => {
    setCurrentSurveys(surveys);
    filterSurveys();
  }, [filters]);

  // ---->>>> filter all the surveys according to status like Live, Awarded, paused and all others.....
  const filterByStatus = (view) => {
    setCurrentSurveys((prevData) => {
      return prevData.filter((survey) => {
        if (survey.status === view) return survey;
      });
    });
  };

  // ---->>>> filter all the surveys according to pm, study type and all other filters....
  const filterSurveys = () => {
    Object.keys(filters).forEach((key) => {
      console.log("filtering surveys");
      if (key === "study_type" || key === "survey_type") {
        setCurrentSurveys((prevData) => {
          return prevData.filter((survey) => {
            if (survey?.[key] === filters[key]) return survey;
          });
        });
      } else if (key === "lead_pm") {
        setCurrentSurveys((prevData) => {
          return prevData.filter((survey) => {
            if (
              survey?.mirats_insights_team?.lead_project_managers.includes(
                filters[key]
              )
            )
              return survey;
          });
        });
      } else if (key === "country") {
        setCurrentSurveys((prevData) => {
          return prevData.filter((survey) => {
            if (survey?.country?.country === filters[key]?.value) return survey;
          });
        });
      } else if (key === "client") {
        setCurrentSurveys((prevData) => {
          return prevData.filter((survey) => {
            if (survey?.client_info?.client_name === filters[key])
              return survey;
          });
        });
      } else if (key === "dateRange") {
        setCurrentSurveys((prevData) => {
          return prevData?.filter((survey) => {
            if (
              filters?.[key]?.["0"] <= survey?.creation_date?.toDate() &&
              survey?.creation_date?.toDate() <= filters?.[key]["1"]
            )
              return survey;
          });
        });
      }
    });
  };

  function handleTableInputSearch(e) {
    var filter, table, tr, td, i, txtValue;
    filter = e.target.value.toUpperCase();
    table = document.getElementById("project_table");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[0];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }

  console.log(statusesCnt);

  return (
    <>
      <Header />
      <div className={styles.projectWrapper}>
        <div className={styles.projectHead}>
          <div className={styles.left}>
            <div className={styles.left_header}>
              <div className={styles.head}>
                <p className={styles.p}>{activity}</p>
                <Switch
                  onChange={(e) => {
                    if (e.target.checked) history.push("/mi/projects");
                    else history.push("/mi/surveys?view=all");
                  }}
                  checked={activity === "projects"}
                />
              </div>

              <div className="searchField">
                {/* Search bar comes here  */}
                <input
                  type="search"
                  placeholder="Search By Project Number, Name and much more."
                  className={styles.searchbar}
                  onChange={handleTableInputSearch}
                />
                {/* <AiOutlineSearch className="searchIcon" size="20" /> */}
              </div>
            </div>
            {/*********  all the filters  *********/}
            <div className={styles.left_select_container}>
              {/* project managers  */}
              <FormControl fullWidth className={styles.select_input}>
                <InputLabel id="demo-simple-select-label">
                  Project Managers
                </InputLabel>
                <Muiselect
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Project Managers"
                  onChange={(e) => {
                    setFilters((prevData) => {
                      return {
                        ...prevData,
                        lead_pm: e.target.value,
                      };
                    });
                  }}
                >
                  {projectManagersData?.map((pm) => (
                    <MenuItem value={pm}>{pm}</MenuItem>
                  ))}
                </Muiselect>
              </FormControl>

              {/* study type  */}
              <FormControl fullWidth className={styles.select_input}>
                <InputLabel id="demo-simple-select-label">
                  Study Type
                </InputLabel>
                <Muiselect
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={filters?.study_type}
                  label="Study Type"
                  onChange={(e) =>
                    setFilters((prevData) => {
                      return {
                        ...prevData,
                        study_type: e.target.value,
                      };
                    })
                  }
                >
                  {studyTypesData?.map((type) => {
                    return <MenuItem value={type.label}>{type.label}</MenuItem>;
                  })}
                </Muiselect>
              </FormControl>

              {/* country  */}
              <div>
                <Select
                  styles={selectCountryStyle}
                  options={countries}
                  value={filters?.country}
                  onChange={(e) => {
                    setFilters((prevData) => {
                      return { ...prevData, country: e };
                    });
                  }}
                />
              </div>

              {/* survey type  */}
              <FormControl fullWidth className={styles.select_input}>
                <InputLabel id="demo-simple-select-label">
                  Survey Type
                </InputLabel>
                <Muiselect
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={filters?.survey_type}
                  label="Survey Type"
                  onChange={(e) =>
                    setFilters((prevData) => {
                      return {
                        ...prevData,
                        survey_type: e.target.value,
                      };
                    })
                  }
                >
                  {surveyTypesData?.map((surveyType) => {
                    return <MenuItem value={surveyType}>{surveyType}</MenuItem>;
                  })}
                </Muiselect>
              </FormControl>

              {/* client  */}
              <FormControl fullWidth className={styles.select_input}>
                <InputLabel id="demo-simple-select-label">Client</InputLabel>
                <Muiselect
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={filters?.client}
                  label="Client"
                  onChange={(e) => {
                    setFilters((prevData) => {
                      return {
                        ...prevData,
                        client: e.target.value,
                      };
                    });
                  }}
                >
                  {clients?.map((client) => (
                    <MenuItem value={client?.company_name}>
                      {client?.company_name}
                    </MenuItem>
                  ))}
                </Muiselect>
              </FormControl>

              {/* period  */}
              <DateRangePicker
                appearance="default"
                placeholder="Date Range"
                size="lg"
                style={{
                  width: "95%",
                  zIndex: "10",
                  margin: ".5rem",
                }}
                onChange={(e) => {
                  setFilters((prevData) => {
                    return { ...prevData, dateRange: e };
                  });
                }}
                ranges={[
                  {
                    label: "Last 7 days",
                    value: [subDays(new Date(), 6), new Date()],
                  },
                  {
                    label: "Last 1 Month",
                    value: [subDays(new Date(), 30), new Date()],
                  },
                  {
                    label: "Last 6 Month",
                    value: [subDays(new Date(), 180), new Date()],
                  },
                  {
                    label: "1 Year",
                    value: [subDays(new Date(), 365), new Date()],
                  },
                ]}
              />
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.id_card}>
              <div>
                <h2>Mirats Insights ID</h2>
                <p className={styles.email}>rohan.gupta@gmail.com</p>
              </div>
              <div className={styles.id_card_description}>
                <p>
                  Get access to your dashboard. Manage your work, sign-in,
                  security and much more.{" "}
                </p>
              </div>
              <img src={facewithmask} className={styles.face_withmask} />
            </div>
          </div>
          {/* <label for="switch">Toggle</label> */}
        </div>

        {/* ----------------------------------------------------------------
                                 survey status Heading Links  
         ----------------------------------------------------------------*/}

        <div className={styles.projectHeadingWrapper}>
          {activity === "projects" ? null : (
            <div className="headingLinks">
              <Link
                to="/mi/surveys?view=live"
                className={view === "live" ? styles.active : null}
              >
                Live ({statusesCnt?.live ? statusesCnt?.live : 0})
              </Link>
              <Link
                to="/mi/surveys?view=awarded"
                className={view === "awarded" ? styles.active : null}
              >
                Awarded ({statusesCnt?.awarded ? statusesCnt?.awarded : 0})
              </Link>
              <Link
                to="/mi/surveys?view=paused"
                className={view === "paused" && styles.active}
              >
                Paused ({statusesCnt?.paused ? statusesCnt?.paused : 0})
              </Link>
              <Link
                to="/mi/surveys?view=completed"
                className={view === "completed" ? styles.active : null}
              >
                Completed ({statusesCnt?.completed ? statusesCnt?.completed : 0}
                )
              </Link>
              <Link
                to="/mi/surveys?view=billed"
                className={view === "billed" ? styles.active : null}
              >
                Billed ({statusesCnt?.billed ? statusesCnt?.billed : 0})
              </Link>
              <Link
                to="/mi/surveys?view=bidding"
                className={view === "bidding" ? styles.active : null}
              >
                Bidding ({statusesCnt?.bidding ? statusesCnt?.bidding : 0})
              </Link>
              <Link
                to="/mi/surveys?view=all"
                className={view === "all" ? styles.active : null}
              >
                All ({statusesCnt?.all ? statusesCnt?.all : 0})
              </Link>
            </div>
          )}
          <div>
            <Link
              className={styles.create_new_survey_btn}
              to="/create-new-project/basic"
            >
              Create New Survey
            </Link>
          </div>
        </div>

        {activity === "projects" ? (
          <ProjectTable
            currentProjects={currentProjects}
            handleSelect={handleSelect}
            history={history}
          />
        ) : (
          <SurveyTable
            currentSurveys={currentSurveys}
            handleSelect={handleSelect}
            history={history}
          />
        )}

        {countCheckedProjects ? (
          <div className="selected_project_op">
            <p>
              <span>{countCheckedProjects}</span> &nbsp; SURVEYS SELECTED
            </p>
            <button>
              <MdEdit color="blue" size={20} /> &nbsp; Edit
            </button>
            <button>
              <MdContentCopy color="blue" size={20} /> &nbsp; Copy IDs
            </button>
            <button>
              <FiDownload color="blue" size={20} /> &nbsp; Export CSV
            </button>
            <button>
              <FiDownload color="blue" size={20} /> &nbsp; Get Cost Summary
            </button>
          </div>
        ) : null}

        {/* ----------------------------------------------------------------
                                 survey Table  
         ----------------------------------------------------------------*/}
      </div>
    </>
  );
};

const ProjectTable = ({ currentProjects, handleSelect, history }) => {
  console.log(currentProjects);
  return (
    <div
      style={{ overflowX: "auto", marginTop: "2rem" }}
      className={styles.project_table_div}
    >
      <table className="project_table" id="project_table">
        <thead style={{ width: "100%" }}>
          <tr className={styles.cell_large}>
            <th
              style={{
                width: "370px",
                textAlign: "center",
              }}
            >
              Project Name
              <p className="headingDescription">
                Project No / Survey No | Client
              </p>
            </th>
            <th>
              Progress
              <p className="headingDescription">Completes/Hits</p>
            </th>
            <th>
              Avg. Cost
              <p className="headingDescription">per complete</p>
            </th>
            <th>
              IR
              <p className="headingDescription">compl./session</p>
            </th>
            <th>
              LOI
              <p className="headingDescription">avg</p>
            </th>
            <th>
              Project Managers
              <p className="headingDescription">lead</p>
            </th>
            <th>
              EPC
              <p className="headingDescription">per click</p>
            </th>
            <th>
              Study Type
              <p className="headingDescription">Survey Type</p>
            </th>
            {/* <th>Country</th> */}
            <th>
              Launch Date
              <p className="headingDescription">days ago</p>
            </th>
          </tr>
        </thead>
        <tbody>
          {currentProjects?.map((project, index) => {
            return (
              <tr key={index} className="dataRow">
                <td className="project_table_first_col">
                  <input
                    type="checkbox"
                    value="Bike"
                    name={project?.survey_name}
                    id="vehicle1"
                    onChange={handleSelect}
                  />
                  <div className="coldiv">
                    <Tooltip
                      content={
                        <TooltipForSurveyName name={project?.project_name} />
                      }
                    >
                      <label
                        className="project_name"
                        htmlFor="vehicle1"
                        onClick={() =>
                          history.push(
                            `/surveys/dashboard/${project?.survey_id}`
                          )
                        }
                      >
                        {project?.project_name}
                      </label>
                    </Tooltip>

                    <br />
                    <div className="project_survey_id_and_client_name">
                      <span>
                        #{project.project_id} / {project?.survey_id}
                      </span>

                      <span className="client">
                        {project?.client?.client_name}
                      </span>
                    </div>
                  </div>
                </td>

                <td>
                  {/* {project?.progress} / {project?.totalSurvey} */}
                  <span className="tableValue">
                    {project?.completedSessionsCnt} /{" "}
                    {project?.inClientSessionsCnt}
                  </span>
                  <br />
                  <span>completes</span>
                </td>
                {/* <td>{project.completes}</td> */}
                <td>
                  {/* {project.CPI} */}
                  <span className="tableValue">{project?.avg_cpi}</span>
                  <br />
                  <span>{project?.client?.client_cost_currency}</span>
                </td>
                <td>
                  {/* {project.IR} */}
                  <span className="tableValue">{project?.ir}%</span>
                  <br />
                  <span>in-field</span>
                </td>
                <td>
                  <span className="tableValue">{project?.loi}</span>
                  <br />
                  <span>mins</span>
                </td>
                <td>
                  <span className="tableValue">
                    {/* {project?.pm?.map(pm => (
											<>
												{pm} <br />
											</>
										))} */}
                    {/* showing only the first lead project manager  */}
                    {project?.pm?.length ? (
                      <span className="project_manager_name">
                        {project?.pm[0]}
                      </span>
                    ) : (
                      "-"
                    )}
                    {/* showing the number of lead project managers  */}
                    {project?.pm?.length - 1 ? (
                      <Tooltip
                        content={<OtherPMsTooltip pms={project?.pm} />}
                        placement="bottom"
                      >
                        {` +${project?.pm?.length - 1}`}
                      </Tooltip>
                    ) : null}
                  </span>
                </td>
                <td>
                  {/* {project.EPC} */}
                  <span className="tableValue">0.35</span>
                  <br />
                  <span>{project?.client?.client_cost_currency} </span>
                </td>
                <td>
                  <span className="tableValue">{project?.study_type}</span>
                  <br />
                  <span>{project?.survey_type}</span>
                </td>
                <td>
                  <span className="tableValue">
                    {project?.launchDate.toDateString()}
                  </span>
                  <br />
                  <span>
                    {(
                      (new Date().getTime() - project?.launchDate?.getTime()) /
                      (1000 * 3600 * 24)
                    ).toFixed(0)}{" "}
                    Days ago
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const SurveyTable = ({ currentSurveys, handleSelect, history }) => {
  return (
    <div
      style={{ overflowX: "auto", marginTop: "2rem" }}
      className={styles.project_table_div}
    >
      <table className="project_table" id="project_table">
        <thead style={{ width: "100%" }}>
          <tr className={styles.cell_large}>
            <th
              style={{
                width: "370px",
                textAlign: "center",
              }}
            >
              Survey Name
              <p className="headingDescription">
                Project No / Survey No | Client | Status
              </p>
            </th>
            <th>
              Progress
              <p className="headingDescription">Compl./Hits</p>
            </th>
            <th>
              Avg. Cost
              <p className="headingDescription">per complete</p>
            </th>
            <th>
              IR
              <p className="headingDescription">compl./session</p>
            </th>
            <th>
              LOI
              <p className="headingDescription">avg</p>
            </th>
            <th>
              Project Managers
              <p className="headingDescription">lead</p>
            </th>
            <th>
              EPC
              <p className="headingDescription">per click</p>
            </th>
            <th>
              Study Type
              <p className="headingDescription">Survey Type</p>
            </th>
            {/* <th>Country</th> */}
            <th>
              Launch Date
              <p className="headingDescription">days ago</p>
            </th>
          </tr>
        </thead>
        <tbody>
          {currentSurveys?.map((project, index) => {
            return (
              <tr key={index} className="dataRow">
                <td className="project_table_first_col">
                  <input
                    type="checkbox"
                    name={project?.survey_name}
                    onChange={handleSelect}
                  />
                  <div className="coldiv">
                    <div className="project_name_and_status">
                      <Tooltip
                        content={
                          <TooltipForSurveyName name={project?.survey_name} />
                        }
                      >
                        <label
                          htmlFor="vehicle1"
                          onClick={() =>
                            history.push(
                              `/surveys/dashboard/${project?.survey_id}`
                            )
                          }
                          className="project_name"
                        >
                          {project?.survey_name}
                        </label>
                      </Tooltip>

                      <span
                        className={`survey_status_${project.internal_status} survey_status`}
                      >
                        {project.internal_status}
                      </span>
                    </div>

                    <br />
                    <div className="project_id_and_internal_status">
                      <span>
                        #{project?.project_id} / {project.survey_id}
                      </span>

                      <span className="client">Luc.id</span>
                    </div>
                  </div>
                </td>

                <td>
                  {/* {project?.progress} / {project?.totalSurvey} */}
                  <span className="tableValue">
                    {project?.completes} / {project?.hits}
                  </span>
                  <br />
                  <span>completes</span>
                </td>
                {/* <td>{project.completes}</td> */}
                <td>
                  {/* {project.CPI} */}
                  <span className="tableValue">
                    {project?.avg_cpi === "NaN"
                      ? project?.client_info?.client_cpi
                      : project?.avg_cpi}
                  </span>
                  <br />
                  <span>{project?.client_info?.client_cost_currency}</span>
                </td>
                <td>
                  {/* {project.IR} */}
                  <span className="tableValue">
                    {project?.ir ? `${project?.ir} %` : "-"}
                  </span>
                  <br />
                  <span>in-field</span>
                </td>
                <td>
                  <span className="tableValue">
                    {project?.expected_completion_loi
                      ? project?.expected_completion_loi
                      : "-"}
                  </span>
                  <br />
                  <span>mins</span>
                </td>
                <td>
                  <span className="tableValue">
                    {/* showing only the first lead project manager  */}
                    {project?.mirats_insights_team?.lead_project_managers
                      .length ? (
                      <span className="project_manager_name">
                        {
                          project?.mirats_insights_team
                            ?.lead_project_managers[0]
                        }
                      </span>
                    ) : (
                      "-"
                    )}

                    {/* showing the number of lead project managers  */}
                    {project?.mirats_insights_team?.lead_project_managers
                      .length - 1 ? (
                      <Tooltip
                        content={
                          <OtherPMsTooltip
                            pms={
                              project?.mirats_insights_team
                                ?.lead_project_managers
                            }
                          />
                        }
                        placement="bottom"
                      >
                        {` +${
                          project?.mirats_insights_team?.lead_project_managers
                            .length - 1
                        }`}
                      </Tooltip>
                    ) : null}
                  </span>
                </td>
                <td>
                  {/* {project.EPC} */}
                  <span className="tableValue">0.35</span>
                  <br />
                  <span>{project?.client_info?.client_cost_currency} </span>
                </td>
                <td>
                  <span className="tableValue">{project?.study_type}</span>
                  <br />
                  <span>{project?.survey_type}</span>
                </td>
                <td>
                  <span className="tableValue">
                    {project?.creation_date?.toDate().toDateString()}
                  </span>
                  <br />
                  <span>
                    {(
                      (new Date().getTime() -
                        project?.creation_date?.toDate().getTime()) /
                      (1000 * 3600 * 24)
                    ).toFixed(0)}{" "}
                    Days ago
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const TooltipForSurveyName = ({ name }) => {
  return (
    <>
      <p>{name}</p>
    </>
  );
};

const OtherPMsTooltip = ({ pms }) => {
  return (
    <>
      {pms.map((pm, index) => {
        if (index !== 0) return <p>{pm}</p>;
      })}
    </>
  );
};

export default Surveys;
