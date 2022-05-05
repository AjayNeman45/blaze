import { createContext, useContext, useEffect, useState } from "react"
import {
	addSurveyGroup,
	getAllSurveyGroups,
	getAllSurveys,
	updateSurvey,
} from "../../utils/firebaseQueries"

const SurveyGroupContext = createContext()

export const useSurveyGroupContext = () => {
	return useContext(SurveyGroupContext)
}

const SurveyGroupContextProvider = ({ children }) => {
	const [surveyIdsOptions, setSurveyIdsOptions] = useState([])
	const [surveyGrpData, setSurveyGrpData] = useState({})
	const [addSurveyGrpModal, setAddSurveyGroupModal] = useState(false)
	const [snackbarData, setSnackbarData] = useState({ show: false })
	const [surveyGrps, setSurveyGrps] = useState([])

	const handleCloseSnackbar = () => {
		setSnackbarData(prevData => {
			return {
				...prevData,
				show: false,
			}
		})
	}
	useEffect(() => {
		getAllSurveys().then(surveys => {
			let surveyIDsOptions = []
			surveys?.forEach(survey => {
				surveyIDsOptions.push({
					label: survey.data()?.survey_id,
					value: survey.data()?.survey_id,
				})
			})
			setSurveyIdsOptions(surveyIDsOptions)
		})

		getAllSurveyGroups().then(groups => {
			let surveyGrps = []
			groups.forEach(group => {
				surveyGrps.push(group.data())
			})
			setSurveyGrps(surveyGrps)
		})
	}, [])

	const insertSurveyGrpData = async () => {
		setAddSurveyGroupModal(false)
		try {
			const q = await addSurveyGroup(surveyGrpData)
			surveyGrpData?.surveys?.map(surveyID => {
				setSnackbarData({
					show: true,
					msg: "survey group created successfully...",
					severity: "success",
				})
				console.log(surveyID)
				updateSurvey(surveyID, {
					survey_group: surveyGrpData?.survey_group_number,
				})
					.then(() => console.log("survey group number updated"))
					.catch(err => console.log(err.message))
			})
			console.log("survey group created")
		} catch (err) {
			setSnackbarData({
				show: true,
				msg: "Oops! something went wrong, try again.",
				severity: "error",
			})
		}
	}

	useEffect(() => {
		if (!addSurveyGrpModal) setSurveyGrpData({})
	}, [addSurveyGrpModal])

	const value = {
		surveyIdsOptions,
		setSurveyGrpData,
		surveyGrpData,
		insertSurveyGrpData,
		addSurveyGrpModal,
		setAddSurveyGroupModal,
		snackbarData,
		handleCloseSnackbar,
		surveyGrps,
	}
	return (
		<SurveyGroupContext.Provider value={value}>
			{children}
		</SurveyGroupContext.Provider>
	)
}

export default SurveyGroupContextProvider
