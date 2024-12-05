import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Trophy, Ticket, Calculator } from 'lucide-react';
import { useBetSlip } from '../../contexts/BetSlipContext';

export default function UserMobileNavigation() {
  const navigate = useNavigate();
  const { bets } = useBetSlip();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
      <div className="grid grid-cols-5 h-16">
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
      </div>
    </nav>
  );
}