import { 
  LayoutDashboard, 
  Dices, 
  Wallet, 
  History, 
  Users, 
  Gift, 
  Lock, 
  UserCircle,
  Trophy,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

export const userMenuItems = [
  { 
    icon: LayoutDashboard, 
    label: 'Dashboard', 
    path: '/dashboard/external' 
  },
  { 
    icon: Trophy, 
    label: 'Paris Sport',
    submenu: [
      { icon: Clock, label: 'Paris en cours', path: '/dashboard/bets/active' },
      { icon: CheckCircle, label: 'Paris gagnés', path: '/dashboard/bets/won' },
      { icon: XCircle, label: 'Paris perdus', path: '/dashboard/bets/lost' },
      { icon: History, label: 'Historique', path: '/dashboard/bets/history' }
    ]
  },
  { icon: Wallet, label: 'Dépôt', path: '/deposit' },
  { icon: History, label: 'Transactions', path: '/transactions' },
  { icon: Users, label: 'Parrainage', path: '/referral' },
  { icon: Gift, label: 'Bonus', path: '/bonus' },
  { icon: Lock, label: 'Sécurité', path: '/security' },
  { icon: UserCircle, label: 'Profile', path: '/profile' }
];