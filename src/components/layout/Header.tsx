import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Calculator, LogIn, LogOut, UserPlus, Mail, LayoutDashboard } from 'lucide-react';
import Logo from './Logo';
import NotificationBell from '../NotificationBell';
import ConnectionStatus from '../ConnectionStatus';
import { useBetSlip } from '../../contexts/BetSlipContext';
import { useAuth } from '../../contexts/AuthContext';
import MobileMenu from './MobileMenu';
import ContactModal from '../contact/ContactModal';

interface HeaderProps {
  onToggleBetSlip: () => void;
  showBetSlip: boolean;
}

export default function Header({ onToggleBetSlip, showBetSlip }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const { bets } = useBetSlip();
  const { currentUser, userData, logout } = useAuth();
  const navigate = useNavigate();
  const isApiUser = userData?.role === 'apiuser';
  const isUserOrAgent = userData?.role === 'externaluser' || userData?.role === 'agentuser';

  const handleBetSlipClick = () => {
    onToggleBetSlip();
  };

  const handleAuthClick = () => {
    if (currentUser) {
      logout();
    } else {
      navigate('/login');
    }
  };

  const getDashboardPath = () => {
    if (!userData?.role) return '/';
    return `/dashboard/${userData.role.replace('user', '')}`;
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {!isApiUser && !isUserOrAgent && (
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Menu"
                >
                  <Menu className="w-6 h-6 text-gray-600" />
                </button>
              )}
              <Link to="/" className="flex items-center gap-2">
                <Logo />
              </Link>
            </div>

            {/* Navigation desktop */}
            {!isApiUser && (
              <nav className="hidden lg:flex items-center gap-6">
                <Link
                  to="/"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Accueil
                </Link>
                <Link
                  to="/football"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Football
                </Link>
                <Link
                  to="/lotto"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Lotto
                </Link>
                <Link
                  to="/lotto/results"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Résultats
                </Link>
                {isUserOrAgent && (
                  <Link
                    to={getDashboardPath()}
                    className="text-gray-700 hover:text-blue-600 transition-colors font-medium flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Tableau de bord</span>
                  </Link>
                )}
              </nav>
            )}

            <div className="flex items-center gap-4">
              <ConnectionStatus />
              {showBetSlip && (
                <button
                  onClick={handleBetSlipClick}
                  className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Calculator className="w-6 h-6 text-gray-600" />
                  {bets.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {bets.length}
                    </span>
                  )}
                </button>
              )}
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="hidden md:flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
              >
                <Mail className="w-6 h-6" />
                <span className="font-medium">Contact</span>
              </button>
              <NotificationBell />
              {!currentUser && (
                <button
                  onClick={() => navigate('/signup')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                  title="S'inscrire"
                >
                  <UserPlus className="w-6 h-6" />
                </button>
              )}
              <button
                onClick={handleAuthClick}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                title={currentUser ? "Se déconnecter" : "Se connecter"}
              >
                {currentUser ? <LogOut className="w-6 h-6" /> : <LogIn className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Menu Mobile */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </>
  );
}