import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LottoService, LottoEvent } from '../../../services/lotto';
import { LottoPrizeService } from '../../../services/lotto/prize';
import BaseDashboard from '../BaseDashboard';
import LottoTable from '../../../components/lotto/LottoTable';
import PrizeModal from '../../../components/lotto/PrizeModal';
import DrawModal from '../../../components/lotto/DrawModal';
import PrizeResultModal from '../../../components/lotto/PrizeResultModal';
import LoadingState from '../../../components/LoadingState';
import { AlertCircle, Plus } from 'lucide-react';

export default function LottoManagement() {
  const navigate = useNavigate();
  const [lottos, setLottos] = useState<LottoEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLotto, setSelectedLotto] = useState<LottoEvent | null>(null);
  const [showDrawModal, setShowDrawModal] = useState(false);
  const [prizeResult, setPrizeResult] = useState<any | null>(null);

  useEffect(() => {
    fetchLottos();
  }, []);

  const fetchLottos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await LottoService.getAllLottos();
      setLottos(data);
    } catch (err) {
      setError('Erreur lors du chargement des lottos');
      console.error('Error fetching lottos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (lotto: LottoEvent) => {
    setSelectedLotto(lotto);
  };

  const handleEdit = (lotto: LottoEvent) => {
    navigate(`/dashboard/admin/setup-lotto/${lotto.id}`);
  };

  const handleDelete = async (lotto: LottoEvent) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      return;
    }

    try {
      await LottoService.deleteLotto(lotto.id!);
      await fetchLottos();
    } catch (err) {
      console.error('Error deleting lotto:', err);
      setError('Erreur lors de la suppression du lotto');
    }
  };

  const handleCalculatePrizes = async (lotto: LottoEvent) => {
    setSelectedLotto(lotto);
    setShowDrawModal(true);
  };

  const handleDrawComplete = async (draw: any) => {
    try {
      setPrizeResult(draw);
      setShowDrawModal(false);
      await fetchLottos();
    } catch (err) {
      setError('Erreur lors du calcul des gains');
      console.error('Error calculating prizes:', err);
    }
  };

  if (loading) {
    return (
      <BaseDashboard title="Gestion des Lottos">
        <LoadingState message="Chargement des lottos..." />
      </BaseDashboard>
    );
  }

  return (
    <BaseDashboard title="Gestion des Lottos">
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={() => navigate('/dashboard/admin/setup-lotto')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Créer un nouveau lotto
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <LottoTable
        lottos={lottos}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCalculatePrizes={handleCalculatePrizes}
      />

      {showDrawModal && selectedLotto && (
        <DrawModal
          lotto={selectedLotto}
          onClose={() => setShowDrawModal(false)}
          onDrawComplete={handleDrawComplete}
        />
      )}

      {prizeResult && (
        <PrizeResultModal
          prize={prizeResult}
          onClose={() => setPrizeResult(null)}
        />
      )}
    </BaseDashboard>
  );
}