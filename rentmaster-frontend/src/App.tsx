import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { LocalizationProvider } from './context/LocalizationContext';
import { LoginPage } from './pages/LoginPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotificationSettingsPage } from './pages/NotificationSettingsPage';
import { DashboardPage } from './pages/DashboardPage';
import { PropertiesPage } from './pages/PropertiesPage';
import { TenantsPage } from './pages/TenantsPage';
import { ContractsPage } from './pages/ContractsPage';
import { InvoicesPage } from './pages/InvoicesPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { UsersPage } from './pages/UsersPage';
import { ServicesPage } from './pages/ServicesPage';
import { OrganizationsPage } from './pages/OrganizationsPage';
import { AutomationPage } from './pages/AutomationPage';
import { RecurringInvoicesPage } from './pages/RecurringInvoicesPage';
import { ScheduledReportsPage } from './pages/ScheduledReportsPage';
import { FinancialDashboardPage } from './pages/FinancialDashboardPage';
import { FinancialManagementPage } from './pages/FinancialManagementPage';
import { ExpensesPage } from './pages/ExpensesPage';
import { CurrencyManagementPage } from './pages/CurrencyManagementPage';
import { DocumentManagementPage } from './pages/DocumentManagementPage';
import { CommunicationPage } from './pages/CommunicationPage';
import { EmailTemplatesPage } from './pages/EmailTemplatesPage';
import { TenantPortalPage } from './pages/TenantPortalPage';
import { AdvancedAnalyticsPage } from './pages/AdvancedAnalyticsPage';
import { PropertyManagementPage } from './pages/PropertyManagementPage';
import { CommunityPage } from './pages/CommunityPage';
import { IntegrationPage } from './pages/IntegrationPage';
import SearchPage from './pages/SearchPage';
import { LocalizationPage } from './pages/LocalizationPage';
import { MessagingPage } from './pages/MessagingPage';
import { MaintenanceOperationsPage } from './pages/MaintenanceOperationsPage';
import { BusinessIntelligencePage } from './pages/BusinessIntelligencePage';

const PrivateRoute = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export const App = () => {
  return (
    <LocalizationProvider>
      <NotificationProvider>
        <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      
      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/properties"
        element={
          <PrivateRoute>
            <PropertiesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/tenants"
        element={
          <PrivateRoute>
            <TenantsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/contracts"
        element={
          <PrivateRoute>
            <ContractsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/invoices"
        element={
          <PrivateRoute>
            <InvoicesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/payments"
        element={
          <PrivateRoute>
            <PaymentsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/users"
        element={
          <PrivateRoute>
            <UsersPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/services"
        element={
          <PrivateRoute>
            <ServicesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/organizations"
        element={
          <PrivateRoute>
            <OrganizationsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <PrivateRoute>
            <NotificationSettingsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/automation"
        element={
          <PrivateRoute>
            <AutomationPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/automation/recurring-invoices"
        element={
          <PrivateRoute>
            <RecurringInvoicesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/automation/scheduled-reports"
        element={
          <PrivateRoute>
            <ScheduledReportsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/financial"
        element={
          <PrivateRoute>
            <FinancialDashboardPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/expenses"
        element={
          <PrivateRoute>
            <ExpensesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/currencies"
        element={
          <PrivateRoute>
            <CurrencyManagementPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/financial-management"
        element={
          <PrivateRoute>
            <FinancialManagementPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/documents"
        element={
          <PrivateRoute>
            <DocumentManagementPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/communication"
        element={
          <PrivateRoute>
            <CommunicationPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/email-templates"
        element={
          <PrivateRoute>
            <EmailTemplatesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/tenant-portal"
        element={
          <PrivateRoute>
            <TenantPortalPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <PrivateRoute>
            <AdvancedAnalyticsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/business-intelligence"
        element={
          <PrivateRoute>
            <BusinessIntelligencePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/property-management"
        element={
          <PrivateRoute>
            <PropertyManagementPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/community"
        element={
          <PrivateRoute>
            <CommunityPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/integrations"
        element={
          <PrivateRoute>
            <IntegrationPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/search"
        element={
          <PrivateRoute>
            <SearchPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/localization"
        element={
          <PrivateRoute>
            <LocalizationPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/messaging"
        element={
          <PrivateRoute>
            <MessagingPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/maintenance"
        element={
          <PrivateRoute>
            <MaintenanceOperationsPage />
          </PrivateRoute>
        }
      />
      
      {/* Default redirects */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
      </NotificationProvider>
    </LocalizationProvider>
  );
};
