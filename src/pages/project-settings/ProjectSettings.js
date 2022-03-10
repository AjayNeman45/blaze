import Header from "../../components/header/Header"
import Subheader from "../../components/subheader/Subheader"
import ToggleSwitch from "../../components/toogleSwitch/ToggleSwitch"
import { GoSettings } from "react-icons/go"
import "./ProjectSettings.css"
import { useParams } from "react-router-dom/cjs/react-router-dom.min"
import { useContext, useEffect, useState } from "react"
import { ProjectSettingContext } from "./ProjectSettingContext"
import Stack from "@mui/material/Stack"
import Button from "@mui/material/Button"
import { db } from "../../firebase"
import { arrayUnion } from "firebase/firestore"

const ProjectSettings = () => {
	const DB = db.collection("mirats").doc("surveys").collection("survey")
	const { surveyID } = useParams()
	const { surveyData } = useContext(ProjectSettingContext)

	let [sdata, setSData] = useState({})
	let [changes, setChanges] = useState({})
	useEffect(() => {
		setSData(surveyData)
		localStorage.setItem("survey_data", surveyData)
	}, [surveyData])

	useEffect(() => {
		if (Object.keys(changes).length !== 0 && !("updated_date" in changes)) {
			setChanges({ ...changes, updated_date: new Date() })
		}
	}, [changes])

	function SaveChanges() {
		DB.where("survey_id", "==", parseInt(surveyID))
			.get()
			.then(querysnapshot => {
				querysnapshot.forEach(doc => {
					doc.ref.set(
						{
							...sdata,
							changes: arrayUnion(changes),
						},
						{ merge: true }
					)
				})
			})
			.then(() => {
				setChanges({})
				console.log("Saved to database successfully")
			})
	}
	function CancelChanges() {
		setChanges({})
		window.location.reload()
	}

	console.log(sdata, changes)
	// console.log(surveyData)
	// console.log("changes is ", changes.no_of_completes)
	return (
		<>
			<Header />
			<Subheader />
			{/* style={{display:SaveContainer?"block":"none"}} */}

			<div className='project_name_input_field'>
				<input
					type='text'
					value={sdata.project}
					onChange={e => {
						setChanges({
							...changes,
							project: {
								changed_to: e.target.value,
								previous_change: surveyData?.project,
							},
						})
						setSData({
							...sdata,
							project: e.target.value,
						})
					}}
				/>
			</div>

			<div className='project_settings_page'>
				<div className='card'>
					<p className='title'>Setup Requirements</p>
					<div>
						<label>Study Type</label>
						<select>
							<option selected>{sdata.study_type}</option>
							<option></option>
							<option></option>
							<option></option>
						</select>
						<small>
							Study Type specifies what kind of survey you are
							running, which helps suppliers send the right
							respondents
						</small>
					</div>
					<div>
						<label>Buisiness unit</label>
						<select>
							<option selected>{sdata.business_unit}</option>
							<option></option>
							<option></option>
						</select>
						<small>
							Buisiness unit determines the currency and group
							within your organization that will be billed for
							this study
						</small>
					</div>
					<div>
						<label>Industry</label>
						<select>
							<option selected>{sdata.industry}</option>
							<option></option>
							<option></option>
						</select>
						<small>
							Industry specifies the genre of survey, which helps
							suppliers send the right respodents.
						</small>
					</div>
					<div>
						<label>Country - Language</label>
						<select>
							<option selected>{sdata.country_language}</option>
							<option></option>
							<option></option>
						</select>
						<small>
							This tells Suppliers where your sample should come
							from and in what language
						</small>
					</div>

					<div>
						<label>
							Does your survey collect personal information that
							can be used to identify am individual?
						</label>
						<div className='radio_btns'>
							{sdata?.collect_user_data}
							<div>
								<input
									type='radio'
									id='yes'
									name='fav_language'
									value='Yes'
									checked={sdata?.collect_user_data}
									onChange={e => {
										setChanges({
											...changes,
											collect_user_data: {
												changed_to: true,
												previous_change:
													surveyData?.collect_user_data,
											},
										})
										setSData({
											...sdata,
											collect_user_data: true,
										})
									}}
								/>
								<label htmlFor='yes'>Yes</label>
							</div>
							<div>
								<input
									type='radio'
									id='no'
									name='fav_language'
									value='No'
									checked={!sdata?.collect_user_data}
									onChange={e => {
										setChanges({
											...changes,
											collect_user_data: {
												changed_to: false,
												previous_change:
													surveyData?.collect_user_data,
											},
										})
										setSData({
											...sdata,
											collect_user_data: false,
										})
									}}
								/>
								<label htmlFor='no'>No</label>
							</div>
						</div>
					</div>
				</div>
				<div className='card'>
					<p className='title'>URL Setup & Costs</p>
					<div>
						<label>Live URL</label>
						<textarea rows={4} value={sdata?.live_url}></textarea>
						<small>
							We use this link to direct respondents to your
							survey after they complete a prescreener, when
							applicable. Please enter a valid url, e.g.
							https://www.now.mirats.in
						</small>
					</div>
					<div>
						<label>Test URL</label>
						<textarea rows={4}></textarea>
						<small>
							We Use this link when testing your survey.
						</small>
					</div>
					<button className='build_url_btn'>
						<GoSettings /> &nbsp; Build Your URL
					</button>
					<div>
						<label>Client CPI</label>
						<input placeholder='$USD input in integers' />
						<small>
							Notes the price a client is paying for completes
						</small>
					</div>
					<div>
						<label>Average Supply CPI</label>
						<input placeholder='$USD ' />
						<small>
							Tracks the price for completes. This is average
							supply costs
						</small>
					</div>
				</div>
				<div className='card'>
					<p className='title'>Expected Metrics & Data</p>
					<div>
						<label>Number of completes</label>

						<input
							type='text'
							value={sdata.no_of_completes}
							onChange={e => {
								setChanges({
									...changes,
									no_of_completes: {
										changed_to: e.target.value,
										previous_change:
											surveyData.no_of_completes,
									},
								})
								console.log(e.target.value)
								setSData({
									...sdata,
									no_of_completes: e.target.value,
								})
							}}
						/>

						<small>
							Notes the number of survey completely required by
							the client on this project. Suppliers use this to
							reference initial estimates for total completes
							required for a survey
						</small>
					</div>
					<div>
						<label>Expected incidence Rate</label>
						<input
							type='text'
							placeholder='Excpected LOI'
							value={sdata.expected_incidence_rate}
							onChange={e => {
								setChanges({
									...changes,
									expected_incidence_rate: {
										changed_to: e.target.value,
										previous_change:
											surveyData?.expected_incidence_rate,
									},
								})
								setSData({
									...sdata,
									expected_incidence_rate: e.target.value,
								})
							}}
						/>
						<small>
							Suppliers use this to determine how to best send to
							your survey before the in-field incidence Rate is
							calculated
						</small>
					</div>
					<div>
						<label>Expected Completion LOI</label>
						<input
							type='text'
							placeholder='Excpected LOI'
							value={sdata.expected_completion_loi}
							onChange={e => {
								setChanges({
									...changes,
									expected_completion_loi: {
										changed_to: e.target.value,
										previous_change:
											surveyData?.expected_completion_loi,
									},
								})
								setSData({
									...sdata,
									expected_completion_loi: e.target.value,
								})
							}}
						/>
						<small>
							Suppliers use this for initial expenctation of time
							to complete a survey before the in-field data is
							available.
						</small>
					</div>
				</div>
				<div className='card'>
					<p className='title'>Survey Basics</p>
					<div>
						<div className='switch-toggle'>
							<ToggleSwitch label='Suitable for mobile' />
							<ToggleSwitch label='Suitable for tablet' />
							<ToggleSwitch label='Suitable for desktops/laptops' />
							<ToggleSwitch label='Suitable for tv' />
							<ToggleSwitch label='Requires Webcam' />
						</div>
					</div>
					<div>
						<label>Survey Current status</label>
						<select>
							<option selected>{sdata.status}</option>
							<option></option>
						</select>
						<small>
							This determines the current state of the survey
						</small>
					</div>
					<div>
						<label>In-field Date</label>
						<input
							placeholder='Start Date'
							class='textbox-n'
							type='text'
							onfocus="(this.type='date')"
							id='date'
						/>
						<small>
							This determines the current state of the survey
						</small>
					</div>
					<div>
						<label>Expected End Date</label>
						<input
							placeholder='out-field Date'
							class='textbox-n'
							type='text'
							onfocus="(this.type='date')"
							id='date'
						/>
						<small>The date this project launched in-field</small>
					</div>
				</div>

				{/* Peoples and Refs */}
				<div className='second_card'>
					<p className='title'>People's & Refs'</p>
					<div>
						<div>
							<label>Account Executive / Sales Coordinator</label>
							<select>
								<option selected>
									{sdata.account_executive}
								</option>
							</select>
							<small>
								Manages owenership of the survey for reporting
								and communication
							</small>
						</div>
						<div>
							<label>Lead Project Manager</label>
							<select>
								<option selected>
									{sdata.project_manager}
								</option>
							</select>
							<small>
								Manages the field of the survey for reporting
								and communication
							</small>
						</div>
						<div>
							<label>Alternative Project Manager</label>
							<select>
								<option selected>
									{sdata.alternate_project_manager}
								</option>
							</select>
							<small>
								Manages the field of the survey for reporting
								and communication
							</small>
						</div>
					</div>
					<div>
						<div>
							<label>Created by</label>
							<input
								type='text'
								placeholder='Created by'
								value={sdata?.created_by}
								onChange={e => {
									setChanges({
										...changes,
										created_by: {
											changed_to: e.target.value,
											previous_change:
												surveyData?.created_by
													? surveyData?.created_by
													: null,
										},
									})
									setSData({
										...sdata,
										created_by: e.target.value,
									})
								}}
							/>
							<small>
								The person who created the survey in this
								project
							</small>
						</div>
						<div>
							<label>Contact Email</label>
							<input
								type='email'
								placeholder='Contact Email'
								value={sdata?.contact_email}
								onChange={e => {
									setChanges({
										...changes,
										contact_email: {
											changed_to: e.target.value,
											previous_change:
												surveyData?.contact_email
													? surveyData?.contact_email
													: null,
										},
									})
									setSData({
										...sdata,
										contact_email: e.target.value,
									})
								}}
							/>
							<small>
								The person who created the survey in this
								project
							</small>
						</div>
						<div>
							<label>PO Number</label>
							<input
								type='text'
								placeholder='PO Number'
								value={sdata?.po_number}
								onChange={e => {
									setChanges({
										...changes,
										po_number: {
											changed_to: e.target.value,
											previous_change:
												surveyData?.po_number
													? surveyData?.po_number
													: null,
										},
									})
									setSData({
										...sdata,
										po_number: e.target.value,
									})
								}}
							/>
							<small>
								The date this project launched in-field
							</small>
						</div>
					</div>
				</div>
				<div className='second_card'>
					<p className='title'>Project Settings</p>
					<div>
						<div>
							<label>External Name</label>
							<input
								type='text'
								placeholder='Other name of Project'
								value={sdata?.external_name}
								onChange={e => {
									setChanges({
										...changes,
										external_name: {
											changed_to: e.target.value,
											previous_change:
												surveyData?.external_name
													? surveyData?.external_name
													: null,
										},
									})
									setSData({
										...sdata,
										external_name: e.target.value,
									})
								}}
							/>
						</div>
						<div>
							<label>Project ID</label>
							<input
								type='text'
								disabled
								placeholder='Project ID'
								value={sdata.project_id}
							/>
						</div>
						<div>
							<label>Survey Group</label>
							<input
								type='text'
								placeholder='Group Number'
								value={sdata.survey_group}
								onChange={e => {
									setChanges({
										...changes,
										survey_group: {
											changed_to: e.target.value,
											previous_change:
												surveyData?.survey_group
													? surveyData?.survey_group
													: null,
										},
									})
									setSData({
										...sdata,
										survey_group: e.target.value,
									})
								}}
							/>
						</div>
						<div>
							<label>Client PM Email</label>
							<input
								type='text'
								placeholder="Client's PM email"
								value={sdata?.client_pm_email}
								onChange={e => {
									setChanges({
										...changes,
										client_pm_email: {
											changed_to: e.target.value,
											previous_change:
												surveyData?.client_pm_email
													? surveyData?.client_pm_email
													: null,
										},
									})
									setSData({
										...sdata,
										client_pm_email: e.target.value,
									})
								}}
							/>
						</div>
						<div>
							<label>Client Project Manager</label>
							<input
								type='text'
								placeholder="Client's Project Manager"
								value={sdata?.client_project_manager}
								onChange={e => {
									setChanges({
										...changes,
										client_project_manager: {
											changed_to: e.target.value,
											previous_change:
												surveyData?.client_project_manager
													? surveyData?.client_project_manager
													: null,
										},
									})
									setSData({
										...sdata,
										client_project_manager: e.target.value,
									})
								}}
							/>
						</div>
					</div>
				</div>

				<div
					className='savediscardContainer'
					style={{
						display:
							Object.keys(changes).length === 0 ? "none" : "flex",
					}}
				>
					<Button variant='contained' onClick={SaveChanges}>
						Save
					</Button>
					<Button
						variant='contained'
						id='cancle_btn'
						onClick={CancelChanges}
					>
						Cancel
					</Button>
				</div>

				<div className='change_log'>
					<p className='change_log_title'>Change log</p>
					<p className='change_log_instruction'>
						Review Changes to your survey configurations. See who
						made changes and when
					</p>
					<div style={{ overflowX: "auto" }}>
						<table className='change_log_table'>
							<thead>
								<tr>
									<th>Time @ Date</th>
									<th>Profile Name</th>
									<th>Profile Email</th>
									<th>Changed Elements/Fields</th>
									<th>Removed</th>
									<th>Changed to</th>
								</tr>
							</thead>
							{/* <tbody>{sdata?.changes.map((data) => {

			  })}</tbody> */}
						</table>
					</div>
				</div>
			</div>
		</>
	)
}

export default ProjectSettings

const handleProjectSettingChanges = (
	setChanges,
	changes,
	setSData,
	sdata,
	e
) => {
	setChanges({
		...changes,
		survey_group: {
			changed_to: e.target.value,
			previous_change: JSON.parse(localStorage.getItem("survey_data"))[
				"survey_group"
			],
		},
	})
	setSData({
		...sdata,
		survey_group: e.target.value,
	})
}