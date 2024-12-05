import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { STORAGE_KEY, DEFAULT_SPORTS } from './constants';
import type { OddsConfig, SportConfig } from './types';

export class OddsStorage {
  private static SPORTS_COLLECTION = 'sports_config';
  private static CONFIG_DOC_ID = 'current_config';

  static async loadFromLocalStorage(): Promise<OddsConfig | null> {
    try {
      const savedConfig = localStorage.getItem(STORAGE_KEY);
      if (savedConfig) {
        return JSON.parse(savedConfig);
      }
      return null;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return null;
    }
  }

  static async loadSportsConfig(): Promise<Record<string, SportConfig>> {
    try {
      const sportsRef = collection(db, this.SPORTS_COLLECTION);
      const snapshot = await getDocs(sportsRef);
      
      const sports: Record<string, SportConfig> = {};
      snapshot.forEach(doc => {
        sports[doc.id] = doc.data() as SportConfig;
      });
      
      return { ...DEFAULT_SPORTS, ...sports };
    } catch (error) {
      console.error('Error loading sports config:', error);
      return DEFAULT_SPORTS;
    }
  }

  static async saveSportConfig(sportKey: string, config: SportConfig): Promise<void> {
    try {
      const sportRef = doc(db, this.SPORTS_COLLECTION, sportKey);
      const sanitizedConfig = {
        enabled: Boolean(config.enabled),
        refreshInterval: Number(config.refreshInterval) || 30,
        lastUpdated: new Date().toISOString()
      };
      await setDoc(sportRef, sanitizedConfig, { merge: true });
    } catch (error) {
      console.error('Error saving sport config:', error);
      throw error;
    }
  }

  static async saveToLocalStorage(config: OddsConfig): Promise<void> {
    try {
      const sanitizedConfig = {
        apiKey: config.apiKey,
        lastUpdated: new Date().toISOString(),
        isActive: Boolean(config.isActive)
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizedConfig));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  static async saveToFirebase(config: OddsConfig): Promise<void> {
    try {
      const configRef = doc(db, 'odds_config', this.CONFIG_DOC_ID);
      
      const sanitizedConfig = {
        apiKey: config.apiKey,
        lastUpdated: new Date().toISOString(),
        isActive: Boolean(config.isActive)
      };

      await setDoc(configRef, sanitizedConfig, { merge: true });
    } catch (error) {
      console.error('Error saving to Firebase:', error);
      throw error;
    }
  }

  static async getActiveConfiguration(): Promise<OddsConfig | null> {
    try {
      // Get main configuration
      const configRef = doc(db, 'odds_config', this.CONFIG_DOC_ID);
      const configDoc = await getDoc(configRef);
      
      if (!configDoc.exists()) {
        return null;
      }

      const mainConfig = configDoc.data();
      const sports = await this.loadSportsConfig();

      return {
        apiKey: mainConfig.apiKey || '',
        sports,
        lastUpdated: mainConfig.lastUpdated || new Date().toISOString(),
        isActive: Boolean(mainConfig.isActive)
      };
    } catch (error) {
      console.error('Error getting active configuration:', error);
      return null;
    }
  }
}