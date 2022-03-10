import { Loading } from "@nextui-org/react"
import { useEffect } from "react"
import { useState } from "react"
import { InputHelperCard } from "./CreateNewProject"
import { useCreateNewProject } from "./CreateNewProjectContext"

const SetUpRequirments = () => {
	const [collectUserData, setCollectUserData] = useState("no")
	const {
		surveyData,
		setSurveyData,
		insertSetupRequirementData,
		insertLoading,
	} = useCreateNewProject()
	console.log(surveyData)

	useEffect(() => {
		setSurveyData({
			...surveyData,
			collect_user_data: collectUserData === "yes" ? true : false,
		})
	}, [collectUserData])

	return (
		<>
			<div className='setup_requirment_info'>
				<div className='create_survey_left'>
					<p className='title'>Setup Requirments</p>
					<p className='subtitle'>
						Complete this information to set your survey live.
					</p>
					<InputHelperCard />
				</div>
				<div className='create_survey_right'>
					<div>
						<label>
							Study Type <span>*</span>
						</label>
						<select
							value={surveyData?.study_type}
							onChange={e =>
								setSurveyData({
									...surveyData,
									study_type: e.target.value,
								})
							}
						>
							<option value='--'>--</option>
							<option value='adhoc'>Adhoc</option>
						</select>
					</div>
					<div>
						<label>
							Business unit <span>*</span>
						</label>
						<select
							value={surveyData?.business_unit}
							onChange={e =>
								setSurveyData({
									...surveyData,
									business_unit: e.target.value,
								})
							}
						>
							<option value='--'>--</option>
							<option value='mirats-api'>MIRATS-API</option>
						</select>
					</div>
					<div>
						<label>
							Industry <span>*</span>
						</label>
						<select
							value={surveyData?.industry}
							onChange={e =>
								setSurveyData({
									...surveyData,
									industry: e.target.value,
								})
							}
						>
							<option value='--'>--</option>
							<option value='other'>Other</option>
						</select>
					</div>
					<div className='create_survey_right'>
						<label>
							Does your survey collect personal information that
							can be used to identify an individual?
						</label>
						<div className='radio_btns'>
							<div className='radio_btn'>
								<input
									type='radio'
									name='preexist'
									value='yes'
									checked={collectUserData == "yes"}
									onChange={e =>
										setCollectUserData(e.target.value)
									}
									id='yes'
								/>
								<span for='yes'>Yes</span>
							</div>
							<div className='radio_btn'>
								<input
									type='radio'
									name='preexist'
									value='no'
									checked={collectUserData == "no"}
									onChange={e =>
										setCollectUserData(e.target.value)
									}
									id='no'
								/>
								<span for='no'>No</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className='next_btn_container'>
				{!insertLoading ? (
					<button
						onClick={insertSetupRequirementData}
						className='next_btn'
					>
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

export default SetUpRequirments
