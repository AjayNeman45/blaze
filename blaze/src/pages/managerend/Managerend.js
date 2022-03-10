import React, { useEffect, useState } from "react"
import "./managerend.css"
import TextField from "@mui/material/TextField"
import Stack from "@mui/material/Stack"
import Autocomplete from "@mui/material/Autocomplete"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormControl from "@mui/material/FormControl"
import FormLabel from "@mui/material/FormLabel"
import Checkbox from "@mui/material/Checkbox"
import FormGroup from "@mui/material/FormGroup"
import { db } from "../../firebase"
import {
	where,
	collection,
	query,
	getDoc,
	getDocs,
	addDoc,
	setDoc,
	doc,
	arrayUnion,
	arrayRemove,
} from "firebase/firestore"
import { async } from "@firebase/util"
import { v4 as uuidv4 } from "uuid"
const Managerend = () => {
	// let top100Films = [{ "title": 'The Nun' }, { "title": 'Conjuring' }]

	// let [question_types, set_question_types] = useState(["Multi Punch"])
	let [question_types, setQuestion_types] = useState(["All"]) //After removing all duplicate values from set, append those set question type values to this useState array
	let [qttype, setQtType] = useState("")
	let [dropdownQuestions, setDropDownQuestions] = useState([])
	const [selectedQuestion, SetselectedQuestion] = useState("") //Selected value is to select the actual question from dropdown and return ID in return instead of actual question
	let [all_options, setAll_options] = useState([])
	let [selected_options, setSelected_options] = useState([])

	let [min, setMin] = useState()
	let [max, setMax] = useState()
	// console.log(min, max, "value of min and max")
	let [valid_options, setValidOptions] = useState("")
	// let [valid_options_for_radiobtn, setValid_options_for_radiobtn] = useState('')
	let qset = new Set() //Question type set

	async function QUESTION_LIBRARY() {
		const q = query(
			collection(db, "mirats", "Qualifications", "QuestionLibrary"),
			where("question_type", "!=", "Dummy")
		)
		const querySnapshot = await getDocs(q)

		querySnapshot.forEach(doc => {
			qset.add(doc.data()["question_type"])
		})

		// console.log(question_types_set)
	}

	useEffect(() => {
		QUESTION_LIBRARY().then(() => {
			// console.log(qset)
			for (const value of qset) {
				setQuestion_types(prear => [...prear, value])
			}
			// console.log(item)
		})
	}, [])

	// According to Question Types fetch the Questions
	async function QuestionLibrary_que(question_type) {
		if (question_type === "All") {
			const q = query(
				collection(db, "mirats", "Qualifications", "QuestionLibrary")
			)
			const querySnapshot = await getDocs(q)
			querySnapshot.forEach(doc => {
				if (doc.data()?.lang?.["ENG-IN"]?.question_text !== undefined) {
					setDropDownQuestions(prevar => {
						return [...prevar, doc.data()]
						// return [...prevar, doc.data()?.lang?.['ENG-IN']?.question_text]
					})
				}
			})
		} else {
			const q = query(
				collection(db, "mirats", "Qualifications", "QuestionLibrary"),
				where("question_type", "==", question_type)
			)
			const querySnapshot = await getDocs(q)
			querySnapshot.forEach(doc => {
				if (doc.data()?.lang?.["ENG-IN"]?.question_text !== undefined) {
					setDropDownQuestions(prevar => {
						// return [...prevar, doc.data()?.lang?.['ENG-IN']?.question_text]
						return [...prevar, doc.data()]
					})
				}
			})
		}
	}

	// Choose the Question type from radio button
	let HandleQuestionType = e => {
		setDropDownQuestions([])
		setAll_options([])
		setSelected_options([])
		QuestionLibrary_que(e.target.value)

		SetselectedQuestion("")
	}
	// function QuestionSelected(e, value) {
	//     console.log(value)
	// }

	// Set all the options according to Question ID
	async function FetchOptions(question_id) {
		console.log(question_id)
		const docRef = doc(
			db,
			"mirats",
			"Qualifications",
			"QuestionLibrary",
			String(question_id)
		)
		const docSnap = await getDoc(docRef)
		// console.log(docSnap.data()?.lang?.['ENG-IN']?.options)
		// let options=[]
		setQtType(docSnap.data()?.question_type) //Set the chosen Question type

		docSnap.data()?.lang?.["ENG-IN"]?.options.forEach(d => {
			// console.log(d)
			setAll_options(prear => {
				// console.log(prear)
				return [...prear, d]
			})
		})
	}

	// Fetching all the options
	useEffect(() => {
		if (selectedQuestion) {
			setAll_options([])
			setSelected_options([])
			FetchOptions(selectedQuestion)
		}
		console.log(selectedQuestion) //Question ID
	}, [selectedQuestion])

	useEffect(() => {
		// console.log(all_options)
		if (all_options) {
			setSelected_options(() => {
				return all_options.map((_, i) => i)
			})
		}
	}, [all_options])
	console.log(selected_options) //Selected Options

	function HandleCheckboxClick(e) {
		console.log(e.target.value)
		console.log(e.target.checked)
		setSelected_options(() => {
			if (!e.target.checked) {
				return selected_options.filter(opt => opt != e.target.value)
			} else {
				return [...selected_options, parseInt(e.target.value)]
			}
		})
	}

	// Save the Qualification for Checkbox Question
	async function Save(valid_opt) {
		const surveyref = doc(db, "mirats", "surveys", "survey", "10000014")
		let data
		switch (qttype) {
			case "Multi Punch":
				if (min === undefined && max === undefined) {
					//IF Min and Max is not selected
					data = {
						qualifications: {
							questions: arrayUnion({
								display_options: selected_options,
								question_id: String(selectedQuestion),
								conditions: {
									valid_options: valid_opt,
									how_many: {
										max: selected_options.length,
										min: 1,
									},
								},
							}),
						},
					}
				} else {
					data = {
						qualifications: {
							questions: arrayUnion({
								display_options: selected_options,
								question_id: String(selectedQuestion),
								conditions: {
									valid_options: valid_opt,
									how_many: {
										max: parseInt(max),
										min: parseInt(min),
									},
								},
							}),
						},
					}
				}
				break
			case "Single Punch":
				data = {
					qualifications: {
						questions: arrayUnion({
							display_options: selected_options,
							question_id: String(selectedQuestion),
							conditions: {
								valid_options: valid_opt,
							},
						}),
					},
				}
				break
			case "Numeric - Open-end":
				data = {
					qualifications: {
						questions: arrayUnion({
							question_id: String(selectedQuestion),
							valid_ans: valid_opt,
						}),
					},
				}
				break
			case "Text - Open-end":
				data = {
					qualifications: {
						questions: arrayUnion({
							question_id: String(selectedQuestion),
							valid_ans: valid_opt,
						}),
					},
				}
				break
		}

		await setDoc(surveyref, data, { merge: true })
	}

	function OnSubmit() {
		// console.log(selectedQuestion)
		// console.log(selected_options)
		let allconditionstobechecked = []
		let splitbycomma = valid_options.split(",")

		for (let i = 0; i < splitbycomma.length; i++) {
			allconditionstobechecked.push(splitbycomma[i].toLowerCase().trim())
		}
		console.log(allconditionstobechecked)

		// Range is not prior to selected option
		Save(allconditionstobechecked).then(() => {
			console.log("Saved Successfully")
		})
	}

	console.log("QT TYpe i s", qttype)
	return (
		<>
			<div className='container'>
				<div className='filtercontainer'>
					{/* Question Types  */}
					<FormControl>
						<FormLabel id='demo-form-control-label-placement'>
							Filter the Questions
						</FormLabel>
						<RadioGroup
							row
							aria-labelledby='demo-form-control-label-placement'
							name='position'
							defaultValue='top'
						>
							{/* Filters */}
							{question_types.map(que => {
								let id = uuidv4()
								return (
									<FormControlLabel
										value={que}
										control={<Radio />}
										label={que}
										name='question_type'
										key={id}
										onChange={HandleQuestionType}
									/>
								)
							})}
						</RadioGroup>
					</FormControl>
				</div>

				{/* All Questions in Drop down */}
				<Autocomplete
					freeSolo
					id='free-solo-2-demo'
					disableClearable
					options={dropdownQuestions}
					getOptionLabel={question =>
						question?.lang?.["ENG-IN"]?.question_text
					}
					renderInput={params => (
						<TextField
							{...params}
							label='Select Question'
							InputProps={{
								...params.InputProps,
								type: "search",
							}}
						/>
					)}
					onChange={(event, question) => {
						if (
							question?.lang?.["ENG-IN"]?.question_text !==
							undefined
						) {
							SetselectedQuestion(question?.question_id)
						} else {
							SetselectedQuestion("")
						}
					}}
					// inputValue={selectedQuestion}
				/>

				{/* Options Displayed here  */}
				{(qttype === "Multi Punch" || qttype === "Single Punch") && (
					<div
						className='alloptionscontainer'
						style={{ display: selectedQuestion ? "block" : "none" }}
					>
						<h3>All Options</h3>
						<FormGroup>
							{all_options?.map((option, index) => {
								// setSelected_options([...selected_options, index])
								let id = uuidv4()
								return (
									<FormControlLabel
										control={<Checkbox defaultChecked />}
										label={index + " -  " + option}
										value={index}
										key={id}
										onChange={e => HandleCheckboxClick(e)}
									/>
								)
							})}
						</FormGroup>
					</div>
				)}

				{/* Min and Max for Checkbox  */}
				{qttype === "Multi Punch" && (
					<div
						style={{
							display: selected_options.length ? "block" : "none",
						}}
					>
						<h4>How many User can Select</h4>
						<input
							type='number'
							className='input'
							id='mincheck'
							placeholder='MIN'
							onChange={e => setMin(e.target.value)}
						/>
						&nbsp;&nbsp;
						<input
							type='number'
							className='input'
							id='maxcheck'
							placeholder='MAX'
							onChange={e => setMax(e.target.value)}
						/>
					</div>
				)}

				<hr />

				{/* Range for Checkbox  */}

				{(qttype === "Multi Punch" ||
					qttype === "Numeric - Open-end" ||
					qttype === "Single Punch" ||
					qttype === "Text - Open-end") && (
					<div
						style={{
							marginTop: "40px",
							display:
								selected_options.length || qttype
									? "block"
									: "none",
						}}
					>
						{/* <h4>To be Checked Condition</h4> */}
						<h4>Valid Options</h4>
						<p style={{ color: "coral" }}>
							If you want to give range then type it as 1-7{" "}
						</p>
						<input
							type='text'
							className='tobecheckedinput'
							placeholder="Type only number and seperate them with Comma's e.g. 1,2,6"
							onChange={e => setValidOptions(e.target.value)}
						/>
					</div>
				)}

				{/* {qttype==="Single Punch" &&     //Give Numeric End too
                    <div style={{ marginTop: "40px", display: selected_options.length ? 'block' : 'none' }}>
                    <h4>Set Valid Options </h4>
                    <p style={{ color: 'coral' }}>If you want to give the range, then type it as 1-7 or else just give 1,2,3 as a valid options  </p>
                    <input type="text" className='tobecheckedinput' placeholder="Valid Options" onChange={(e) => setValid_options_for_radiobtn(e.target.value)} />
                </div>
                } */}

				{/* <div style={{ display: (selected_options.length || valid_options.length||"") ? 'block' : 'none' }}> */}
				<div>
					<button onClick={OnSubmit} className='btn'>
						Set the Qualification
					</button>
				</div>
			</div>
		</>
	)
}

export default Managerend
