import { Modal } from "@mui/material"
import { Box } from "@mui/system"
import React, { useState } from "react"
import { mainStatusWithInternalStatuses } from "../../utils/commonData"
import { v4 as uuid } from "uuid"
import styles from "./ChangeInternalStatusModal.module.css"

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "white",
	boxShadow: 24,
	p: 4,
	borderRadius: "5px",
}

const ChangeInternalStatusModal = ({
	openModal,
	setOpenModal,
	mainStatus,
	handleConfirmButton,
}) => {
	const [internalStatus, setInternalStatus] = useState()
	return (
		<Modal
			open={openModal}
			onClose={() => setOpenModal(false)}
			aria-labelledby='modal-modal-title'
			aria-describedby='modal-modal-description'
		>
			<Box sx={style}>
				<h3> Choose Internal status</h3>
				<div className={styles.internal_statuses}>
					{mainStatusWithInternalStatuses?.[mainStatus]?.map(
						interStatus => {
							return (
								<div
									key={interStatus?.value}
									className={styles.input_box}
								>
									<input
										type='radio'
										value={interStatus?.value}
										id={interStatus?.value}
										name='internalStatus'
										onChange={e =>
											setInternalStatus(e.target.value)
										}
									/>
									<label htmlFor={interStatus?.value}>
										{interStatus?.label}
									</label>
								</div>
							)
						}
					)}

					<div className={styles.btns}>
						<button
							className={styles.confirm_btn}
							onClick={() => {
								handleConfirmButton(internalStatus)
								setOpenModal(false)
							}}
							disabled={
								internalStatus !== undefined ? false : true
							}
						>
							Confirm
						</button>
						<button
							className={styles.cancel_btn}
							onClick={() => setOpenModal(false)}
						>
							Cancel
						</button>
					</div>
				</div>
			</Box>
		</Modal>
	)
}

export default ChangeInternalStatusModal

