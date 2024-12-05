import { collection, addDoc, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { LottoEvent } from './types';

export interface LottoPrize {
  id?: string;
  lottoId: string;
  calculationDate: string;
  winningNumbers: number[];
  jackpotAmount: number;
  prizeDistribution: {
    numbers: number;
    amount: number;
  }[];
  winners: {
    matchedNumbers: number;
    count: number;
    prizePerWinner: number;
  }[];
}

export class LottoPrizeService {
  static async calculatePrizes(
    lottoId: string,
    winningNumbers: number[],
    jackpotAmount: number,
    prizeDistribution: { numbers: number; amount: number }[]
  ): Promise<LottoPrize> {
    try {
      // Récupérer les participations
      const participationsRef = collection(db, 'lotto_participations');
      const q = query(participationsRef, where('lottoId', '==', lottoId));
      const participationsSnapshot = await getDocs(q);
      const participations = participationsSnapshot.docs.map(doc => doc.data());

      // Calculer les gagnants par niveau
      const winners = prizeDistribution.map(prize => {
        const matchingParticipations = participations.filter(p => {
          const matchedNumbers = p.selectedNumbers.filter(num => 
            winningNumbers.includes(num)
          ).length;
          return matchedNumbers === prize.numbers;
        });

        const count = matchingParticipations.length;
        const prizePerWinner = count > 0 ? prize.amount / count : prize.amount;

        return {
          matchedNumbers: prize.numbers,
          count,
          prizePerWinner
        };
      });

      // Créer l'objet des résultats
      const prizeResult: LottoPrize = {
        lottoId,
        calculationDate: new Date().toISOString(),
        winningNumbers,
        jackpotAmount,
        prizeDistribution,
        winners
      };

      // Sauvegarder les résultats
      const prizeRef = await addDoc(collection(db, 'lotto_prizes'), prizeResult);

      // Mettre à jour le statut du lotto
      const lottoRef = doc(db, 'lottos', lottoId);
      await updateDoc(lottoRef, {
        prizeCalculated: true,
        winningNumbers
      });

      return {
        ...prizeResult,
        id: prizeRef.id
      };
    } catch (error) {
      console.error('Error calculating prizes:', error);
      throw new Error('Failed to calculate prizes');
    }
  }

  static async getPrizeResult(lottoId: string): Promise<LottoPrize | null> {
    try {
      const prizesRef = collection(db, 'lotto_prizes');
      const q = query(prizesRef, where('lottoId', '==', lottoId));
      const prizeSnapshot = await getDocs(q);

      if (prizeSnapshot.empty) {
        return null;
      }

      const prizeDoc = prizeSnapshot.docs[0];
      return {
        id: prizeDoc.id,
        ...prizeDoc.data()
      } as LottoPrize;
    } catch (error) {
      console.error('Error getting prize result:', error);
      throw new Error('Failed to get prize result');
    }
  }
}