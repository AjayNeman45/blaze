import { Modal } from "@mui/material";
import React, { useState } from "react";
import { addStaticRedirects } from "../../utils/firebaseQueries";
import { useAllocationContext } from "./AllocationContext";
import styles from "./Allocations.module.css";

const AddStaticRedirectsModal = ({
  addStaticRedirectsModal,
  setAddStaticRedirectsModal,
}) => {
  const { supplierData, setSupplierData, insertExternalSupplier, survey } =
    useAllocationContext();

  const handleStaticRedirectsChange = (e) => {
    const type = e.target.name;
    setSupplierData((prevData) => {
      return {
        ...prevData,
        global_redirect: false,
        static_redirects: {
          ...prevData?.static_redirects,
          [type]: e.target.value,
        },
      };
    });
  };

  // saving the external supplier data with global redirects
  const handleSaveBtn = () => {
    // inserting external supplier data
    insertExternalSupplier();

    // resetting  the state to empty again
    setAddStaticRedirectsModal(false);
  };

  return (
    <>
      <Modal
        keepMounted
        open={addStaticRedirectsModal}
        onClose={() => setAddStaticRedirectsModal(false)}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <div className={styles.global_redirects_modal}>
          <h3>Set Static Redirect for the survey</h3>
          <div className={styles.inputs}>
            <textarea
              type="text"
              placeholder="Complete"
              value={supplierData?.static_redirects?.complete}
              name="complete"
              onChange={handleStaticRedirectsChange}
            />
            <textarea
              type="text"
              placeholder="Quality Terminate"
              name="quality_terminate"
              value={supplierData?.static_redirects?.quality_terminate}
              onChange={handleStaticRedirectsChange}
            />
            <textarea
              type="text"
              placeholder="Quata Full"
              name="quota_full"
              value={supplierData?.static_redirects?.quota_full}
              onChange={handleStaticRedirectsChange}
            />
            <textarea
              type="text"
              placeholder="Terminate"
              name="terminate"
              value={supplierData?.static_redirects?.terminate}
              onChange={handleStaticRedirectsChange}
            />
          </div>
          <div className={styles.btns}>
            <button className={styles.save_btn} onClick={handleSaveBtn}>
              Save
            </button>
            <button
              className={styles.close_btn}
              onClick={() => setAddStaticRedirectsModal(false)}
            >
              close
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddStaticRedirectsModal;
