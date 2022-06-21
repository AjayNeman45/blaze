import { MenuItem, Modal, Select } from "@mui/material";
import React, { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import Subheader from "../../components/subheader/Subheader";
import styles from "./Quotas.module.css";
import { FaInfoCircle } from "react-icons/fa";
import { useQuotasContext } from "./QuotasContext";
import SurveyInfo from "../../components/survey-info/SurveyInfo";
import { useParams } from "react-router-dom";
import { addQuota, getQuestion } from "../../utils/firebaseQueries";
import { v4 as uuid } from "uuid";
import SnackbarMsg from "../../components/Snackbar";
import { set, toNumber } from "lodash";
import { Radio } from "@nextui-org/react";
import { data } from "../../tmp";

const Quotas = () => {
  const [showQuotaModal, setShowQuotaModal] = useState(false);
  const [quotasChange, setQuotasChange] = useState(false);
  const { surveyID } = useParams();
  const {
    survey,
    qualifications,
    getQualificationsForQuotas,
    setQualifications,
    totalData,
  } = useQuotasContext();

  useEffect(() => {
    if (quotasChange) {
      getQualificationsForQuotas(survey);
    }
  }, [quotasChange]);

  const handleQuotasChange = (e, indx, index) => {
    setQualifications((prear) => {
      return qualifications?.filter((q, i) => {
        let obj = {};
        if (i === index) {
          obj = {
            ...q,
            conditions: {
              ...q?.conditions,
              quotas: {
                ...q?.conditions?.quotas,
                [indx]: parseInt(e.target.value),
              },
            },
          };
        } else {
          obj = q;
        }
        return obj;
      });
    });
  };

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
              <span>-</span>
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
                {/* <th>Field Target</th> */}
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
                {/* <td>
                  <input
                    className={styles.table_input}
                    type="number"
                    disabled
                    // value={tableHeadData.field_target}
                  />
                </td> */}
                <td>
                  <input
                    className={styles.table_input}
                    type="number"
                    value={survey?.no_of_completes}
                    disabled
                  />
                </td>
                <td>{totalData?.total_prescreens}</td>
                <td>{totalData?.total_completes}</td>
                <td>{totalData.total_remaining}</td>
                <td>{totalData?.total_conversion} %</td>
                {/* <td>
                  <IoMdLock size={20} />
                </td> */}
              </tr>
              {qualifications.map((data, index) => {
                if (data?.conditions.hasOwnProperty("quotas")) {
                  switch (data?.question_type) {
                    case "Numeric - Open-end":
                      return data?.conditions?.valid_responses?.map(
                        (response, indx) => {
                          return data?.conditions?.quotas.hasOwnProperty(
                            indx
                          ) ? (
                            <tr key={uuid()}>
                              <td>{data?.question_name}</td>
                              <td>
                                {response?.from} to {response?.to}
                              </td>
                              <td>
                                <input
                                  className={styles.table_input}
                                  type="text"
                                  value={data?.conditions?.quotas?.[indx]}
                                  onChange={(e) => {
                                    handleQuotasChange(e, indx, index);
                                  }}
                                />
                              </td>

                              <td>
                                {
                                  data.prescreens[
                                    `${data?.conditions?.valid_responses?.[indx]?.from}-${data?.conditions?.valid_responses?.[indx]?.to}`
                                  ]
                                }
                              </td>
                              <td>
                                {
                                  data.completes[
                                    `${data?.conditions?.valid_responses?.[indx]?.from}-${data?.conditions?.valid_responses?.[indx]?.to}`
                                  ]
                                }
                              </td>
                              <td>
                                {data?.conditions?.quotas?.[indx] -
                                  data.completes[
                                    `${data?.conditions?.valid_responses?.[indx]?.from}-${data?.conditions?.valid_responses?.[indx]?.to}`
                                  ]}
                              </td>
                              <td>
                                {Math.round(
                                  (data.completes[
                                    `${data?.conditions?.valid_responses?.[indx]?.from}-${data?.conditions?.valid_responses?.[indx]?.to}`
                                  ] /
                                    data?.prescreens[
                                      data?.conditions?.valid_responses?.[indx]
                                        ?.from +
                                        "-" +
                                        data?.conditions?.valid_responses?.[
                                          indx
                                        ]?.to
                                    ]) *
                                    100
                                )}{" "}
                                %
                              </td>
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
                          if (data?.conditions?.quotas?.hasOwnProperty(indx)) {
                            return (
                              <tr key={uuid()}>
                                <td>{data?.question_name}</td>
                                <td>{data?.options?.[option]}</td>
                                <td>
                                  <input
                                    type="text"
                                    className={styles.table_input}
                                    value={data?.conditions?.quotas?.[indx]}
                                  />
                                </td>
                                <td>
                                  {
                                    data?.prescreens?.[
                                      data?.options?.[
                                        data?.conditions?.valid_options?.[indx]
                                      ]
                                    ]
                                  }
                                </td>
                                <td>
                                  {
                                    data?.completes?.[
                                      data?.options?.[
                                        data?.conditions?.valid_options?.[indx]
                                      ]
                                    ]
                                  }
                                </td>
                                <td>
                                  {data?.conditions?.quotas?.[indx] -
                                    data?.completes?.[
                                      data?.options?.[
                                        data?.conditions?.valid_options?.[indx]
                                      ]
                                    ]}
                                </td>
                                <td>
                                  {Math.round(
                                    (data?.completes?.[
                                      data?.options?.[
                                        data?.conditions?.valid_options?.[indx]
                                      ]
                                    ] /
                                      data?.prescreens[
                                        data?.options?.[
                                          data?.conditions?.valid_options?.[
                                            indx
                                          ]
                                        ]
                                      ]) *
                                      100
                                  )}{" "}
                                  %
                                </td>
                                {/* <td>
                                <IoMdLock size={20} />
                              </td> */}
                              </tr>
                            );
                          }
                        }
                      );
                    case "Multi Punch":
                      return data?.conditions?.valid_options?.map(
                        (option, indx) => {
                          if (data?.conditions?.quotas?.hasOwnProperty(indx)) {
                            return (
                              <tr key={uuid()}>
                                <td>{data?.question_name}</td>
                                <td>{data?.options?.[option]}</td>
                                <td>
                                  <input
                                    type="text"
                                    className={styles.table_input}
                                    value={data?.conditions?.quotas?.[indx]}
                                  />
                                </td>
                                <td>{data?.prescreens}</td>
                                <td>
                                  {
                                    data?.completes?.[
                                      data?.options?.[
                                        data?.conditions?.valid_options?.[indx]
                                      ]
                                    ]
                                  }
                                </td>
                                <td>
                                  {data?.conditions?.quotas?.[indx] -
                                    data?.completes?.[
                                      data?.options?.[
                                        data?.conditions?.valid_options?.[indx]
                                      ]
                                    ]}
                                </td>
                                <td>
                                  {Math.round(
                                    (data?.completes?.[
                                      data?.options?.[
                                        data?.conditions?.valid_options?.[indx]
                                      ]
                                    ] /
                                      data?.prescreens[
                                        data?.options?.[
                                          data?.conditions?.valid_options?.[
                                            indx
                                          ]
                                        ]
                                      ]) *
                                      100
                                  )}{" "}
                                  %
                                </td>
                                {/* <td>
                                <IoMdLock size={20} />
                              </td> */}
                              </tr>
                            );
                          }
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
        setQuotasChange={setQuotasChange}
      />
    </>
  );
};

const QuotaModal = ({
  showQuotaModal,
  setShowQuotaModal,
  qualifications,
  setQuotasChange,
}) => {
  const [showQuotaAddModal, setShowQuotaAddModal] = useState(false);
  const [selectQuestion, setSelectQuestion] = useState({});
  const [qualificationsCopy, setQualificationsCopy] = useState([]);

  useEffect(() => {
    setQualificationsCopy(qualifications);
  }, [qualifications]);
  const handleBtnChange = () => {
    setShowQuotaModal(false);
    setShowQuotaAddModal(true);
  };

  const handleSearchInputChange = (e) => {
    setQualificationsCopy(qualifications);
    const value = e.target.value.toLowerCase();
    let qualificationsTmp = [];
    qualifications?.map((qual) => {
      if (qual?.question_name.toLowerCase().includes(value)) {
        qualificationsTmp.push(qual);
      }
    });
    setQualificationsCopy(qualificationsTmp);
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
          <p className={styles.title}>Change Quota of Qualifications</p>
          <input
            type="search"
            className={styles.search_input}
            placeholder="search for question"
            onChange={handleSearchInputChange}
          />
          <div className={styles.qualifications_list}>
            <Radio.Group onChange={(e) => setSelectQuestion(e)}>
              {qualificationsCopy?.map((question) => {
                return (
                  <div key={uuid()}>
                    <Radio value={question}>{question?.question_name}</Radio>
                  </div>
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
        setQuotasChange={setQuotasChange}
      />
    </>
  );
};

const AddQuotaModal = ({
  showQuotaAddModal,
  setShowQuotaAddModal,
  qualification,
  setQuotasChange,
}) => {
  const { survey } = useQuotasContext();
  const { surveyID } = useParams();
  const [quotaValues, setQuotaValues] = useState({});
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarData, setSnackbarData] = useState({});
  const [remainingQuota, setRemainingQuota] = useState();
  const [quotasUsed, setQuotaUsed] = useState(0);

  useEffect(() => {
    setRemainingQuota(survey?.no_of_completes);
  }, [survey]);

  useEffect(() => {
    setQuotaValues(qualification);
  }, [qualification]);

  const handleSaveBtnClick = () => {
    addQuota(
      surveyID,
      qualification?.question_id,
      quotaValues?.conditions?.quotas
    )
      .then(() => {
        setShowSnackbar(true);
        console.log("quota updated...");
        setSnackbarData({
          msg: `quota updated  successfully for question - ${qualification?.question_name}`,
          severity: "success",
        });
        setQuotasChange(true);
      })
      .catch((err) => {
        setSnackbarData({
          msg: `could not update quota for question - ${qualification?.question_name}, try again...!`,
          severity: "error",
        });
      });
    setQuotaValues({});
    setShowQuotaAddModal(false);
  };

  const handleInputChange = (e, indx) => {
    let value = parseInt(e.target.value);
    let newData = { ...quotaValues };
    if (newData.conditions.quotas === undefined) newData.conditions.quotas = {};
    if (isNaN(value)) {
      delete newData.conditions.quotas[indx];
    } else newData.conditions.quotas[indx] = value;
    setQuotaValues(newData);
  };

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
            if (qualification?.question_type === "Numeric - Open-end") {
              return quotaValues?.conditions?.valid_responses?.map(
                (response, indx) => {
                  return (
                    <div className={styles.numeric_conditions} key={response}>
                      <span>{response.from}</span> To
                      <span>{response.to}</span> - &nbsp;{" "}
                      <input
                        type="number"
                        placeholder="add quota"
                        value={quotaValues?.conditions?.quotas?.[indx]}
                        onChange={(e) => handleInputChange(e, indx)}
                      />
                    </div>
                  );
                }
              );
            } else {
              return quotaValues?.conditions?.valid_options?.map(
                (option, indx) => {
                  return (
                    <div key={option} className={styles.single_punch_condition}>
                      <span>{quotaValues?.options?.[option]}</span> &nbsp; -
                      <input
                        type="number"
                        placeholder="add quota"
                        value={quotaValues?.conditions?.quotas?.[indx]}
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
