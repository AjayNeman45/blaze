import Header from "../../components/header/Header"
import styles from "./Dashboard.module.css"
import Chart from "chart.js"
import { Line } from "react-chartjs-2"

const state = {
	labels: ["January", "February", "March", "April", "May"],
	datasets: [
		{
			label: "Rainfall",
			fill: false,
			lineTension: 0.5,
			backgroundColor: "rgba(75,192,192,1)",
			borderColor: "rgba(0,0,0,1)",
			borderWidth: 2,
			data: [65, 59, 80, 81, 56],
		},
	],
}

const rescentProjects = [
	{
		name: "Something",
		owner: "Someone",
		startDate: "10/01/2022",
		endDate: "10/01/2022",
		status: "completed",
	},
	{
		name: "Something",
		owner: "Someone",
		startDate: "10/01/2022",
		endDate: "10/01/2022",
		status: "completed",
	},
	{
		name: "Something",
		owner: "Someone",
		startDate: "10/01/2022",
		endDate: "10/01/2022",
		status: "completed",
	},
	{
		name: "Something",
		owner: "Someone",
		startDate: "10/01/2022",
		endDate: "10/01/2022",
		status: "completed",
	},
	{
		name: "Something",
		owner: "Someone",
		startDate: "10/01/2022",
		endDate: "10/01/2022",
		status: "completed",
	},
]

const contacts = [
	{
		name: "something",
		email: "something@gmail.com",
		phoneNumber: "9273947390",
	},
	{
		name: "something",
		email: "something@gmail.com",
		phoneNumber: "9273947390",
	},
	{
		name: "something",
		email: "something@gmail.com",
		phoneNumber: "9273947390",
	},
	{
		name: "something",
		email: "something@gmail.com",
		phoneNumber: "9273947390",
	},
	{
		name: "something",
		email: "something@gmail.com",
		phoneNumber: "9273947390",
	},
]

const cardData = [
	{
		attribute: "Length Of Interview",
		value: "15 minutes",
	},
	{
		attribute: "Increases Rate",
		value: "38%",
	},
	{
		attribute: "Sample Size",
		value: "150 N",
	},
	{
		attribute: "Cost Per Interview",
		value: "7 USD",
	},
	{
		attribute: "Status of the survey",
		value: "Active",
	},
	{
		attribute: "In-field LOI",
		value: "NaN minutes",
	},
]
const Dashboard = () => {
	const chartData = {
		displayTitle: true,
		displayLegend: true,
		legendPosition: "right",
		location: "City",
	}
	return (
		<>
			<Header />
			<div className={styles.dashboard}>
				<h2 className={styles.page_title}>Dashboard</h2>
				<div className={styles.first}>
					<div className={styles.graph}>graph</div>
					<div className={styles.projects}>
						<h5 className={styles.projects_section_title}>
							Rescent Projects{" "}
						</h5>
						{rescentProjects.map((project, index) => (
							<div className={styles.project} key={index}>
								<div className={styles.name_status}>
									<span>{project.name}</span>
									<span>{project.status}</span>
								</div>
								<div className={styles.start_end_date}>
									<div>
										<span>Start: {project.startDate}</span>{" "}
										&nbsp;
										<span>End: {project.endDate}</span>
									</div>
									<span>Owner: {project.owner}</span>
								</div>
							</div>
						))}
					</div>
				</div>

				<div className={styles.second}>
					<div className={styles.contacts}>
						<h5 className={styles.contacts_section_title}>
							Contacts
						</h5>
						{contacts.map((contact, index) => (
							<div className={styles.contact} key={index}>
								<span>{contact.name}</span>
								<div className={styles.email_phone_number}>
									<span>{contact.email}</span> &nbsp;
									<span>{contact.phoneNumber}</span>
								</div>
							</div>
						))}
					</div>
					<div className={styles.bids_stats}>
						<div className={styles.bids_earn}>
							<span>13</span>
							<span>Bids Earn</span>
						</div>
						<div className={styles.bids_lost}>
							<span>Bids Lost</span>
							<span>10</span>
						</div>
					</div>
				</div>
				<div className={styles.dashboard_cards}>
					{cardData.map((data, index) => (
						<div className={styles.dashboard_card} key={index}>
							<p className={styles.dashboard_card_value}>
								{data.value}
							</p>
							<p className={styles.dashboard_card_attribute}>
								{data.attribute}
							</p>
						</div>
					))}
				</div>
			</div>
		</>
	)
}

export default Dashboard
