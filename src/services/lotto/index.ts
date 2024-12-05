import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export type LottoStatus = 'pending' | 'active' | 'completed';

export interface LottoEvent {
  id?: string;
  eventName: string;
  startDate: string;
  endDate: string;
  ticketPrice: number;
  currency: string;
  frequency: string;
  numbersToSelect: number;
  gridsPerTicket: number;
  createdAt?: string;
  status?: LottoStatus;
  prizeCalculated?: boolean;
  winningNumbers?: number[];
}

export class LottoService {
  private static COLLECTION = 'lottos';

  static async createLotto(data: Omit<LottoEvent, 'id' | 'createdAt' | 'status'>): Promise<string> {
    try {
      const now = new Date();
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);

      // Validation des dates
      if (startDate >= endDate) {
        throw new Error('La date de début doit être antérieure à la date de fin');
      }

      // Détermination du statut initial
      let initialStatus: LottoStatus = 'pending';
      if (now >= startDate && now < endDate) {
        initialStatus = 'active';
      } else if (now >= endDate) {
        initialStatus = 'completed';
      }

      const lottoData = {
        ...data,
        createdAt: now.toISOString(),
        status: initialStatus,
        prizeCalculated: false
      };

      const docRef = await addDoc(collection(db, this.COLLECTION), lottoData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating lotto:', error);
      throw error instanceof Error ? error : new Error('Failed to create lotto event');
    }
  }

  static async updateLotto(id: string, data: Partial<LottoEvent>): Promise<void> {
    try {
      const lottoRef = doc(db, this.COLLECTION, id);
      await updateDoc(lottoRef, {
        ...data,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating lotto:', error);
      throw new Error('Failed to update lotto event');
    }
  }

  static async getLotto(id: string): Promise<LottoEvent | null> {
    try {
      const docRef = doc(db, this.COLLECTION, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      return {
        id: docSnap.id,
        ...docSnap.data()
      } as LottoEvent;
    } catch (error) {
      console.error('Error fetching lotto:', error);
      throw new Error('Failed to fetch lotto event');
    }
  }

  static async getAllLottos(): Promise<LottoEvent[]> {
    try {
      const querySnapshot = await getDocs(collection(db, this.COLLECTION));
      const lottos: LottoEvent[] = [];
      
      querySnapshot.forEach((doc) => {
        lottos.push({
          id: doc.id,
          ...doc.data()
        } as LottoEvent);
      });

      // Mise à jour des statuts en fonction des dates actuelles
      const now = new Date();
      const updatedLottos = await Promise.all(lottos.map(async (lotto) => {
        const startDate = new Date(lotto.startDate);
        const endDate = new Date(lotto.endDate);
        let newStatus = lotto.status;

        if (now >= startDate && now < endDate && lotto.status === 'pending') {
          newStatus = 'active';
          await this.updateLottoStatus(lotto.id!, 'active');
        } else if (now >= endDate && lotto.status !== 'completed') {
          newStatus = 'completed';
          await this.updateLottoStatus(lotto.id!, 'completed');
        }

        return {
          ...lotto,
          status: newStatus
        };
      }));

      return updatedLottos;
    } catch (error) {
      console.error('Error fetching lottos:', error);
      throw new Error('Failed to fetch lotto events');
    }
  }

  static async deleteLotto(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.COLLECTION, id));
    } catch (error) {
      console.error('Error deleting lotto:', error);
      throw new Error('Failed to delete lotto event');
    }
  }

  static async updateLottoStatus(id: string, status: LottoStatus): Promise<void> {
    try {
      const lottoRef = doc(db, this.COLLECTION, id);
      await updateDoc(lottoRef, { status });
    } catch (error) {
      console.error('Error updating lotto status:', error);
      throw new Error('Failed to update lotto status');
    }
  }
}