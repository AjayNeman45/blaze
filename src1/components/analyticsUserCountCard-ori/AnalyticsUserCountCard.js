import React from "react"
import styles from "./userAnalytcs.module.css"
import { Progress } from "@nextui-org/react"
import LinearProgress from "@mui/material/LinearProgress"

function AnalyticsUserCountCard({ cardTitle, userType, data }) {
	return (
		<div className={styles.UserAnalytics_container}>
			<h1>{cardTitle}</h1>
			<div className={styles.UserAnalytics_header}>
				<h4>{userType}</h4>
				<h4>USERS</h4>
			</div>
			{data.map(item => {
				return (
					<>
						<div className={styles.platform_type}>
							<p>{item.platformName}</p> <p>{item.count}</p>
						</div>

						<LinearProgress
							color='inherit'
							variant='determinate'
							value={item.progress}
						/>
					</>
				)
			})}
		</div>
	)
}

export default AnalyticsUserCountCard
