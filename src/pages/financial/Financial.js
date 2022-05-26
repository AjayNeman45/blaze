import React from "react";
import Header from "../../components/header/Header";
import Subheader from "../../components/subheader/Subheader";
import styles from "./financial.module.css";
import NewFeedbackSurvey from "./newFeedbackSurvey/NewFeedbackSurvey";
const Financial = () => {
  const completed = true;
  return (
    <>
      <Header />
      <Subheader />
      <div className={styles.financial_container}>
        {completed ? <FinancialOverView /> : <NewFeedbackSurvey />}
      </div>
    </>
  );
};

const FinancialOverView = () => {
  return (
    <>
      <div className={styles.top_financialContainer}>
        <div className={styles.financial_overview}>
          <h2 className={styles.financialOverview_title}>Financial Overview</h2>
          <div className={styles.financialOverview_smallBox}>
            <div className={styles.smallbox}>
              <h2 className={styles.smallbox_title}>Total Rev.</h2>
              <span className={styles.smallbox_number}>$22</span>
            </div>
            <div className={styles.smallbox}>
              <h2 className={styles.smallbox_title2}>Supply Cost</h2>
              <span className={styles.smallbox_number}>$16</span>
            </div>
            <div className={styles.smallbox}>
              <h2 className={styles.smallbox_title3}>Total Rev.</h2>
              <span className={styles.smallbox_number}>$6</span>
            </div>
          </div>
          <div className={styles.financialOverview_smallEllipse}>
            <div className={styles.smallEllipse}>
              <span className={styles.ellipse_title}>Avg Supply CPI</span>
              <span className={styles.ellipse_number}>$4.00</span>
            </div>
            <div className={styles.smallEllipse}>
              <span className={styles.ellipse_title}>Avg. Client CPI</span>
              <span className={styles.ellipse_number}>$5.00</span>
            </div>
            <div className={styles.smallEllipse}>
              <span className={styles.ellipse_title}>EPC Vendor</span>
              <span className={styles.ellipse_number}>$0.23</span>
            </div>
          </div>
        </div>

        <div className={styles.financial_stats}>
          <h2 className={styles.stats_title}>Stats</h2>

          <span className={styles.paragraph}>Total No of Completes : 200</span>
          <span className={styles.paragraph}>Average CPI : 2 USD</span>
          <span className={styles.paragraph}>Client’s PO : #930294</span>
          <span className={styles.paragraph}>Vendor Avg CPI : 1 USD</span>
          <span className={styles.paragraph}>Total Revenue : 400 USD</span>
          <span className={styles.paragraph}>Total Supply Cost : 200 USD</span>
          <span className={styles.paragraph}>Profit : 200 USD</span>
          <span className={styles.paragraph}>Profit Percentage : 50%</span>
        </div>
      </div>

      <div className={styles.bottom_financialContainer}>
        <div className={styles.create_invoices}>
          <h2 className={styles.create_invoiceTitle}>Create Invoice</h2>

          <div className={styles.input_Container}>
            <div className={styles.leftInput}>
              <div className={styles.single_input_data}>
                <label htmlFor="" className={styles.label}>
                  Bill to :
                </label>
                <input type="text" className={styles.inputField} />
              </div>
              <div className={styles.single_input_data}>
                <label htmlFor="" className={styles.label}>
                  Bill Address :{" "}
                </label>
                <input type="text" className={styles.inputField} />
              </div>
              <div className={styles.single_input_data}>
                <label htmlFor="" className={styles.label}>
                  Bill From :{" "}
                </label>
                <input type="text" className={styles.inputField} />
              </div>
              <div className={styles.single_input_data}>
                <label htmlFor="" className={styles.label}>
                  Bill Address :{" "}
                </label>
                <input type="text" className={styles.inputField} />
              </div>
              <div className={styles.single_input_data}>
                <label htmlFor="" className={styles.label}>
                  Invoice Type :
                </label>
                <input type="text" className={styles.inputField} />
              </div>
            </div>
            <div className={styles.middleInput}>
              <div className={styles.middle_input_data}>
                <label htmlFor="" className={styles.label}>
                  Invoice Date :
                </label>
                <input type="date" className={styles.DateinputField} />
              </div>
              <div className={styles.middle_input_data}>
                <label htmlFor="" className={styles.label}>
                  Due Date :
                </label>
                <input type="date" className={styles.DateinputField} />
              </div>
              <div className={styles.middle_input_data}>
                <label htmlFor="" className={styles.label}>
                  Payment Terms :
                </label>
                <input type="text" className={styles.inputField} />
              </div>
            </div>
            <div className={styles.rightInput}>
              <div className={styles.single_input_data}>
                <label htmlFor="" className={styles.label}>
                  Notes :
                </label>
                <textarea
                  name=""
                  id=""
                  cols="30"
                  rows="8"
                  className={styles.textarea}
                ></textarea>
              </div>
            </div>
          </div>

          <div className={styles.table_Container}>
            <table className={styles.table}>
              <tr className={styles.table_row}>
                <th className={styles.table_head}>Description/PO Number</th>
                <th className={styles.table_head}>Qty</th>
                <th className={styles.table_head}>CPI</th>
                <th className={styles.table_head}>Tax</th>
                <th className={styles.table_head}>Total Amount</th>
              </tr>
              <tr>
                <td className={styles.table_data}>#100399</td>
                <td className={styles.table_data}>23</td>
                <td className={styles.table_data}>2 USD</td>
                <td className={styles.table_data}>0%</td>
                <td className={styles.table_data}>1750 USD</td>
              </tr>
            </table>
          </div>

          <button className={styles.btn}>Add more PO</button>
        </div>
      </div>
    </>
  );
};

export default Financial;
