import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  X, 
  Home, 
  Trophy, 
  Ticket, 
  LogOut,
  LayoutDashboard,
  Users,
  Shield,
  Settings,
  Calendar,
  Clock,
  Database,
  BarChart,
  TrendingUp,
  AlertTriangle,
  FileText,
  DollarSign,
  ChevronDown,
  Wallet,
  History,
  Gift,
  Lock,
  UserCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import Logo from './Logo';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { logout, userData } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);
  const [openSubMenu, setOpenSubMenu] = React.useState<string | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getMenuItems = () => {
    const role = userData?.role;

    switch (role) {
      case 'externaluser':
      case 'agentuser':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: `/dashboard/${role.replace('user', '')}` },
          { 
            icon: Trophy, 
            label: 'Paris Sport',
            subMenu: [
              { icon: Clock, label: 'Paris en cours', path: '/dashboard/bets/active' },
              { icon: CheckCircle, label: 'Paris gagnés', path: '/dashboard/bets/won' },
              { icon: XCircle, label: 'Paris perdus', path: '/dashboard/bets/lost' },
              { icon: History, label: 'Historique', path: '/dashboard/bets/history' }
            ]
          },
          { icon: Wallet, label: 'Dépôt', path: '/deposit' },
          { icon: DollarSign, label: 'Retrait', path: '/withdraw' },
          { icon: History, label: 'Transactions', path: '/transactions' },
          { icon: Users, label: 'Parrainage', path: '/referral' },
          { icon: Gift, label: 'Bonus', path: '/bonus' },
          { icon: Lock, label: 'Sécurité', path: '/security' },
          { icon: UserCircle, label: 'Profile', path: '/profile' }
        ];

      case 'adminuser':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard/admin' },
          { 
            icon: Trophy, 
            label: 'Lottos',
            subMenu: [
              { icon: Calendar, label: 'Liste des lottos', path: '/dashboard/admin/lottos' },
              { icon: Trophy, label: 'Créer un lotto', path: '/dashboard/admin/setup-lotto' },
              { icon: Clock, label: 'Tirages', path: '/dashboard/admin/lotto-draws' }
            ]
          },
          { icon: Users, label: 'Utilisateurs', path: '/dashboard/admin/users' },
          { icon: Shield, label: 'Permissions', path: '/dashboard/admin/permissions' },
          { icon: Settings, label: 'Configuration', path: '/dashboard/admin/site-config' }
        ];

      case 'staffuser':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard/staff' },
          { icon: Users, label: 'Clients', path: '/dashboard/staff/clients' },
          { icon: FileText, label: 'Tickets', path: '/dashboard/staff/tickets' },
          { icon: Trophy, label: 'Historique', path: '/dashboard/staff/history' }
        ];

      case 'manageruser':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard/manager' },
          { icon: Users, label: 'Équipe', path: '/dashboard/manager/team' },
          { icon: BarChart, label: 'Rapports', path: '/dashboard/manager/reports' },
          { icon: TrendingUp, label: 'Performance', path: '/dashboard/manager/performance' },
          { icon: Settings, label: 'Paramètres', path: '/dashboard/manager/settings' }
        ];

      case 'directoruser':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard/director' },
          { icon: TrendingUp, label: 'Performance', path: '/dashboard/director/performance' },
          { icon: Users, label: 'Agents', path: '/dashboard/director/agents' },
          { icon: DollarSign, label: 'Finances', path: '/dashboard/director/finances' },
          { icon: AlertTriangle, label: 'Risques', path: '/dashboard/director/risks' },
          { icon: Settings, label: 'Paramètres', path: '/dashboard/director/settings' }
        ];

      case 'ucieruser':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard/ucier' },
          { icon: Shield, label: 'Conformité', path: '/dashboard/ucier/compliance' },
          { icon: AlertTriangle, label: 'Alertes', path: '/dashboard/ucier/alerts' },
          { icon: FileText, label: 'Rapports', path: '/dashboard/ucier/reports' },
          { icon: Settings, label: 'Paramètres', path: '/dashboard/ucier/settings' }
        ];

      case 'apiuser':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard/api' },
          { icon: Database, label: 'Configuration API', path: '/dashboard/api/odds-config' },
          { icon: BarChart, label: 'Sports', path: '/dashboard/api/sports-config' },
          { icon: Settings, label: 'Paramètres', path: '/dashboard/api/settings' }
        ];

      default:
        return [
          { icon: Home, label: 'Accueil', path: '/' },
          { icon: Trophy, label: 'Football', path: '/football' },
          { icon: Ticket, label: 'Lotto', path: '/lotto' }
        ];
    }
  };

  const menuItems = getMenuItems();

  const toggleSubMenu = (label: string) => {
    setOpenSubMenu(openSubMenu === label ? null : label);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div 
        ref={menuRef}
        className="fixed inset-y-0 left-0 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto"
      >
        <div className="flex flex-col min-h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <Logo />
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 p-4">
            <div className="space-y-1">
              {menuItems.map((item, index) => (
                <div key={index}>
                  {item.subMenu ? (
                    <>
                      <button
                        onClick={() => toggleSubMenu(item.label)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform ${openSubMenu === item.label ? 'rotate-180' : ''}`} />
                      </button>
                      {openSubMenu === item.label && (
                        <div className="ml-4 pl-4 border-l border-gray-200 space-y-1 mt-1">
                          {item.subMenu.map((subItem, subIndex) => (
                            <NavLink
                              key={subIndex}
                              to={subItem.path}
                              onClick={onClose}
                              className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                                  isActive
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`
                              }
                            >
                              <subItem.icon className="w-4 h-4" />
                              <span className="font-medium text-sm">{subItem.label}</span>
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <NavLink
                      to={item.path}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </NavLink>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 mt-auto">
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}