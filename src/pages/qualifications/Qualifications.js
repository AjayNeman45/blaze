import React, { useEffect, useState } from "react";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import Header from "../../components/header/Header";
import Question from "../../components/question/Question";
import Subheader from "../../components/subheader/Subheader";
import styles from "./Qualifications.module.css";
import { useQualificationsContext } from "./QualificationsContext";
import EditQuestionModal from "./edit-question-modal/EditQuestionModal";
import { updateQualificationStatus } from "../../utils/firebaseQueries";
import { v4 as uuid } from "uuid";
import { Loading } from "@nextui-org/react";
import SurveyInfo from "../../components/survey-info/SurveyInfo";

const Qualifications = () => {
  const { qualifications, setEditQuestion, fetchingQualifications } =
    useQualificationsContext();
  const [questions, setQuestions] = useState(qualifications);
  const history = useHistory();
  useEffect(() => {
    setQuestions(qualifications);
  }, [qualifications]);

  const [openEditModal, setOpenEditModal] = useState(false);
  const { surveyID } = useParams();
  const handleEditQuestion = (question_id) => {
    setOpenEditModal(true);
    questions?.map((question) => {
      if (question?.question_id === question_id) {
        setEditQuestion(question);
      }
    });
  };

  const handleInactivate = async (question_id) => {
    if (window.confirm("Are you sure you want to inactivate qualification?")) {
      updateQualificationStatus(surveyID, question_id)
        .then(() => {
          setQuestions((prevArr) => {
            return prevArr?.filter((question) => {
              return question?.question_id !== question_id;
            });
          });
        })
        .catch((err) => console.log(err.message));
    } else {
      console.log("cancel clicked");
    }
  };

  const handleAddQualificationBtn = () => {
    history.push(`/add/qualifications/${surveyID}`);
  };

  const tableSearchByName = (e) => {
    var input, filter, table, tr, td, i, txtValue;
    input = e.target.value;
    filter = input.toUpperCase();
    table = document.getElementById("qualification__table");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[1];
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
      <Subheader />
      <div className={styles.qualification_page}>
        <SurveyInfo />
        <div className={styles.head_section}>
          <div className={styles.head_section_right}>
            <div className={styles.survay_name_search}>
              <input
                type="text"
                placeholder="search by name"
                id="qualification_name_search"
                onChange={tableSearchByName}
              />
            </div>
            <div className={styles.head_section_right_btns}>
              <button
                className={styles.add_qualification_btn}
                onClick={handleAddQualificationBtn}
              >
                Add Qualification
              </button>
              {/*  we will going to use this button later <button className={styles.manage_logic_btn}>Add Logic</button>  */}
            </div>
          </div>
        </div>
        <div className={styles.table_section}>
          {fetchingQualifications ? (
            <Loading />
          ) : (
            <table
              className={styles.qualification_table}
              id="qualification__table"
            >
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Qualification</th>
                  <th>Condition</th>
                  <th>Status</th>
                  <th>Function</th>
                </tr>
              </thead>
              <tbody>
                {questions?.map((data, index) => {
                  return (
                    <tr key={data?.question_id}>
                      <td>{index}</td>
                      <td>{data.question_name}</td>
                      <ConditionsColumn data={data} />
                      <td>Active</td>
                      <td className={styles.table_function_col}>
                        <span
                          onClick={() => handleEditQuestion(data?.question_id)}
                        >
                          Edit
                        </span>
                        {/* <span> */}
                        <a
                          href={`/question-preview/${surveyID}/${data?.question_id}`}
                          target="_blank"
                        >
                          Preview{" "}
                        </a>
                        {/* </span> */}
                        <span
                          onClick={() => handleInactivate(data?.question_id)}
                        >
                          Inactivate
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {openEditModal && (
        <EditQuestionModal
          openEditModal={openEditModal}
          setOpenEditModal={setOpenEditModal}
        />
      )}
    </>
  );
};

export default Qualifications;

const ConditionsColumn = ({ data }) => {
  return (
    <>
      {data?.conditions ? (
        <td className={styles.conditions_col}>
          {data?.conditions?.how_many && (
            <>
              min :&nbsp; {data?.conditions?.how_many?.min} &nbsp; max :&nbsp;{" "}
              {data?.conditions?.how_many?.max}
              <br />
            </>
          )}

          {data?.conditions?.valid_options?.map((option, i) => {
            return (
              <div key={uuid()}>
                {i === 0 && <label>one or more from: &nbsp;</label>}
                <span>{data?.options[parseInt(option)]}</span>
              </div>
            );
          })}

          {data?.conditions?.valid_responses &&
            data?.conditions?.valid_responses.map((resp, i) => {
              return (
                <span key={uuid()}>
                  {resp?.from} - {resp?.to}
                </span>
              );
            })}

          {data?.conditions?.valid_ans && (
            <>
              <span>{data?.conditions?.valid_ans}</span>
            </>
          )}
        </td>
      ) : (
        <td>
          <span className={styles.any_condition_pass}>Any condition pass</span>
        </td>
      )}
    </>
  );
};
