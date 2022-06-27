import Header from "../../components/header/Header";
import "./Leads.css";
import { CgMenuGridO } from "react-icons/cg";
import { AiFillPhone } from "react-icons/ai";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useEffect, useState } from "react";
import { Modal } from "@mui/material";
import { Box } from "@mui/system";
import { HiArrowSmDown } from "react-icons/hi";
import { BiUpArrowAlt } from "react-icons/bi";

const tableData = [
  {
    name: "Amy Jordan",
    company: "Lee enterprise",
    title: "VP puchasing",
    state: "Georgia",
    phone: "1 (800) 667-6389",
    email: "amy@gmail.com",
    lead_status: "New",
    owner_first_name: "amy",
    owner_last_name: "jordan",
  },
  {
    name: "Amy Jordan",
    company: "Lee enterprise",
    title: "VP puchasing",
    state: "Georgia",
    phone: "1 (800) 667-6389",
    email: "amy@gmail.com",
    lead_status: "New",
    owner_first_name: "amy",
    owner_last_name: "jordan",
  },
  {
    name: "Amy Jordan",
    company: "Lee enterprise",
    title: "VP puchasing",
    state: "Georgia",
    phone: "1 (800) 667-6389",
    email: "amy@gmail.com",
    lead_status: "New",
    owner_first_name: "amy",
    owner_last_name: "jordan",
  },
  {
    name: "Amy Jordan",
    company: "Lee enterprise",
    title: "VP puchasing",
    state: "Georgia",
    phone: "1 (800) 667-6389",
    email: "amy@gmail.com",
    lead_status: "New",
    owner_first_name: "amy",
    owner_last_name: "jordan",
  },
];

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
const Leads = () => {
  const [leadsData, setLeadsData] = useState([]);
  const [sortByName, setSortByName] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleOpenMenu = (e) => {
    setAnchorEl(e.target);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleSortByName = () => {
    setSortByName(!sortByName);
  };
  useEffect(() => {
    setLeadsData(tableData.sort(dynamicSort("name", sortByName)));
  }, [sortByName]);

  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  return (
    <>
      <Header />
      <div className="leads_page">
        <p className="leads_page_title">Leads</p>
        <div style={{ overflowX: "auto" }}>
          <table className="leads_table">
            <tr>
              <th>#</th>
              <th>
                Name
                {sortByName ? (
                  <HiArrowSmDown
                    style={{ cursor: "pointer" }}
                    onClick={handleSortByName}
                  />
                ) : (
                  <BiUpArrowAlt
                    style={{ cursor: "pointer" }}
                    onClick={handleSortByName}
                  />
                )}
              </th>
              <th>Company</th>
              <th>Title</th>
              <th>State</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Owner first name</th>
              <th>Owner last name</th>
              <th>Created at</th>
              <th></th>
            </tr>
            {leadsData.map((data, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{data.name}</td>
                <td>{data.company}</td>
                <td>{data.title}</td>
                <td>{data.state}</td>
                <td>
                  <AiFillPhone color="blue" /> &nbsp; {data.phone}
                </td>
                <td>{data.email}</td>
                <td>{data.lead_status}</td>
                <td>{data.owner_first_name}</td>
                <td>{data.owner_last_name}</td>
                <td>
                  <CgMenuGridO
                    aria-controls={open ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleOpenMenu}
                  />
                </td>
              </tr>
            ))}
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

export default Leads;
