import React from "react"
import styles from "./MiratsQuantoHeader.module.css"
import Logo from "../../assets/images/insights.png"

const MiratsQuantoHeader = () => {
	return (
		<>
			<div className={styles.header}>
				<div className={styles.left}>
					<img src={Logo} alt='' />
				</div>
				<div className={styles.right}>
					<ul>
						<li>Corporate Website</li>
						<li>Mirats Quanto</li>
						<li>Support</li>
						<li className={styles.apply_now_btn}>Apply Now</li>
					</ul>
				</div>
			</div>
		</>
	)
}

export default MiratsQuantoHeader
