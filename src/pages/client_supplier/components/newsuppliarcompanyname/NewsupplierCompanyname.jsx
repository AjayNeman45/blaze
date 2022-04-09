import React from "react";
import styles from "./newsuppliarcompanyname.module.css";

const NewsupplierCompanyname = ({ data }) => {
  // const projectManagers = [
  //   {
  //     title: data.project_manager[0].name,
  //     mail: data.project_manager[0].email,
  //     mobile: data.project_manager[0].phone,
  //   },
  //   {
  //     title: "Project Manager 1",
  //     mail: "pm1@companyname.com",
  //     mobile: "+91(895) 759 8589",
  //   },
  // ];

  // const supplyManager = [
  //   {
  //     title: "Supply Manager 1",
  //     mail: "pm1@companyname.com",
  //     mobile: "+91(895) 759 8589",
  //   },
  //   {
  //     title: "Supply Manager 1",
  //     mail: "pm1@companyname.com",
  //     mobile: "+91(895) 759 8589",
  //   },
  // ];

  // const accountManager = [
  //   {
  //     title: "Account Manager 1",
  //     mail: "pm1@companyname.com",
  //     mobile: "+91(895) 759 8589",
  //   },
  // ];

  return (
    <div className={styles.parentCompanyContainer}>
      <div className={styles.companyContent}>
        <h1>
          {data?.company_name === "" ? "Company Name" : data.company_name}
        </h1>
        <h3 className={styles.adminmail}>
          {data?.company_email === ""
            ? "admin@company.com"
            : data.company_email}
        </h3>

        <h2 className={styles.managers}>Project Managers’</h2>
        {data?.project_manager.map((elem, i) => {
          return (
            <div className={styles.comapnyCard} key={i}>
              <h2>{elem?.name === "" ? "Project Manager Name" : elem?.name}</h2>
              <a href="link">
                {elem?.email === ""
                  ? "projectmanager@comapny.com"
                  : elem?.email}
              </a>
              <h3>{elem?.phone === "" ? "Phone Number" : elem?.phone}</h3>
            </div>
          );
        })}

        <h2 className={styles.managers}>Supply Managers’</h2>
        {data?.supply_manager.map((elem, i) => {
          return (
            <div className={styles.comapnyCard} key={i}>
              <h2>{elem?.name === "" ? "Supply Manager Name" : elem?.name}</h2>
              <a href="link">
                {elem?.email === "" ? "supplymanager@comapny.com" : elem?.email}
              </a>
              <h3>{elem?.phone === "" ? "Phone Number" : elem?.phone}</h3>
            </div>
          );
        })}

        <h2 className={styles.managers}>Account Managers’</h2>
        {data?.account_manager.map((elem, i) => {
          return (
            <div className={styles?.comapnyCard} key={i}>
              <h2>{elem?.name === "" ? "Account Manager Name" : elem?.name}</h2>
              <a href="link">
                {elem?.email === ""
                  ? "accountmanager@company.com"
                  : elem?.email}
              </a>
              <h3>{elem?.phone === "" ? "Phone Number" : elem?.phone}</h3>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NewsupplierCompanyname;
