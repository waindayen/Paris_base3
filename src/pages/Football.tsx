import React, { useState } from 'react';
import { useOdds } from '../hooks/useOdds';
import { Trophy, Calendar, Filter, AlertCircle, RefreshCw, Info } from 'lucide-react';
import { oddsApi } from '../services/odds';

const FOOTBALL_LEAGUES = [
  { key: 'soccer_uefa_champs_league', name: 'Champions League' },
  { key: 'soccer_epl', name: 'Premier League' },
  { key: 'soccer_spain_la_liga', name: 'La Liga' },
  { key: 'soccer_france_ligue_one', name: 'Ligue 1' },
  { key: 'soccer_italy_serie_a', name: 'Serie A' },
  { key: 'soccer_germany_bundesliga', name: 'Bundesliga' }
].filter(league => {
  const config = oddsApi.getSportConfig(league.key);
  return config.enabled;
});

export default function Football() {
  const [selectedLeague, setSelectedLeague] = useState(FOOTBALL_LEAGUES[0]?.key || '');

  const { 
    data: matches, 
    isLoading,
    error,
    refetch
  } = useOdds(selectedLeague);

  const handleRefresh = () => {
    refetch();
  };

  // Si aucun championnat n'est activé
  if (FOOTBALL_LEAGUES.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 px-4 pb-20">
        <div className="max-w-7xl mx-auto py-8">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Info className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Service temporairement indisponible</h2>
            <p className="text-gray-600 mb-4">
              Nous effectuons actuellement une maintenance de notre service. Les matchs seront de nouveau disponibles très prochainement.
            </p>
            <p className="text-gray-600">
              Merci de votre patience et de votre compréhension.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Si l'API n'est pas configurée
  if (!oddsApi.isConfigured()) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 px-4 pb-20">
        <div className="max-w-7xl mx-auto py-8">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Info className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Service momentanément indisponible</h2>
            <p className="text-gray-600 mb-4">
              Nous rencontrons actuellement des difficultés techniques avec notre service de données sportives.
            </p>
            <p className="text-gray-600">
              Nos équipes travaillent activement pour rétablir l'accès aux matchs le plus rapidement possible. Merci de réessayer dans quelques instants.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const renderError = () => {
    if (error?.code === "SPORT_DISABLED") {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Info className="w-12 h-12 text-blue-600 mb-4" />
          <h3 className="text-lg font-bold mb-2">Championnat temporairement indisponible</h3>
          <p className="text-gray-600 text-center mb-4">
            Ce championnat n'est pas disponible pour le moment. Veuillez sélectionner un autre championnat ou réessayer plus tard.
          </p>
        </div>
      );
    }

    if (error?.code === "RESOURCE_NOT_FOUND") {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Info className="w-12 h-12 text-blue-600 mb-4" />
          <h3 className="text-lg font-bold mb-2">Aucun match disponible</h3>
          <p className="text-gray-600 text-center mb-4">
            Il n'y a pas de match prévu pour ce championnat actuellement. Revenez plus tard ou essayez un autre championnat.
          </p>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <RefreshCw className="w-5 h-5" />
            Actualiser
          </button>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-bold mb-2">Oops ! Un problème est survenu</h3>
        <p className="text-gray-600 text-center mb-4">
          Nous ne pouvons pas récupérer les matchs pour le moment. Veuillez réessayer dans quelques instants.
        </p>
        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <RefreshCw className="w-5 h-5" />
          Réessayer
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 px-4 pb-20">
      <div className="max-w-7xl mx-auto py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Football</h1>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </button>
        </div>

        {/* League Selector */}
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

        {/* Matches Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Chargement des matchs en cours...</p>
          </div>
        ) : error ? (
          renderError()
        ) : matches?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Trophy className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-bold mb-2">Aucun match à venir</h3>
            <p className="text-gray-500">Il n'y a pas de match prévu pour le moment dans ce championnat.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matches?.map((match) => {
              const mainMarket = match.bookmakers[0]?.markets[0];
              const homeOdds = mainMarket?.outcomes.find(o => o.name === match.home_team)?.price;
              const awayOdds = mainMarket?.outcomes.find(o => o.name === match.away_team)?.price;
              const drawOdds = mainMarket?.outcomes.find(o => o.name === 'Draw')?.price;

              return (
                <div key={match.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium text-blue-600">{match.sport_title}</span>
                    <span className="flex items-center gap-1 text-gray-600 text-sm">
                      <Calendar className="w-4 h-4" />
                      {new Date(match.commence_time).toLocaleString('fr-FR', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <div className="flex justify-between items-center mb-6">
                    <div className="flex-1 text-center">
                      <h3 className="font-semibold text-lg">{match.home_team}</h3>
                    </div>
                    <div className="px-4 text-gray-500">VS</div>
                    <div className="flex-1 text-center">
                      <h3 className="font-semibold text-lg">{match.away_team}</h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {homeOdds && (
                      <button className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                        <div className="text-sm text-gray-600 mb-1">1</div>
                        <div className="text-xl font-bold text-blue-600">{homeOdds.toFixed(2)}</div>
                      </button>
                    )}
                    {drawOdds && (
                      <button className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                        <div className="text-sm text-gray-600 mb-1">X</div>
                        <div className="text-xl font-bold text-blue-600">{drawOdds.toFixed(2)}</div>
                      </button>
                    )}
                    {awayOdds && (
                      <button className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                        <div className="text-sm text-gray-600 mb-1">2</div>
                        <div className="text-xl font-bold text-blue-600">{awayOdds.toFixed(2)}</div>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}