import Header from "../../components/header/Header";
import {
  Link,
  useHistory,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
import { MdEdit } from "react-icons/md";
import { MdContentCopy } from "react-icons/md";
import { FiDownload } from "react-icons/fi";
import "./Projects.css";
import { useEffect, useState } from "react";
import Subheader from "../../components/subheader/Subheader";
import { useProjectContext } from "./ProjectContext";
import Hashids from "hashids";

const Projects = () => {
  const hashids = new Hashids("My Project");

  var id = hashids.encodeHex("5as7f78");
  console.log(id);
  var hex = hashids.decodeHex(id);
  console.log(hex);

  const history = useHistory();
  const [countCheckedProjects, setCountCheckProjects] = useState(0);
  const [checkRows, setCheckRows] = useState([]);
  const location = useLocation();
  const view = new URLSearchParams(location.search).get("view");
  const [liveCnt, setLiveCnt] = useState(0);
  const [awardedCnt, setAwardedCnt] = useState(0);
  const [pausedCnt, setPausedCnt] = useState(0);
  const [completedCnt, setComletedCnt] = useState(0);
  const [billedCnt, setBilledCnt] = useState(0);
  const [biddingCnt, setBiddingCnt] = useState(0);

  const { projects } = useProjectContext();
  useEffect(() => {
    projects.map((project) => {
      if (project?.status === "live") {
        setLiveCnt((prevState) => prevState + 1);
      }
      if (project?.status === "awarded") {
        setAwardedCnt((prevState) => prevState + 1);
      }
      if (project?.status === "paused") {
        setPausedCnt((prevState) => prevState + 1);
      }
      if (project?.status === "completed") {
        setComletedCnt((prevState) => prevState + 1);
      }
      if (project?.status === "billed") {
        setBilledCnt((prevState) => prevState + 1);
      }
      if (project?.status === "bidding") {
        setBiddingCnt((prevState) => prevState + 1);
      }
    });
  }, []);

  useEffect(() => {
    document.querySelectorAll("li").forEach((li) => {
      if (li.children[0].classList.contains(view)) {
        li.children[0].style.color = "blue";
      } else {
        li.children[0].style.color = "";
      }
    });
  }, [view]);

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

  return (
    <>
      <Header />
      <div className="project_page">
        <h3 className="project_page_title">Projects</h3>
        <div className="search_section">
          <div className="searchby">
            <label>Search</label>
            <input
              type="text"
              placeholder="search project by name or id"
              className="input"
            />
          </div>
          <div className="searchby">
            <label>Project Manager</label>
            <input
              type="text"
              placeholder="search project by name or id"
              disabled
              className="input"
            />
          </div>

          <div className="searchby">
            <label>Study Type</label>
            <input
              type="text"
              placeholder="search project by name or id"
              className="input"
            />
          </div>
          <div className="searchby">
            <label>Countries</label>
            <input
              type="text"
              placeholder="search project by name or id"
              className="input"
            />
          </div>
          <div className="searchby">
            <label>Months</label>
            <select className="month input">
              <option name="January" value="Jan">
                January
              </option>
              <option name="February" value="Feb">
                February
              </option>
              <option name="March" value="Mar">
                March
              </option>
              <option name="April" value="Apr">
                April
              </option>
              <option name="May" value="May">
                May
              </option>
              <option name="June" value="Jun">
                June
              </option>
              <option name="July" value="Jul">
                July
              </option>
              <option name="August" value="Aug">
                August
              </option>
              <option name="September" value="Sep">
                September
              </option>
              <option name="October" value="Oct">
                October
              </option>
              <option name="November" value="Nov">
                November
              </option>
              <option name="December" value="Dec">
                December
              </option>
            </select>
          </div>
          <div className="searchby">
            <label>Clients</label>
            <select className="countries input">
              <option value="all">All</option>
              <option value="india">India</option>
              <option value="india">India</option>
              <option value="india">India</option>
            </select>
          </div>
        </div>
        <div className="filter_project_section">
          <ul>
            <li value="live">
              <Link className="link live" to="/projects?view=live" value="live">
                LIVE({liveCnt})
              </Link>
            </li>
            <li value="awarded">
              <Link className="link awarded" to="/projects?view=awarded">
                AWARDED({awardedCnt})
              </Link>
            </li>
            <li value="paused">
              <Link className="link paused" to="/projects?view=paused">
                PAUSED({pausedCnt})
              </Link>
            </li>
            <li value="completed">
              <Link className="link completed" to="/projects?view=completed">
                COMPLETED({completedCnt})
              </Link>
            </li>
            <li value="billed">
              <Link className="link billed" to="/projects?view=billed">
                BILLED({billedCnt})
              </Link>
            </li>
            <li value="bidding">
              <Link className="link bidding" to="/projects?view=bidding">
                BIDDING({biddingCnt})
              </Link>
            </li>
            <li value="all">
              <Link className="link all" to="/projects?view=all">
                ALL({projects.length})
              </Link>
            </li>
          </ul>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="project_table">
            <thead>
              <tr>
                <th>Survey</th>
                <th>Progress</th>
                <th>Completes</th>
                <th>Avg. CPI</th>
                <th>IR</th>
                <th>LOI</th>
                <th>PM</th>
                <th>EPC</th>
                <th>Study Type</th>
                <th>Creation Date</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => {
                if (view === "all") {
                  return (
                    <tr key={index}>
                      <td className="project_table_first_col">
                        <input
                          type="checkbox"
                          value="Bike"
                          name={project?.survey_name}
                          id="vehicle1"
                          onChange={handleSelect}
                        />
                        <div className="coldiv">
                          <label
                            htmlFor="vehicle1"
                            onClick={() =>
                              history.push(
                                `/projects/reconciliations/${project?.survey_id}`
                              )
                            }
                          >
                            {project?.survey_name}
                          </label>{" "}
                          <br />
                          <div className="project_id_and_internal_status">
                            <span>#{project?.survey_id}</span>
                            <span
                              className={`survey_status_${project.internal_status} survey_status`}
                            >
                              {project.internal_status}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        {project?.progress} / {project?.totalSurvey}
                        <br />
                        <span>completes</span>
                      </td>
                      <td>{project.completes}</td>
                      <td>{project.CPI}</td>
                      <td>{project.IR}</td>
                      <td>{project?.expected_completion_loi}</td>
                      <td>{project?.project_manager}</td>
                      <td>{project.EPC}</td>
                      <td>{project.study_type}</td>
                      <td>{project.creation_date}</td>
                    </tr>
                  );
                } else if (project.status === view) {
                  return (
                    <tr key={index}>
                      <td className="project_table_first_col">
                        <input
                          type="checkbox"
                          value="Bike"
                          name={project.name}
                          id="vehicle1"
                          onChange={handleSelect}
                        />
                        <div>
                          <label
                            htmlFor="vehicle1"
                            onClick={() =>
                              history.push(
                                `/projects/dashboard/${project.name}`
                              )
                            }
                          >
                            {project.name}
                          </label>{" "}
                          <br />
                          <small>{project.projectID}</small>
                        </div>
                      </td>
                      <td>
                        {project.progress} / {project.totalSurvey}
                        <br />
                        <span>completes</span>
                      </td>
                      <td>{project.completes}</td>
                      <td>{project.CPI}</td>
                      <td>{project.IR}</td>
                      <td>{project.LOI}</td>
                      <td>{project.PM}</td>
                      <td>{project.EPC}</td>
                      <td>{project.study_type}</td>
                      <td>{project.creation_date}</td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
        </div>

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
      </div>
    </>
  );
};

export default Projects;
