import Header from "../../components/header/Header";
import styles from "./clients.module.css";
import { CgMenuGridO } from "react-icons/cg";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useEffect, useState } from "react";
import { Modal } from "@mui/material";
import { Box } from "@mui/system";
import { query, onSnapshot, collection } from "firebase/firestore";
import { db } from "../../firebase";
import { BsArrowDown } from "react-icons/bs";
// import { getClients } from "../../utils/firebaseQueries"
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

const Clients = () => {
  const [leadsData, setLeadsData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [clients, setClients] = useState([]);
  const handleOpenMenu = (e) => {
    setAnchorEl(e.target);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const [filteredClients, setFilteredClients] = useState([]);
  const [filterAndSorts, setFilterAndSorts] = useState({});

  const getClients = async () => {
    const q = query(
      collection(db, "miratsinsights", "blaze", "spark", "customer")
    );

    const clientSnapshot = onSnapshot(q, (querySnapshot) => {
      setClients([]);

      querySnapshot.forEach((doc) => {
        setClients((prear) => [...prear, { ...doc.data(), doc_id: doc.id }]);
      });
    });
  };

  useEffect(() => {
    getClients();
  }, []);

  useEffect(() => {
    setFilteredClients(clients);
    // For Sorting
    if (filterAndSorts?.sort) {
      if (filterAndSorts?.sort[1] === "asc") {
        setFilteredClients(
          [...filteredClients]?.sort((a, b) =>
            a?.[filterAndSorts?.sort?.[0]] > b?.[filterAndSorts?.sort?.[0]]
              ? 1
              : -1
          )
        );
      } else {
        setFilteredClients(
          [...filteredClients]?.sort((a, b) =>
            a?.[filterAndSorts?.sort?.[0]] > b?.[filterAndSorts?.sort?.[0]]
              ? -1
              : 1
          )
        );
      }
    }
  }, [clients, filterAndSorts]);

  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  function HandleSort(type) {
    setFilterAndSorts((preob) => ({
      ...preob,
      sort: [type, preob?.sort && preob?.sort[1] === "asc" ? "desc" : "asc"],
    }));
  }
  return (
    <>
      <Header />
      <div className={styles.leads_page}>
        <p className={styles.leads_page_title}>Clients</p>
        <div style={{ overflowX: "auto" }}>
          <table className={styles.leads_table}>
            <tr>
              <th>#</th>
              <th>
                <div
                  className={styles.arrow_cont}
                  onClick={() => HandleSort("company_name")}
                >
                  Company Name
                  {filterAndSorts?.sort?.[0] === "company_name" &&
                  filterAndSorts?.sort?.[1] === "desc" ? (
                    <BsArrowDown className={styles.arrow_icon} />
                  ) : (
                    <BsArrowDown
                      className={styles.arrow_icon}
                      style={{ transform: "rotate(180deg)" }}
                    />
                  )}
                </div>
              </th>
              <th>
                <div
                  className={styles.arrow_cont}
                  onClick={() => HandleSort("company_email")}
                >
                  Company Email
                  {filterAndSorts?.sort?.[0] === "company_email" &&
                  filterAndSorts?.sort?.[1] === "desc" ? (
                    <BsArrowDown className={styles.arrow_icon} />
                  ) : (
                    <BsArrowDown
                      className={styles.arrow_icon}
                      style={{ transform: "rotate(180deg)" }}
                    />
                  )}
                </div>
              </th>
              <th>Project Managers</th>
              <th>Supply Managers</th>
              <th>Account Managers</th>

              <th></th>
            </tr>
            {filteredClients?.map((data, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{data?.company_name}</td>
                <td>{data.company_email}</td>
                <td>
                  {" "}
                  <div className={styles.column_td}>
                    {data?.project_managers?.map((manager) => (
                      <div>
                        {manager?.name} - {manager?.email}
                      </div>
                    ))}
                  </div>
                </td>
                <td>
                  <div className={styles.column_td}>
                    {data?.supply_managers?.map((manager) => (
                      <div>
                        {manager?.name} - {manager?.email}
                      </div>
                    ))}
                  </div>
                </td>
                <td>
                  <div className={styles.column_td}>
                    {data?.account_managers?.map((manager) => (
                      <div>
                        {manager?.name} - {manager?.email}
                      </div>
                    ))}
                  </div>
                </td>

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
        <Box className={styles.edit_account_modal}>
          <span>Edit Global Media</span>
          <hr />
          <form>
            <div className={styles.inputs}>
              <div className={styles.edit_account_name}>
                <label>
                  Account Name <span className={styles.required}>*</span>
                </label>
                <input type="text" placeholder="" />
              </div>
              <div className={styles.edit_account_owner}>
                <label>Account Owner</label>
                <input type="text" placeholder="" />
              </div>
              <div className={styles.edit_account_type}>
                <label>Type</label>
                <input type="text" placeholder="" />
              </div>
              <div className={styles.edit_website}>
                <label>Website</label>
                <input type="text" placeholder="" />
              </div>
              <div className={styles.edit_phone}>
                <label>Phone</label>
                <input type="text" placeholder="" />
              </div>
              <div className={styles.edit_account_desc}>
                <label>Description</label>
                <textarea></textarea>
              </div>
              <div className={styles.edit_industry}>
                <label>Description</label>
                <textarea></textarea>
              </div>
              <div className={styles.edit_employees_count}>
                <label>Employees</label>
                <input type="text" />
              </div>
            </div>

            <span className={styles.btns}>
              <button onClick={handleCloseModal}>Cancle</button>
              <button>Save</button>
            </span>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default Clients;
