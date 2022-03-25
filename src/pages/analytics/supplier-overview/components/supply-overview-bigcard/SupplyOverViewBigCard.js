import React from "react";
import styles from "./supply_overviewbigcard.module.css";
function SupplyOverViewBigCard() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Cint AB</h1>
      <h1 className={styles.count}>22/100</h1>
      <div className={styles.conversion}>
        <p>
          <span style={{ fontWeight: 600 }}>32%</span> conversion
        </p>
      </div>
      <div className={styles.ctqf}>
        <p>23 C</p>
        <p>110 T</p>
        <p>21 QF</p>
      </div>

      <div className={styles.hits}>
        <p style={{ color: "#27D44D" }}>12m</p>
        <p style={{ color: "#F4554A" }}>2m</p>
        <p style={{ color: "#606060" }}>1.2k hits</p>
      </div>
    </div>
  );
}

export default SupplyOverViewBigCard;
