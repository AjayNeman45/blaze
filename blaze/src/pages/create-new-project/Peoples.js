import { Loading } from "@nextui-org/react"
import { useCreateNewProject } from "./CreateNewProjectContext"

const Peoples = () => {
	const { surveyData, setSurveyData, insertPeoplesData, insertLoading } =
		useCreateNewProject()

	return (
		<>
			<div className='peoples_info'>
				<div className='create_survey_left'>
					<p className='title'>People</p>
					<p className='desc'>
						Manage ownership of the survey for reporting and
						communication.
					</p>
				</div>
				<div className='create_survey_right'>
					<div>
						<label>Project Manager</label>
						<select
							value={surveyData?.project_manager}
							onChange={e =>
								setSurveyData({
									...surveyData,
									project_manager: e.target.value,
								})
							}
						>
							<option value='--'>--</option>
							<option value='unassigned'>Unassigned</option>
						</select>
					</div>
					<div>
						<label>Account Executive</label>
						<select
							value={surveyData?.account_executive}
							onChange={e =>
								setSurveyData({
									...surveyData,
									account_executive: e.target.value,
								})
							}
						>
							<option value='--'>--</option>
							<option value='unassigned'>Unassigned</option>
						</select>
					</div>
					<div>
						<label>Alternate Project Manager</label>
						<select
							value={surveyData?.altername_project_manager}
							onChange={e =>
								setSurveyData({
									...surveyData,
									alternate_project_manager: e.target.value,
								})
							}
						>
							<option value='--'>--</option>
							<option value='unassigned'>Unassigned</option>
						</select>
					</div>
				</div>
			</div>
			<div className='next_btn_container'>
				{!insertLoading ? (
					<button onClick={insertPeoplesData} className='next_btn'>
						Create Project
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
