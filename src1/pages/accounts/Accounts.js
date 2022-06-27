import Header from "../../components/header/Header";
import "./Accounts.css";
import { CgMenuGridO } from "react-icons/cg";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useEffect, useState } from "react";
import { Modal } from "@mui/material";
import { Box } from "@mui/system";
import { AiFillPhone } from "react-icons/ai";
import { HiArrowSmDown } from "react-icons/hi";
import { BiUpArrowAlt } from "react-icons/bi";

const tableData = [
  {
    account_name: "Slobal Media",
    billing_state: "Ontario",
    phone: "1(800) 667-6389",
    type: "prospect",
    owner_first_name: "test",
    owner_last_name: "test",
  },
  {
    account_name: "Global Media",
    billing_state: "Ontario",
    phone: "1(800) 667-6389",
    type: "prospect",
    owner_first_name: "test",
    owner_last_name: "test",
  },
  {
    account_name: "Mlobal Media",
    billing_state: "Ontario",
    phone: "1(800) 667-6389",
    type: "prospect",
    owner_first_name: "test",
    owner_last_name: "test",
  },
  {
    account_name: "Klobal Media",
    billing_state: "Ontario",
    phone: "1(800) 667-6389",
    type: "prospect",
    owner_first_name: "test",
    owner_last_name: "test",
  },
];

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "white",
  outline: "none",
  boxShadow: 24,
  p: 4,
};

function dynamicSort(property, sortBy) {
  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  if (sortBy) {
    return function (a, b) {
      /* next line works with strings and numbers,
       * and you may want to customize it to your needs
       */
      var result =
        a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
      return result * sortOrder;
    };
  } else {
    return function (a, b) {
      var result =
        a[property] > b[property] ? -1 : a[property] < b[property] ? 1 : 0;
      return result * sortOrder;
    };
  }
}

const Accounts = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [accountsData, setAccountsData] = useState([]);
  const [sortAccountName, setSortAccountName] = useState(1);

  const open = Boolean(anchorEl);
  const handleOpenMenu = (e) => {
    setAnchorEl(e.target);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleSortByAccountName = () => {
    setSortAccountName(!sortAccountName);
  };
  useEffect(() => {
    setAccountsData(
      tableData.sort(dynamicSort("account_name", sortAccountName))
    );
  }, [sortAccountName]);

  return (
    <>
      <Header />
      <div className="accounts_page">
        <p className="accounts_page_title">Accounts</p>
        <div style={{ overflowX: "auto" }}>
          <table className="accounts_table">
            <tr>
              <th>#</th>
              <th>
                Account Name
                {sortAccountName ? (
                  <HiArrowSmDown
                    style={{ cursor: "pointer" }}
                    onClick={handleSortByAccountName}
                  />
                ) : (
                  <BiUpArrowAlt
                    style={{ cursor: "pointer" }}
                    onClick={handleSortByAccountName}
                  />
                )}
              </th>
              <th>Billing State/ Province</th>
              <th>Phone</th>
              <th>Type</th>
              <th>Owner First Name</th>
              <th>Owner Last Name</th>
              <th></th>
            </tr>
            {accountsData?.map((data, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{data?.account_name}</td>
                  <td>{data?.billing_state}</td>
                  <td>
                    <AiFillPhone color="blue" /> &nbsp;
                    {data?.phone}
                  </td>
                  <td>{data?.type}</td>
                  <td>{data?.owner_first_name}</td>
                  <td>{data?.owner_last_name}</td>
                  <td>
                    <CgMenuGridO
                      aria-controls={open ? "basic-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}
                      onClick={handleOpenMenu}
                    />
                  </td>
                </tr>
              );
            })}
          </table>
        </div>
      </div>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          onClick={() => {
            handleOpenModal();
            handleCloseMenu();
          }}
          style={{ fontSize: "14px" }}
        >
          Edit
        </MenuItem>
        <MenuItem onClick={handleCloseMenu} style={{ fontSize: "14px" }}>
          Delete
        </MenuItem>
        <MenuItem onClick={handleCloseMenu} style={{ fontSize: "14px" }}>
          Change Owner
        </MenuItem>
      </Menu>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="edit_account_modal">
          <span>Edit Global Media</span>
          <hr />
          <form>
            <div className="inputs">
              <div className="edit_account_name">
                <label>
                  Account Name <span className="required">*</span>
                </label>
                <input type="text" placeholder="" />
              </div>
              <div className="edit_account_owner">
                <label>Account Owner</label>
                <input type="text" placeholder="" />
              </div>
              <div className="edit_account_type">
                <label>Type</label>
                <input type="text" placeholder="" />
              </div>
              <div className="edit_website">
                <label>Website</label>
                <input type="text" placeholder="" />
              </div>
              <div className="edit_phone">
                <label>Phone</label>
                <input type="text" placeholder="" />
              </div>
              <div className="edit_account_desc">
                <label>Description</label>
                <textarea></textarea>
              </div>
              <div className="edit_industry">
                <label>Description</label>
                <textarea></textarea>
              </div>
              <div className="edit_employees_count">
                <label>Employees</label>
                <input type="text" />
              </div>
            </div>

            <span className="btns">
              <button onClick={handleCloseModal}>Cancle</button>
              <button>Save</button>
            </span>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default Accounts;
