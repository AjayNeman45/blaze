import React, { useEffect, useState } from "react"
import styles from "./Reports.module.css"
import Header from "../../components/header/Header"
import Subheader from "../../components/subheader/Subheader"
import { LinearProgress } from "@mui/material"
import { Box } from "@mui/system"
import { AiOutlineCheck } from "react-icons/ai"
import { RiFullscreenExitFill, RiAncientGateLine } from "react-icons/ri"
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js"
import { Bar } from "react-chartjs-2"
import SurveyInfo from "../../components/survey-info/SurveyInfo"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import ExternalSupplier from "../../components/miratsExternalSupplier/ExternalSupplier"
import { useReportsContext } from "./ReportsContext"
import "chartjs-adapter-moment"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

function LinearProgressWithLabel(props) {
	return (
		<Box sx={{ display: "flex", alignItems: "center" }}>
			<Box sx={{ width: "100%" }}>
				<LinearProgress
					variant='determinate'
					{...props}
					style={{
						height: `${props.height}px`,
						borderRadius: "20px",
						backgroundColor: "#ecebeb",
					}}
				/>
			</Box>
		</Box>
	)
}

const clientStatusesData = [
	{
		title: "In Client Survey",
		value: "in_client_survey",
		statusCode: 3,
		desc: "Currently in current survey or 	",
	},
	{
		title: "Completed",
		value: "completed",
		statusCode: 10,
		desc: "Survey Completed by User",
	},
	{
		title: "Terminated",
		value: "term",
		statusCode: 20,
		desc: "Survey terminated at client side",
	},
]

const miratsStatusesData = [
	{
		title: "In Client Survey",
		value: "in_client_survey",
		statusCode: 3,
		desc: "Currently in current survey or drop",
	},
	{
		title: "Static",
		value: "static",
		statusCode: 0,
		desc: "Did not answer a question",
	},
	{
		title: "In Screener",
		value: "inScreener",
		statusCode: 1,
		desc: "Currently in screener or drop",
	},
]

const Reports = () => {
	const {
		survey,
		statusesCnt,
		miratsStatusesCnt,
		alertCardData,
		extIntSupplierData,
		clientCpiSum,
	} = useReportsContext()

	return (
		<>
			<Header />
			<Subheader />
			<div className={styles.reports_page}>
				<SurveyInfo />
				<div className={styles.main}>
					<div className={styles.left}>
						{/* respondent activity  */}
						<RespondantActivity />
						<div style={{ margin: "1rem 0 0 1rem" }}>
							<Grid container spacing={2} alignItems='flex-end'>
								<Grid itme xs={7}>
									<AlertCard
										title='Length of Interview'
										subtitle='completion loi'
										count={
											statusesCnt?.completed
												? (
														alertCardData?.totalTimeForCompletedSessions /
														statusesCnt?.completed
												  ).toFixed(0)
												: 0
										}
										unit='min'
										expectedCount={
											survey?.expected_completion_loi
										}
									/>
								</Grid>
								<Grid item xs={5}>
									<AlertCard
										title='Term LOI'
										subtitle='termination loi'
										count={
											statusesCnt?.completed
												? (
														alertCardData?.totalTimeForTerminatedSessions /
														statusesCnt?.completed
												  ).toFixed(0)
												: 0
										}
										unit='min'
										expectedCount={(
											(10 / 100) *
											survey?.expected_completion_loi
										).toFixed(0)}
										alertMsg={"alert: HIGH LOI"}
									/>
								</Grid>
							</Grid>

							<div className={styles.container2}>
								<div>
									<AlertCard
										title='Incidence'
										subtitle='incidence rate'
										count={
											statusesCnt?.completed
												? (
														(statusesCnt?.completed /
															miratsStatusesCnt?.in_client_survey) *
														100
												  ).toFixed(2)
												: 0
										}
										unit='%'
										expectedCount={
											survey?.expected_incidence_rate
										}
										alertMsg={"alert: LOW"}
									/>
								</div>
								<div>
									<AlertCard
										title='Drop-off'
										subtitle='drop-off rate'
										count={20}
										unit='%'
										expectedCount={20}
										alertMsg='No alerts'
									/>
								</div>
								<div>
									<AlertCard
										title='quota rate'
										subtitle='quota rate'
										count={
											statusesCnt?.overQuota
												? (
														(statusesCnt?.overQuota *
															100) /
														miratsStatusesCnt?.in_client_survey
												  ).toFixed(2)
												: 0
										}
										unit='%'
										expectedCount={20}
										alertMsg={"alert: LOW"}
									/>
								</div>
							</div>
						</div>
					</div>

					<div className={styles.right}>
						<div className={styles.client_statuses_card}>
							<StatusCard
								cardTitle='Client Statuses'
								cardData={clientStatusesData}
								statusesCnt={statusesCnt}
								inClientCnt={
									miratsStatusesCnt?.in_client_survey
								}
							/>
						</div>
						<div className={styles.mirats_internal_statuses_card}>
							<StatusCard
								cardTitle='mirats statuses'
								cardData={miratsStatusesData}
								statusesCnt={miratsStatusesCnt}
								inClientCnt={
									miratsStatusesCnt?.in_client_survey
								}
							/>
						</div>
						<div className={styles.total_survey_cost_card}>
							<span className={styles.legend}>
								Total Survey Cost
							</span>
							<span className={styles.value}>
								${" "}
								{(
									clientCpiSum / statusesCnt?.completed
								).toFixed(2)}
							</span>
						</div>
					</div>
				</div>

				<div className={styles.externalsuppliercontainer}>
					<div>
						<ExternalSupplier
							tableTitle='mirats external supplier completes'
							data={extIntSupplierData?.externalSupplersData}
						/>
					</div>
					<div>
						<ExternalSupplier
							tableTitle='mirats internal supplier completes'
							data={extIntSupplierData?.internalSuppliresData}
						/>
					</div>
				</div>
			</div>
		</>
	)
}

const RespondantActivity = () => {
	const [entrants, setEntrants] = useState(false)
	const [prescreens, setPrescreens] = useState(false)
	const [completes, setCompletes] = useState(false)
	const [labels, setLabels] = useState([])
	const [barData, setBarData] = useState({
		entrants: [],
		prescreens: [],
		completed: [],
	})

	const { graphData, statusesCnt, miratsStatusesCnt } = useReportsContext()

	useEffect(() => {
		if (graphData) {
			setLabels([])
			setBarData({ entrants: [], prescreens: [], completed: [] })
			Object?.keys(graphData)?.map(key => {
				setLabels(prevData => [...prevData, key])
				setBarData(prevData => {
					return {
						...prevData,
						entrants: [
							...prevData?.entrants,
							graphData?.[key]?.entrants
								? graphData?.[key]?.entrants
								: 0,
						],
						prescreens: [
							...prevData?.prescreens,
							graphData?.[key]?.prescreens
								? graphData?.[key]?.prescreens
								: 0,
						],
						completed: [
							...prevData?.completed,
							graphData?.[key]?.completed
								? graphData?.[key]?.completed
								: 0,
						],
					}
				})
			})
		}
	}, [graphData])

	const options = {
		responsive: true,
		plugins: {
			legend: {
				display: false,
			},
			title: {
				display: false,
			},
		},
	}

	const data = {
		labels,
		datasets: [
			{
				label: "Entrants",
				data: entrants ? barData?.entrants?.map(data => data) : [],
				backgroundColor: "#f7b438",
				barThickness: 20,
			},
			{
				label: "Prescreens",
				data: prescreens ? barData?.prescreens?.map(data => data) : [],
				backgroundColor: "rgb(127, 133, 255)",
				barThickness: 20,
			},
			{
				label: "Completes",
				data: completes ? barData?.completed?.map(data => data) : [],
				barThickness: 20,
				backgroundColor: "rgb(21, 222, 147)",
			},
		],
	}

	return (
		<div className={styles.respondant_activity}>
			<p className={styles.legend}>Respondant Activity</p>

			<div className={styles.head}>
				<div
					style={{ borderBottom: entrants && "5px solid orange" }}
					className={styles.entrants}
					onClick={() => setEntrants(!entrants)}
				>
					<div className={styles.title}>
						<RiAncientGateLine size={24} />
						<span>entrants</span>
					</div>

					<span className={styles.value}>{statusesCnt?.hits}</span>
				</div>
				<div
					style={{
						borderBottom:
							prescreens && "5px solid rgb(127, 133, 255)",
					}}
					onClick={() => setPrescreens(!prescreens)}
					className={styles.prescreens}
				>
					<div className={styles.title}>
						<RiFullscreenExitFill size={24} />
						<span>prescreens</span>
					</div>
					<span className={styles.value}>
						{miratsStatusesCnt?.in_client_survey}
					</span>
				</div>
				<div
					className={styles.completes}
					style={{
						borderBottom:
							completes && "5px solid rgb(21, 222, 147)",
					}}
					onClick={() => setCompletes(!completes)}
				>
					<div className={styles.title}>
						<AiOutlineCheck size={24} />
						<span>completes</span>
					</div>
					<span className={styles.value}>
						{statusesCnt?.completed}
					</span>
				</div>
			</div>
			<Bar options={options} data={data} height={100} />
		</div>
	)
}

const AlertCard = ({ title, subtitle, count, unit, expectedCount }) => {
	return (
		<div className={styles.alert_card}>
			<p className={styles.legend}>{title}</p>
			<div className={styles.main_boby}>
				<p className={styles.subtitle}>{subtitle}</p>
				<div className={styles.cnt_and_alert_container}>
					<p className={styles.count_and_unit}>
						{count} {unit}
					</p>
					<p className={styles.alert_msg}>
						{(count === expectedCount && "No Alerts") ||
							(count > expectedCount && "alert: HIGH") ||
							(count < expectedCount && "alert: LOW")}
					</p>
				</div>
				<div>
					<LinearProgressWithLabel
						value={
							count > expectedCount
								? 100
								: (count * 100) / expectedCount
						}
					/>
				</div>
				<p className={styles.expected_count}>
					expected : {expectedCount} {unit}
				</p>
			</div>
		</div>
	)
}

const StatusCard = ({ cardTitle, cardData, inClientCnt, statusesCnt }) => {
	return (
		<div className={styles.clientStatus_conatiner}>
			<h4>{cardTitle}</h4>
			{cardData?.map(data => {
				return (
					<>
						<div className={styles.clientStatus_title}>
							<div className={styles.clientStatus_div}>
								<h3>{data?.title}</h3>
							</div>
							<p>{data?.statusCode}</p>
						</div>

						<div className={styles.clientStatus_progressDiv}>
							<p>
								{data?.desc}
								<span>
									{data?.value === "in_client_survey"
										? inClientCnt
										: statusesCnt?.[data?.value]}
								</span>
							</p>
							<div className={styles.clientStatus_progressBar}>
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
									}}
								>
									<Box sx={{ width: "100%", mr: 1 }}>
										<LinearProgress
											variant='determinate'
											value={
												data?.value ===
												"in_client_survey"
													? (
															(inClientCnt *
																100) /
															statusesCnt?.hits
													  ).toFixed(2)
													: (
															(statusesCnt?.[
																data?.value
															] *
																100) /
															statusesCnt?.hits
													  ).toFixed(2)
											}
										/>
									</Box>
									<Box sx={{ minWidth: 35 }}>
										<Typography
											variant='body2'
											color='text.secondary'
										>
											{data?.value === "in_client_survey"
												? (
														(inClientCnt * 100) /
														statusesCnt?.hits
												  ).toFixed(2)
												: (
														(statusesCnt?.[
															data?.value
														] *
															100) /
														statusesCnt?.hits
												  ).toFixed(2)}
											%
										</Typography>
									</Box>
								</Box>
							</div>
						</div>
					</>
				)
			})}
		</div>
	)
}

export default Reports

