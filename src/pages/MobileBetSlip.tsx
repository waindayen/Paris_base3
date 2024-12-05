import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, AlertCircle } from 'lucide-react';
import { useBetSlip } from '../contexts/BetSlipContext';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency } from '../utils/format';
import AuthMobileModal from '../components/auth/AuthMobileModal';

export default function MobileBetSlip() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { bets, removeBet, clearBets, updateStake } = useBetSlip();
  const [betType, setBetType] = useState<'simple' | 'combine'>('simple');
  const [combinedStake, setCombinedStake] = useState<string>('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalOdds = bets.reduce((acc, bet) => acc * bet.odds, 1);
  const potentialWin = betType === 'combine' 
    ? parseFloat(combinedStake) * totalOdds
    : bets.reduce((acc, bet) => acc + (bet.stake || 0) * bet.odds, 0);

  const handleStakeChange = (value: string) => {
    if (/^\d*\.?\d*$/.test(value)) {
      setCombinedStake(value);
    }
  };

  const handleBetSubmit = async () => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    try {
      setError(null);
      setIsSubmitting(true);

      // Validation des mises
      if (betType === 'combine') {
        if (!combinedStake || parseFloat(combinedStake) <= 0) {
          throw new Error('Veuillez entrer une mise valide');
        }
      } else {
        const invalidBets = bets.filter(bet => !bet.stake || bet.stake <= 0);
        if (invalidBets.length > 0) {
          throw new Error('Veuillez entrer une mise pour chaque pari');
        }
      }

      // TODO: Implémenter la soumission des paris
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Réinitialiser le formulaire
      clearBets();
      setCombinedStake('');
      setBetType('simple');
      navigate('/');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="h-16 px-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-700"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </button>
          <h1 className="text-lg font-bold">Panier de Paris</h1>
          <button
            onClick={clearBets}
            className="p-2 text-red-500"
            title="Vider le panier"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="pt-16 pb-20">
        {/* Type de pari */}
        <div className="p-4 bg-white border-b border-gray-200">
          <div className="flex rounded-lg overflow-hidden border border-gray-200">
            <button
              onClick={() => setBetType('simple')}
              className={`flex-1 py-3 text-sm font-medium ${
                betType === 'simple'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              Paris Simple
            </button>
            <button
              onClick={() => setBetType('combine')}
              className={`flex-1 py-3 text-sm font-medium ${
                betType === 'combine'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              Paris Combiné
            </button>
          </div>
        </div>

        {/* Liste des paris */}
        <div className="p-4 space-y-4">
          {bets.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Aucun pari sélectionné
            </div>
          ) : (
            <>
              {bets.map((bet) => (
                <div
                  key={bet.id}
                  className="bg-white rounded-lg shadow-sm p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-medium mb-1">
                        {bet.homeTeam} vs {bet.awayTeam}
                      </div>
                      <div className="text-sm text-gray-600">
                        {bet.type === '1' ? bet.homeTeam :
                         bet.type === '2' ? bet.awayTeam : 'Match Nul'}
                      </div>
                    </div>
                    <button
                      onClick={() => removeBet(bet.id)}
                      className="p-2 text-red-500"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-blue-600">Cote: {bet.odds}</span>
                    {betType === 'simple' && (
                      <input
                        type="text"
                        placeholder="Mise"
                        value={bet.stake || ''}
                        onChange={(e) => {
                          if (/^\d*\.?\d*$/.test(e.target.value)) {
                            updateStake(bet.id, parseFloat(e.target.value) || 0);
                          }
                        }}
                        className="w-32 px-3 py-2 border border-gray-200 rounded-lg text-right"
                      />
                    )}
                  </div>
                </div>
              ))}

              {betType === 'combine' && (
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-medium">Cote totale</span>
                    <span className="font-bold text-blue-600">{totalOdds.toFixed(2)}</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Mise totale"
                    value={combinedStake}
                    onChange={(e) => handleStakeChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium">Gain potentiel</span>
                  <span className="font-bold text-green-600">
                    {formatCurrency(potentialWin)}
                  </span>
                </div>
                <button
                  onClick={handleBetSubmit}
                  disabled={isSubmitting || bets.length === 0}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Validation...' : 'Valider le pari'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <AuthMobileModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        message="Connectez-vous pour placer vos paris"
      />
    </div>
  );
}