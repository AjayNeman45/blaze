import React from "react"
import Snackbar from "@mui/material/Snackbar"
import MuiAlert from "@mui/material/Alert"

const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})

const SnackbarMsg = ({ msg, severity, open, handleClose }) => {
	return (
		<>
			<Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
				<Alert
					onClose={handleClose}
					severity={severity}
					sx={{ width: "100%" }}
				>
					{msg}
				</Alert>
			</Snackbar>
		</>
	)
}

export default SnackbarMsg
