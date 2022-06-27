import "./CreateNewProject.css";
import Header from "../../components/header/Header";
import { useParams } from "react-router-dom";
// import { AiOutlineBulb } from "react-icons/ai";
import BasicSurveyInfo from "./BasicSurveyInfo";
import SetUpRequirments from "./SetupRequirements";
import MetricsAndData from "./MetricsAndData";
import Peoples from "./Peoples";

const CreateNewProject = () => {
  const { edit_option } = useParams();
  return (
    <>
      <Header />
      <div className="create_survey_page">
        <div className="create_survey_page_header">
          <p className="title">Create Survey</p>
          {/* <p className="subtitle">
            Create a new survey and then enlist a new project
          </p> */}
          <hr />
        </div>
        {(() => {
          switch (edit_option) {
            case "basic":
              return <BasicSurveyInfo />;
            case "setup-requirements":
              return <SetUpRequirments />;
            case "metrics-and-surveyData":
              return <MetricsAndData />;
            case "peoples":
              return <Peoples />;
            default:
              return <BasicSurveyInfo />;
          }
        })()}
      </div>
    </>
  );
};

// export const InputHelperCard = ({ title, desc }) => {
//   return (
//     <div className="input_helper_card">
//       <div className="top" style={{ display: "flex" }}>
//         <AiOutlineBulb size={30} color="blue" />
//         <p className="title" style={{ marginLeft: "10px" }}>
//           {title}
//         </p>
//       </div>
//       <p className="desc">{desc}</p>
//     </div>
//   );
// };

export default CreateNewProject;
