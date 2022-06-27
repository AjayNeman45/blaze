import React, { useEffect, useState } from "react";
import styles from "./Reconciliations.module.css";
import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { useReconcileContext } from "./ReconciliationContext";
import { ReconciliationTable } from "./Reconciliations";

const TermDetails = () => {
  const { allSuppliers, termDetailsSessions, handleGenerateReport } =
    useReconcileContext();
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [supplier, setSupplier] = useState({});
  const [showTable, setShowTable] = useState(false);
  const [termType, setTermType] = useState("");
  const [tableLoading, setTableLoading] = useState(false);

  useEffect(() => {
    allSuppliers?.map((supp) => {
      if (supp?.supplier_account === selectedSupplier) {
        setSupplier(supp);
      }
    });
  }, [selectedSupplier]);

  return (
    <>
      <div className={styles.term_details_section}>
        <div className={styles.term_details_select_fields}>
          <div className={styles.section}>
            <FormControl sx={{ m: 1, width: 300 }}>
              <InputLabel id="demo-simple-select-label">Supplier</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedSupplier}
                label="Supplier"
                onChange={(e) => setSelectedSupplier(e.target.value)}
              >
                {allSuppliers?.map((supp) => (
                  <MenuItem value={supp?.supplier_account}>
                    {supp?.supplier_account}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className={styles.section}>
            <FormControl sx={{ m: 1, width: 300 }}>
              <InputLabel id="demo-simple-select-label">
                Termination Type
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={termType}
                label="Termination Type"
                onChange={(e) => setTermType(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="quality_terminate">Quality Terminate</MenuItem>
                <MenuItem value="terminate">Terminate</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        <div className={styles.generate_report_btn}>
          <button
            onClick={() => {
              handleGenerateReport(supplier, termType, setTableLoading);
              setShowTable(true);
              setTableLoading(true);
            }}
          >
            Generate Report
          </button>
        </div>

        {tableLoading ? (
          <div style={{ textAlign: "center" }}>
            <CircularProgress />
          </div>
        ) : (
          showTable && (
            <ReconciliationTable
              sessionsCopy={termDetailsSessions}
              showTable={showTable}
            />
          )
        )}
      </div>
    </>
  );
};

export default TermDetails;
