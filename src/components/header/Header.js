import React from "react"
import { Link, NavLink, useParams } from "react-router-dom"
import Logo from "../../assets/images/mirats_console_logo.png"
import Steve from "../../assets/images/steve.png"
import "./Header.css"

// Header avatar
import Box from "@mui/material/Box"
import Avatar from "@mui/material/Avatar"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import Divider from "@mui/material/Divider"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import Tooltip from "@mui/material/Tooltip"
import PersonAdd from "@mui/icons-material/PersonAdd"
import Settings from "@mui/icons-material/Settings"
import Logout from "@mui/icons-material/Logout"

const SurveysSubmenu = () => (
	<>
		<ul className='nav__submenu'>
			<li className='nav__submenu-item '>
				<Link to='/surveys?view=all'>My Surveys</Link>
			</li>
			<li className='nav__submenu-item '>
				<Link to='/survey-groups'>Survey Groups</Link>
			</li>
			<li className='nav__submenu-item '>
				<Link to='/projects'>My Projects</Link>
			</li>
			<li className='nav__submenu-item '>
				<Link to='/question-library'>Question Library</Link>
			</li>
		</ul>
	</>
)

const Header = () => {
	const [anchorEl, setAnchorEl] = React.useState(null)
	const open = Boolean(anchorEl)
	const handleClick = event => {
		setAnchorEl(event.currentTarget)
	}
	const handleClose = () => {
		setAnchorEl(null)
	}
	const checkActive = (match, location) => {
		//some additional logic to verify you are in the home URI
		if (!location) return false
		const { pathname } = location
		return pathname === "/"
	}
	return (
		<div className='header'>
			<div className='header_left'>
				<img src={Logo} alt='' width={180} height={"auto"} />
				<div className='header_left_links'>
					<NavLink
						activeClassName='header_active_link'
						className='header_link'
						to='/'
						isActive={checkActive}
					>
						<span>Dashboard</span>
					</NavLink>
					<NavLink
						activeClassName='header_active_link'
						className='header_link'
						to='/surveys?view=all'
					>
						<span>
							<span>Surveys </span>
						</span>

						<SurveysSubmenu />
					</NavLink>
					<NavLink
						activeClassName='header_active_link'
						className='header_link'
						to='/accounts'
					>
						<span>Accounts</span>
						<SurveysSubmenu />
					</NavLink>
					<NavLink
						activeClassName='header_active_link'
						className='header_link'
						to='/leads'
					>
						<span>Leads</span>
					</NavLink>
					<NavLink
						activeClassName='header_active_link'
						className='header_link'
						to='/contacts'
					>
						<span>Contacts</span>
					</NavLink>
				</div>
			</div>

			{/* User Profile */}
			<div className='header_right'>
				<div>
					<p className='userprofilename'>Rohan Gupta</p>
					<p className='userprofiledescription'>
						Recruitment Coordinator
					</p>
				</div>
				<div>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							textAlign: "center",
						}}
					>
						<Tooltip title='Account settings'>
							<IconButton
								onClick={handleClick}
								size='small'
								sx={{ ml: 2 }}
								aria-controls={
									open ? "account-menu" : undefined
								}
								aria-haspopup='true'
								aria-expanded={open ? "true" : undefined}
							>
								<Avatar sx={{ width: 40, height: 40 }}>
									{" "}
									<img
										className='profile_image'
										src={Steve}
									/>{" "}
								</Avatar>
							</IconButton>
						</Tooltip>
					</Box>
					<Menu
						anchorEl={anchorEl}
						id='account-menu'
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
							<Avatar /> Profile
						</MenuItem>
						<MenuItem>
							<Avatar /> My account
						</MenuItem>
						<Divider />
						<MenuItem>
							<ListItemIcon>
								<PersonAdd fontSize='small' />
							</ListItemIcon>
							Add another account
						</MenuItem>
						<MenuItem>
							<ListItemIcon>
								<Settings fontSize='small' />
							</ListItemIcon>
							Settings
						</MenuItem>
						<MenuItem>
							<ListItemIcon>
								<Logout fontSize='small' />
							</ListItemIcon>
							Logout
						</MenuItem>
					</Menu>
				</div>
			</div>
		</div>
	)
}

export default Header

