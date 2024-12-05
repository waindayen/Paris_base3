import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Wallet, Trophy, Ticket, Menu, Calculator, Mail } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useBetSlip } from '../../contexts/BetSlipContext';
import ContactModal from '../contact/ContactModal';

export default function MobileNavigation() {
  const { currentUser, userData } = useAuth();
  const { bets } = useBetSlip();
  const navigate = useNavigate();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const isUserOrAgent = userData?.role === 'externaluser' || userData?.role === 'agentuser';

  // Si l'utilisateur n'est pas connecté, afficher la navigation de base
  if (!currentUser) {
    return (
      <>
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
          <div className="grid grid-cols-6 h-16">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 ${
                  isActive ? 'text-blue-600' : 'text-gray-600'
                }`
              }
            >
              <Home className="w-6 h-6" />
              <span className="text-xs">Accueil</span>
            </NavLink>

            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 ${
                  isActive ? 'text-blue-600' : 'text-gray-600'
                }`
              }
            >
              <Trophy className="w-6 h-6" />
              <span className="text-xs">Football</span>
            </NavLink>

            <NavLink
              to="/lotto"
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 ${
                  isActive ? 'text-blue-600' : 'text-gray-600'
                }`
              }
            >
              <Ticket className="w-6 h-6" />
              <span className="text-xs">Lotto</span>
            </NavLink>

            <NavLink
              to="/lotto/results"
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 ${
                  isActive ? 'text-blue-600' : 'text-gray-600'
                }`
              }
            >
              <Trophy className="w-6 h-6" />
              <span className="text-xs">Résultats</span>
            </NavLink>

            <button
              onClick={() => navigate('/betslip')}
              className="flex flex-col items-center justify-center gap-1 text-gray-600 relative"
            >
              <Calculator className="w-6 h-6" />
              <span className="text-xs">Panier</span>
              {bets.length > 0 && (
                <span className="absolute -top-1 right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {bets.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsContactModalOpen(true)}
              className="flex flex-col items-center justify-center gap-1 text-gray-600"
            >
              <Mail className="w-6 h-6" />
              <span className="text-xs">Contact</span>
            </button>
          </div>
        </nav>

        <ContactModal 
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
        />
      </>
    );
  }

  // Si l'utilisateur est un agent ou un utilisateur externe
  if (isUserOrAgent) {
    return (
      <>
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
          <div className="grid grid-cols-6 h-16">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 ${
                  isActive ? 'text-blue-600' : 'text-gray-600'
                }`
              }
            >
              <Home className="w-6 h-6" />
              <span className="text-xs">Accueil</span>
            </NavLink>

            <NavLink
              to="/deposit"
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 ${
                  isActive ? 'text-blue-600' : 'text-gray-600'
                }`
              }
            >
              <Wallet className="w-6 h-6" />
              <span className="text-xs">Dépôt</span>
            </NavLink>

            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 ${
                  isActive ? 'text-blue-600' : 'text-gray-600'
                }`
              }
            >
              <Trophy className="w-6 h-6" />
              <span className="text-xs">Football</span>
            </NavLink>

            <NavLink
              to="/lotto"
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 ${
                  isActive ? 'text-blue-600' : 'text-gray-600'
                }`
              }
            >
              <Ticket className="w-6 h-6" />
              <span className="text-xs">Lotto</span>
            </NavLink>

            <button
              onClick={() => navigate('/betslip')}
              className="flex flex-col items-center justify-center gap-1 text-gray-600 relative"
            >
              <Calculator className="w-6 h-6" />
              <span className="text-xs">Panier</span>
              {bets.length > 0 && (
                <span className="absolute -top-1 right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {bets.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsContactModalOpen(true)}
              className="flex flex-col items-center justify-center gap-1 text-gray-600"
            >
              <Mail className="w-6 h-6" />
              <span className="text-xs">Contact</span>
            </button>
          </div>
        </nav>

        <ContactModal 
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
        />
      </>
    );
  }

  // Pour les autres types d'utilisateurs, ne pas afficher de navigation mobile
  return null;
}