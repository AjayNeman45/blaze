import { Redirect, Route, Switch } from "react-router-dom";
import Surveys from "./pages/surveys/Surveys";
// import Dashboard from "./pages/dashboard/Dashboard";
import Dashboard from "./pages/dashboard-new/Dashboard";
import Accounts from "./pages/accounts-new/Accounts";
import Leads from "./pages/leads/Leads";
import CreateNewProject from "./pages/create-new-project/CreateNewProject";
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
import Analytics from "./pages/analytics/Analytics";
import SurveyDashboard from "./pages/survey-dashboard/SurveyDashboard";
import SurveyDashboardContextProvider from "./pages/survey-dashboard/SurveyDashboardContext";
import NewProjectSettings from "./pages/project-settings/ProjectSettings";
import BiddingQuota from "./pages/bidding-quota/BiddingQuota";
import ViewRedirectsEndpoints from "./pages/viewRedirectsEndpoints/ViewRedirectsEndpoints";
import Sources from "./pages/sources/Sources";
import Login from "./pages/login/Login";
import LiveSurveyLogs from "./pages/live-survey-logs/LiveSurveyLogs";
import ReportsContextProvider from "./pages/reports/ReportsContext";
import AnalyticsContextProvider from "./pages/analytics/AnalyticsContext";
import SourcesContextProvider from "./pages/sources/SourcesContext";
import { LiveSurveyLogsContextProvider } from "./pages/live-survey-logs/LiveSurveyLogsContext";
import NewSupplier from "./pages/client_supplier/pages/new-supplier/NewSupplier";
import NewClient from "./pages/client_supplier/pages/new-client/NewClient";
import DashboardContextProvider from "./pages/dashboard-new/DashboardContext";
import QuestionLibrary from "./pages/question-library/QuestionLibrary";
import QualificationLibraryContextProvider from "./pages/question-library/QuestionLibraryContext";
import SurveyGroups from "./pages/survey-groups/SurveyGroups";
import SurveyContextProvider from "./pages/surveys/SurveyContext";
import ProjectContextProvider from "./pages/surveys/ProjectContext";
import SupplierOverview from "./pages/analytics/supplier-overview/SupplierOverview";
import SupplierOverviewContextProvider from "./pages/analytics/supplier-overview/SupplierOverviewContext";
import SupplierRedirects from "./pages/SupplierRedirects/SupplierRedirects";
import SurveyGroupContextProvider from "./pages/survey-groups/SurveyGroupContext";
import LoginContextProvider from "./pages/login/LoginContext";
import Financial from "./pages/financial/Financial";
import Clients from "./pages/clients/Clients";
import Supplier from "./pages/supplier/Supplier";
import Contacts from "./pages/contacts-new/Contacts";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";

function ProtectedRoute({ children }) {
  const [user, loading] = useAuthState(auth);
  if (!loading && !user) {
    return <Redirect to="/login" />;
  }
  return children;
}

function App() {
  const [user, loading] = useAuthState(auth);

  return (
    <>
      <Switch>
        {/* blaze  */}

        <Route path="/error" exact>
          <Blaze />
        </Route>
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

        <Route path="/blaze/:encryptedID/reference" exact>
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

        <Route
          path="/7e08091a73b14e034889265e41ba796f91c766ad/:id/:status"
          exact
        >
          <EndPoint />
        </Route>
        <Route path="/blaze/:encryptedID/preRedirectUrl/:questionNumber" exact>
          <PreRedirectPage />
        </Route>

        <Route path="/er" exact>
          <ErrorPage />
        </Route>
        {/* blaze end */}

        <BaseContextProvider>
          <Route path="/" exact>
            <ProtectedRoute>
              <DashboardContextProvider>
                <Dashboard />
              </DashboardContextProvider>
            </ProtectedRoute>
          </Route>

          <Route path="/survey-groups" exact>
            <ProtectedRoute>
              <SurveyGroupContextProvider>
                <SurveyGroups />
              </SurveyGroupContextProvider>
            </ProtectedRoute>
          </Route>

          <Route path="/aaa/accounts" exact>
            <ProtectedRoute>
              <Accounts />
            </ProtectedRoute>
          </Route>
          <Route path="/leads" exact>
            <ProtectedRoute>
              <Leads />
            </ProtectedRoute>
          </Route>

          {/* Login */}

          <Route path="/login" exact>
            <LoginContextProvider>
              <Login />
            </LoginContextProvider>
          </Route>

          <Route path="/create-new-project/:edit_option" exact>
            <ProtectedRoute>
              <CreateNewProjectProvider>
                <CreateNewProject />
              </CreateNewProjectProvider>
            </ProtectedRoute>
          </Route>

          {/* put here one context that can fetch the survey once and send it below the component  */}

          <Route path="/surveys/dashboard/:surveyID" exact>
            <ProtectedRoute>
              <SurveyDashboardContextProvider>
                <SurveyDashboard />
              </SurveyDashboardContextProvider>
            </ProtectedRoute>
          </Route>
          <Route path="/surveys/settings/:surveyID" exact>
            <ProtectedRoute>
              <ProejctSettingProvider>
                <NewProjectSettings />
              </ProejctSettingProvider>
            </ProtectedRoute>
          </Route>
          <Route path="/surveys/qualifications/:surveyID" exact>
            <ProtectedRoute>
              <QualificationContextProvider>
                <Qualifications />
              </QualificationContextProvider>
            </ProtectedRoute>
          </Route>
          <Route path="/surveys/quotas/:surveyID" exact>
            <ProtectedRoute>
              <QuotasContextProvider>
                <Quotas />
              </QuotasContextProvider>
            </ProtectedRoute>
          </Route>
          <Route path="/surveys/allocations/:surveyID" exact>
            <ProtectedRoute>
              <AllocationContextProvider>
                <Allocations />
              </AllocationContextProvider>
            </ProtectedRoute>
          </Route>
          <Route path="/surveys/reports/:surveyID" exact>
            <ProtectedRoute>
              <ReportsContextProvider>
                <Reports />
              </ReportsContextProvider>
            </ProtectedRoute>
          </Route>
          <Route path="/surveys/documents/:surveyID" exact>
            <ProtectedRoute>
              <Documents />
            </ProtectedRoute>
          </Route>
          <Route path="/surveys/security/:surveyID" exact>
            <ProtectedRoute>
              <Security />
            </ProtectedRoute>
          </Route>
          <Route path="/surveys/reconciliations/:surveyID" exact>
            <ProtectedRoute>
              <ReconciliationContextProvider>
                <Reconciliations />
              </ReconciliationContextProvider>
            </ProtectedRoute>
          </Route>
          <Route path="/surveys/analytics/:navigationTab/:surveyID" exact>
            <ProtectedRoute>
              <AnalyticsContextProvider>
                <Analytics />
              </AnalyticsContextProvider>
            </ProtectedRoute>
          </Route>
          <Route
            path="/surveys/analytics/supplier-overview/:surveyID/:supplierID"
            exact
          >
            <ProtectedRoute>
              <AnalyticsContextProvider>
                <SupplierOverviewContextProvider>
                  <SupplierOverview />
                </SupplierOverviewContextProvider>
              </AnalyticsContextProvider>
            </ProtectedRoute>
          </Route>
          <Route path="/surveys/financials/:surveyID" exact>
            <ProtectedRoute>
              <Financial />
            </ProtectedRoute>
          </Route>
          <Route path="/surveys/sources/:surveyID" exact>
            <ProtectedRoute>
              <SourcesContextProvider>
                <Sources />{" "}
              </SourcesContextProvider>
            </ProtectedRoute>
          </Route>

          {/* single survey fetch pages end  */}

          {/* independent pages  */}
          <Route path="/question-library" exact>
            <ProtectedRoute>
              <QualificationLibraryContextProvider>
                <QuestionLibrary />
              </QualificationLibraryContextProvider>
            </ProtectedRoute>
          </Route>

          <Route path="/question-preview/:surveyID/:questionNumber" exact>
            <ProtectedRoute>
              <QualificationContextProvider>
                <QuestionPreview />
              </QualificationContextProvider>
            </ProtectedRoute>
          </Route>

          <Route path="/add/qualifications/:surveyID" exact>
            <ProtectedRoute>
              <AddQualificationContextProvider>
                <NewManagerEnd />
              </AddQualificationContextProvider>
            </ProtectedRoute>
          </Route>

          <Route path="/clients" exact>
            <ProtectedRoute>
              <Clients />
            </ProtectedRoute>
          </Route>
          <Route path="/supplier" exact>
            <ProtectedRoute>
              <Supplier />
            </ProtectedRoute>
          </Route>

          <Route path="/contacts" exact>
            <ProtectedRoute>
              <Contacts />
            </ProtectedRoute>
          </Route>
          {/* independent pages done  */}

          {/* source  pages  */}

          <Route path="/viewredirects/:surveyID" exact>
            <ProtectedRoute>
              <ViewRedirectsEndpoints />
            </ProtectedRoute>
          </Route>
          <Route path="/biddingquota/:surveyID" exact>
            <ProtectedRoute>
              <BiddingQuota />
            </ProtectedRoute>
          </Route>

          <Route path="/sources/:surveyID" exact>
            <ProtectedRoute>
              <Sources />
            </ProtectedRoute>
          </Route>

          <Route path="/livesurveylogs/:surveyID" exact>
            <ProtectedRoute>
              <LiveSurveyLogsContextProvider>
                <LiveSurveyLogs />
              </LiveSurveyLogsContextProvider>
            </ProtectedRoute>
          </Route>

          {/* source pages end  */}

          {/* New Supplier and Client  */}
          <Route path="/new-supplier" exact>
            <ProtectedRoute>
              <NewSupplier />
            </ProtectedRoute>
          </Route>
          <Route path="/new-client">
            <ProtectedRoute>
              <NewClient />
            </ProtectedRoute>
          </Route>

          <Route path="/mi/:activity" exact>
            <ProtectedRoute>
              <SurveyContextProvider>
                <ProjectContextProvider>
                  <Surveys />
                </ProjectContextProvider>
              </SurveyContextProvider>
            </ProtectedRoute>
          </Route>

          <Route path="/a/supplier_redirects" exact>
            <ProtectedRoute>
              <SupplierRedirects />
            </ProtectedRoute>
          </Route>
        </BaseContextProvider>
      </Switch>
    </>
  );
}

export default App;
