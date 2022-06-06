import { Modal } from "@mui/material"
import { Box } from "@mui/system"
import React from "react"
import styles from "./ExportAsModal.module.css"

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 500,
	bgcolor: "white",
	borderRadius: "30px",
	boxShadow: 24,
	p: 4,
}
const ExportAsModal = ({
	visible,
	handleClose,
	downloadAsExcel,
	downloadToPDF,
}) => {
	return (
		<Modal
			open={visible}
			onClose={handleClose}
			aria-labelledby='modal-modal-title'
			aria-describedby='modal-modal-description'
		>
			<Box sx={style}>
				<h2 className={styles.title}>Download Logs</h2>
				<div className={styles.buttons}>
					<button
						className={styles.export_as_pdf}
						onClick={() => {
							handleClose()
							downloadToPDF()
						}}
					>
						Export as PDF
					</button>
					<button
						className={styles.export_as_excel}
						onClick={() => {
							handleClose()
							downloadAsExcel()
						}}
					>
						Export as Excel
					</button>
				</div>
			</Box>
		</Modal>
	)
}

export default ExportAsModal

