import { collection, getDocs, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { db } from "../../firebase"
import { getAllSessions, getSurvey } from "../../utils/firebaseQueries"
// import XLSX from "xlsx"
import styles from "./Reconciliations.module.css"
import { ReconciliationTable } from "./Reconciliations"
import { v4 as uuid } from "uuid"
import { utils, writeFile } from "xlsx"
import cx from "classnames"

export const statusData = [
	{
		name: "all",
		label: "All",
		default_checked: true,
		code: 1,
	},
	{
		name: "completed",
		label: "Completed",
		code: 2,
	},
	{
		name: "over-quota",
		label: "Over Quota",
		code: 5,
	},
	{
		name: "terminated",
		label: "Terminated",
		code: 23,
	},
	{
		name: "in-client-survey",
		label: "In Client Survey",
		code: 3,
	},
]

const DataAnalysis = () => {
	const { surveyID } = useParams()
	const [sessions, setSessions] = useState([])
	const [sessionsCopy, setSessionsCopy] = useState([])
	const [filterByStatus, setFilterByStatus] = useState([])
	const [showTable, setShowTable] = useState(false)
	//   const [surveyID, setSurveyID] = useState("");
	const [surveyName, setSurveyName] = useState("")
	const [fromDate, setFromDate] = useState()
	const [endDate, setEndDate] = useState()
	const [checkedStatus, setCheckedStatus] = useState([1])
	const [msg, setMsg] = useState("")
	const { projectId } = useParams()
	const gamma = localStorage.getItem("gamma")

	// fetching all the sessions of the project
	useEffect(() => {
		var dt = new Date()
		dt.setDate(dt.getDate() + 29)
		setFromDate(new Date().toISOString().substring(0, 10))
		setFromDate(new Date().toISOString().substring(0, 10))
		setEndDate(dt.toISOString().substring(0, 10))

		setEndDate(dt.toISOString().substring(0, 10))

		const func = async () => {
			try {
				const survey = await getSurvey(surveyID)
				console.log(survey)
				const allSessions = await getAllSessions(surveyID, gamma)
				allSessions.forEach(session => {
					setSessions(oldData => [
						...oldData,
						{
							session_data: session.data(),
							survey_id: survey.survey_id,
							survey_name: survey.survey_name,
						},
					])
					setSessionsCopy(oldData => [
						...oldData,
						{
							session_data: session.data(),
							survey_id: survey.survey_id,
							survey_name: survey.survey_name,
						},
					])
				})
			} catch (err) {
				console.log(err)
			}
		}
		func()
	}, [])

	// console.log(sessionsCopy)

	// handles status change function
	const handleStatusClick = (e, code) => {
		console.log(code)
		if (checkedStatus.includes(code)) {
			setCheckedStatus(() => checkedStatus.filter(c => c !== code))
		} else {
			setCheckedStatus([...checkedStatus, code])
		}
	}

	// handles show table btn
	const handleShowTable = () => {
		setSessionsCopy([])

		let from_d = new Date(fromDate)
		let end_d = new Date(endDate)
		// console.log(from_d, end_d)
		if (from_d != "Invalid Date" && end_d != "Invalid Date") setMsg("")
		else {
			setMsg("Select field date to filter")
			setShowTable(false)
			return
		}
		setSessionsCopy(() => {
			let temp = []
			sessions.map(session => {
				if (
					new Date(session?.session_data?.date?.toDate()).valueOf() >=
						from_d.valueOf() &&
					new Date(session?.session_data?.date?.toDate()).valueOf() <=
						end_d.valueOf()
				) {
					setShowTable(true)
					if (checkedStatus.includes(1)) temp.push(session)
					else if (!checkedStatus.length) temp.push(session)
					else if (
						checkedStatus.includes(
							session?.session_data?.mirats_status
						)
					) {
						console.log("for other status")
						temp.push(session)
					}
				}
			})
			return temp
		})
	}
	// handles Download To Excel btn
	const DownloadToExcel = () => {
		console.log("download excel function called")
		var elt = document.getElementById("table-to-xls")
		var wb = utils.table_to_book(elt, { sheet: "Sheet JS" })
		return writeFile(wb, `DataAnalysis_${surveyID}_${surveyName}.xlsx`)
	}

	return (
		// <></>
		<>
			<div className={styles.data_analysis_section}>
				<div className={styles.filter_by_field_Date}>
					<span className={styles.legend}>Field Dates</span>
					<br />
					<input
						type='date'
						value={fromDate}
						onChange={e => setFromDate(e.target.value)}
						placeholder='from'
						className={styles.date_input}
					/>
					<input
						type='date'
						value={endDate}
						onChange={e => setEndDate(e.target.value)}
						placeholder='to'
						className={styles.date_input}
					/>
				</div>
				<br />
				<div className={styles.filter_by_status}>
					{statusData?.map(st => {
						return (
							<div key={uuid()}>
								<span
									className={
										checkedStatus.includes(st.code)
											? cx(
													styles.active_status,
													styles.status
											  )
											: styles.status
									}
									onClick={e =>
										handleStatusClick(e, st?.code)
									}
								>
									{st.label}
								</span>
							</div>
						)
					})}
				</div>
				{msg.length ? (
					<p
						style={{
							textAlign: "center",
							color: "red",
						}}
					>
						{msg}
					</p>
				) : null}
				<div className={styles.btns}>
					<button type='button' onClick={DownloadToExcel}>
						Export To Excel
					</button>
					<button onClick={handleShowTable}>Show Table</button>
				</div>
			</div>
			<br />
			<div className={styles.data_analysis_table}>
				<ReconciliationTable
					sessionsCopy={sessionsCopy}
					showTable={showTable}
				/>
			</div>
		</>
	)
}
export default DataAnalysis
