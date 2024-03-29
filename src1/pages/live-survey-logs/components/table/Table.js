import styles from "./Table.module.css";

import { styled } from "@mui/system";
import TablePaginationUnstyled from "@mui/base/TablePaginationUnstyled";
import { useState } from "react";
import { v4 as uuid } from "uuid";

// const rows = [
//   createData(
//     "Feb 18, 2022",
//     "11092003",
//     "11029394",
//     "11029394",
//     "11029394",
//     "Completed",
//     "3",
//     "23",
//     "Win 11"
//   ),
//   createData("Feb 18, 2022", "10:03 am", "7:00 pm", "8 hrs 57 mins", "NA"),
//   createData("Feb 18, 2022", "10:03 am", "7:00 pm", "8 hrs 57 mins", "NA"),
//   createData("Feb 18, 2022", "10:03 am", "7:00 pm", "8 hrs 57 mins", "NA"),
//   createData("Feb 18, 2022", "10:03 am", "7:00 pm", "8 hrs 57 mins", "NA"),
//   createData("Feb 18, 2022", "10:03 am", "7:00 pm", "8 hrs 57 mins", "NA"),
//   createData("Feb 18, 2022", "10:03 am", "7:00 pm", "8 hrs 57 mins", "NA"),
//   createData("Feb 18, 2022", "10:03 am", "7:00 pm", "8 hrs 57 mins", "NA"),
//   createData("Feb 18, 2022", "10:03 am", "7:00 pm", "8 hrs 57 mins", "NA"),
//   createData("Feb 18, 2022", "10:03 am", "7:00 pm", "8 hrs 57 mins", "NA"),
//   createData("Feb 18, 2022", "10:03 am", "7:00 pm", "8 hrs 57 mins", "NA"),
//   createData("Feb 18, 2022", "10:03 am", "7:00 pm", "8 hrs 57 mins", "NA"),
// ];

const Root = styled("div")`
  table {
    border-collapse: separate;
    border-spacing: 10px;
    width: 100%;
  }

  th {
    color: black;
    font-weight: 700;
    text-align: center;
    padding: 8px;
    font-size: 20px;
  }

  td {
    padding: 10px 30px;
    border-radius: 21px;
    text-align: center;
    color: #484848;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    font-size: 15px;
    margin-right: 50px;
  }
`;

const CustomTablePagination = styled(TablePaginationUnstyled)`
  & .MuiTablePaginationUnstyled-toolbar {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 0.5em 2em;

    @media (min-width: 768px) {
      flex-direction: row;
      align-items: center;
    }
  }

  & .MuiTablePaginationUnstyled-selectLabel {
    margin: 0;
  }

  & .MuiTablePaginationUnstyled-select {
    padding: 0.5em 1em;
    border-radius: 21px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border: none;
    font-weight: 700;
    font-size: 14px;
    color: #484848;
    outline: none;
  }

  & .MuiTablePaginationUnstyled-displayedRows {
    margin: 0;

    @media (min-width: 768px) {
      margin-left: auto;
    }
  }

  & .MuiTablePaginationUnstyled-spacer {
    display: none;
  }

  & .MuiTablePaginationUnstyled-actions {
    display: flex;
    gap: 0.25rem;
    padding: 0.5em;
  }

  & .MuiTablePaginationUnstyled-actions button {
    padding: 0.3em 0.5em;
    border: 1px solid #828282;
    cursor: pointer;
    background-color: white;
    border-radius: 21px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border: none;
  }

  & .MuiTablePaginationUnstyled-actions span {
    // padding: 0 0.8em;
    padding: 1em;
    color: #484848;
    font-weight: 700;
  }
`;

const Table = ({
  allSessions,
  surveyid,
  project_no,
  miratsCodes,
  clientCodes,
  surveyLogTableRef,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  // Avoid a layout jump when reaching the last page with empty rows.
  // const emptyRows =
  //   page > 0 ? Math.max(0, (1 + page) * rowsPerPage - allSessions?.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className={styles.table}>
      <Root sx={{ maxWidth: "100%", overflow: "auto" }}>
        <table
          id="survey-log-table"
          aria-label="custom pagination table"
          cellSpacing={10}
        >
          <thead>
            <tr>
              <th>Date</th>
              <th>RID</th>
              <th>Ref_ID</th>
              <th>Survey No</th>
              <th>ProjectNo</th>
              <th>Client Status</th>
              <th>Mirats Status</th>
              <th>qid_42</th>
              <th>aqid_os</th>
            </tr>
          </thead>
          <tbody>
            {(rowsPerPage > 0
              ? allSessions?.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : allSessions
            )?.map((row) => (
              <>
                {/* <div className={styles.gap}> */}
                <tr key={uuid()}>
                  <td>{row?.date.toDate().toDateString()}</td>
                  <td>{row?.rid}</td>
                  <td>{row?.ref_id}</td>
                  <td>{surveyid}</td>
                  <td>{project_no}</td>
                  <td>
                    {clientCodes?.map((code) => {
                      if (code?.code === row?.client_status) {
                        return <span key={uuid()}>{code?.m_desc}</span>;
                      }
                    })}
                  </td>
                  <td>
                    {miratsCodes?.map((code) => {
                      if (code?.code === row?.mirats_status) {
                        return <span key={uuid()}> {code?.m_desc} </span>;
                      }
                    })}
                  </td>
                  <td>
                    {row?.responses?.map((response) => {
                      if (response?.question_id === "42") {
                        return (
                          <span key={uuid()}> {response?.user_response}</span>
                        );
                      }
                    })}
                  </td>
                  <td>{row?.session_technical_details?.os}</td>
                </tr>
                {/* </div> */}
              </>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <CustomTablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                // colSpan={3}
                count={allSessions?.length}
                rowsPerPage={rowsPerPage}
                page={page}
                componentsProps={{
                  select: {
                    "aria-label": "rows per page",
                  },
                  actions: {
                    showFirstButton: true,
                    showLastButton: true,
                  },
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </tr>
          </tfoot>
        </table>
      </Root>
    </div>
  );
};

export default Table;
