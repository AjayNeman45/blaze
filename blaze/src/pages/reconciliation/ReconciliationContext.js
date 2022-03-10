import { collection, doc, getDocs, query, where } from "firebase/firestore"
import { createContext, useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { db } from "../../firebase"

const ReconciliationContext = createContext()

export const useReconcileContext = () => {
	return useContext(ReconciliationContext)
}

const ReconciliationContextProvider = ({ children }) => {
	const value = {}
	return (
		<ReconciliationContext.Provider value={value}>
			{children}
		</ReconciliationContext.Provider>
	)
}

export default ReconciliationContextProvider
