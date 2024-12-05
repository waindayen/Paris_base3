import React, { createContext, useContext, useState, useEffect } from 'react';
import { isBettingClosed } from '../utils/timeUtils';

export interface Bet {
  id: string;
  match: string;
  selection: string;
  odds: number;
  stake?: number;
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  type: '1' | 'X' | '2';
  matchTime: string;
}

interface BetSlipContextType {
  bets: Bet[];
  addBet: (bet: Bet) => void;
  removeBet: (id: string) => void;
  clearBets: () => void;
  updateStake: (id: string, stake: number) => void;
  hasBet: (matchId: string, type: '1' | 'X' | '2') => boolean;
}

const BetSlipContext = createContext<BetSlipContextType | undefined>(undefined);

export function BetSlipProvider({ children }: { children: React.ReactNode }) {
  const [bets, setBets] = useState<Bet[]>([]);

  // Vérifier et nettoyer les paris expirés
  useEffect(() => {
    const interval = setInterval(() => {
      setBets(prevBets => 
        prevBets.filter(bet => !isBettingClosed(bet.matchTime))
      );
    }, 30000); // Vérifier toutes les 30 secondes

    return () => clearInterval(interval);
  }, []);

  const addBet = (bet: Bet) => {
    if (isBettingClosed(bet.matchTime)) {
      return;
    }

    setBets(prev => {
      const existingBet = prev.find(b => b.matchId === bet.matchId && b.type === bet.type);
      if (existingBet) {
        return prev.filter(b => b.id !== existingBet.id);
      }
      return [...prev, bet];
    });
  };

  const removeBet = (id: string) => {
    setBets(prev => prev.filter(bet => bet.id !== id));
  };

  const clearBets = () => {
    setBets([]);
  };

  const updateStake = (id: string, stake: number) => {
    setBets(prev => prev.map(bet => 
      bet.id === id ? { ...bet, stake } : bet
    ));
  };

  const hasBet = (matchId: string, type: '1' | 'X' | '2') => {
    return bets.some(bet => bet.matchId === matchId && bet.type === type);
  };

  return (
    <BetSlipContext.Provider value={{ bets, addBet, removeBet, clearBets, updateStake, hasBet }}>
      {children}
    </BetSlipContext.Provider>
  );
}

export function useBetSlip() {
  const context = useContext(BetSlipContext);
  if (context === undefined) {
    throw new Error('useBetSlip must be used within a BetSlipProvider');
  }
  return context;
}