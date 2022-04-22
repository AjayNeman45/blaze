import { NavLink, useParams } from "react-router-dom";
import Documents from "../../pages/documents/Documents";
import "./subheader.css";
const Subheader = () => {
  const { surveyID } = useParams();
  return (
    <div className="subheader">
      <div className="subheader_links">
        <NavLink
          activeClassName="subheader_active_link"
          className="subheader_link"
          to={`/surveys/dashboard/${surveyID}`}
        >
          Dashboard
        </NavLink>
        <NavLink
          activeClassName="subheader_active_link"
          className="subheader_link"
          to={`/surveys/analytics/audience/${surveyID}`}
        >
          Analytics
        </NavLink>
        <NavLink
          activeClassName="subheader_active_link"
          className="subheader_link"
          to={`/surveys/sources/${surveyID}`}
        >
          Sources
        </NavLink>
        <NavLink
          activeClassName="subheader_active_link"
          className="subheader_link"
          to={`/surveys/reports/${surveyID}`}
        >
          Reports
        </NavLink>
        <NavLink
          activeClassName="subheader_active_link"
          className="subheader_link"
          to={`/surveys/settings/${surveyID}`}
        >
          Project Settings
        </NavLink>
        <NavLink
          activeClassName="subheader_active_link"
          className="subheader_link"
          to={`/surveys/questions/${surveyID}`}
        >
          Qualifications
        </NavLink>
        <NavLink
          activeClassName="subheader_active_link"
          className="subheader_link"
          to={`/surveys/quotas/${surveyID}`}
        >
          Quotas
        </NavLink>
        <NavLink
          activeClassName="subheader_active_link"
          className="subheader_link"
          to={`/surveys/allocations/${surveyID}`}
        >
          Allocations
        </NavLink>
        <NavLink
          activeClassName="subheader_active_link"
          className="subheader_link"
          to={`/surveys/documents/${surveyID}`}
        >
          Documents
        </NavLink>
        <NavLink
          activeClassName="subheader_active_link"
          className="subheader_link"
          to={`/surveys/security/${surveyID}`}
        >
          Security
        </NavLink>
        <NavLink
          activeClassName="header_active_link"
          className="subheader_link"
          to={`/surveys/reconciliations/${surveyID}`}
        >
          Reconciliations
        </NavLink>
      </div>
    </div>
  );
};

export default Subheader;
