import { Loading } from "@nextui-org/react"
import { useEffect } from "react"
import { useCreateNewProject } from "./CreateNewProjectContext"

const MetricsAndData = () => {
	const { surveyData, setSurveyData, metricsData, insertLoading } =
		useCreateNewProject()
	return (
		<>
			<div className='metrics_and_data'>
				<div className='create_survey_left'>
					<p className='title'>Expected Metrics & Data</p>
					<p className='desc'>
						Fill in to inform suppliers of your survey before
						receiving traffic. Review in-field surveyData when
						survey is live!
					</p>
				</div>
				<div className='create_survey_right'>
					<div>
						<label>
							Expected Incidence Rate <span>*</span>
						</label>
						<input
							type='text'
							className='text_input'
							value={surveyData?.expected_incidence_rate}
							onChange={e =>
								setSurveyData({
									...surveyData,
									expected_incidence_rate: e.target.value,
								})
							}
						/>
					</div>
					<div>
						<label>
							Expected Completion LOI <span>*</span>
						</label>
						<input
							type='text'
							className='text_input'
							value={surveyData?.exected_completion_loi}
							onChange={e =>
								setSurveyData({
									...surveyData,
									expected_completion_loi: e.target.value,
								})
							}
						/>
					</div>
				</div>
			</div>
			<hr />
			<div className='internal_status'>
				<div className='create_survey_left'>
					<p className='title'>Internal Status</p>
					<p className='desc'>
						Fill in to inform suppliers of your survey before
						receiving traffic. Review in-field surveyData when
						survey is live!
					</p>
				</div>
				<div className='create_survey_right'>
					<div>
						<label>Status</label>
						<input
							type='text'
							className='text_input'
							value='Bidding'
							disabled={true}
						/>
					</div>
					<div>
						<label>
							Internal Status <span>*</span>
						</label>
						<select
							onChange={e =>
								setSurveyData({
									...surveyData,
									internal_status: e.target.value,
								})
							}
							defaultValue='ongoing'
						>
							<option value='ongoing'>ongoing</option>
							<option value='lead'>lead</option>
							<option value='won'>won</option>
							<option value='lost'>lost</option>
						</select>
					</div>
				</div>
			</div>
			<div className='next_btn_container'>
				{!insertLoading ? (
					<button onClick={metricsData} className='next_btn'>
						Next
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

export default MetricsAndData
