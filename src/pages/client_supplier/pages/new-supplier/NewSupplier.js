import Globalredirects from "../../components/globalredirects/Globalredirects";
import NewsupplierCompanyname from "../../components/newsuppliarcompanyname/NewsupplierCompanyname";
import styles from "../../pages/new-client/SupplierClient.module.css";
import Switch from "@mui/material/Switch";
import React, { useState } from "react";
import { db } from "../../../../firebase";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";
import { RiDeleteBinLine } from "react-icons/ri";
const NewSupplier = () => {
  const [managerfields, setManagerFields] = useState([{}]);
  const [supplyfields, setSupplyFields] = useState([{}]);
  const [accountfields, setAccountFields] = useState([{}]);

  const dataRef = collection(db, "mirats", "supplier", "supplier");

  const GetLastSupplierID = async () => {
    const q = query(dataRef, orderBy("id", "desc"), limit(1));
    const querySnapshot = await getDocs(q);
    let id = null;
    querySnapshot.forEach((elem) => {
      id = elem.data()?.id;
    });
    return id;
  };
  const storeSupplierData = async () => {
    GetLastSupplierID().then(async (lastid) => {
      await setDoc(
        doc(db, "mirats", "supplier", "supplier", String(lastid + 1)),
        { ...formData, id: lastid + 1 }
      ).then(() => {});
    });
    // await setDoc(dataRef,id,formData)
  };
  // ********************************* Global Form Data Object***********************
  const [formData, setFormData] = useState({
    company_name: "",
    company_email: "",
    project_manager: [{ name: "", email: "", phone: "" }],
    supply_manager: [{ name: "", email: "", phone: "" }],
    account_manager: [{ name: "", email: "", phone: "" }],
  });

  // ********************* add and remove Functions************************
  // ----------------- Add project manager----------------------

  function HandleManagerChange(index, manager, e) {
    setFormData((preobj) => {
      let key = preobj?.[manager];
      key[index][e.target.name] = e.target.value;
      return {
        ...preobj,
        [manager]: key,
      };
    });
  }

  // ----------------- Add Supply manager----------------------

  const handleProjectRemove = (idx) => {
    setFormData((preobj) => {
      let project_manager = preobj?.project_manager?.filter((e, i) => {
        return i != idx;
      });
      return { ...preobj, project_manager: project_manager };
    });
  };
  const handleSupplyRemove = (idx) => {
    setFormData((preobj) => {
      let supply_manager = preobj?.supply_manager?.filter((e, i) => {
        return i != idx;
      });
      return { ...preobj, supply_manager: supply_manager };
    });
  };
  const handleAccountRemove = (idx) => {
    setFormData((preobj) => {
      let account_manager = preobj?.account_manager?.filter((e, i) => {
        return i != idx;
      });
      return { ...preobj, account_manager: account_manager };
    });
  };
  // ----------------- Add account manager----------------------

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>create new Supplier</h1>
      <div className={styles.cards_container}>
        <div className={styles.left_container}>
          {/* basic information card */}
          <div className={styles.basic_info_card}>
            <h2>Basic Information</h2>
            <form>
              <div className={styles.input_group}>
                <label>Supplier Company Name</label>
                <input
                  type="text"
                  placeholder="GRS Research"
                  name="name"
                  onChange={(e) =>
                    setFormData({ ...formData, company_name: e.target.value })
                  }
                />
              </div>
              <div className={styles.input_group}>
                <label>Supplier Company Email</label>
                <input
                  type="text"
                  placeholder="admin@grsresearch.in"
                  name="email"
                  onChange={(e) =>
                    setFormData({ ...formData, company_email: e.target.value })
                  }
                />
              </div>
            </form>
          </div>

          <div className={styles.manager_cards}>
            <div className={styles.manager_info_card}>
              <h2>Project Manager</h2>
              <form>
                {formData?.project_manager.map((elem, idx) => {
                  return (
                    // style={!altaf ? sonu : lokesh}
                    <div
                      key={`${elem}-${idx}`}
                      className={styles.inputContainer}
                      style={idx !== 0 ? { marginTop: "3.5vmax" } : null}
                    >
                      <div className={styles.input_group}>
                        <label>Project Manager </label>
                        <input
                          type="text"
                          placeholder="Ajay"
                          value={elem?.name}
                          name="name"
                          onChange={(e) =>
                            HandleManagerChange(idx, "project_manager", e)
                          }
                        />
                      </div>
                      <div className={styles.input_group}>
                        <label>Project Manager Email</label>
                        <input
                          type="text"
                          placeholder="pm@grsresearch.in"
                          value={elem?.email}
                          name="email"
                          onChange={(e) =>
                            HandleManagerChange(idx, "project_manager", e)
                          }
                        />
                      </div>
                      <div className={styles.input_group}>
                        <label>Project Manager Phone No</label>
                        <input
                          type="text"
                          placeholder="+91989384994"
                          value={elem?.phone}
                          name="phone"
                          onChange={(e) =>
                            HandleManagerChange(idx, "project_manager", e)
                          }
                        />
                      </div>
                      {idx !== 0 ? (
                        <button
                          type="button"
                          className={styles.closebtn}
                          onClick={() => handleProjectRemove(idx)}
                        >
                          <RiDeleteBinLine />
                        </button>
                      ) : null}
                    </div>
                  );
                })}
              </form>

              <button
                onClick={() =>
                  setFormData((formdata) => ({
                    ...formdata,
                    project_manager: [
                      ...formdata?.project_manager,
                      { name: "", email: "", phone: "" },
                    ],
                  }))
                }
              >
                + Add Project Manager
              </button>
            </div>
            <div className={styles.manager_info_card}>
              <h2>Supply Manager</h2>
              <form>
                {formData?.supply_manager?.map((elem, idx) => {
                  return (
                    // style={!altaf ? sonu : lokesh}
                    <div
                      key={`${supplyfields}-${idx}`}
                      className={styles.inputContainer}
                      style={idx !== 0 ? { marginTop: "3.5vmax" } : null}
                    >
                      <div className={styles.input_group}>
                        <label>Supply Manager</label>
                        <input
                          type="text"
                          placeholder="Ajay"
                          name="name"
                          value={elem.name}
                          onChange={(e) =>
                            HandleManagerChange(idx, "supply_manager", e)
                          }
                        />
                      </div>
                      <div className={styles.input_group}>
                        <label>Supply Manager Email</label>
                        <input
                          type="text"
                          placeholder="pm@grsresearch.in"
                          name="email"
                          value={elem.email}
                          onChange={(e) =>
                            HandleManagerChange(idx, "supply_manager", e)
                          }
                        />
                      </div>
                      <div className={styles.input_group}>
                        <label>Supply Manager Phone No</label>
                        <input
                          type="text"
                          placeholder="+91989384994"
                          name="phone"
                          value={elem.phone}
                          onChange={(e) =>
                            HandleManagerChange(idx, "supply_manager", e)
                          }
                        />
                      </div>
                      {idx !== 0 ? (
                        <button
                          type="button"
                          className={styles.closebtn}
                          onClick={() => handleSupplyRemove(idx)}
                        >
                          <RiDeleteBinLine />
                        </button>
                      ) : null}
                    </div>
                  );
                })}
              </form>

              <button
                onClick={() =>
                  setFormData((formdata) => ({
                    ...formdata,
                    supply_manager: [
                      ...formdata?.supply_manager,
                      { name: "", email: "", phone: "" },
                    ],
                  }))
                }
              >
                + Add Supply Manager
              </button>
            </div>
            <div className={styles.manager_info_card}>
              <h2>Account Manager</h2>

              <form>
                {formData?.account_manager?.map((elem, idx) => {
                  return (
                    // style={!altaf ? sonu : lokesh}
                    <div
                      key={`${elem}-${idx}`}
                      className={styles.inputContainer}
                      style={idx !== 0 ? { marginTop: "3.5vmax" } : null}
                    >
                      <div className={styles.input_group}>
                        <label>Account Manager</label>
                        <input
                          type="text"
                          placeholder="Ajay"
                          value={elem.name}
                          name="name"
                          onChange={(e) =>
                            HandleManagerChange(idx, "account_manager", e)
                          }
                        />
                      </div>
                      <div className={styles.input_group}>
                        <label>Account Manager Email</label>
                        <input
                          type="text"
                          placeholder="pm@grsresearch.in"
                          name="email"
                          value={elem.email}
                          onChange={(e) =>
                            HandleManagerChange(idx, "account_manager", e)
                          }
                        />
                      </div>
                      <div className={styles.input_group}>
                        <label>Account Manager Phone No</label>
                        <input
                          type="text"
                          placeholder="+91989384994"
                          name="phone"
                          value={elem.phone}
                          onChange={(e) =>
                            HandleManagerChange(idx, "account_manager", e)
                          }
                        />
                      </div>
                      {idx !== 0 ? (
                        <button
                          type="button"
                          className={styles.closebtn}
                          onClick={() => handleAccountRemove(idx)}
                        >
                          <RiDeleteBinLine />
                        </button>
                      ) : null}
                    </div>
                  );
                })}
              </form>
              <button
                onClick={() =>
                  setFormData((formdata) => ({
                    ...formdata,
                    account_manager: [
                      ...formdata?.account_manager,
                      { name: "", email: "", phone: "" },
                    ],
                  }))
                }
              >
                + Add Account Manager
              </button>
            </div>
          </div>

          {/* button */}
          <button className={styles.suppliarBtn} onClick={storeSupplierData}>
            Create Supplier
          </button>
        </div>
        <div className={styles.right_container}>
          {/* company manager info */}
          <NewsupplierCompanyname data={formData} />
          <div className={styles.redirect_toggle}>
            <h2>Global Redirects</h2>
            <div>
              <Switch defaultChecked size="large" />
            </div>
          </div>
          <Globalredirects />
        </div>
      </div>
    </div>
  );
};

export default NewSupplier;
