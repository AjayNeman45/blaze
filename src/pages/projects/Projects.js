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
import styles from "./Project.module.css";
import { AiOutlineSearch } from "react-icons/ai";
import facewithmask from "../../assets/images/facewithmask.png";
import { Switch } from "@nextui-org/react";
const Projects = () => {
  const hashids = new Hashids("My Project");

  var id = hashids.encodeHex("5as7f78");
  console.log(id);
  var hex = hashids.decodeHex(id);
  console.log(hex);
  const [countCheckedProjects, setCountCheckProjects] = useState(0);
  const [checkRows, setCheckRows] = useState([]);
  const location = useLocation();
  const history = useHistory();
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

  const tableSearchBySurveyName = (e) => {
    console.log(e.target.value);
    var input, filter, table, tr, td, i, txtValue;
    input = e.target.value;
    filter = input.toUpperCase();
    table = document.getElementById("project_table");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[0];
      if (td) {
        txtValue = td.textContent || td.innerText;
        console.log(txtValue);
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  };

  const tableSearchByStudyType = (e) => {
    var input, filter, table, tr, td, i, txtValue;
    input = e.target.value;
    filter = input.toUpperCase();
    table = document.getElementById("project_table");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[8];
      console.log(td);
      if (td) {
        txtValue = td.textContent || td.innerText;
        console.log(txtValue);
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  };

  const tableSearchByCountry = (e) => {
    var input, filter, table, tr, td, i, txtValue;
    input = e.target.value;
    filter = input.toUpperCase();
    table = document.getElementById("project_table");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[9];
      console.log(td);
      if (td) {
        txtValue = td.textContent || td.innerText;
        console.log(txtValue);
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  };

  const tableSearchByMonth = (e) => {
    var input, filter, table, tr, td, i, txtValue;
    input = e.target.value;
    filter = input.toUpperCase();
    table = document.getElementById("project_table");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[10];
      console.log(td);
      if (td) {
        txtValue = td.textContent || td.innerText;
        console.log(txtValue);
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  };

  return (
    <>
      <Header />

      <div className={styles.projectWrapper}>
        <div className={styles.projectHead}>
          <div className={styles.left}>
            <div className={styles.left_header}>
              <div className={styles.head}>
                <p className={styles.p}>Surveys</p>
                <Switch />
              </div>

              <div className="searchField">
                {/* Search bar comes here  */}
                <input
                  type="search"
                  placeholder="Search Project, Surveys and much more."
                  className={styles.searchbar}
                />
                <AiOutlineSearch className="searchIcon" />
              </div>
            </div>
            <div className={styles.left_select_container}>
              <div>
                <select>
                  <option value="">Project Manager</option>
                </select>
              </div>
              <div>
                <select>
                  <option value="">Study Type</option>
                </select>
              </div>
              <div>
                <select>
                  <option value="">Countries</option>
                </select>
              </div>
              <div>
                <select>
                  <option value="">Survey Type</option>
                </select>
              </div>
              <div>
                <select>
                  <option value="">Client</option>
                </select>
              </div>
              <div>
                <select>
                  <option value="">This Month</option>
                </select>
              </div>
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
                                 project Heading Links  
         ----------------------------------------------------------------*/}
        <div className={styles.projectHeadingWrapper}>
          <div className="headingLinks">
            <a href="#" className={styles.active}>
              Live In
            </a>
            <a href="#">Awarded (N)</a>
            <a href="#">Paused (N)</a>
            <a href="#">Completed (N)</a>
            <a href="#">Billed (N)</a>
            <a href="#">All (N)</a>
          </div>
          <div>
            <Link
              className={styles.create_new_survey_btn}
              to="/create-new-project/basic"
            >
              Create New Survey
            </Link>
          </div>
        </div>

        {/* ----------------------------------------------------------------
                                 project Table  
         ----------------------------------------------------------------*/}
        <div className="project_page">
          <div
            style={{ overflowX: "auto" }}
            className={styles.project_table_div}
          >
            <table className="project_table" id="project_table">
              <thead style={{ width: "100%" }}>
                <tr className={styles.cell_large}>
                  <th style={{ width: "370px", textAlign: "center" }}>
                    Survey Name
                    <p className="headingDescription">
                      Project No / Survey No | Client | Status
                    </p>
                  </th>
                  <th>
                    Progress
                    <p className="headingDescription">Completes/Hits</p>
                  </th>
                  {/* <th>
                    Completes
                    <p className="headingDescription">per complete</p>
                  </th> */}
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
                    PM
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
                {projects.map((project, index) => {
                  if (view === "all") {
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
                            <label
                              style={{
                                color: "black",
                                fontWeight: 100,
                                fontSize: "12px",
                              }}
                              htmlFor="vehicle1"
                              onClick={() =>
                                history.push(
                                  `/projects/reconciliations/${project?.survey_id}`
                                )
                              }
                            >
                              {project?.survey_name}
                            </label>
                            <br />
                            <div className="project_id_and_internal_status">
                              <span>
                                #{project?.survey_id} / {project.project_id}
                              </span>

                              <span className="client">Luc.id</span>

                              <span
                                style={{
                                  fontSize: "10px",
                                  color: "black",
                                  fontWeight: "lighter",
                                }}
                                className={`survey_status_${project.internal_status} survey_status`}
                              >
                                {project.internal_status}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          {/* {project?.progress} / {project?.totalSurvey} */}
                          <span className="tableValue">27/102</span>
                          <br />
                          <span>completes</span>
                        </td>
                        {/* <td>{project.completes}</td> */}
                        <td>
                          {/* {project.CPI} */}
                          <span className="tableValue">1.23</span>
                          <br />
                          <span>US Dollar</span>
                        </td>
                        <td>
                          {/* {project.IR} */}
                          <span className="tableValue">26.47%</span>
                          <br />
                          <span>in-field</span>
                        </td>
                        <td>
                          <span className="tableValue">
                            {project?.expected_completion_loi}
                          </span>
                          <br />
                          <span>mins</span>
                        </td>
                        <td>
                          {/* {project?.project_manager} */}
                          <span className="tableValue">JR</span>
                          <br />
                          <span>Janhavi </span>
                        </td>
                        <td>
                          {/* {project.EPC} */}
                          <span className="tableValue">0.35</span>
                          <br />
                          <span>US Dollar </span>
                        </td>
                        <td>
                          {/* {project.study_type} */}
                          <span className="tableValue">B2C</span>
                          <br />
                          <span>adhoc</span>
                        </td>
                        {/* <td>{project?.country?.country}</td> */}
                        <td>
                          <span className="tableValue">
                            {project?.creation_date?.toDate().toDateString()}
                          </span>
                          <br />
                          <span>5 Days ago</span>
                        </td>
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
                            </label>
                            <br />
                            <small>{project.projectID}</small>
                          </div>
                        </td>
                        <td>
                          {project.progress} / {project.totalSurvey}
                          <br />
                          <span>completes</span>
                        </td>
                        {/* <td>
                          {project.completes}
                          <br />
                          <span>completes</span>
                        </td> */}
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
      </div>
    </>
  );
};

export default Projects;
