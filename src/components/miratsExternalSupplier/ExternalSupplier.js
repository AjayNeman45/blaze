import React, { useEffect, useState } from "react";
import styles from "./externalSupplier.module.css";
import { v4 as uuid } from "uuid";
import { useReportsContext } from "../../pages/reports/ReportsContext";

function ExternalSupplier({ tableTitle, data }) {
  const [total, setTotal] = useState({});
  const { survey } = useReportsContext();
  useEffect(() => {
    let completes_total = 0,
      avg_cpi_total = 0,
      amount_total = 0;
    data?.map((d) => {
      completes_total += parseInt(d?.completed);
      avg_cpi_total += parseInt(d?.avg_cpi);
    });
    avg_cpi_total = (avg_cpi_total / data?.length).toFixed(2);
    amount_total = (completes_total * avg_cpi_total).toFixed(2);

    setTotal({ completes_total, avg_cpi_total, amount_total });
  }, [data]);

  return (
    <div className={styles.externalSupplier_container}>
      <h3 className={styles.title}>{tableTitle}</h3>

      <table>
        <thead>
          <tr>
            <th className={styles.supplier}>SUPPLIER</th>
            <th className={styles.center}>COMPLETES</th>
            <th>Avg. CPI</th>
            <th>AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((d) => {
            return (
              <tr key={uuid()}>
                <td>{d?.supplier_name}</td>
                <td className={styles.center}>{d?.completed}</td>
                <td className={styles.center}>
                  {survey?.client_info?.client_cost_currency_symbol}{" "}
                  {d?.avg_cpi}
                </td>
                <td>
                  {survey?.client_info?.client_cost_currency_symbol}{" "}
                  {(d?.completed * d?.avg_cpi).toFixed(2)}
                </td>
              </tr>
            );
          })}
          <tr>
            <td className={styles.supplier}>total</td>
            <td className={styles.center}>{total?.completes_total}</td>
            <td className={styles.center}>
              {survey?.client_info?.client_cost_currency_symbol}{" "}
              {total?.avg_cpi_total}
            </td>
            <td className={styles.center}>
              {survey?.client_info?.client_cost_currency_symbol}{" "}
              {total?.amount_total}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ExternalSupplier;
