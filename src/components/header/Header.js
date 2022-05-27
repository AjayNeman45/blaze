import React from "react";
import { Link, NavLink, useParams } from "react-router-dom";
import Logo from "../../assets/images/mirats_console_logo.png";
import Steve from "../../assets/images/steve.png";
import "./Header.css";
import { MdPayment } from "react-icons/md";
// Header avatar
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { useBaseContext } from "../../context/BaseContext";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const SurveysSubmenu = ({ history }) => {
  return (
    <>
      <ul className="nav__submenu">
        <li
          className="nav__submenu_item"
          onClick={() => history.push("/mi/surveys?view=all")}
        >
          My Surveys
        </li>
        <li
          className="nav__submenu_item"
          onClick={() => history.push("/survey-groups")}
        >
          Survey Groups
        </li>
        <li
          className="nav__submenu_item"
          onClick={() => history.push("/mi/projects")}
        >
          My Projects
        </li>
        <p
          className="nav__submenu_item"
          onClick={() => {
            console.log("redirecting to question library", history);
            history.push("/question-library");
          }}
        >
          Question Library
        </p>
      </ul>
    </>
  );
};
const SupplierSubMenu = ({ history }) => {
  return (
    <>
      <ul className="nav__submenu">
        <li
          className="nav__submenu_item"
          onClick={() => history.push("/mi/surveys?view=all")}
        >
          Organisations
        </li>
        <li
          className="nav__submenu_item"
          onClick={() => history.push("/contacts")}
        >
          Contacts
        </li>
        <li
          className="nav__submenu_item"
          onClick={() => history.push("/mi/projects")}
        >
          Supplier Settings
        </li>
        <li
          className="nav__submenu_item"
          onClick={() => history.push("/question-library")}
        >
          Pricing
        </li>
      </ul>
    </>
  );
};

const ClientSubMenu = ({ history }) => (
  <>
    <ul className="nav__submenu">
      <li
        className="nav__submenu_item"
        onClick={() => history.push("/mi/surveys?view=all")}
      >
        Organisations
      </li>
      <li
        className="nav__submenu_item"
        onClick={() => history.push("/contacts")}
      >
        Contacts
      </li>
      <li
        className="nav__submenu_item"
        onClick={() => history.push("/mi/projects")}
      >
        Client Settings
      </li>
    </ul>
  </>
);

const Header = () => {
  const history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { userData } = useBaseContext();
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const checkActive = (match, location) => {
    //some additional logic to verify you are in the home URI
    if (!location) return false;
    const { pathname } = location;
    return pathname === "/";
  };
  return (
    <div className="header">
      <div className="header_left">
        <img src={Logo} alt="" width={180} height={"auto"} />
        <div className="header_left_links">
          <NavLink
            activeClassName="header_active_link"
            className="header_link"
            to="/"
            isActive={checkActive}
          >
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            activeClassName="header_active_link"
            className="header_link"
            to="/mi/surveys?view=all"
          >
            <span>
              <span>Surveys </span>
              <SurveysSubmenu history={history} />
            </span>
          </NavLink>
          {/* <NavLink
            activeClassName="header_active_link"
            className="header_link"
            to="/accounts"
          >
            <span>Accounts</span>
            <SurveysSubmenu />
          </NavLink> */}
          <NavLink
            activeClassName="header_active_link"
            className="header_link"
            // to="/accounts"
            to="/supplier"
          >
            <span>Supplier</span>
            <SupplierSubMenu history={history} />
          </NavLink>
          {/* <NavLink
            activeClassName="header_active_link"
            className="header_link"
            to="/leads"
          >
            <span>Leads</span>
          </NavLink> */}
          <NavLink
            activeClassName="header_active_link"
            className="header_link"
            to="/clients"
          >
            <span>Clients</span>
            <ClientSubMenu history={history} />
          </NavLink>
          {/* <NavLink
            activeClassName="header_active_link"
            className="header_link"
            to="/contacts"
          >
            <span>Contacts</span>
          </NavLink> */}
          <NavLink
            activeClassName="header_active_link"
            className="header_link"
            to="/bid"
          >
            <span>Bid</span>
          </NavLink>
        </div>
      </div>

      {/* User Profile */}
      <div className="header_right">
        <div>
          <p className="userprofilename">
            {userData?.firstname} {userData?.lastname}
          </p>
          <p className="userprofiledescription">{userData?.position}</p>
        </div>
        <div>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Tooltip title="Account settings">
              <IconButton
                onClick={handleClick}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                <Avatar sx={{ width: 40, height: 40 }}>
                  {" "}
                  <img
                    className="profile_image"
                    src={userData?.profile_photo}
                  />{" "}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{
              horizontal: "right",
              vertical: "top",
            }}
            anchorOrigin={{
              horizontal: "right",
              vertical: "bottom",
            }}
          >
            <MenuItem>
              <Avatar />
              My Profile
            </MenuItem>
            <MenuItem>
              <Avatar /> My account
            </MenuItem>
            <MenuItem>
              <MdPayment
                size={30}
                style={{ marginRight: "5px" }}
                color="gray"
              />{" "}
              Payments
            </MenuItem>
            <Divider />

            <MenuItem>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default Header;
