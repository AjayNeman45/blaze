import { createContext, useContext, useEffect, useState } from "react"
import {
	addDoc,
	collection,
	getDoc,
	getDocs,
	query,
	setDoc,
} from "firebase/firestore"
import { db } from "../../firebase"

const ProjectContext = createContext()

export const useProjectContext = () => {
	return useContext(ProjectContext)
}

const ProjectContextProvider = ({ children }) => {
	const [projects, setProjects] = useState([])
	useEffect(() => {
		const func = async () => {
			const querySnapshot = await getDocs(
				collection(db, "mirats", "surveys", "survey")
			)
			querySnapshot.docs.reverse().forEach(doc => {
				setProjects(prevData => {
					return [...prevData, doc.data()]
				})
			})
		}
		func()
	}, [])

	const value = {
		projects,
	}
	return (
		<ProjectContext.Provider value={value}>
			{children}
		</ProjectContext.Provider>
	)
}

export default ProjectContextProvider
