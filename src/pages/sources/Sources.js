import React, { useContext, useState } from "react";
import Header from "../../components/header/Header";
import Subheader from "../../components/subheader/Subheader";
import { useParams } from "react-router-dom";
import SurveyInfo from "../../components/survey-info/SurveyInfo";
import styles from "./sources.module.css";
import Card from "./components/Card";
import { SourceContext } from "./SourcesContext";
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";
import { v4 as uuid } from "uuid";
import { hashids } from "../../index";

function Sources() {
  let { surveydata, setSurveydata } = useContext(SourceContext);
  let { surveyID } = useParams();
  const [opensnackbar, setOpenSnackbar] = useState({}); //{show:false,severity:'success',msg:"Modify redirects saved successfully"}
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar({});
  };
  return (
    <>
      {opensnackbar?.show && (
        <Snackbar
          open={opensnackbar?.show}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={opensnackbar?.severity}
            sx={{ width: "100%" }}
          >
            {opensnackbar?.msg}
          </Alert>
        </Snackbar>
      )}
      <Header />
      <Subheader />
      <SurveyInfo />
      <div className={styles.container}>
        <h1 className={styles.title}>Panel Sources And Traffic Channels</h1>
        <div className={styles.legend}>
          <div className={styles.big_circle}></div>
          <h2 className={styles.legend_title}>External Suppliers</h2>
        </div>

        {!surveydata?.external_suppliers?.length ? (
          <span className={styles.not_found_supplier_txt}>
            No external suppliers found
          </span>
        ) : (
          <div className={styles.cards_container}>
            {surveydata?.external_suppliers?.map((data, index) => {
              return (
                <div className={styles.single_card} key={uuid()}>
                  <Card
                    data={data}
                    title={data?.supplier_account}
                    supplier_id={hashids.encode([data?.supplier_account_id])}
                    surveyid={surveyID}
                    index={index}
                    surveydata={surveydata}
                    setSurveydata={setSurveydata}
                    setOpenSnackbar={setOpenSnackbar}
                    supplier_type={"external_suppliers"}
                  />
                </div>
              );
            })}
          </div>
        )}

        <div className={styles.legend}>
          <div className={styles.big_circle}></div>
          <h2 className={styles.legend_title}>Internal Suppliers</h2>
        </div>
        {!surveydata?.internal_suppliers?.length ? (
          <span className={styles.not_found_supplier_txt}>
            No internal suppliers found
          </span>
        ) : (
          <div className={styles.cards_container}>
            {surveydata?.internal_suppliers?.map((data, index) => {
              return (
                <div className={styles.single_card}>
                  <Card
                    data={data}
                    supplier_id={hashids.encode([data?.supplier_account_id])}
                    index={index}
                    title={data?.supplier_account}
                    surveyid={surveyID}
                    surveydata={surveydata}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default Sources;
