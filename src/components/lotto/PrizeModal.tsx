import React, { useState } from 'react';
import { X, Trophy, AlertCircle } from 'lucide-react';
import { LottoEvent } from '../../services/lotto';
import { LottoPrizeService } from '../../services/lotto/prize';
import { formatCurrency } from '../../utils/format';

interface PrizeModalProps {
  lotto: LottoEvent;
  onClose: () => void;
  onPrizeCalculated: () => void;
}

export default function PrizeModal({ lotto, onClose, onPrizeCalculated }: PrizeModalProps) {
  const [winningNumbers, setWinningNumbers] = useState<number[]>([]);
  const [prizeDistribution, setPrizeDistribution] = useState([
    { numbers: lotto.numbersToSelect, amount: 0 },
    { numbers: lotto.numbersToSelect - 1, amount: 0 },
    { numbers: lotto.numbersToSelect - 2, amount: 0 },
    { numbers: lotto.numbersToSelect - 3, amount: 0 }
  ]);
  const [jackpotAmount, setJackpotAmount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNumberChange = (index: number, value: string) => {
    const number = parseInt(value);
    if (!isNaN(number) && number >= 1 && number <= 49) {
      const newNumbers = [...winningNumbers];
      newNumbers[index] = number;
      setWinningNumbers(newNumbers);
    }
  };

  const handlePrizeAmountChange = (index: number, value: string) => {
    const amount = parseFloat(value);
    if (!isNaN(amount) && amount >= 0) {
      const newDistribution = [...prizeDistribution];
      newDistribution[index].amount = amount;
      setPrizeDistribution(newDistribution);
    }
  };

  const validateForm = () => {
    if (winningNumbers.length !== lotto.numbersToSelect) {
      throw new Error(`Veuillez saisir les ${lotto.numbersToSelect} numéros gagnants`);
    }

    if (new Set(winningNumbers).size !== lotto.numbersToSelect) {
      throw new Error('Les numéros gagnants doivent être uniques');
    }

    if (!jackpotAmount || parseFloat(jackpotAmount) <= 0) {
      throw new Error('Veuillez définir un montant pour le jackpot');
    }

    const totalPrizes = prizeDistribution.reduce((sum, prize) => sum + prize.amount, 0);
    if (totalPrizes <= 0) {
      throw new Error('Veuillez définir au moins un montant de gain');
    }
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      setIsSubmitting(true);
      validateForm();

      await LottoPrizeService.calculatePrizes(
        lotto.id!,
        winningNumbers,
        parseFloat(jackpotAmount),
        prizeDistribution
      );

      onPrizeCalculated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du calcul des gains');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-semibold">Calcul des gains - {lotto.eventName}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Numéros gagnants */}
            <div>
              <h3 className="text-lg font-medium mb-4">Numéros gagnants</h3>
              <div className="grid grid-cols-6 gap-2">
                {Array.from({ length: lotto.numbersToSelect }).map((_, index) => (
                  <input
                    key={index}
                    type="number"
                    min="1"
                    max="49"
                    value={winningNumbers[index] || ''}
                    onChange={(e) => handleNumberChange(index, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-center"
                    placeholder={(index + 1).toString()}
                  />
                ))}
              </div>
            </div>

            {/* Jackpot */}
            <div>
              <h3 className="text-lg font-medium mb-4">Jackpot</h3>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={jackpotAmount}
                  onChange={(e) => setJackpotAmount(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Montant du jackpot"
                />
                <span className="text-sm text-gray-500">€</span>
              </div>
            </div>

            {/* Distribution des gains secondaires */}
            <div>
              <h3 className="text-lg font-medium mb-4">Gains secondaires</h3>
              <div className="space-y-4">
                {prizeDistribution.map((prize, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex-1">
                      <span className="font-medium">{prize.numbers} numéros</span>
                    </div>
                    <input
                      type="number"
                      value={prize.amount || ''}
                      onChange={(e) => handlePrizeAmountChange(index, e.target.value)}
                      className="w-40 px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Montant"
                    />
                    <span className="text-sm text-gray-500">€</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Calcul en cours...' : 'Calculer les gains'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}