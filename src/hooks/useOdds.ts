import { useQuery } from 'react-query';
import { oddsApi } from '../services/odds';
import type { Sport, Event } from '../services/odds/types';
import { OddsApiError } from '../services/odds/errors';

// Constantes pour la gestion du cache et des rafraîchissements
const STALE_TIME = 30000; // 30 secondes
const CACHE_TIME = 60000; // 1 minute
const RETRY_DELAY = 2000; // 2 secondes

// Intervalle de rafraîchissement par défaut pour les différents types de requêtes
const DEFAULT_REFRESH_INTERVALS = {
  live: 15000, // 15 secondes pour les événements en direct
  upcoming: 30000, // 30 secondes pour les événements à venir
  scores: 60000 // 1 minute pour les scores
};

export function useSports() {
  return useQuery<Sport[], OddsApiError>(
    'sports',
    () => oddsApi.getSports(),
    {
      retry: 2,
      staleTime: STALE_TIME,
      cacheTime: CACHE_TIME,
      retryDelay: RETRY_DELAY,
      enabled: oddsApi.isConfigured(),
      onError: (error) => {
        console.error('Failed to fetch sports:', error.message);
      }
    }
  );
}

export function useOdds(sportKey: string) {
  // Récupérer la configuration spécifique au sport
  const sportConfig = oddsApi.getSportConfig(sportKey);
  const refreshInterval = sportConfig.refreshInterval * 1000; // Conversion en millisecondes

  return useQuery<Event[], OddsApiError>(
    ['odds', sportKey],
    async () => {
      if (!sportKey) return [];
      return await oddsApi.getOdds(sportKey);
    },
    {
      retry: (failureCount, error) => {
        // Ne pas réessayer si le sport est désactivé
        return failureCount < 2 && error.code !== 'SPORT_DISABLED';
      },
      staleTime: STALE_TIME,
      cacheTime: CACHE_TIME,
      retryDelay: RETRY_DELAY,
      // Utiliser l'intervalle de rafraîchissement configuré ou la valeur par défaut
      refetchInterval: refreshInterval || DEFAULT_REFRESH_INTERVALS.upcoming,
      // Activer le rafraîchissement en arrière-plan
      refetchIntervalInBackground: true,
      // N'activer que si l'API est configurée et le sport activé
      enabled: oddsApi.isConfigured() && sportConfig.enabled,
      onError: (error) => {
        console.error(`Failed to fetch odds for ${sportKey}:`, error.message);
      }
    }
  );
}

export function useLiveEvents(sportKey: string) {
  const sportConfig = oddsApi.getSportConfig(sportKey);

  return useQuery<Event[], OddsApiError>(
    ['live-events', sportKey],
    async () => {
      if (!sportKey) return [];
      return await oddsApi.getLiveEvents(sportKey);
    },
    {
      retry: (failureCount, error) => {
        return failureCount < 2 && error.code !== 'SPORT_DISABLED';
      },
      // Rafraîchissement plus fréquent pour les événements en direct
      refetchInterval: DEFAULT_REFRESH_INTERVALS.live,
      refetchIntervalInBackground: true,
      staleTime: 5000, // Données considérées comme périmées après 5 secondes
      cacheTime: CACHE_TIME,
      retryDelay: RETRY_DELAY,
      enabled: oddsApi.isConfigured() && sportConfig.enabled,
      onError: (error) => {
        console.error(`Failed to fetch live events for ${sportKey}:`, error.message);
      }
    }
  );
}

export function useScores(sportKey: string) {
  const sportConfig = oddsApi.getSportConfig(sportKey);

  return useQuery<Event[], OddsApiError>(
    ['scores', sportKey],
    async () => {
      if (!sportKey) return [];
      return await oddsApi.getScores(sportKey);
    },
    {
      retry: (failureCount, error) => {
        return failureCount < 2 && error.code !== 'SPORT_DISABLED';
      },
      // Rafraîchissement moins fréquent pour les scores
      refetchInterval: DEFAULT_REFRESH_INTERVALS.scores,
      refetchIntervalInBackground: true,
      staleTime: STALE_TIME,
      cacheTime: CACHE_TIME,
      retryDelay: RETRY_DELAY,
      enabled: oddsApi.isConfigured() && sportConfig.enabled,
      onError: (error) => {
        console.error(`Failed to fetch scores for ${sportKey}:`, error.message);
      }
    }
  );
}