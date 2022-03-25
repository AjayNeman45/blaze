import { Route, Switch } from "react-router-dom";
import Projects from "./pages/projects/Projects";
import Dashboard from "./pages/dashboard/Dashboard";
import Accounts from "./pages/accounts/Accounts";
import Contacts from "./pages/contacts/Contacts";
import Leads from "./pages/leads/Leads";
import CreateNewProject from "./pages/create-new-project/CreateNewProject";
import Loader from "./components/loader/Loader";
import ProjectSettings from "./pages/project-settings/ProjectSettings";
import Qualifications from "./pages/qualifications/Qualifications";
import Quotas from "./pages/quotas/Quotas";
import Allocations from "./pages/allocations/Allocations";
import Reports from "./pages/reports/Reports";
import Documents from "./pages/documents/Documents";
import Security from "./pages/security/Security";
import Reconciliations from "./pages/reconciliation/Reconciliations";
import Blaze from "./pages/blaze/Blaze";
import BaseContextProvider from "./context/BaseContext";
import CreateNewProjectProvider from "./pages/create-new-project/CreateNewProjectContext";
import ProjectContextProvider from "./pages/projects/ProjectContext";
import ProejctSettingProvider from "./pages/project-settings/ProjectSettingContext";
import BlazeContextProvider from "./pages/blaze/BlazeContext";
import SurveyQuestions from "./pages/survey-questions/SurveyQuestions";
import GdprConsent from "./pages/blaze/gdpr-consent/GdprConsent";
import GdprCotextProvider from "./pages/blaze/gdpr-consent/GdprConsentContext";
import ReconciliationContextProvider from "./pages/reconciliation/ReconciliationContext";
import AllocationContextProvider from "./pages/allocations/AllocationContext";
import QualificationContextProvider from "./pages/qualifications/QualificationsContext";
import QuestionPreview from "./components/QuestionPreview";
import NewManagerEnd from "./pages/managerend/NewManagerEnd";
import QuotasContextProvider from "./pages/quotas/QuotasContext";
import PreRedirectPage from "./pages/pre-redirect-page/PreRedirectPage";
import AddQualificationContextProvider from "./pages/managerend/AddQualificationContext";
import EndPoint from "./pages/end-point/EndPoint";
import Reference from "./pages/Reference";
import ErrorPage from "./pages/BlazeErrorpage/ErrorPage";
import ThankYouPage from "./components/thank-you-page/ThankYouPage";
import Analytics from "./pages/analytics/Analytics";
import SurveyDashboard from "./pages/survey-dashboard/SurveyDashboard";
import SurveyDashboardContextProvider from "./pages/survey-dashboard/SurveyDashboardContext";
import NewProjectSettings from "./pages/project-settings/NewProjectSettings";
import BiddingQuota from "./pages/bidding-quota/BiddingQuota";
import ViewRedirectsEndpoints from "./pages/viewRedirectsEndpoints/ViewRedirectsEndpoints";
import Sources from "./pages/sources/Sources";
import Login from "./pages/login/Login";
import LiveSurveyLogs from "./pages/live-survey-logs/LiveSurveyLogs";
import ReportsContextProvider from "./pages/reports/ReportsContext";
import AnalyticsContextProvider from "./pages/analytics/AnalyticsContext";
import SourcesContextProvider from "./pages/sources/SourcesContext";
import { LiveSurveyLogsContextProvider } from "./pages/live-survey-logs/LiveSurveyLogsContext";
function App() {
  return (
    <>
      <Switch>
        <BaseContextProvider>
          <Route path="/" exact>
            <Dashboard />
          </Route>
          <ProjectContextProvider>
            <Route path="/projects" exact>
              <Projects />
            </Route>
          </ProjectContextProvider>

          <Route path="/accounts">
            <Accounts />
          </Route>
          <Route path="/contacts">
            <Contacts />
          </Route>
          <Route path="/leads">
            <Leads />
          </Route>

          {/* Login */}
          <Route path="/login">
            <Login />
          </Route>

          <Route path="/create-new-project/:edit_option" exact>
            <CreateNewProjectProvider>
              <CreateNewProject />
            </CreateNewProjectProvider>
          </Route>

          <Route path="/projects/dashboard/:surveyID">
            <SurveyDashboardContextProvider>
              <SurveyDashboard />
            </SurveyDashboardContextProvider>
          </Route>

          <Route path="/projects/settings/:surveyID" exact>
            <ProejctSettingProvider>
              <NewProjectSettings />
            </ProejctSettingProvider>
          </Route>

          <Route path="/projects/questions/:surveyID" exact>
            <QualificationContextProvider>
              <Qualifications />
            </QualificationContextProvider>
          </Route>
          <Route path="/projects/quotas/:surveyID" exact>
            <QuotasContextProvider>
              <Quotas />
            </QuotasContextProvider>
          </Route>
          <Route path="/projects/allocations/:surveyID" exact>
            <AllocationContextProvider>
              <Allocations />
            </AllocationContextProvider>
          </Route>
          <Route path="/projects/reports/:surveyID" exact>
            <ReportsContextProvider>
              <Reports />
            </ReportsContextProvider>
          </Route>
          <Route path="/projects/documents/:surveyID" exact>
            <Documents />
          </Route>
          <Route path="/projects/security/:surveyID" exact>
            <Security />
          </Route>
          <Route path="/question-preview/:surveyID/:questionNumber" exact>
            <QualificationContextProvider>
              <QuestionPreview />
            </QualificationContextProvider>
          </Route>
          <Route path="/projects/reconciliations/:surveyID" exact>
            <ReconciliationContextProvider>
              <Reconciliations />
            </ReconciliationContextProvider>
          </Route>
          <Route path="/projects/analytics/:navigationTab/:surveyID">
            <AnalyticsContextProvider>
              <Analytics />
            </AnalyticsContextProvider>
          </Route>

          <Route path="/error">
            <Blaze />
          </Route>

          <Route path="/add/qualifications/:surveyID">
            <AddQualificationContextProvider>
              <NewManagerEnd />
            </AddQualificationContextProvider>
          </Route>

          {/* blaze  */}
          <Route
            path={[
              "/blaze/:encryptedID/lightningStart",
              "/blaze/lightningStart",
              "/blaze/:encryptedID",
              "/blaze",
            ]}
            exact
          >
            <BlazeContextProvider>
              <Blaze />
            </BlazeContextProvider>
          </Route>

          <Route path="/blaze/:encryptedID/reference">
            <Reference />
          </Route>

          <Route path="/blaze/:encryptedID/questions/:questionNumber" exact>
            <SurveyQuestions />
          </Route>
          <Route path="/blaze/:encryptedID/gdpr-consent" exact>
            <GdprCotextProvider>
              <GdprConsent />
            </GdprCotextProvider>
          </Route>

          <Route path="/blaze/:encryptedID/preRedirectUrl/:questionNumber">
            <PreRedirectPage />
          </Route>

          <Route path="/7e08091a73b14e034889265e41ba796f91c766ad/:id/:status">
            <EndPoint />
          </Route>

          <Route path="/er" exact>
            <ErrorPage />
          </Route>
          <Route path="/a9a145d7ed82f6af2680e08ec6729d9f" exact>
            <ThankYouPage />
          </Route>
          {/* blaze end */}

          {/* source  pages  */}

          <Route path="/viewredirects/:surveyID" exact>
            <ViewRedirectsEndpoints />
          </Route>
          <Route path="/biddingquota/:surveyID" exact>
            <BiddingQuota />
          </Route>

          <Route path="/sources/:surveyID" exact>
            <Sources />
          </Route>

          <Route path="/livesurveylogs/:surveyID" exact>
            <LiveSurveyLogsContextProvider>
              <LiveSurveyLogs />
            </LiveSurveyLogsContextProvider>
          </Route>

          <Route path="/projects/sources/:surveyID" exact>
            <SourcesContextProvider>
              <Sources />{" "}
            </SourcesContextProvider>
          </Route>
          {/* source pages end  */}
        </BaseContextProvider>
      </Switch>
    </>
  );
}

export default App;
