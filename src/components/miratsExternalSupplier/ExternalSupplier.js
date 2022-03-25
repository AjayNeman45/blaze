import React, { useEffect, useState } from "react";
import styles from "./externalSupplier.module.css";
import { v4 as uuid } from "uuid";

function ExternalSupplier({ tableTitle, data }) {
  // console.log(data);
  const [total, setTotal] = useState({});
  useEffect(() => {
    let completes_total = 0,
      avg_cpi_total = 0,
      amount_total = 0;
    data?.map((d) => {
      completes_total += d?.completed;
      avg_cpi_total += d?.avg_cpi;
      amount_total += d?.completed * d?.avg_cpi;
    });
    setTotal({ completes_total, avg_cpi_total, amount_total });
  }, [data]);

  return (
    <div className={styles.externalSupplier_container}>
      <h3 className={styles.title}>{data?.title}</h3>

      <table>
        <tr>
          <th className={styles.supplier}>SUPPLIER</th>
          <th className={styles.center}>COMPLETES</th>
          <th>Avg. CPI</th>
          <th>AMOUNT</th>
        </tr>
        {data?.map((d) => {
          return (
            <tr key={uuid()}>
              <td>{d?.supplier_name}</td>
              <td className={styles.center}>{d?.completed}</td>
              <td className={styles.center}>${d?.avg_cpi}</td>
              <td>${d?.completed * d?.avg_cpi}</td>
            </tr>
          );
        })}
        <tr>
          <td className={styles.supplier}>total</td>
          <td className={styles.center}>{total?.completes_total}</td>
          <td className={styles.center}>${total?.avg_cpi_total}</td>
          <td className={styles.center}>${total?.amount_total}</td>
        </tr>
      </table>
    </div>
  );
}

export default ExternalSupplier;