import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { BetSlipProvider } from './contexts/BetSlipContext';
import { ConnectionProvider } from './contexts/ConnectionContext';
import Header from './components/layout/Header';
import BetSlip from './components/betslip/BetSlip';
import PrivateRoute from './components/PrivateRoute';
import RoleRoute from './components/RoleRoute';
import AuthLayout from './components/layout/AuthLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import MobileNavigation from './components/layout/MobileNavigation';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Blog from './pages/Blog';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Unauthorized from './pages/Unauthorized';
import MobileBetSlip from './pages/MobileBetSlip';
import Lotto from './pages/Lotto';
import LottoResults from './pages/LottoResults';
import Contact from './pages/Contact';

// Wallet Pages
import Deposit from './pages/wallet/Deposit';
import Withdraw from './pages/wallet/Withdraw';

// Bet Pages
import ActiveBets from './pages/bets/ActiveBets';
import WonBets from './pages/bets/WonBets';
import LostBets from './pages/bets/LostBets';
import BetsHistory from './pages/bets/BetsHistory';

// Admin Pages
import CombinedBetsConfig from './pages/dashboards/admin/CombinedBetsConfig';

// Dashboards
import ExternalDashboard from './pages/dashboards/ExternalDashboard';
import AgentDashboard from './pages/dashboards/AgentDashboard';
import StaffDashboard from './pages/dashboards/StaffDashboard';
import ManagerDashboard from './pages/dashboards/ManagerDashboard';
import DirectorDashboard from './pages/dashboards/director/DirectorDashboard';
import ApiDashboard from './pages/dashboards/ApiDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import UcierDashboard from './pages/dashboards/UcierDashboard';
import SiteConfig from './pages/dashboards/SiteConfig';
import OddsConfigPage from './pages/dashboards/api/OddsConfigPage';
import SportsConfigPage from './pages/dashboards/api/SportsConfigPage';
import LottoManagement from './pages/dashboards/admin/LottoManagement';
import SetupLotto from './pages/dashboards/admin/SetupLotto';
import LottoDraws from './pages/dashboards/LottoDraws';
import ContactFormConfig from './pages/dashboards/admin/ContactFormConfig';

const MainLayout = () => {
  const [isBetSlipOpen, setIsBetSlipOpen] = React.useState(true);
  const { userData } = useAuth();
  const isApiUser = userData?.role === 'apiuser';
  const showBetSlip = !isApiUser && window.location.pathname === '/';
  
  return (
    <div className="min-h-screen bg-gray-50">
      {!isApiUser && (
        <Header onToggleBetSlip={() => setIsBetSlipOpen(!isBetSlipOpen)} showBetSlip={showBetSlip} />
      )}
      <div className={`pt-16 pb-16 md:pb-0 ${showBetSlip ? 'md:pr-80' : ''}`}>
        <Outlet />
      </div>
      {showBetSlip && (
        <div className="hidden md:block">
          <BetSlip isOpen={isBetSlipOpen} onClose={() => setIsBetSlipOpen(!isBetSlipOpen)} />
        </div>
      )}
      {!isApiUser && <MobileNavigation />}
    </div>
  );
};

const DashboardRedirect = () => {
  const { userData } = useAuth();
  const role = userData?.role?.replace('user', '') || 'external';
  return <Navigate to={`/dashboard/${role}`} replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <ConnectionProvider>
        <BetSlipProvider>
          <Router>
            <Routes>
              {/* Routes publiques avec AuthLayout */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
              </Route>

              {/* Routes publiques avec MainLayout */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/lotto" element={<Lotto />} />
                <Route path="/lotto/results" element={<LottoResults />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/betslip" element={<MobileBetSlip />} />
              </Route>

              {/* Routes protégées avec DashboardLayout */}
              <Route path="/dashboard" element={<PrivateRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route index element={<DashboardRedirect />} />
                  
                  {/* Routes Admin */}
                  <Route path="admin" element={<RoleRoute allowedRoles={['adminuser']}><AdminDashboard /></RoleRoute>} />
                  <Route path="admin/site-config" element={<RoleRoute allowedRoles={['adminuser']}><SiteConfig /></RoleRoute>} />
                  <Route path="admin/combined-bets" element={<RoleRoute allowedRoles={['adminuser']}><CombinedBetsConfig /></RoleRoute>} />
                  <Route path="admin/lottos" element={<RoleRoute allowedRoles={['adminuser']}><LottoManagement /></RoleRoute>} />
                  <Route path="admin/setup-lotto" element={<RoleRoute allowedRoles={['adminuser']}><SetupLotto /></RoleRoute>} />
                  <Route path="admin/setup-lotto/:id" element={<RoleRoute allowedRoles={['adminuser']}><SetupLotto /></RoleRoute>} />
                  <Route path="admin/lotto-draws" element={<RoleRoute allowedRoles={['adminuser']}><LottoDraws /></RoleRoute>} />
                  <Route path="admin/contact-config" element={<RoleRoute allowedRoles={['adminuser']}><ContactFormConfig /></RoleRoute>} />

                  {/* Routes API */}
                  <Route path="api" element={<RoleRoute allowedRoles={['apiuser']}><ApiDashboard /></RoleRoute>} />
                  <Route path="api/odds-config" element={<RoleRoute allowedRoles={['apiuser']}><OddsConfigPage /></RoleRoute>} />
                  <Route path="api/sports-config" element={<RoleRoute allowedRoles={['apiuser']}><SportsConfigPage /></RoleRoute>} />

                  {/* Routes Director */}
                  <Route path="director" element={<RoleRoute allowedRoles={['directoruser']}><DirectorDashboard /></RoleRoute>} />

                  {/* Routes Ucier */}
                  <Route path="ucier" element={<RoleRoute allowedRoles={['ucieruser']}><UcierDashboard /></RoleRoute>} />

                  {/* Routes des paris - Non accessibles aux API users */}
                  <Route path="bets/active" element={<RoleRoute allowedRoles={['externaluser', 'agentuser']}><ActiveBets /></RoleRoute>} />
                  <Route path="bets/won" element={<RoleRoute allowedRoles={['externaluser', 'agentuser']}><WonBets /></RoleRoute>} />
                  <Route path="bets/lost" element={<RoleRoute allowedRoles={['externaluser', 'agentuser']}><LostBets /></RoleRoute>} />
                  <Route path="bets/history" element={<RoleRoute allowedRoles={['externaluser', 'agentuser']}><BetsHistory /></RoleRoute>} />

                  {/* Routes du portefeuille - Non accessibles aux API users */}
                  <Route path="deposit" element={<RoleRoute allowedRoles={['externaluser', 'agentuser']}><Deposit /></RoleRoute>} />
                  <Route path="withdraw" element={<RoleRoute allowedRoles={['externaluser', 'agentuser']}><Withdraw /></RoleRoute>} />

                  {/* Autres routes */}
                  <Route path="external" element={<RoleRoute allowedRoles={['externaluser']}><ExternalDashboard /></RoleRoute>} />
                  <Route path="agent" element={<RoleRoute allowedRoles={['agentuser']}><AgentDashboard /></RoleRoute>} />
                  <Route path="staff" element={<RoleRoute allowedRoles={['staffuser']}><StaffDashboard /></RoleRoute>} />
                  <Route path="manager" element={<RoleRoute allowedRoles={['manageruser']}><ManagerDashboard /></RoleRoute>} />
                </Route>
              </Route>
            </Routes>
          </Router>
        </BetSlipProvider>
      </ConnectionProvider>
    </AuthProvider>
  );
}