import { createContext, useContext, useEffect, useState } from "react";
import {
  addSurveyGroup,
  deleteSurveyGroup,
  getAllSurveyGroups,
  getAllSurveys,
  updateSurvey,
} from "../../utils/firebaseQueries";

const SurveyGroupContext = createContext();

export const useSurveyGroupContext = () => {
  return useContext(SurveyGroupContext);
};

const SurveyGroupContextProvider = ({ children }) => {
  const [surveyIdsOptions, setSurveyIdsOptions] = useState([]);
  const [surveyGrpData, setSurveyGrpData] = useState({});
  const [addSurveyGrpModal, setAddSurveyGroupModal] = useState(false);
  const [snackbarData, setSnackbarData] = useState({ show: false });
  const [surveyGrps, setSurveyGrps] = useState([]);
  const [surveyGrpsCopy, setSurveyGrpsCopy] = useState([]);

  const handleCloseSnackbar = () => {
    setSnackbarData((prevData) => {
      return {
        ...prevData,
        show: false,
      };
    });
  };
  useEffect(() => {
    getAllSurveys().then((surveys) => {
      let surveyIDsOptions = [];
      surveys?.forEach((survey) => {
        surveyIDsOptions.push({
          label: survey.data()?.survey_id,
          value: survey.data()?.survey_id,
        });
      });
      setSurveyIdsOptions(surveyIDsOptions);
    });

    fetchAllSurveyGrps();
  }, []);

  const fetchAllSurveyGrps = () => {
    getAllSurveyGroups().then((groups) => {
      let surveyGrps = [];
      groups.forEach((group) => {
        surveyGrps.push(group.data());
      });
      setSurveyGrpsCopy(surveyGrps);
      setSurveyGrps(surveyGrps);
    });
  };

  const handleSurveyGroupSearch = (e) => {
    setSurveyGrps(surveyGrpsCopy);
    setSurveyGrps((prevData) => {
      return prevData.filter((grp) => {
        return grp?.survey_group_name.includes(e.target.value);
      });
    });
  };

  const insertSurveyGrpData = async () => {
    setAddSurveyGroupModal(false);
    let maxSurveyGrpID = 20000001,
      flag = false;
    surveyGrps?.map((grp) => {
      if (grp?.survey_grp_id >= maxSurveyGrpID) {
        maxSurveyGrpID = grp?.survey_grp_id;
        flag = true;
      }
    });
    if (flag) maxSurveyGrpID += 1;
    try {
      surveyGrpData["survey_grp_id"] = maxSurveyGrpID;
      const q = await addSurveyGroup(surveyGrpData, maxSurveyGrpID);
      setSnackbarData({
        show: true,
        msg: "survey group created successfully...",
        severity: "success",
      });
      surveyGrpData?.surveys?.map((surveyID) => {
        updateSurveyForSurveyGrp(surveyGrpData, surveyID);
      });
      fetchAllSurveyGrps();
      console.log("survey group created");
    } catch (err) {
      setSnackbarData({
        show: true,
        msg: "Oops! something went wrong, try again.",
        severity: "error",
      });
    }
  };

  const updateSurveyGroup = async (
    setSelectedGrpsCnt,
    setSelectedSurveyGrps
  ) => {
    setAddSurveyGroupModal(false);
    setSelectedGrpsCnt(0);
    setSelectedSurveyGrps([]);
    addSurveyGroup(surveyGrpData, surveyGrpData?.survey_grp_id)
      .then(() => {
        console.log("survey grp updated");
        setSnackbarData({
          show: true,
          msg: "survey group updated successfully...",
          severity: "success",
        });
        surveyGrpData?.surveys?.map((surveyID) => {
          updateSurveyForSurveyGrp(surveyGrpData, surveyID);
        });
        fetchAllSurveyGrps();
      })
      .catch((err) => {
        console.log(err.message);
        setSnackbarData({
          show: true,
          msg: "Oops! something went wrong, try again.",
          severity: "success",
        });
      });
  };

  const updateSurveyForSurveyGrp = (surveyGrpData, surveyID) => {
    updateSurvey(surveyID, {
      survey_group: surveyGrpData?.survey_group_number,
    })
      .then(() => console.log("survey group number updated in survey data"))
      .catch((err) => console.log(err.message));
  };

  const handleDeleteSurveyGrps = (surveyGrpsNos, setCheckRows) => {
    surveyGrpsNos?.map((grpNum) => {
      deleteSurveyGroup(grpNum)
        .then(() => {
          setSnackbarData({
            msg: "Survey group deleted successfully...",
            severity: "success",
            show: true,
            handleClose: handleCloseSnackbar,
          });
          setSurveyGrps((prevData) => {
            return prevData?.filter((data) => {
              return data?.survey_group_number !== parseInt(grpNum);
            });
          });
        })
        .catch((err) => {
          setSnackbarData({
            msg: "Oops! something went wrong try again",
            severity: "error",
            show: true,
            handleClose: handleCloseSnackbar,
          });
        });
    });
    setCheckRows([]);
  };

  useEffect(() => {
    if (!addSurveyGrpModal) setSurveyGrpData({});
  }, [addSurveyGrpModal]);

  const value = {
    surveyIdsOptions,
    setSurveyIdsOptions,
    setSurveyGrpData,
    surveyGrpData,
    insertSurveyGrpData,
    updateSurveyGroup,
    addSurveyGrpModal,
    setAddSurveyGroupModal,
    snackbarData,
    handleCloseSnackbar,
    surveyGrps,
    setSurveyGrps,
    handleDeleteSurveyGrps,
    handleSurveyGroupSearch,
  };
  return (
    <SurveyGroupContext.Provider value={value}>
      {children}
    </SurveyGroupContext.Provider>
  );
};

export default SurveyGroupContextProvider;
