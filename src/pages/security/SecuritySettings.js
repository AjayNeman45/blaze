import React, { useState } from "react";
import styles from "./Security.module.css";
import { AiFillInfoCircle } from "react-icons/ai";
import { Checkbox, FormControlLabel } from "@mui/material";
import { useEffect } from "react";
import { addSecurityChecks, getSurvey } from "../../utils/firebaseQueries";
import { useParams } from "react-router-dom";
import { Loading } from "@nextui-org/react";

const SecuritySettings = ({ setOpenSnackbar }) => {
  const [securityChecks, setSecurityChecks] = useState({});
  const [disabledSaveBtn, setDisabledSaveBtn] = useState(false);

  const { surveyID } = useParams();

  const handleSaveBtn = () => {
    setDisabledSaveBtn(true);
    if (
      Object.keys(securityChecks).length !== 0 &&
      securityChecks.constructor === Object
    ) {
      console.log(securityChecks);
      addSecurityChecks(surveyID, securityChecks)
        .then((res) => {
          setOpenSnackbar(true);
          setDisabledSaveBtn(false);
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    const func = async () => {
      const survey = await getSurvey(surveyID);
      setSecurityChecks(survey?.security_checks);
    };
    func();
  }, []);

  return (
    <div className={styles.security_settings}>
      <div className={styles.validation_setting_header}>
        <p className={styles.security_settings_instruction}>
          <AiFillInfoCircle size={23} style={{ marginRight: "10px" }} />
          Please note that security settings are defaulted at the Account level.
          You can update settings for each survey as needed.
        </p>
      </div>
      <div class={styles.validation_settings_content}>
        <h1 class={styles.validation_settings_legend}>Survey Validation</h1>

        <ul class={styles.validation_settings_list}>
          <li class={styles.validation_settings_item}>
            <FormControlLabel control={<Checkbox />} label="Verify Callback" />
          </li>
          <li class={styles.validation_settings_item}>
            <FormControlLabel
              control={
                <Checkbox checked={securityChecks?.unique_ip ? true : false} />
              }
              label="Unique IP Address"
              onClick={(e) => {
                setSecurityChecks({
                  ...securityChecks,
                  unique_ip: !securityChecks?.unique_ip,
                });
              }}
            />
          </li>
          <li class={styles.validation_settings_item}>
            <FormControlLabel
              control={
                <Checkbox checked={securityChecks?.unique_rid ? true : false} />
              }
              label="Unique RID"
              onClick={() =>
                setSecurityChecks({
                  ...securityChecks,
                  unique_rid: !securityChecks?.unique_rid,
                })
              }
            />
          </li>
          <li class={styles.validation_settings_item}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={securityChecks?.unique_fingerprint ? true : false}
                />
              }
              label="Unique Fingerprint"
              onClick={() =>
                setSecurityChecks({
                  ...securityChecks,
                  unique_fingerprint: !securityChecks?.unique_fingerprint,
                })
              }
            />
          </li>
        </ul>
      </div>
      <div className={styles.save_btn}>
        {!disabledSaveBtn ? (
          <button onClick={handleSaveBtn}>Save</button>
        ) : (
          <Loading type="spinner" size="lg" />
        )}
      </div>
    </div>
  );
};

export default SecuritySettings;
