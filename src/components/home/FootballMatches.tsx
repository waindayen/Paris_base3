import React, { useState, useEffect } from 'react';
import { Trophy, Filter, RefreshCw, AlertCircle, Calendar } from 'lucide-react';
import { useOdds } from '../../hooks/useOdds';
import { oddsApi } from '../../services/odds';
import MatchCard from '../match/MatchCard';
import { isToday } from 'date-fns';

const FOOTBALL_LEAGUES = [
  { key: 'all', name: 'Tous les matchs' },
  { key: 'soccer_uefa_champs_league', name: 'Champions League' },
  { key: 'soccer_france_ligue_one', name: 'Ligue 1' },
  { key: 'soccer_epl', name: 'Premier League' },
  { key: 'soccer_spain_la_liga', name: 'La Liga' },
  { key: 'soccer_italy_serie_a', name: 'Serie A' },
  { key: 'soccer_germany_bundesliga', name: 'Bundesliga' }
].filter(league => {
  if (league.key === 'all') return true;
  const config = oddsApi.getSportConfig(league.key);
  return config.enabled;
});

export default function FootballMatches() {
  const [selectedLeague, setSelectedLeague] = useState('all');
  const [allMatches, setAllMatches] = useState<any[]>([]);
  const [isLoadingAll, setIsLoadingAll] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  const { data: leagueMatches, isLoading: isLoadingLeague, error, refetch } = useOdds(
    selectedLeague === 'all' ? 'soccer_uefa_champs_league' : selectedLeague
  );

  useEffect(() => {
    if (selectedLeague === 'all') {
      fetchAllMatches();
    }
  }, [selectedLeague, retryCount]);

  const handleRefresh = () => {
    setRetryCount(count => count + 1);
    if (selectedLeague === 'all') {
      fetchAllMatches();
    } else {
      refetch();
    }
  };

  const fetchAllMatches = async () => {
    setIsLoadingAll(true);
    try {
      // Fetch matches in sequence to avoid rate limits
      const allMatches = [];
      for (const league of FOOTBALL_LEAGUES.filter(l => l.key !== 'all')) {
        try {
          const matches = await oddsApi.getOdds(league.key);
          allMatches.push(...matches);
          // Add small delay between requests
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (err) {
          if (err?.code === 'API_RATE_LIMIT') {
            // If rate limited, use cached data if available
            const cachedMatches = await oddsApi.getCachedMatches(league.key);
            if (cachedMatches) {
              allMatches.push(...cachedMatches);
            }
          }
        }
      }
      setAllMatches(allMatches);
    } catch (err) {
      console.error('Error fetching all matches:', err);
    } finally {
      setIsLoadingAll(false);
    }
  };

  // Filtrer les matchs pour n'afficher que ceux du jour
  const filterTodayMatches = (matches: any[]) => {
    if (!matches) return [];
    return matches.filter(match => {
      const matchDate = new Date(match.commence_time);
      return isToday(matchDate);
    });
  };

  const matches = selectedLeague === 'all' ? allMatches : leagueMatches;
  const todayMatches = filterTodayMatches(matches);
  const isLoading = selectedLeague === 'all' ? isLoadingAll : isLoadingLeague;

  const renderError = () => {
    if (error?.code === 'API_RATE_LIMIT') {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-yellow-800 mb-2">Limite d'utilisation atteinte</h3>
          <p className="text-yellow-700 mb-4">
            Nous recevons beaucoup de demandes en ce moment. Les données affichées peuvent ne pas être à jour.
          </p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Réessayer
          </button>
        </div>
      );
    }

    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-700 mb-4">{error.message}</p>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <Trophy className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Football</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-5 h-5" />
            <span className="hidden sm:inline">Matchs du jour</span>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Actualiser</span>
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="font-medium text-gray-700">Championnats</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {FOOTBALL_LEAGUES.map((league) => (
            <button
              key={league.key}
              onClick={() => setSelectedLeague(league.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedLeague === league.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {league.name}
            </button>
          ))}
        </div>
      </div>

      {/* Liste des matchs */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        renderError()
      ) : !todayMatches?.length ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            Aucun match prévu aujourd'hui
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {todayMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}