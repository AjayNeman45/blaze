import React, { useEffect, useState } from "react"
import { Menu, MenuItem, Select } from "@mui/material"
import styles from "./ProjectInfo.module.css"

const options = [
	"Archieved",
	"Awarded",
	"Bidding",
	"Canceled Non chagred",
	"Canceled with charge",
	"complete",
	"Live",
	"paid",
	"pending",
	"ready to invoice",
	"Invoiced",
	"Titania",
	"Triton",
	"Umbriel",
]

const ProjectInfo = ({ surveyStatus }) => {
	const [anchorEl, setAnchorEl] = useState(null)
	const [status, setStatus] = useState(null)

	const handleClose = e => {
		setAnchorEl(null)
	}
	useEffect(() => {
		if (surveyStatus) setStatus(surveyStatus)
	}, [surveyStatus])

	return (
		<>
			<div className={styles.head}>
				<div className={styles.head_left}>
					<div className={styles.project_number}>
						<span>IRB 2201007 - PH - [MA] - MIRATS5241</span>
					</div>

					<div className={styles.project_name}>
						<span>project</span>
						<span> MIRATS5241</span>
					</div>
					<div className={styles.survey_number}>
						<span>survey number</span>
						<span>16908590</span>
					</div>
				</div>
				<div className={styles.head_right}>
					<Select
						value={status}
						onChange={e => setStatus(e.target.value)}
						displayEmpty
						inputProps={{ "aria-label": "Without label" }}
						className={styles.status_select_field}
					>
						{options.map(option => (
							<MenuItem
								key={option}
								onClick={handleClose}
								value={option}
							>
								{option}
							</MenuItem>
						))}
					</Select>
					<button className={styles.fielding_assistant_btn}>
						Fielding Assistant
					</button>
					<select className={styles.action_select_field}>
						<option>Test Survey</option>
						<option>Clone Survey</option>
						<option>Set External Name</option>
					</select>
				</div>
			</div>
		</>
	)
}

export default ProjectInfo
