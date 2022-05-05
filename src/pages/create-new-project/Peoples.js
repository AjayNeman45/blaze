import { Loading } from "@nextui-org/react"
import { useCreateNewProject } from "./CreateNewProjectContext"
import Select from "react-select"
import { useLocation } from "react-router-dom"
import { encryptText, decryptText } from "../../utils/enc-dec.utils"
import { useEffect, useState } from "react"
import { db } from "../../firebase"
import { doc, getDoc } from "firebase/firestore"
import { getClients, getSurvey } from "../../utils/firebaseQueries"
import { selectStyle } from "./BasicSurveyInfo"
import { positions } from "@mui/system"
const miratsoptions = [
	{ value: "Moinnudin S.", label: "Moinnudin S." },
	{ value: "Mahmood A.", label: "Mahmood A." },
	{ value: "Mayank K.", label: "Mayank K." },
	{ value: "Amit K. C.", label: "Amit K. C." },
]

const gmooptions = []

const Peoples = () => {
	const { surveyData, setSurveyData, insertPeoplesData, insertLoading } =
		useCreateNewProject()
	const location = useLocation()
	const encryptedID = new URLSearchParams(location.search).get("id")
	const [clientInfo, setClientInfo] = useState({})
	let [peoplesResearchTeam, setPeoplesResearchTeam] = useState("")
	useEffect(() => {
		const survey_id = decryptText(encryptedID.split("-")[0])
		getSurvey(survey_id).then(data => {
			setPeoplesResearchTeam(data?.client_info?.client_name)
		})
	}, [encryptedID])

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [])

	// ---->>>> useEffect for getting the clients info and storing there information to used in dropdown
	useEffect(() => {
		getClients().then(clients => {
			let pms = [],
				sms = [],
				ams = []
			clients.forEach(client => {
				console.log(
					client.data()?.company_name,
					surveyData?.client_info?.client_name
				)
				if (
					client.data()?.company_name ===
					surveyData?.client_info?.client_name
				) {
					client.data()?.project_managers?.map(pm => {
						pms.push({ label: pm?.name, value: pm?.name })
					})
					client.data()?.supply_managers?.map(sm => {
						sms.push({ label: sm?.name, value: sm?.name })
					})
					client.data()?.account_managers?.map(am => {
						ams.push({ label: am?.name, value: am?.name })
					})
				}
			})
			setClientInfo({
				leadProjectManagers: pms,
				salesManagers: sms,
				accountManagers: ams,
			})
		})
	}, [surveyData])

	const handleInputChange = (e, teamName, positionInTeam) => {
		let peoples = []
		e.forEach(({ label, value }) => {
			peoples.push(value)
		})

		setSurveyData(prevData => {
			return {
				...prevData,
				[teamName]: {
					...prevData?.[teamName],
					[positionInTeam]: peoples,
				},
			}
		})
	}

	return (
		<>
			<div className='peoples_info'>
				<div className='create_survey_left'>
					<p className='title'>Financial of the survey.</p>
					<p className='desc'>
						Fill this form to store the financials of this survey
					</p>
				</div>
				<div className='create_survey_right'>
					<div className='two-column'>
						<div className='client_cpi'>
							<label>Client CPI</label>
							<input
								type='number'
								placeholder='32%'
								onChange={e => {
									setSurveyData({
										...surveyData,
										client_info: {
											...surveyData?.client_info,
											client_cpi: parseInt(
												e.target.value
											),
										},
									})
								}}
								value={surveyData?.client_info?.client_cpi}
							/>
						</div>
						<div className='cost_curr'>
							<label>Client Cost Currency</label>
							<select
								onChange={e => {
									let client_cost_currency_symbol
									if (e.target.value === "USD")
										client_cost_currency_symbol = "$"
									else if (e.target.value === "INR")
										client_cost_currency_symbol = "₹"
									else if (e.target.value === "EURO")
										client_cost_currency_symbol = "€"
									setSurveyData({
										...surveyData,
										client_info: {
											...surveyData?.client_info,
											client_cost_currency:
												e.target.value,
											client_cost_currency_symbol,
										},
									})
								}}
								value={
									surveyData?.client_info
										?.client_cost_currency
								}
							>
								<option value='USD'>USD</option>
								<option value='INR'>INR</option>
								<option value='EURO'>EURO</option>
							</select>
						</div>
					</div>
					<div className='column'>
						<label>PO Number</label>
						<input
							type='text'
							placeholder='XXXXXXXXXX'
							onChange={e => {
								setSurveyData({
									...surveyData,
									client_info: {
										...surveyData?.client_info,
										po_number: e.target.value,
									},
								})
							}}
							value={surveyData?.client_info?.po_number}
						/>
					</div>
					<div className='column'>
						<label>Client's PO Number</label>
						<input
							type='text'
							placeholder='XXXXXXXXXX'
							onChange={e => {
								setSurveyData({
									...surveyData,
									client_info: {
										...surveyData?.client_info,
										client_po_number: e.target.value,
									},
								})
							}}
							value={surveyData?.client_info?.client_po_number}
						/>
					</div>
				</div>
			</div>

			{/* people working on project */}
			<div className='people_working_on_proj'>
				<div className='create_survey_left'>
					<p className='title'>People's working on this project.</p>
					<p className='desc'>
						Tell us about your team as well as client's team working
						on this project.
					</p>
				</div>
				<div className='create_survey_right'>
					<h2>Mirats Insights Team</h2>
					<div className='column'>
						<label>Lead Project Manager</label> <br />
						<Select
							onChange={e => {
								handleInputChange(
									e,
									"mirats_insights_team",
									"lead_project_managers"
								)
							}}
							styles={selectStyle}
							isMulti
							options={miratsoptions}
						/>
					</div>
					<div className='column'>
						<label>Sales Manager</label> <br />
						<Select
							onChange={e => {
								handleInputChange(
									e,
									"mirats_insights_team",
									"sales_managers"
								)
							}}
							styles={selectStyle}
							isMulti
							options={miratsoptions}
						/>
					</div>
					<div className='column'>
						<label>Account Manager</label> <br />
						<Select
							onChange={e => {
								handleInputChange(
									e,
									"mirats_insights_team",
									"account_managers"
								)
							}}
							styles={selectStyle}
							isMulti
							options={miratsoptions}
						/>
					</div>

					{/****** clients team info  */}
					<h2>{surveyData?.client_info?.client_name} Team</h2>
					<div className='column'>
						<label>Lead Project Manager</label> <br />
						<Select
							styles={selectStyle}
							isMulti
							options={clientInfo?.leadProjectManagers}
							onChange={e =>
								handleInputChange(
									e,
									"clients_team",
									"lead_project_managers"
								)
							}
						/>
					</div>
					<div className='column'>
						<label>Sales Manager</label> <br />
						<Select
							styles={selectStyle}
							isMulti
							options={clientInfo?.salesManagers}
							onChange={e =>
								handleInputChange(
									e,
									"clients_team",
									"sales_managers"
								)
							}
						/>
					</div>
					<div className='column'>
						<label>Account Manager</label> <br />
						<Select
							styles={selectStyle}
							isMulti
							options={clientInfo?.accountManagers}
							onChange={e =>
								handleInputChange(
									e,
									"clients_team",
									"account_managers"
								)
							}
						/>
					</div>
				</div>
			</div>

			<div className='next_btn_container'>
				{!insertLoading ? (
					<button onClick={insertPeoplesData} className='next_btn'>
						Finish
					</button>
				) : (
					<Loading
						type='spinner'
						size='lg'
						className='insert_loading'
					/>
				)}
			</div>
		</>
	)
}

export default Peoples

