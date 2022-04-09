import Header from "../../components/header/Header";
import AccountHeader from "../../components/account-header/AccountHeader";
import styles from "./acc_cont.module.css";
import InfoForm from "../../components/info-form/InfoForm";
import { MdOutlineModeEditOutline } from "react-icons/md";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { Link } from "react-router-dom";

const infoFormData = [
  {
    labelHeader: "Account Name",
    labelInput: "Global Media",
    edit: <MdOutlineModeEditOutline />,
  },
  {
    labelHeader: "Account Owner",
    labelInput: "Global Media",
    edit: <MdOutlineModeEditOutline />,
  },
  {
    labelHeader: "Type",
    labelInput: "Prospect",
    edit: <MdOutlineModeEditOutline />,
  },
  {
    labelHeader: "Parent Account",
    labelInput: "Prospect",
    edit: <MdOutlineModeEditOutline />,
  },
  {
    labelHeader: "Website",
    labelInput: "",
    edit: <MdOutlineModeEditOutline />,
  },
  {
    labelHeader: "Phone",
    labelInput: "",
    edit: <MdOutlineModeEditOutline />,
  },
  {
    labelHeader: "Description",
    labelInput: "",
    edit: <MdOutlineModeEditOutline />,
  },
  {
    labelHeader: "Industry",
    labelInput: "",
    edit: <MdOutlineModeEditOutline />,
  },
  {
    labelHeader: "Employees",
    labelInput: "600",
    edit: <MdOutlineModeEditOutline />,
  },
];

const headerData = [
  {
    title: "Phone",
    link: "12345678901010",
  },
  {
    title: "Biling Address",
    link: "Ontario",
  },
  {
    title: "Website",
    link: "Ontario",
  },
  {
    title: "Account Owner",
    link: "test test",
  },
];

const Accounts = () => {
  const [expanded, setExpanded] = useState("panel1");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : true);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Header />
      <div className={styles.accounts_contacts}>
        <section className={styles.header_top}>
          <AccountHeader
            headerData={headerData}
            heading="Account"
            head="Global Media"
          />
        </section>

        <div className={styles.acc_cont_container}>
          <section className={styles.information}>
            <div>
              <Accordion
                expanded={expanded === "panel1"}
                onChange={handleChange("panel1")}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>
                    <h3>Information</h3>
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    <InfoForm infoFormData={infoFormData} />
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>
                    <h3>Documents</h3>
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    <a href="link">Certificate Of Information</a>
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2a-content"
                  id="panel2a-header"
                >
                  <Typography>
                    <h3>Contacts</h3>
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Suspendisse malesuada lacus ex, sit amet blandit leo
                    lobortis eget.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>
                    <h3>Address Information</h3>
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    <span>Mailing Address - </span> <span>Ontario, Canada</span>
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2a-content"
                  id="panel2a-header"
                >
                  <Typography>
                    <h3>System Information</h3>
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Suspendisse malesuada lacus ex, sit amet blandit leo
                    lobortis eget.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </div>
          </section>

          <section className={styles.opportunities}>
            <h3>
              Opportunities <p className={styles.items}>10 Items |</p>
            </h3>

            <div className={styles.opportunity_container}>
              <table>
                <thead>
                  <tr>
                    <th>Opportunity Name</th>
                    <th>Stage</th>
                    <th>Amount</th>
                    <th>Closed Date</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={styles.link}>
                      <Link to="" />
                      Global Media(Sample)
                    </td>
                    <td>Negotiations</td>
                    <td>$17,000.00</td>
                    <td>4/19/2022 </td>
                    <td>
                      <Button
                        id="basic-button"
                        aria-controls={open ? "basic-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        onClick={handleClick}
                      >
                        <MdOutlineKeyboardArrowDown />
                      </Button>

                      <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                          "aria-labelledby": "basic-button",
                        }}
                      >
                        <MenuItem onClick={handleClose}>Edit</MenuItem>
                        <MenuItem onClick={handleClose}>Delete</MenuItem>
                      </Menu>
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.link}>
                      <Link to="" />
                      Global Media(Sample)
                    </td>
                    <td>Negotiations</td>
                    <td>$17,000.00</td>
                    <td>4/19/2022</td>
                    <td>
                      <Button
                        id="basic-button"
                        aria-controls={open ? "basic-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        onClick={handleClick}
                      >
                        <MdOutlineKeyboardArrowDown />
                      </Button>

                      <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                          "aria-labelledby": "basic-button",
                        }}
                      >
                        <MenuItem onClick={handleClose}>Edit</MenuItem>
                        <MenuItem onClick={handleClose}>Delete</MenuItem>
                      </Menu>
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.link}>
                      <Link to="" />
                      Global Media(Sample)
                    </td>
                    <td>Negotiations</td>
                    <td>$17,000.00</td>
                    <td>4/19/2022</td>
                    <td>
                      <Button
                        id="basic-button"
                        aria-controls={open ? "basic-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        onClick={handleClick}
                      >
                        {/* <RiArrowDropDownLine /> */}
                        <MdOutlineKeyboardArrowDown />
                      </Button>

                      <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                          "aria-labelledby": "basic-button",
                        }}
                      >
                        <MenuItem onClick={handleClose}>Edit</MenuItem>
                        <MenuItem onClick={handleClose}>Delete</MenuItem>
                      </Menu>
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.link}>
                      <Link to="" />
                      Global Media(Sample)
                    </td>
                    <td>Negotiations</td>
                    <td>$17,000.00</td>
                    <td>4/19/2022</td>
                    <td>
                      <Button
                        id="basic-button"
                        aria-controls={open ? "basic-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        onClick={handleClick}
                      >
                        {/* <RiArrowDropDownLine /> */}
                        <MdOutlineKeyboardArrowDown />
                      </Button>

                      <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                          "aria-labelledby": "basic-button",
                        }}
                      >
                        <MenuItem onClick={handleClose}>Edit</MenuItem>
                        <MenuItem onClick={handleClose}>Delete</MenuItem>
                      </Menu>
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.link}>
                      <Link to="" />
                      Global Media(Sample)
                    </td>
                    <td>Negotiations</td>
                    <td>$17,000.00</td>
                    <td>4/19/2022</td>
                    <td>
                      <Button
                        id="basic-button"
                        aria-controls={open ? "basic-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        onClick={handleClick}
                      >
                        {/* <RiArrowDropDownLine /> */}
                        <MdOutlineKeyboardArrowDown />
                      </Button>

                      <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                          "aria-labelledby": "basic-button",
                        }}
                      >
                        <MenuItem onClick={handleClose}>Edit</MenuItem>
                        <MenuItem onClick={handleClose}>Delete</MenuItem>
                      </Menu>
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.link}>
                      <Link to="" />
                      Global Media(Sample)
                    </td>
                    <td>Negotiations</td>
                    <td>$17,000.00</td>
                    <td>4/19/2022</td>
                    <td>
                      <Button
                        id="basic-button"
                        aria-controls={open ? "basic-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        onClick={handleClick}
                      >
                        {/* <RiArrowDropDownLine /> */}
                        <MdOutlineKeyboardArrowDown />
                      </Button>

                      <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                          "aria-labelledby": "basic-button",
                        }}
                      >
                        <MenuItem onClick={handleClose}>Edit</MenuItem>
                        <MenuItem onClick={handleClose}>Delete</MenuItem>
                      </Menu>
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.link}>
                      <Link to="" />
                      Global Media(Sample)
                    </td>
                    <td>Negotiations</td>
                    <td>$17,000.00</td>
                    <td>4/19/2022</td>
                    <td>
                      <Button
                        id="basic-button"
                        aria-controls={open ? "basic-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        onClick={handleClick}
                      >
                        <MdOutlineKeyboardArrowDown />
                      </Button>

                      <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                          "aria-labelledby": "basic-button",
                        }}
                      >
                        <MenuItem onClick={handleClose}>Edit</MenuItem>
                        <MenuItem onClick={handleClose}>Delete</MenuItem>
                      </Menu>
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.link}>
                      <Link to="" />
                      Global Media(Sample)
                    </td>
                    <td>Negotiations</td>
                    <td>$17,000.00</td>
                    <td>4/19/2022</td>
                    <td>
                      <Button
                        id="basic-button"
                        aria-controls={open ? "basic-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        onClick={handleClick}
                      >
                        {/* <RiArrowDropDownLine /> */}
                        <MdOutlineKeyboardArrowDown />
                      </Button>

                      <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                          "aria-labelledby": "basic-button",
                        }}
                      >
                        <MenuItem onClick={handleClose}>Edit</MenuItem>
                        <MenuItem onClick={handleClose}>Delete</MenuItem>
                      </Menu>
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.link}>
                      <Link to="" />
                      Global Media(Sample)
                    </td>
                    <td>Negotiations</td>
                    <td>$17,000.00</td>
                    <td>4/19/2022</td>
                    <td>
                      <Button
                        id="basic-button"
                        aria-controls={open ? "basic-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        onClick={handleClick}
                      >
                        <MdOutlineKeyboardArrowDown />
                      </Button>

                      <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                          "aria-labelledby": "basic-button",
                        }}
                      >
                        <MenuItem onClick={handleClose}>Edit</MenuItem>
                        <MenuItem onClick={handleClose}>Delete</MenuItem>
                      </Menu>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className={styles.table_link}>
              <a href="www.google.com">View All</a>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Accounts;
