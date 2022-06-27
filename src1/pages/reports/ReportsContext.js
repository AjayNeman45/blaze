import { createContext, useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getAllSessions, getSurvey } from "../../utils/firebaseQueries"

const reportsContext = createContext()
export const useReportsContext = () => {
	return useContext(reportsContext)
}

const ReportsContextProvider = ({ children }) => {
	const { surveyID } = useParams()
	const [statusesCnt, setStatusesCnt] = useState({})
	const [miratsStatusesCnt, setMiratsStatusesCnt] = useState({})
	const [survey, setSurvey] = useState({})
	const [alertCardData, setAlertCardData] = useState({})
	const [extIntSupplierData, setExtIntSupplierData] = useState({})
	const [clientCpiSum, setClientCpiSum] = useState(0)
	const [graphData, setGraphData] = useState()
	const [entrants, setEntrants] = useState({})

	const handleGraphData = (creationDate, status) => {
		setGraphData(prevData => {
			return {
				...prevData,
				[creationDate]: {
					...prevData?.[creationDate],
					[status]:
						(prevData?.[creationDate]?.[status]
							? prevData?.[creationDate]?.[status]
							: 0) + 1,
				},
			}
		})
	}

	useEffect(() => {
		let completionLOIsum = 0,
			terminationLOIsum = 0,
			client_cpi_sum = 0,
			overQuota = 0,
			hits = 0,
			securityTerm = 0,
			term = 0,
			completed = 0,
			inClientSurvey = 0,
			staticSessions = 0,
			inScreener = 0

		getSurvey(surveyID).then(data => {
			setSurvey(data)
			getAllSessions(surveyID).then(sessions => {
				let completesCnt1 = 0,
					completesCnt2 = 0
				let cpiCnt1 = 0,
					cpiCnt2 = 0
				let externalSupplersData = [],
					internalSuppliresData = []
				data?.external_suppliers?.map(supp => {
					sessions.forEach(session => {
						if (
							supp?.supplier_account_id ===
								session.data()?.supplier_account_id &&
							session.data()?.client_status === 10
						) {
							completesCnt1++
							cpiCnt1 += session.data()?.client_cpi
						}
					})
					externalSupplersData.push({
						supplier_name: supp?.supplier_account,
						completed: completesCnt1,
						avg_cpi:
							completesCnt1 === 0
								? (0).toFixed(2)
								: (cpiCnt1 / completesCnt1).toFixed(2),
					})
					completesCnt1 = 0
					cpiCnt1 = 0
				})

				data?.internal_suppliers?.map(supp => {
					sessions?.forEach(session => {
						if (
							supp?.supplier_account_id ===
								session.data()?.supplier_account_id &&
							session.data()?.client_status === 10
						) {
							completesCnt2++
							cpiCnt2 += session.data()?.client_cpi
						}
					})

					internalSuppliresData.push({
						supplier_name: supp?.supplier_account,
						completed: completesCnt2,
						avg_cpi:
							completesCnt2 === 0 ? 0 : cpiCnt2 / completesCnt2,
					})

					completesCnt2 = 0
					cpiCnt2 = 0
				})

				setExtIntSupplierData({
					externalSupplersData,
					internalSuppliresData,
				})
			})
		})

		getAllSessions(surveyID).then(sessions => {
			hits = sessions.docs.length

			sessions.forEach(session => {
				let monthNumber = session.data()?.date?.toDate()?.getMonth() + 1
				let status = session.data()?.client_status
				let miratsStatus = session.data()?.mirats_status
				let creationDate = session.data()?.date.toDate().toDateString()

				handleGraphData(creationDate, "entrants")

				// mirats status checks
				if (miratsStatus === 3) {
					inClientSurvey++
					handleGraphData(creationDate, "prescreens")
				} else if (miratsStatus === 0) {
					staticSessions++
				} else if (miratsStatus === 1) {
					inScreener++
				}
				//client status checks
				if (status === 40) {
					overQuota += 1
				} else if (status === 30) {
					securityTerm += 1
				} else if (status === 20) {
					terminationLOIsum += parseInt(
						session.data()?.total_survey_time.split(":")[1]
					)
					term += 1
				} else if (status === 10) {
					completionLOIsum += parseInt(
						session.data()?.total_survey_time.split(":")[1]
					)
					client_cpi_sum += parseInt(session.data()?.client_cpi)
					completed += 1
					handleGraphData(creationDate, "completed")
				}
			})

			setMiratsStatusesCnt({
				in_client_survey: inClientSurvey,
				static: staticSessions,
				inScreener,
				hits,
			})
			setStatusesCnt({ overQuota, completed, term, securityTerm, hits })

			setClientCpiSum(client_cpi_sum)
			setAlertCardData({
				totalTimeForCompletedSessions: completionLOIsum,
				totalTimeForTerminatedSessions: terminationLOIsum,
			})
		})
	}, [surveyID])

	const value = {
		survey,
		statusesCnt,
		alertCardData,
		miratsStatusesCnt,
		extIntSupplierData,
		clientCpiSum,
		graphData,
	}
	return (
		<reportsContext.Provider value={value}>
			{children}
		</reportsContext.Provider>
	)
}

export default ReportsContextProvider

