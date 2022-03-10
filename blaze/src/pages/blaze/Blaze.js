import React, { useEffect, useState } from "react"
import styles from "./Blaze.module.css"
import Loader from "../../components/loader/Loader"
import { useBlazeContext } from "./BlazeContext"
import ErrorPage from "../../components/error-page/ErrorPage"
import GdprConsent from "./gdpr-consent/GdprConsent"

const Blaze = () => {
	const { baseLoading, errCode, errMsg, verificationDone } = useBlazeContext()

	return (
		<>
			{baseLoading && (
				<>
					<Loader msg='We are fetching survey for you...' />
				</>
			)}
			{!baseLoading && errCode && errMsg && (
				<ErrorPage errCode={errCode} errMsg={errMsg} />
			)}
		</>
	)
}

export default Blaze
