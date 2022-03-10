import React, { useState } from "react"
import styles from "./Reconciliations.module.css"
import { statusData } from "./DataAnalysis"
import { v4 as uuid } from "uuid"
import { utils, writeFile } from "xlsx"
import cx from "classnames"
import { useParams } from "react-router-dom"
import { ReconciliationTable } from "./Reconciliations"

const RespondantAnswer = () => {
	const { surveyID } = useParams()

	const [checkedStatus, setCheckedStatus] = useState([1])
	const [sessions, setSessions] = useState([])
	const [sessionsCopy, setSessionsCopy] = useState([])
	const [showTable, setShowTable] = useState(false)
	const [surveyName, setSurveyName] = useState("")
	const [fromDate, setFromDate] = useState()
	const [endDate, setEndDate] = useState()
	const [msg, setMsg] = useState("")

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
			console.log("here in sessions copy")
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

	console.log(checkedStatus, statusData)

	return (
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

export default RespondantAnswer
