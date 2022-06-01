import React, { useContext, useEffect, useState } from "react";
import styles from "./card.module.css";
import { useHistory } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
// import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import classNames from "classnames";
import { db } from "../../../firebase";
import { doc, setDoc } from "firebase/firestore";
import copy from "copy-to-clipboard";
import { SourceContext } from "../SourcesContext";
function Card({
  data,
  title,
  supplier_id,
  surveyid,
  index,
  surveydata,
  setSurveydata,
  setOpenSnackbar,
  supplier_type,
}) {
  const history = useHistory();
  let { ChangeVendorStatus } = useContext(SourceContext);
  const [redirectsopenDialog, setRedirectsOpenDialog] = useState(false);
  const [viewLinkopenDialog, setViewLinkOpenDialog] = useState(false);
  const [copyText, setCopyText] = useState({});
  console.log(supplier_id);

  useEffect(() => {
    setCopyText({
      // live_url: surveydata?.live_url,
      live_url: `https://mirats-blaze.netlify.com/blaze/${surveydata?.encrypt?.sid}-${surveydata?.encrypt?.pid}-${surveydata?.encrypt?.cid}/lightningStart?SRCID=${supplier_id}&RID=[%rid%]`,
      test_url: `https://mirats-blaze.netlify.com/blaze/${surveydata?.encrypt?.sid}-${surveydata?.encrypt?.pid}-${surveydata?.encrypt?.cid}/lightningStart?SRCID=${supplier_id}&gamma=alpha&RID=$[%rid%]`,
      both_url: `Live url = ${`https://mirats-blaze.netlify.com/blaze/${surveydata?.encrypt?.sid}-${surveydata?.encrypt?.pid}-${surveydata?.encrypt?.cid}/lightningStart?SRCID=${supplier_id}&RID=[%rid%]`}\nTest url = ${`https://mirats-blaze.netlify.com/blaze/${surveydata?.encrypt?.sid}-${surveydata?.encrypt?.pid}-${surveydata?.encrypt?.cid}/lightningStart?SRCID=${supplier_id}&gamma=alpha&RID=[%rid%]`}`,
    });
  }, [surveydata]);
  const copyToClipboard = (type) => {
    copy(copyText?.[type]);
    setOpenSnackbar({
      severity: "success",
      show: true,
      msg: "Link copied to clipboard",
    });
  };

  const handleClickOpen = (statechanger) => {
    statechanger(true);
  };
  const handleClose = (statechanger) => {
    statechanger(false);
  };

  function HandleRedirectsChange(e) {
    setSurveydata((preob) => {
      // let key=e.target.name
      let externalsuppliers = preob?.external_suppliers;

      externalsuppliers[index].static_redirects[e.target.name] = e.target.value;
      return {
        ...preob,
        external_suppliers: externalsuppliers,
      };
    });
  }

  async function SaveRedirectChanges() {
    await setDoc(
      doc(db, "mirats", "surveys", "survey", String(surveyid)),
      {
        external_suppliers: surveydata?.external_suppliers,
      },
      { merge: true }
    ).then(() => {
      console.log("Data updated successfully");
      setOpenSnackbar({
        show: true,
        severity: "success",
        msg: "Redirects Saved successfully",
      });
      setRedirectsOpenDialog(false);
    });
  }

  return (
    <>
      {/* Redirects Dialog box */}
      <Dialog
        sx={{ borderRadius: "25" }}
        PaperProps={{ sx: { width: "1300px" } }}
        open={redirectsopenDialog}
        maxWidth="xl"
        onClose={() => handleClose(setRedirectsOpenDialog)}
      >
        <div className={styles.nameform}>
          <DialogTitle>
            <h2>Modify Redirects</h2>{" "}
          </DialogTitle>
          <DialogContent sx={{}}>
            {data?.global_redirect ? (
              <div
                className={classNames(
                  styles.field,
                  styles.globalredirect_warning
                )}
              >
                <h3>Warning :</h3>

                <p>GLobal redirects are already present.</p>
                <p>
                  You can only edit the global redirects from supplier settings.
                </p>
              </div>
            ) : (
              <>
                <div className={styles.field}>
                  <TextField
                    margin="dense"
                    id="name"
                    name="complete"
                    label="Complete"
                    fullWidth
                    onChange={(e) => {
                      HandleRedirectsChange(e);
                    }}
                    value={data?.static_redirects?.complete}
                    variant="outlined"
                  />
                </div>
                <div className={styles.field}>
                  <TextField
                    margin="dense"
                    id="name"
                    name="quality_terminate"
                    label="Quality Terminate"
                    fullWidth
                    onChange={(e) => HandleRedirectsChange(e)}
                    value={data?.static_redirects?.quality_terminate}
                    variant="outlined"
                  />
                </div>
                <div className={styles.field}>
                  <TextField
                    margin="dense"
                    id="name"
                    label="Quota Full"
                    fullWidth
                    value={data?.static_redirects?.quota_full}
                    name="quota_full"
                    variant="outlined"
                    onChange={(e) => {
                      HandleRedirectsChange(e);
                    }}
                  />
                </div>
                <div className={styles.field}>
                  <TextField
                    margin="dense"
                    id="name"
                    label="Terminate"
                    fullWidth
                    name="terminate"
                    onChange={(e) => HandleRedirectsChange(e)}
                    value={data?.static_redirects?.terminate}
                    variant="outlined"
                  />
                </div>
              </>
            )}
          </DialogContent>
        </div>
        <div className={styles.form_btns}>
          <button
            className={styles.cancel}
            onClick={() => handleClose(setRedirectsOpenDialog)}
          >
            Cancel
          </button>
          {!data?.global_redirect && (
            <button className={styles.save} onClick={SaveRedirectChanges}>
              Save
            </button>
          )}
        </div>
      </Dialog>

      {/* View Link dialog box  */}
      <Dialog
        sx={{ borderRadius: "25" }}
        open={viewLinkopenDialog}
        PaperProps={{ sx: { width: "1000px" } }}
        maxWidth="xl"
        onClose={() => handleClose(setViewLinkOpenDialog)}
      >
        <div className={styles.nameform}>
          <DialogTitle>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h2>View Links</h2>{" "}
              <button
                className={styles.copyallbtn}
                onClick={() => copyToClipboard("both_url")}
              >
                Copy both links
              </button>
            </div>
          </DialogTitle>
          <DialogContent>
            <div
              className={styles.field}
              style={{ display: "flex", alignItems: "center" }}
            >
              <TextField
                margin="dense"
                id="name"
                label="Live Links"
                fullWidth
                variant="outlined"
                disabled
                value={`https://miratsblaze.netlify.com/blaze/${surveydata?.encrypt?.sid}-${surveydata?.encrypt?.pid}-${surveydata?.encrypt?.cid}/lightningStart?SRCID=${supplier_id}&RID=[%rid%]`}
                // inputProps={{ sx: { color: "#fff" } }}
              />
              <button
                className={styles.copybtn}
                onClick={() => copyToClipboard("live_url")}
              >
                Copy
              </button>
            </div>
            <div
              className={styles.field}
              style={{ display: "flex", alignItems: "center" }}
            >
              <TextField
                margin="dense"
                id="name"
                label="Test Links"
                fullWidth
                variant="outlined"
                disabled
                value={`https://miratsblaze.netlify.com/blaze/${surveydata?.encrypt?.sid}-${surveydata?.encrypt?.pid}-${surveydata?.encrypt?.cid}/lightningStart?SRCID=${supplier_id}&alpha=gamma&RID=$[%rid%]`}
                // inputProps={{ sx: { color: "#fff" } }}
              />
              <button
                className={styles.copybtn}
                onClick={() => copyToClipboard("test_url")}
              >
                Copy
              </button>
            </div>
          </DialogContent>
        </div>
        <div className={styles.form_btns}>
          <button
            className={styles.cancel}
            onClick={() => handleClose(setViewLinkOpenDialog)}
          >
            Cancel
          </button>
        </div>
      </Dialog>

      <div className={styles.card}>
        <p className={styles.title}>{title}</p>
        <button
          className={styles.source_btn}
          onClick={() => {
            handleClickOpen(setRedirectsOpenDialog);
          }}
        >
          Modify Redirects
        </button>
        <button
          className={styles.source_btn}
          onClick={() => {
            handleClickOpen(setViewLinkOpenDialog);
          }}
        >
          View Link
        </button>
        <button
          className={styles.source_btn}
          onClick={() => {
            history.push(
              `/surveys/analytics/supplier-overview/${surveyid}/${data?.supplier_account_id}`
            );
          }}
        >
          View Stats
        </button>
        <select
          className={styles.status_select}
          value={data?.vendor_status}
          onChange={(e) => ChangeVendorStatus(index, e.target.value, surveyid)}
        >
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="closed">Closed</option>
        </select>
        <button
          className={styles.source_btn}
          onClick={() => {
            history.push(
              `/livesurveylogs/${surveyid}?logtype=live&supplier_id=${data?.supplier_account_id}`
            );
          }}
        >
          View Log
        </button>
        <button
          className={styles.source_btn}
          onClick={() => {
            history.push(`/livesurveylogs/${surveyid}?logtype=test`);
          }}
        >
          View Test Log
        </button>
      </div>
    </>
  );
}

export default Card;
