import React, { useState } from "react"
import styles from "./Reports.module.css"
import Header from "../../components/header/Header"
import Subheader from "../../components/subheader/Subheader"
import ProjectInfo from "../../components/project-info/ProjectInfo"
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	LinearProgress,
	MenuItem,
	Select,
	Typography,
} from "@mui/material"
import { Box } from "@mui/system"
import { HiOutlineDocumentReport } from "react-icons/hi"
import { AiOutlineInfoCircle, AiOutlineCheck } from "react-icons/ai"
import { BiChevronDown, BiInfoCircle } from "react-icons/bi"
import {
	RiUserFollowLine,
	RiTimerLine,
	RiFullscreenExitFill,
	RiAncientGateLine,
} from "react-icons/ri"
import { GrNavigate } from "react-icons/gr"
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
// import faker from "faker"

function LinearProgressWithLabel(props) {
	return (
		<Box sx={{ display: "flex", alignItems: "center" }}>
			{props.mainProgressBar && (
				<Typography
					variant='body2'
					sx={{ mr: 2 }}
					color='text.secondary'
				>
					Progress
				</Typography>
			)}

			<Box sx={{ width: "100vw" }}>
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
			<Box sx={{ minWidth: 35 }}>
				<Typography variant='body2' color='text.secondary'>
					{`${Math.round(props.value)}%`}
				</Typography>
			</Box>
		</Box>
	)
}

const Reports = () => {
	return (
		<>
			<Header />
			<Subheader />
			<div className={styles.reports_page}>
				<ProjectInfo />
				<div style={{ margin: "2rem" }}>
					<LinearProgressWithLabel
						value={10}
						height={7}
						mainProgressBar={true}
					/>
				</div>
				<div className={styles.container}>
					<div className={styles.left}>
						<input type='date' />
						<button>
							<HiOutlineDocumentReport />
							Get Reports
						</button>
					</div>
					<div className={styles.right}>
						<div className={styles.first_complete}>
							<label>first complete</label>
							<br />
							<span>-</span>
						</div>
						<div className={styles.last_complete}>
							<label>last complete</label>
							<br />
							<span>-</span>
						</div>
						<div className={styles.avg_cpi_epc}>
							<span>
								AVG. CPI <br />
								<b>0.50 USD</b>
							</span>
							<span>
								EPC <br />
								<b>0.00 USD</b>
							</span>
						</div>
					</div>
				</div>

				<div className={styles.main}>
					<div className={styles.left}>
						{/* respondent activity  */}
						<RespondantActivity />
						{/* Rates */}
						<Rates />
						{/* length of interview  */}
						<LengthOfInterview />
					</div>

					<div className={styles.right}>
						{/* data analysis  */}
						<DataAnalysis />
					</div>
				</div>
			</div>
		</>
	)
}

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const RespondantActivity = () => {
	const [entrants, setEntrants] = useState(false)
	const [prescreens, setPrescreens] = useState(false)
	const [completes, setCompletes] = useState(false)

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

	const labels = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
	]
	const Entrants = entrants ? [39, 47, 26, 36, 59, 10, 30] : []
	const Prescreens = prescreens ? [50, 50, 50, 60, 30, 70, 40] : []
	const Completes = completes ? [40, 30, 10, 80, 40, 65, 67] : []

	const data = {
		labels,
		datasets: [
			{
				label: "Entrants",
				data: Entrants.map(data => data),
				backgroundColor: "#f7b438",
				barThickness: 10,
			},
			{
				label: "Prescreens",
				data: Prescreens.map(data => data),
				backgroundColor: "rgb(127, 133, 255)",
				barThickness: 10,
			},
			{
				label: "Completes",
				data: Completes.map(data => data),
				barThickness: 10,
				backgroundColor: "rgb(21, 222, 147)",
			},
		],
	}

	return (
		<div className={styles.respondant_activity}>
			<p className={styles.legend}>Respondant Activity</p>

			<div className={styles.head}>
				<div
					style={{ borderBottom: entrants && "2px solid orange" }}
					className={styles.entrants}
					onClick={() => setEntrants(!entrants)}
				>
					<div className={styles.title}>
						<RiAncientGateLine size={24} />
						<span>entrants</span>
					</div>

					<span className={styles.value}>511</span>
				</div>
				<div
					style={{
						borderBottom:
							prescreens && "2px solid rgb(127, 133, 255)",
					}}
					onClick={() => setPrescreens(!prescreens)}
					className={styles.prescreens}
				>
					<div className={styles.title}>
						<RiFullscreenExitFill size={24} />
						<span>prescreens</span>
					</div>
					<span className={styles.value}>458</span>
				</div>
				<div
					className={styles.completes}
					style={{
						borderBottom:
							completes && "2px solid rgb(21, 222, 147)",
					}}
					onClick={() => setCompletes(!completes)}
				>
					<div className={styles.title}>
						<AiOutlineCheck size={24} />
						<span>completes</span>
					</div>
					<span className={styles.value}>0</span>
				</div>
			</div>
			<Bar options={options} data={data} height={70} />
		</div>
	)
}

const rates_page_data = [
	{
		header: "Rates",
		icon: <RiUserFollowLine size={20} />,
		body_heading: "conversion rate",
		percent: "10%",
		points: "-10 pts",
		goal: "Goal:",
		above: "Above",
		progress: "10%",
		tooltip: "@",
	},
	{
		header: "Rates",
		icon: <RiUserFollowLine size={20} />,
		body_heading: "conversion rate",
		percent: "10%",
		points: "-10 pts",
		goal: "Goal:",
		above: "Above",
		progress: "10%",
		tooltip: "@",
	},
	{
		header: "Rates",
		icon: <RiUserFollowLine size={20} />,
		body_heading: "conversion rate",
		percent: "10%",
		points: "-10 pts",
		goal: "Goal:",
		above: "Above",
		progress: "10%",
		tooltip: "@",
	},
	{
		header: "Rates",
		icon: <RiUserFollowLine size={20} />,
		body_heading: "conversion rate",
		percent: "10%",
		points: "-10 pts",
		goal: "Goal:",
		above: "Above",
		progress: "10%",
	},
]

const Rates = () => {
	return (
		<div className={styles.rates}>
			<p className={styles.legend}>Rates</p>
			<div className={styles.rates_container}>
				{rates_page_data.map((data, index) => (
					<div className={styles.rateContainer} key={index}>
						<div className={styles.rates_body}>
							{/* rate */}
							<div className={styles.quota_rate}>
								{data.icon}
								<span>{data.body_heading}</span>
							</div>
							{/* percentage and point */}
							<div className={styles.percentage}>
								<h1>{data.percent}</h1>
								<span className={styles.points}>
									{data.points}
								</span>
							</div>
							{/* progress bar */}
							<div className={styles.progress}>
								<LinearProgressWithLabel value={10} />
							</div>
							{/* goal */}
							<div className={styles.footer_data}>
								<span>
									<b>{data.goal}</b>
								</span>
								<span className={styles.text_light}>
									{data.above}
								</span>
								<span className={styles.text_light}>
									{data.progress}
								</span>
								<span className={styles.text_light}>
									<AiOutlineInfoCircle size={18} />
								</span>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

const DataAnalysis = () => {
	const [mode, setMode] = React.useState("live")

	return (
		<div className={styles.data_analysis_card}>
			<p className={styles.legend}>Data Analysis</p>
			<Select
				value={mode}
				onChange={e => setMode(e.target.value)}
				displayEmpty
				inputProps={{ "aria-label": "Without label" }}
				className={styles.select_field}
			>
				<MenuItem value='live'>Live</MenuItem>
				<MenuItem value='test'>Test</MenuItem>
			</Select>
			<div className={styles.client_codes}>
				<Accordion className={styles.accordion}>
					<AccordionSummary
						expandIcon={<BiChevronDown />}
						aria-controls='panel1a-content'
						id='panel1a-header'
						className={styles.accordion_summary}
					>
						<p className={styles.accordion_name}>client codes</p>
						<BiInfoCircle
							size={20}
							style={{ marginTop: "13px", marginLeft: "10px" }}
						/>
					</AccordionSummary>
					<AccordionDetails className={styles.accordion_details}>
						<div className={styles.client_code}>
							<span className={styles.tag}>
								In Client Survey 1
							</span>
							<br />
							<br />
							<div className={styles.name}>
								<span>Currently in Client Survey or Drop</span>
								<span>93</span>
							</div>
							<br />
							<div>
								<LinearProgressWithLabel
									value={10}
									height={4}
								/>
							</div>
						</div>
						<div className={styles.total}>
							Total &nbsp; &nbsp;<span>93</span>
						</div>
					</AccordionDetails>
				</Accordion>
			</div>
			<div className={styles.marketplace_codes}>
				<Accordion className={styles.accordion}>
					<AccordionSummary
						expandIcon={<BiChevronDown />}
						aria-controls='panel2a-content'
						id='panel2a-header'
						className={styles.accordion_summary}
					>
						<p className={styles.accordion_name}>
							marketplace codes
						</p>
						<BiInfoCircle
							size={20}
							style={{ marginTop: "13px", marginLeft: "10px" }}
						/>
					</AccordionSummary>
					<AccordionDetails className={styles.accordion_details}>
						<span className={styles.tag}>In Client Survey 1</span>
						<br />
						<br />
						<div className={styles.name}>
							<span>Currently in Client Survey or Drop</span>
							<span>93</span>
						</div>
						<br />
						<div>
							<LinearProgressWithLabel value={10} />
						</div>
						<div className={styles.total}>
							Total &nbsp; &nbsp;<span>93</span>
						</div>
					</AccordionDetails>
				</Accordion>
			</div>
		</div>
	)
}

const LengthOfInterview = () => {
	return (
		<div className={styles.LOI_card}>
			<p className={styles.legend}>Length of Interview</p>
			<div className={styles.left}>
				<div className={styles.head}>
					<span>
						<RiTimerLine size={20} />
					</span>
					<span>completion loi</span>
				</div>
				<div className={styles.middle}>
					<div className={styles.timing}>
						<h1>0 min</h1>
						<span>-20 min</span>
					</div>
					<LinearProgressWithLabel value={2} height={4} />
					<span></span>
				</div>
				<div className={styles.bottom}>
					<span>
						<b>Expected: </b>
					</span>
					<span className={styles.text_light}>20</span>
					<span className={styles.text_light}>min</span>
					<span className={styles.text_light}>
						<AiOutlineInfoCircle size={18} />
					</span>
				</div>
			</div>
			<div className={styles.right}></div>
		</div>
	)
}

export default Reports
