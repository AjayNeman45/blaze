import React, { useEffect, useState } from "react"
import Header from "../../components/header/Header"
import styles from "./SurveyGroups.module.css"
import { v4 as uuid } from "uuid"
import CreateSurveyGroupModal from "./CreateSurveyGroup/CreateSurveyGroupModal"
import { useSurveyGroupContext } from "./SurveyGroupContext"
import SnackbarMsg from "../../components/Snackbar"
import { useHistory } from "react-router-dom"

const surveyGroups = [
	{
		survey_group_name: "Amazing Follows",
		survey_group_number: 129330900,
		number_of_surveys: 4,
		status: true,
		description: "",
		survey_group_id: 9237498,
	},
	{
		survey_group_name: "Amazing Follows",
		survey_group_number: 129330900,
		number_of_surveys: 4,
		status: true,
		description: "",
		survey_group_id: 9237498,
	},
	{
		survey_group_name: "Amazing Follows",
		survey_group_number: 129330900,
		number_of_surveys: 4,
		status: true,
		description: "",
		survey_group_id: 9237498,
	},
]

const SurveyGroups = () => {
	const {
		addSurveyGrpModal,
		setAddSurveyGroupModal,
		snackbarData,
		handleCloseSnackbar,
		surveyGrps,
	} = useSurveyGroupContext()

	const history = useHistory()

	return (
		<>
			<SnackbarMsg
				open={snackbarData?.show}
				msg={snackbarData?.msg}
				severity={snackbarData?.severity}
				handleClose={handleCloseSnackbar}
			/>

			{/* add survey group modal  */}
			<CreateSurveyGroupModal
				openModal={addSurveyGrpModal}
				setOpenModal={setAddSurveyGroupModal}
			/>
			<Header />
			<div className={styles.survey_groups_page}>
				<div className={styles.header_container}>
					<div className={styles.header_container_left}>
						<p className={styles.page_title}>survey groups</p>
					</div>
					<div className={styles.header_container_right}>
						<button onClick={() => setAddSurveyGroupModal(true)}>
							Add Survey Groups
						</button>
						<input
							type='search'
							placeholder='search survey groups'
						/>
					</div>
				</div>

				<div
					style={{ overflowX: "auto", marginTop: "2rem" }}
					className={styles.project_table_div}
				>
					<table
						className={styles.survey_grp_table}
						id='survey_grp_table'
					>
						<thead style={{ width: "100%" }}>
							<tr className={styles.cell_large}>
								<th>
									Name
									<p className='headingDescription'>
										Survey Group Number
									</p>
								</th>
								<th>No of Surveys Included</th>
								<th>survey included</th>
								<th>Description</th>
								<th>SurveyGroup ID</th>
							</tr>
						</thead>
						<tbody>
							{surveyGrps?.map(sg => {
								return (
									<tr key={uuid()}>
										<td className={styles.first_column}>
											<input type='checkbox' />
											<div>
												<p
													className={
														styles.survey_grp_name
													}
												>
													{sg?.survey_group_name}
												</p>
												<span>
													#{sg?.survey_group_number}
												</span>
												<sapn
													className={
														sg?.survey_group_status
															? styles.active_survey_grp_status
															: styles.inactive_survey_grp_status
													}
												>
													{sg?.survey_group_status
														? "Active"
														: "Inactive"}
												</sapn>
											</div>
										</td>
										<td>{sg?.surveys?.length}</td>
										<td>
											{[...sg?.surveys.slice(0, 2)].map(
												surveyID => (
													<span
														className={
															styles.surveys_included_box
														}
														onClick={() =>
															history.push(
																`/surveys/dashboard/${surveyID}`
															)
														}
													>
														{surveyID}
													</span>
												)
											)}
											{sg?.surveys?.length > 3 && (
												<span>more...</span>
											)}
										</td>
										<td>
											<p className={styles.description}>
												{sg?.description}
											</p>
										</td>
										<td>{sg?.survey_group_id}</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				</div>
			</div>
		</>
	)
}

export default SurveyGroups

