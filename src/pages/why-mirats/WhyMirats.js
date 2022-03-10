import { useLocation } from "react-router-dom"
import WhyMiratsComponent from "../../components/why-mirats-component/WhyMiratsComponent"
import "./WhyMirats.css"

const why_mirats_page_data = [
	{
		title: "Why Mirats",
		desc: "Leading companies across industries are choosing Google Cloud to solve their toughest challenges.",
	},
	{
		mainData: [
			{
				title: "Run your apps wherever you need them",
				desc: "Avoid vendor lock-in with Google Cloud’s commitment to open source, multicloud, and hybrid cloud—allowing you to use your data and run your apps on any cloud or in any environment. Our open cloud solutions provide consistency between public and private clouds, enabling businesses to modernize and developers to build faster in any environment.",
				media: "https://lh3.googleusercontent.com/eonHWb215LQQmfE16rbMgJBxhZYockB8ZkB-vwZNkw4pEbSHbcwrQZeaL5XOIuz3gD4Iq-TqnEJC=e14-h235-w600",
			},
			{
				title: "Run your apps wherever you need them",
				desc: "Avoid vendor lock-in with Google Cloud’s commitment to open source, multicloud, and hybrid cloud—allowing you to use your data and run your apps on any cloud or in any environment. Our open cloud solutions provide consistency between public and private clouds, enabling businesses to modernize and developers to build faster in any environment.",
				media: "https://lh3.googleusercontent.com/eonHWb215LQQmfE16rbMgJBxhZYockB8ZkB-vwZNkw4pEbSHbcwrQZeaL5XOIuz3gD4Iq-TqnEJC=e14-h235-w600",
			},
			{
				title: "Run your apps wherever you need them",
				desc: "Avoid vendor lock-in with Google Cloud’s commitment to open source, multicloud, and hybrid cloud—allowing you to use your data and run your apps on any cloud or in any environment. Our open cloud solutions provide consistency between public and private clouds, enabling businesses to modernize and developers to build faster in any environment.",
				media: "https://lh3.googleusercontent.com/eonHWb215LQQmfE16rbMgJBxhZYockB8ZkB-vwZNkw4pEbSHbcwrQZeaL5XOIuz3gD4Iq-TqnEJC=e14-h235-w600",
			},
			{
				title: "Run your apps wherever you need them",
				desc: "Avoid vendor lock-in with Google Cloud’s commitment to open source, multicloud, and hybrid cloud—allowing you to use your data and run your apps on any cloud or in any environment. Our open cloud solutions provide consistency between public and private clouds, enabling businesses to modernize and developers to build faster in any environment.",
				media: "https://lh3.googleusercontent.com/eonHWb215LQQmfE16rbMgJBxhZYockB8ZkB-vwZNkw4pEbSHbcwrQZeaL5XOIuz3gD4Iq-TqnEJC=e14-h235-w600",
			},
			{
				title: "Run your apps wherever you need them",
				desc: "Avoid vendor lock-in with Google Cloud’s commitment to open source, multicloud, and hybrid cloud—allowing you to use your data and run your apps on any cloud or in any environment. Our open cloud solutions provide consistency between public and private clouds, enabling businesses to modernize and developers to build faster in any environment.",
				media: "https://lh3.googleusercontent.com/eonHWb215LQQmfE16rbMgJBxhZYockB8ZkB-vwZNkw4pEbSHbcwrQZeaL5XOIuz3gD4Iq-TqnEJC=e14-h235-w600",
			},
			{
				title: "Run your apps wherever you need them",
				desc: "Avoid vendor lock-in with Google Cloud’s commitment to open source, multicloud, and hybrid cloud—allowing you to use your data and run your apps on any cloud or in any environment. Our open cloud solutions provide consistency between public and private clouds, enabling businesses to modernize and developers to build faster in any environment.",
				media: "https://lh3.googleusercontent.com/eonHWb215LQQmfE16rbMgJBxhZYockB8ZkB-vwZNkw4pEbSHbcwrQZeaL5XOIuz3gD4Iq-TqnEJC=e14-h235-w600",
			},
		],
	},
]

const WhyMirats = () => {
	const location = useLocation()
	console.log(location.pathname)
	return (
		<div>
			{(() => {
				switch (location.pathname) {
					case "/why-mirats":
						return (
							<WhyMiratsComponent data={why_mirats_page_data} />
						)

					default:
						break
				}
			})()}
		</div>
	)
}

export default WhyMirats
