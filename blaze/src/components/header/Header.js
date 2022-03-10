import { Link, NavLink } from "react-router-dom"
import Logo from "../../assets/images/insights.png"
import "./Header.css"

const Header = () => {
	return (
		<div className='header'>
			<div className='header_left'>
				<img src={Logo} alt='' width={180} height={35} />
				<div className='header_left_links'>
					<NavLink
						activeClassName='header_active_link'
						className='header_link'
						to='/dashboard'
					>
						Dashboard
					</NavLink>
					<NavLink
						activeClassName='header_active_link'
						className='header_link'
						to='/projects?view=all'
					>
						Projects
					</NavLink>
					<NavLink
						activeClassName='header_active_link'
						className='header_link'
						to='/accounts'
					>
						Accounts
					</NavLink>
					<NavLink
						activeClassName='header_active_link'
						className='header_link'
						to='/leads'
					>
						Leads
					</NavLink>
					<NavLink
						activeClassName='header_active_link'
						className='header_link'
						to='/contacts'
					>
						Contacts
					</NavLink>
				</div>
			</div>
			<div className='header_right'>
				<Link
					className='create_new_project_btn'
					to='/create-new-project/basic'
				>
					Create New Project
				</Link>
			</div>
		</div>
	)
}

export default Header
