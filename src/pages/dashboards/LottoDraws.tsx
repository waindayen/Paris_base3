import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BaseDashboard from './BaseDashboard';
import PendingDraws from '../../components/lotto/draws/PendingDraws';
import PrizeHistory from '../../components/lotto/draws/PrizeHistory';
import { Trophy, History } from 'lucide-react';

export default function LottoDraws() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const tabs = [
    { 
      id: 'pending',
      label: 'En attente de calcul',
      icon: Trophy,
      path: '/dashboard/admin/lotto-draws'
    },
    { 
      id: 'history',
      label: 'Historique des gains',
      icon: History,
      path: '/dashboard/admin/lotto-draws/history'
    }
  ];

  const getActiveTab = () => {
    if (currentPath.endsWith('/history')) return 'history';
    return 'pending';
  };

  const activeTab = getActiveTab();

  return (
    <BaseDashboard title="Gestion des Tirages Lotto">
      {/* Tabs Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'pending' ? <PendingDraws /> : <PrizeHistory />}
    </BaseDashboard>
  );
}