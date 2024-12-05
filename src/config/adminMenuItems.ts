import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Shield, 
  Database,
  AlertTriangle,
  FileText,
  Trophy,
  Calendar,
  Calculator,
  DollarSign
} from 'lucide-react';

export const adminMenuItems = [
  { 
    icon: LayoutDashboard, 
    label: 'Dashboard', 
    path: '/dashboard/admin' 
  },
  { 
    icon: Trophy, 
    label: 'Paris',
    submenu: [
      { 
        icon: Calculator, 
        label: 'Paris Combinés', 
        path: '/dashboard/admin/combined-bets' 
      },
      { 
        icon: Trophy, 
        label: 'Liste des lottos', 
        path: '/dashboard/admin/lottos' 
      },
      { 
        icon: Calendar, 
        label: 'Créer un lotto', 
        path: '/dashboard/admin/setup-lotto' 
      },
      { 
        icon: Trophy, 
        label: 'Tirages', 
        path: '/dashboard/admin/lotto-draws' 
      }
    ]
  },
  { 
    icon: Users, 
    label: 'Utilisateurs', 
    path: '/dashboard/admin/users' 
  },
  { 
    icon: Shield, 
    label: 'Permissions', 
    path: '/dashboard/admin/permissions' 
  },
  { 
    icon: DollarSign, 
    label: 'Finances',
    submenu: [
      { 
        icon: Calculator, 
        label: 'Limites de paris', 
        path: '/dashboard/admin/betting-limits' 
      },
      { 
        icon: DollarSign, 
        label: 'Transactions', 
        path: '/dashboard/admin/transactions' 
      }
    ]
  },
  { 
    icon: Database, 
    label: 'Base de données', 
    path: '/dashboard/admin/database' 
  },
  { 
    icon: AlertTriangle, 
    label: 'Alertes', 
    path: '/dashboard/admin/alerts' 
  },
  { 
    icon: FileText, 
    label: 'Logs', 
    path: '/dashboard/admin/logs' 
  },
  { 
    icon: Settings, 
    label: 'Configuration', 
    path: '/dashboard/admin/site-config' 
  }
];