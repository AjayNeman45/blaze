import React, { useEffect, useMemo, useState } from "react";
import styles from "./ChangeTeamModal.module.css";
import { Box } from "@mui/system";
import { Tab, Tabs, Typography } from "@mui/material";
import PropTypes from "prop-types";
import Select from "react-select";
import Modal from "@mui/material/Modal";
import cx from "classnames";
import { updateSurvey } from "../../../utils/firebaseQueries";
import { useParams } from "react-router-dom";
import { useProjectSettingsContext } from "../ProjectSettingContext";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 590,
  bgcolor: "white",
  borderRadius: "20px",
  boxShadow: 24,
  p: 4,
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const ChangeTeamModal = ({ visible, closeHandler, peoples, teams }) => {
  const [value, setValue] = React.useState(0);
  const { surveyID } = useParams();
  const { surveyData, changes, setChanges } = useProjectSettingsContext();
  const [defaultSelected, setDefaultSelected] = useState([]);
  const [salesManagers, setSalesManagers] = useState([]);
  const [teamsCopy, setTeamsCopy] = useState({});
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useMemo(() => {
    let defaultSelectedTmp = [];
    teams?.project_managers?.map((people1) => {
      peoples?.project_managers?.map((people2) => {
        if (people1 === people2?.value) {
          defaultSelectedTmp.push(people2);
        }
      });
    });
    setDefaultSelected(defaultSelectedTmp);
    setTeamsCopy(teams);
  }, [teams]);

  const handleTabChange = (tabValue) => {
    let defaultSelectedTmp = [];
    switch (tabValue) {
      case 0:
        setValue(tabValue);
        teamsCopy?.project_managers?.map((people1) => {
          peoples?.project_managers?.map((people2) => {
            if (people1 === people2?.value) {
              defaultSelectedTmp.push(people2);
            }
          });
        });
        break;
      case 1:
        setValue(tabValue);
        teamsCopy?.sales_managers?.map((people1) => {
          peoples?.sales_managers?.map((people2) => {
            if (people1 === people2?.value) {
              defaultSelectedTmp.push(people2);
            }
          });
        });
        break;
      case 2:
        setValue(tabValue);
        teamsCopy?.account_managers?.map((people1) => {
          peoples?.account_managers?.map((people2) => {
            if (people1 === people2?.value) {
              defaultSelectedTmp.push(people2);
            }
          });
        });
        break;
      default:
        return;
    }
    setDefaultSelected(defaultSelectedTmp);
  };

  const getPrevNewVal = (newValueWithObj, teamName) => {
    let newVal = "",
      prevVal = "";
    newValueWithObj.forEach((val) => {
      newVal = newVal + val?.label + ", ";
    });
    teams[teamName].forEach((people) => {
      peoples[teamName].forEach((people1) => {
        if (people === people1.value) {
          prevVal = prevVal + people1.label + ", ";
        }
      });
    });
    return { newVal, prevVal };
  };

  const handleSelectChange = (val, teamName) => {
    let newArr = val?.map((v) => v.value);
    setTeamsCopy((prevData) => {
      return {
        ...prevData,
        [teamName]: newArr,
      };
    });
    let changesExist =
      JSON.stringify(teams[teamName]) === JSON.stringify(newArr); //boolean variable to check whether changes are there or not

    if (!changesExist) {
      const { prevVal, newVal } = getPrevNewVal(val, teamName);
      setChanges((prevData) => {
        return {
          ...prevData,
          [teamName]: { changed_to: newVal, previous_change: prevVal },
        };
      });
    }
  };

  const handleSaveBtnClick = async () => {
    try {
      // const res = await updateSurvey(surveyID, body);
      await updateDoc(
        doc(db, "miratsinsights", "blaze", "surveys", String(surveyID)),
        {
          changes: arrayUnion(changes),
          mirats_insights_team: teamsCopy,
        },
        {
          merge: true,
        }
      );
    } catch (error) {
      console.log(error.message);
    }
    closeHandler();
  };

  return (
    <div>
      <Modal
        open={visible}
        onClose={closeHandler}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h3>Update Mirats Insights Team</h3>

          <div className={styles.tabs}>
            <span
              className={cx(styles.tab_title, value === 0 && styles.active_tab)}
              onClick={() => {
                handleTabChange(0);
              }}
            >
              Project Managers
            </span>
            <span
              className={cx(styles.tab_title, value === 1 && styles.active_tab)}
              onClick={() => {
                handleTabChange(1);
              }}
            >
              Sales Managers
            </span>
            <span
              className={cx(styles.tab_title, value === 2 && styles.active_tab)}
              onClick={() => {
                handleTabChange(2);
              }}
            >
              Account Managers
            </span>
          </div>
          <div className={styles.select_input}>
            {(() => {
              switch (value) {
                case 0:
                  return (
                    <Select
                      options={peoples?.project_managers}
                      defaultValue={[...defaultSelected]}
                      isMulti
                      key="1234124"
                      name="project_managers"
                      onChange={(val) =>
                        handleSelectChange(val, "project_managers")
                      }
                    />
                  );
                case 1:
                  return (
                    <Select
                      options={peoples?.sales_managers}
                      defaultValue={[...defaultSelected]}
                      isMulti
                      name="sales_managers"
                      key="786586"
                      onChange={(val) =>
                        handleSelectChange(val, "sales_managers")
                      }
                    />
                  );
                case 2:
                  return (
                    <Select
                      options={peoples?.account_managers}
                      defaultValue={[...defaultSelected]}
                      isMulti
                      name="account_managers"
                      key="5453464"
                      onChange={(val) =>
                        handleSelectChange(val, "account_managers")
                      }
                    />
                  );
                default:
                  return;
              }
            })()}
          </div>
          <div className={styles.btns}>
            <button className={styles.save_btn} onClick={handleSaveBtnClick}>
              save
            </button>
            <button className={styles.cancle_btn} onClick={closeHandler}>
              cancel
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default ChangeTeamModal;
