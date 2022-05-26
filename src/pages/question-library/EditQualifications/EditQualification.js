import React, { useEffect, useMemo, useState } from "react"
import styles from "./EditQualification.module.css"
// Modal
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Modal from "@mui/material/Modal"
import { styled } from "@mui/material/styles"

// Autocomplete MuI
import PropTypes from "prop-types"
import { useAutocomplete } from "@mui/base/AutocompleteUnstyled"
import CheckIcon from "@mui/icons-material/Check"
import CloseIcon from "@mui/icons-material/Close"
import { useQualificationLibraryContext } from "../QuestionLibraryContext"
import { v4 as uuid } from "uuid"
import Select from "react-select"
import countryList from "react-select-country-list"
import { updateQuestion } from "../../../utils/firebaseQueries"

// MOdal
const style = {
	position: "absolute",
	width: "900px",
	height: "650px",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	bgcolor: "#FFFFFF",
	border: "1px solid #F1F1F1",
	boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
	borderRadius: "40px",
	p: 5,
}

// Autocomp.
const Root = styled("div")(
	({ theme }) => `
    color: ${
		theme.palette.mode === "dark"
			? "rgba(255,255,255,0.65)"
			: "rgba(0,0,0,.85)"
	};
    font-size: 14px;
  `
)

const Label = styled("label")`
	padding: 0 0 4px;
	line-height: 1.5;
	display: none;
`

const InputWrapper = styled("div")(
	({ theme }) => `
    width: 100%;
    height: 55.19px;
    border: 1px solid #959595;
    background-color: #ffffff;
    border-radius: 43px;
    padding: 14px;
    display: flex;
    flex-wrap: wrap;
    margin-top:10px;
  
    & input {
      background-color: ${theme.palette.mode === "dark" ? "#141414" : "#fff"};
      color: ${
			theme.palette.mode === "dark"
				? "rgba(255,255,255,0.65)"
				: "rgba(0,0,0,.85)"
		};
      height: 30px;
      box-sizing: border-box;
      padding: 4px 6px;
      width: 0;
      min-width: 30px;
      flex-grow: 1;
      border: 0;
      margin: 0;
      outline: 0;
    }
  `
)

function Tag(props) {
	const { label, onDelete, ...other } = props
	return (
		<div {...other}>
			<span>{label}</span>
			<CloseIcon onClick={onDelete} />
		</div>
	)
}

Tag.propTypes = {
	label: PropTypes.string.isRequired,
	onDelete: PropTypes.func.isRequired,
}

const StyledTag = styled(Tag)(
	({ theme }) => `
    display: flex;
    align-items: center;
    height: 24px;
    margin: 2px;
    line-height: 20px;
    background-color: ${
		theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "#EFEFEF"
	};
    border: 1px solid ${theme.palette.mode === "dark" ? "#303030" : "#e8e8e8"};
    border-radius: 20px;
    box-sizing: content-box;
    padding: 0 4px 0 10px;
    outline: 0;
    overflow: hidden;
    font-size: 12px;
    font-weight: 600;
    color:#000000;
  
    &:focus {
      border-color: ${theme.palette.mode === "dark" ? "#177ddc" : "#40a9ff"};
      background-color: ${
			theme.palette.mode === "dark" ? "#003b57" : "#e6f7ff"
		};
    }
  
    & span {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  
    & svg {
      font-size: 12px;
      cursor: pointer;
      padding: 4px;
    }
  `
)

const Listbox = styled("ul")(
	({ theme }) => `
    width: 300px;
    margin: 2px 0 0;
    padding: 0;
    position: absolute;
    list-style: none;
    background-color: ${theme.palette.mode === "dark" ? "#141414" : "#fff"};
    overflow: auto;
    max-height: 250px;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 1;
    font-size: 18px;

   
  
    & li {
      padding: 5px 12px;
      display: flex;
  
      & span {
        flex-grow: 1;
      }
  
      & svg {
        color: transparent;
      }
    }
  
    & li[aria-selected='true'] {
      background-color: ${
			theme.palette.mode === "dark" ? "#2b2b2b" : "#fafafa"
		};
      font-weight: 400;
  
      & svg {
        color: #1890ff;
      }
    }
  
    & li[data-focus='true'] {
      background-color: ${
			theme.palette.mode === "dark" ? "#003b57" : "#e6f7ff"
		};
      cursor: pointer;
  
      & svg {
        color: currentColor;
      }
    }
  `
)

function EditQualification({
	open,
	handleClose,
	defaultData,
	setSelectedQueCnt,
	setSelectedQues,
}) {
	const { questions } = useQualificationLibraryContext()
	const [dataToEdit, setDataToEdit] = useState({})
	const [questionLang, setQuestionLang] = useState()
	const countries = useMemo(() => countryList().getData(), [])

	useEffect(() => {
		let queLang = defaultData[0].slice(0, 6)
		let queID = parseInt(defaultData[0].slice(6))
		setQuestionLang(queLang.split("-")[0])
		questions?.map(que => {
			if (que?.question_id === queID) {
				setDataToEdit(que)
			}
		})
	}, [questions, defaultData])

	const handleInputChange = e => {
		let val = e.target.value
		if (val === "true") val = true
		else if (val === "false") val = false
		setDataToEdit(prevData => {
			return {
				...prevData,
				[e.target.name]: val,
			}
		})
	}

	const handleEditQuestion = () => {
		handleClose()
		updateQuestion(defaultData[0]?.slice(6), dataToEdit)
			.then(() => {
				setSelectedQueCnt(0)
				setSelectedQues([])
				console.log("question edited")
			})
			.catch(err => {
				console.log(err.message)
			})
	}
	console.log(dataToEdit, questionLang)

	return (
		<div>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby='modal-modal-title'
				aria-describedby='modal-modal-description'
			>
				<Box sx={style}>
					<div className={styles.modal_container}>
						<h1 className={styles.createQualifications_title}>
							Create Qualifications
						</h1>
						<div
							className={
								styles.createQualifications_mainContainer
							}
						>
							<div
								className={styles.createQualifications_leftSide}
							>
								<div className={styles.inputFild_container}>
									<p>Qualification Name</p>
									<input
										type='text'
										name='name'
										value={dataToEdit?.name}
										onChange={handleInputChange}
									/>
								</div>
								<div className={styles.inputFild_container}>
									<p>Question Type</p>
									<select
										name='question_type'
										value={dataToEdit?.question_type}
										onChange={handleInputChange}
									>
										<option>Single Punch</option>
										<option>Multi Punch</option>
										<option>Numeric - Open-end</option>
										<option>Text - Open-end</option>
									</select>
								</div>
								<div className={styles.inputFild_container}>
									<p>Survey Group Status</p>
									<select
										name='question_status'
										value={dataToEdit?.question_status}
										onChange={handleInputChange}
									>
										<option value='active'>Active</option>
										<option value='inactive'>
											Inactive
										</option>
									</select>
								</div>
								<div className={styles.inputFild_container}>
									<p>isCoreDemographic</p>
									<div
										className={
											styles.is_core_demographic_container
										}
									>
										<div>
											<input
												type='radio'
												name='is_core_demographic'
												id='yes'
												value='true'
												checked={
													dataToEdit?.is_core_demographic
												}
												onChange={handleInputChange}
											/>
											<label htmlFor='yes'>Yes</label>
										</div>
										<div>
											<input
												type='radio'
												name='is_core_demographic'
												id='no'
												value='false'
												checked={
													!dataToEdit?.is_core_demographic
												}
												onChange={handleInputChange}
											/>
											<label htmlFor='no'>No</label>
										</div>
									</div>
								</div>
							</div>

							<div
								className={
									styles.createQualifications_rightSide
								}
							>
								<div className={styles.inputFild_container}>
									<p>Qualification Question Text</p>
									<textarea
										rows='7'
										cols='50'
										value={
											dataToEdit?.lang?.[
												defaultData[0].slice(0, 6)
											]?.question_text
										}
										onChange={e => {
											let countryLang =
												defaultData[0]?.slice(0, 6)
											setDataToEdit(prevData => {
												return {
													...prevData,
													lang: {
														[countryLang]: {
															...prevData?.lang?.[
																countryLang
															],
															question_text:
																e.target.value,
														},
													},
												}
											})
										}}
									/>
								</div>

								<div className={styles.inputFild_container}>
									<p>Country</p>
									<Select
										value={
											defaultData[0]
												?.slice(0, 6)
												.split("-")[1]
										}
										options={countries}
									/>
								</div>
								<div className={styles.inputFild_container}>
									<p>Language</p>
									<select
										value={
											defaultData[0]
												.slice(0, 6)
												.split("-")[0]
										}
									>
										<option value='ENG'>English</option>
										<option value='FRA'>French</option>
										<option value='GER'>German</option>
										<option value='JPN'>Japanese</option>
										<option value='ESP'>Spanish</option>
									</select>
								</div>
								<p className={styles.subtitle}>
									Question ID : 1400382
								</p>
							</div>
						</div>

						<div className={styles.inputFild_container}>
							<p> Options Text</p>
							{dataToEdit?.lang?.[
								defaultData[0]?.slice(0, 6)
							]?.options?.map((option, index) => {
								return (
									<input
										type='text'
										value={option}
										id={uuid()}
										onChange={e => {
											let countryLang =
												defaultData[0]?.slice(0, 6)
											let newOptions =
												dataToEdit?.lang?.[countryLang]
													?.options
											newOptions[index] = e.target.value

											setDataToEdit(prevData => {
												return {
													...prevData,
													lang: {
														...prevData?.lang,
														[countryLang]: {
															options: newOptions,
														},
													},
												}
											})
										}}
									/>
								)
							})}
						</div>
						<p
							onClick={() => {
								let countryLang = defaultData[0]?.slice(0, 6)
								let newOptions =
									dataToEdit?.lang?.[countryLang]?.options
								newOptions.push("")
								setDataToEdit(prevData => {
									return {
										...prevData,
										lang: {
											...prevData?.lang,
											[countryLang]: {
												options: newOptions,
											},
										},
									}
								})
							}}
						>
							Add option
						</p>

						<button
							className={styles.addSurvery_btn}
							onClick={handleEditQuestion}
						>
							{" "}
							Edit Question
						</button>
					</div>
				</Box>
			</Modal>
		</div>
	)
}

export default EditQualification

function AutoCompText() {
	const {
		getRootProps,
		getInputLabelProps,
		getInputProps,
		getTagProps,
		getListboxProps,
		getOptionProps,
		groupedOptions,
		value,
		focused,
		setAnchorEl,
	} = useAutocomplete({
		id: "customized-hook-demo",
		defaultValue: [options[0]],
		multiple: true,
		options: options,
		getOptionLabel: option => option.title,
	})

	return (
		<>
			<Root>
				<div {...getRootProps()}>
					<Label {...getInputLabelProps()}>Customized hook</Label>
					<InputWrapper
						ref={setAnchorEl}
						className={focused ? "focused" : ""}
					>
						{value.map((option, index) => (
							<StyledTag
								label={option.title}
								{...getTagProps({ index })}
							/>
						))}

						<input {...getInputProps()} />
					</InputWrapper>
				</div>
				{groupedOptions.length > 0 ? (
					<Listbox {...getListboxProps()}>
						{groupedOptions.map((option, index) => (
							<li {...getOptionProps({ option, index })}>
								<span>{option.title}</span>
								<CheckIcon fontSize='small' />
							</li>
						))}
					</Listbox>
				) : null}
			</Root>
		</>
	)
}

const options = [{ title: "Single Select" }, { title: "Multi Select" }]
