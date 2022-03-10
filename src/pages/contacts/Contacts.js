import Header from "../../components/header/Header"
import { AiFillPhone } from "react-icons/ai"
import { HiArrowSmDown } from "react-icons/hi"
import { BiUpArrowAlt } from "react-icons/bi"

import "./Contacts.css"
import { useEffect, useState } from "react"

const tableData = [
	{
		name: "Marole White",
		account_name: "Global media",
		title: "VP Sales",
		phone: "1(800) 667-6328",
		email: "info@gmail.com",
		owner_first_name: "john",
		owner_last_name: "smith",
	},
	{
		name: "Barole White",
		account_name: "Global media",
		title: "VP Sales",
		phone: "1(800) 667-6328",
		email: "info@gmail.com",
		owner_first_name: "john",
		owner_last_name: "smith",
	},
	{
		name: "Parole White",
		account_name: "Global media",
		title: "VP Sales",
		phone: "1(800) 667-6328",
		email: "info@gmail.com",
		owner_first_name: "john",
		owner_last_name: "smith",
	},
	{
		name: "Narole White",
		account_name: "Global media",
		title: "VP Sales",
		phone: "1(800) 667-6328",
		email: "info@gmail.com",
		owner_first_name: "john",
		owner_last_name: "smith",
	},
]

function dynamicSort(property, sortBy) {
	var sortOrder = 1
	if (property[0] === "-") {
		sortOrder = -1
		property = property.substr(1)
	}
	if (sortBy) {
		return function (a, b) {
			/* next line works with strings and numbers,
			 * and you may want to customize it to your needs
			 */
			var result =
				a[property] < b[property]
					? -1
					: a[property] > b[property]
					? 1
					: 0
			return result * sortOrder
		}
	} else {
		console.log("in descresing order")
		return function (a, b) {
			var result =
				a[property] > b[property]
					? -1
					: a[property] < b[property]
					? 1
					: 0
			return result * sortOrder
		}
	}
}

const Contacts = () => {
	const [sortByName, setSorBytname] = useState(1)
	const [contactsData, setContactsData] = useState([])

	const handleSortByName = () => {
		setSorBytname(!sortByName)
	}
	useEffect(() => {
		setContactsData(tableData.sort(dynamicSort("name", sortByName)))
		console.log(tableData.sort(dynamicSort("name", sortByName)))
	}, [sortByName])

	return (
		<>
			<Header />
			<div className='contacts_page'>
				<p className='contacts_page_title'>Contacts</p>
				<div style={{ overflowX: "auto" }}>
					<table className='contacts_table'>
						<thead>
							<tr>
								<th>#</th>
								<th>
									Name
									{sortByName ? (
										<HiArrowSmDown
											style={{ cursor: "pointer" }}
											onClick={handleSortByName}
										/>
									) : (
										<BiUpArrowAlt
											style={{ cursor: "pointer" }}
											onClick={handleSortByName}
										/>
									)}
								</th>
								<th>Account Name</th>
								<th>Title</th>
								<th>Phone</th>
								<th>Email</th>
								<th>Owner First Name</th>
								<th>Owner Last Name</th>
							</tr>
						</thead>
						<tbody>
							{contactsData.map((data, index) => {
								return (
									<tr>
										<td>{index + 1}</td>
										<td>{data.name}</td>
										<td>{data.account_name}</td>
										<td>{data.title}</td>
										<td>
											<AiFillPhone color='blue' /> &nbsp;{" "}
											{data.phone}
										</td>
										<td>{data.email}</td>
										<td>{data.owner_first_name}</td>
										<td>{data.owner_last_name}</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				</div>
			</div>
		</>
	)
}

export default Contacts
