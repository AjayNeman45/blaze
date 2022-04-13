import { MenuItem, Modal, Select } from "@mui/material";
import React, { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import Subheader from "../../components/subheader/Subheader";
import styles from "./Quotas.module.css";
import { FaInfoCircle } from "react-icons/fa";
import { IoMdLock } from "react-icons/io";
import ProjectInfo from "../../components/project-info/ProjectInfo";
import { useQuotasContext } from "./QuotasContext";
import SurveyInfo from "../../components/survey-info/SurveyInfo";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useParams } from "react-router-dom";
import { addQuota, getQuestion } from "../../utils/firebaseQueries";
import { v4 as uuid } from "uuid";
import SnackbarMsg from "../../components/Snackbar";
import { toNumber } from "lodash";
import { Radio } from "@nextui-org/react";

const tableHeadData = {
  field_target: 200,
  quota: 200,
  prescreens: 450,
  completes: 1,
  total_remaining: 199,
  conversion: 1,
};

const Quotas = () => {
  const [showQuotaModal, setShowQuotaModal] = useState(false);
  const [qualifications, setQualifications] = useState([]);
  const [status, setStatus] = useState("");
  const [quotas, setQuotas] = useState({});
  const { surveyID } = useParams();
  const { survey } = useQuotasContext();

  useEffect(() => {
    const func = async () => {
      getDoc(doc(db, "mirats", "surveys", "survey", surveyID))
        .then((res) => {
          res.data()?.qualifications?.questions?.map(async (question) => {
            const qid = question?.question_id;
            console.log(question);
            setQuotas((prevData) => {
              return {
                ...prevData,
                [question?.question_name]: { ...question?.conditions?.quotas },
              };
            });
            if (!question?.status) return;
            const questionData = await getQuestion(qid);
            setQualifications((prevData) => [
              ...prevData,
              {
                ...question,
                ...questionData.data()?.lang["ENG-IN"],
                question_type: questionData.data()?.question_type,
                question_name: questionData.data()?.name,
                conditions: question?.conditions ? question?.conditions : null,
              },
            ]);
          });
        })
        .catch((err) => console.log(err.message));
    };
    func();
  }, []);

  return (
    <>
      <Header />
      <Subheader />
      <div>
        <SurveyInfo />
        <div className={styles.quota_info}>
          <div className={styles.quota_info_left}>
            <div className={styles.quota_info_section}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <label>calculation type</label> &nbsp;
                <FaInfoCircle color="gray" />
              </div>
              <div>
                <span>Completes</span> &nbsp;
                <span style={{ color: "blue" }}>edit</span>
              </div>
            </div>
            <div className={styles.quota_info_section}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <label>auto increment</label> &nbsp;
                <FaInfoCircle color="gray" />
              </div>

              <div>
                <span>Off</span>&nbsp;
                <span style={{ color: "blue" }}>edit</span>
              </div>
            </div>
            <div className={styles.quota_info_section}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <label>field end date</label>&nbsp;
                <FaInfoCircle color="gray" />
              </div>
              <span>-</span>
            </div>
            <div className={styles.quota_info_section}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <label>total entrants</label>&nbsp;
                <FaInfoCircle color="gray" />
              </div>
              <span>469</span>
            </div>
          </div>
          <div className={styles.quota_info_right}>
            <button
              className={styles.add_quota_btn}
              onClick={() => setShowQuotaModal(true)}
            >
              Add Quota
            </button>
            <button className={styles.import_btn}>Import</button>
          </div>
        </div>
        <div className={styles.quota_table}>
          <table>
            <thead>
              <tr>
                <th>Question Name</th>
                <th>Quota Name</th>
                <th>Field Target</th>
                <th>Quota</th>
                <th>Prescreens</th>
                <th>Completes</th>
                <th>Total Remaining</th>
                <th>Conversion</th>
                {/* <th>Lock</th> */}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={2}>Total</td>
                <td>
                  <input
                    className={styles.table_input}
                    type="number"
                    disabled
                    value={tableHeadData.field_target}
                  />
                </td>
                <td>
                  <input
                    className={styles.table_input}
                    type="number"
                    value={survey?.no_of_completes}
                    disabled
                  />
                </td>
                <td>{tableHeadData.prescreens}</td>
                <td>{tableHeadData.completes}</td>
                <td>{tableHeadData.total_remaining}</td>
                <td>{tableHeadData.conversion} %</td>
                {/* <td>
                  <IoMdLock size={20} />
                </td> */}
              </tr>
              {qualifications.map((data, index) => {
                if (data?.conditions.hasOwnProperty("quotas")) {
                  // console.log("yes", data);
                  switch (data?.question_type) {
                    case "Numeric - Open-end":
                      return data?.conditions?.valid_responses?.map(
                        (response, indx) => {
                          return data?.conditions?.quotas[indx] ? (
                            <tr>
                              <td>{data?.question_name}</td>
                              <td>
                                {response?.from} to {response?.to}
                              </td>
                              <td>
                                <input
                                  className={styles.table_input}
                                  type="number"
                                />
                              </td>
                              <td>
                                <input
                                  className={styles.table_input}
                                  type="text"
                                  value={data?.conditions?.quotas[indx]}
                                  onChange={(e) => {
                                    setQualifications((prear) => {
                                      return qualifications?.filter((q, i) => {
                                        console.log(
                                          i,
                                          index,
                                          q?.conditions?.quotas
                                        );
                                        let obj = {};
                                        if (i === index) {
                                          obj = {
                                            ...q,
                                            conditions: {
                                              ...q?.conditions,
                                              quotas: {
                                                ...q?.conditions?.quotas,
                                                [indx]: parseInt(
                                                  e.target.value
                                                ),
                                              },
                                            },
                                          };
                                        } else {
                                          obj = q;
                                        }
                                        console.log(obj);
                                        return obj;
                                      });
                                    });
                                  }}
                                />
                              </td>

                              <td>{data.prescreens}</td>
                              <td>{data.completes}</td>
                              <td>{data.total_remaining}</td>
                              <td>{data.conversion}</td>
                              {/* <td>
                                <IoMdLock size={20} />
                              </td> */}
                            </tr>
                          ) : null;
                        }
                      );
                    case "Single Punch":
                      return data?.conditions?.valid_options?.map(
                        (option, indx) => {
                          return data?.conditions?.quotas[indx] ? (
                            <tr>
                              <td>{data?.question_name}</td>
                              <td>{data?.options[option]}</td>
                              <td>
                                <input
                                  className={styles.table_input}
                                  type="number"
                                  value={data.quota}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className={styles.table_input}
                                  value={data?.conditions?.quotas[indx]}
                                />
                              </td>
                              <td>{data.prescreens}</td>
                              <td>{data.completes}</td>
                              <td>{data.total_remaining}</td>
                              <td>{data.conversion}</td>
                              {/* <td>
                                <IoMdLock size={20} />
                              </td> */}
                            </tr>
                          ) : null;
                        }
                      );
                  }
                }
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* show qualification modal  */}
      <QuotaModal
        showQuotaModal={showQuotaModal}
        setShowQuotaModal={setShowQuotaModal}
        qualifications={qualifications}
      />
    </>
  );
};

const QuotaModal = ({ showQuotaModal, setShowQuotaModal, qualifications }) => {
  const [showQuotaAddModal, setShowQuotaAddModal] = useState(false);
  const [selectQuestion, setSelectQuestion] = useState({});
  const handleBtnChange = () => {
    setShowQuotaModal(false);
    setShowQuotaAddModal(true);
  };
  return (
    <>
      <Modal
        open={showQuotaModal}
        onClose={() => setShowQuotaModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className={styles.quotas_modal}>
          <h3>Change Quota of Qualifications</h3>
          <div className={styles.qualifications_list}>
            <Radio.Group onChange={(e) => setSelectQuestion(e)}>
              {qualifications?.map((question) => {
                let questionType = question?.question_type;
                if (
                  questionType === "Numeric - Open-end" ||
                  questionType === "Single Punch"
                )
                  return (
                    <Radio value={question}>{question?.question_name}</Radio>
                    // <div className={styles.qualification}>
                    //   <input
                    //     type="radio"
                    //     name="qualification_que"
                    //     id={question?.question_text}
                    //     onChange={() => setSelectQuestion(question)}
                    //   />
                    //   &nbsp; <label>{question?.question_name}</label>
                    // </div>
                  );
              })}
            </Radio.Group>
          </div>
          <div className={styles.change_btn}>
            <button onClick={handleBtnChange}>Change</button>
          </div>
        </div>
      </Modal>

      <AddQuotaModal
        showQuotaAddModal={showQuotaAddModal}
        setShowQuotaAddModal={setShowQuotaAddModal}
        qualification={selectQuestion}
      />
    </>
  );
};

const AddQuotaModal = ({
  showQuotaAddModal,
  setShowQuotaAddModal,
  qualification,
}) => {
  const { survey } = useQuotasContext();
  const { surveyID } = useParams();
  const [quotaValues, setQuotaValues] = useState({});
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarData, setSnackbarData] = useState({});
  const [remainingQuota, setRemainingQuota] = useState();
  const [quotasUsed, setQuotaUsed] = useState(0);
  const [disabledBtn, setDisabledBtn] = useState(true);

  useEffect(() => {
    setRemainingQuota(survey?.no_of_completes);
  }, [survey]);

  const handleSaveBtnClick = () => {
    addQuota(surveyID, qualification?.question_id, quotaValues)
      .then(() => {
        setShowSnackbar(true);
        console.log("quota updated...");
        setSnackbarData({
          msg: `quota updated  successfully for question - ${qualification?.question_name}`,
          severity: "success",
        });
      })
      .catch((err) => {
        setSnackbarData({
          msg: `could not update quota for question - ${qualification?.question_name}, try again...!`,
          severity: "error",
        });
      });
    setQuotaValues([]);
    setShowQuotaAddModal(false);

    // .then(res => {
    //   console.log(res)
    // }).catch(err => {
    //   console.log(err)
    // })
  };

  const handleInputChange = (e, indx) => {
    let value = parseInt(e.target.value);
    setQuotaValues((prevData) => {
      let data = prevData;
      data[indx] = isNaN(value) ? 0 : value;
      return data;
    });
  };

  // console.log(quotaValues)

  const handleSnackbar = () => {
    setShowSnackbar(!showSnackbar);
  };

  return (
    <>
      <SnackbarMsg
        msg={snackbarData?.msg}
        severity={snackbarData?.severity}
        open={showSnackbar}
        handleClose={handleSnackbar}
      />
      <Modal
        open={showQuotaAddModal}
        onClose={() => setShowQuotaAddModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className={styles.quota_add_modal}>
          <div className={styles.modal_header}>
            <p className={styles.title}>Change Quota</p>
            <p>Total quotas - {remainingQuota - quotasUsed}</p>
          </div>

          <p className={styles.question_text}>{qualification.question_text}</p>
          {(() => {
            switch (qualification?.question_type) {
              case "Numeric - Open-end": {
                return qualification?.conditions?.valid_responses?.map(
                  (response, indx) => {
                    return (
                      <div className={styles.numeric_conditions} key={uuid()}>
                        <span>{response.from}</span> To
                        <span>{response.to}</span> - &nbsp;{" "}
                        <input
                          type="number"
                          placeholder="add quota"
                          value={quotaValues[indx]}
                          onChange={(e) => handleInputChange(e, indx)}
                        />
                      </div>
                    );
                  }
                );
              }
              case "Single Punch":
                return qualification?.conditions?.valid_options?.map(
                  (option, indx) => {
                    return (
                      <div
                        key={uuid()}
                        className={styles.single_punch_condition}
                      >
                        <span>{qualification?.options[option]}</span> &nbsp; -
                        <input
                          type="number"
                          placeholder="add quota"
                          value={quotaValues?.[indx]}
                          onChange={(e) => handleInputChange(e, indx)}
                        />
                      </div>
                    );
                  }
                );
            }
          })()}
          <button className={styles.save_btn} onClick={handleSaveBtnClick}>
            Save
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Quotas;
