import { NavLink, useParams } from "react-router-dom"
import Documents from "../../pages/documents/Documents"
import "./subheader.css"
const Subheader = () => {
	const { surveyID } = useParams()
	return (
		<div className='subheader'>
			<div className='subheader_links'>
				<NavLink
					activeClassName='subheader_active_link'
					className='subheader_link'
					to='/projects/dashboard'
				>
					Dashboard
				</NavLink>
				<NavLink
					activeClassName='subheader_active_link'
					className='subheader_link'
					to='/projects/analytics'
				>
					Analytics
				</NavLink>
				<NavLink
					activeClassName='subheader_active_link'
					className='subheader_link'
					to='/projects/sources'
				>
					Sources
				</NavLink>
				<NavLink
					activeClassName='subheader_active_link'
					className='subheader_link'
					to={`/projects/reports/${surveyID}`}
				>
					Reports
				</NavLink>
				<NavLink
					activeClassName='subheader_active_link'
					className='subheader_link'
					to={`/projects/settings/${surveyID}`}
				>
					Project Settings
				</NavLink>
				<NavLink
					activeClassName='subheader_active_link'
					className='subheader_link'
					to={`/projects/questions/${surveyID}`}
				>
					Qualifications
				</NavLink>
				<NavLink
					activeClassName='subheader_active_link'
					className='subheader_link'
					to={`/projects/quotas/${surveyID}`}
				>
					Quotas
				</NavLink>
				<NavLink
					activeClassName='subheader_active_link'
					className='subheader_link'
					to={`/projects/allocations/${surveyID}`}
				>
					Allocations
				</NavLink>
				<NavLink
					activeClassName='subheader_active_link'
					className='subheader_link'
					to={`/projects/documents/${surveyID}`}
				>
					Documents
				</NavLink>
				<NavLink
					activeClassName='subheader_active_link'
					className='subheader_link'
					to={`/projects/security/${surveyID}`}
				>
					Security
				</NavLink>
				<NavLink
					activeClassName='header_active_link'
					className='subheader_link'
					to={`/projects/reconciliations/${surveyID}`}
				>
					Reconciliations
				</NavLink>
			</div>
		</div>
	)
}

export default Subheader
