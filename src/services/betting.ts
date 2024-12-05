import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface CombinedBetsConfig {
  enabled: boolean;
  maxSelections: number;
  minOdds: number;
  maxOdds: number;
  maxWinAmount: number;
  minStake: number;
  currency: string;
  restrictedLeagues: string[];
  lastUpdated?: string;
}

export class BettingService {
  static async getCombinedBetsConfig(): Promise<CombinedBetsConfig | null> {
    try {
      const docRef = doc(db, 'betting_config', 'combined_bets');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as CombinedBetsConfig;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting combined bets config:', error);
      return null;
    }
  }

  static validateCombinedBet(bet: any, config: CombinedBetsConfig): string | null {
    if (!config.enabled) {
      return 'Les paris combinés sont actuellement désactivés';
    }

    if (bet.selections.length > config.maxSelections) {
      return `Le nombre maximum de sélections est de ${config.maxSelections}`;
    }

    const totalOdds = bet.selections.reduce((acc: number, sel: any) => acc * sel.odds, 1);
    if (totalOdds < config.minOdds) {
      return `La cote totale minimum est de ${config.minOdds}`;
    }
    if (totalOdds > config.maxOdds) {
      return `La cote totale maximum est de ${config.maxOdds}`;
    }

    if (bet.stake < config.minStake) {
      return `La mise minimum est de ${config.minStake} ${config.currency}`;
    }

    const potentialWin = bet.stake * totalOdds;
    if (potentialWin > config.maxWinAmount) {
      return `Le gain maximum autorisé est de ${config.maxWinAmount} ${config.currency}`;
    }

    const hasRestrictedLeague = bet.selections.some((sel: any) => 
      config.restrictedLeagues.includes(sel.leagueId)
    );
    if (hasRestrictedLeague) {
      return 'Un ou plusieurs championnats sélectionnés ne sont pas autorisés pour les paris combinés';
    }

    return null;
  }
}