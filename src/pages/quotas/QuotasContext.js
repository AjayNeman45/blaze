import { doc, getDoc } from "firebase/firestore"
import { createContext, useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { db } from "../../firebase"
import { getSurvey } from "../../utils/firebaseQueries"

const QuotasContext = createContext()

export const useQuotasContext = () => {
	return useContext(QuotasContext)
}

const QuotasContextProvider = ({ children }) => {
	const [survey, setSurvey] = useState()
	const { surveyID } = useParams()

	useEffect(() => {
		getSurvey(surveyID)
			.then(data => setSurvey(data))
			.catch(err => console.log(err.message))
	}, [])

	const value = {
		survey,
	}
	return (
		<QuotasContext.Provider value={value}>
			{children}
		</QuotasContext.Provider>
	)
}

export default QuotasContextProvider
