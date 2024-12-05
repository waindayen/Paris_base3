import React, { useState } from 'react';
import { Search, Filter, Calendar, Trophy, Edit, Trash2, Eye } from 'lucide-react';
import { LottoEvent } from '../../services/lotto';
import { formatCurrency } from '../../utils/format';
import { getStatusLabel } from '../../utils/lottoUtils';
import { useAuth } from '../../contexts/AuthContext';

interface LottoTableProps {
  lottos: LottoEvent[];
  onView: (lotto: LottoEvent) => void;
  onEdit: (lotto: LottoEvent) => void;
  onDelete: (lotto: LottoEvent) => void;
  onCalculatePrizes?: (lotto: LottoEvent) => void;
}

export default function LottoTable({ 
  lottos, 
  onView, 
  onEdit, 
  onDelete,
  onCalculatePrizes 
}: LottoTableProps) {
  const { userData } = useAuth();
  const canCalculatePrizes = userData?.role === 'adminuser' || userData?.role === 'ucieruser';
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const filteredLottos = lottos.filter(lotto => {
    const matchesSearch = lotto.eventName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !dateFilter || lotto.endDate.startsWith(dateFilter);
    return matchesSearch && matchesDate;
  });

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Filtres */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-64 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="w-full md:w-48">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Événement
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Dates
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Prix
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Statut
              </th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredLottos.map((lotto) => {
              const status = getStatusLabel(lotto);
              return (
                <tr key={lotto.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{lotto.eventName}</div>
                      <div className="text-sm text-gray-500">
                        {lotto.numbersToSelect} numéros à sélectionner
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div>Début: {new Date(lotto.startDate).toLocaleString()}</div>
                      <div>Fin: {new Date(lotto.endDate).toLocaleString()}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(lotto.ticketPrice)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm font-medium ${status.className}`}>
                      <status.icon className="w-4 h-4" />
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => onView(lotto)}
                      className="text-blue-600 hover:text-blue-700"
                      title="Voir les détails"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onEdit(lotto)}
                      className="text-yellow-600 hover:text-yellow-700"
                      title="Modifier"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    {canCalculatePrizes && 
                     lotto.status === 'completed' && 
                     !lotto.prizeCalculated && 
                     onCalculatePrizes && (
                      <button
                        onClick={() => onCalculatePrizes(lotto)}
                        className="text-green-600 hover:text-green-700"
                        title="Calculer les gains"
                      >
                        <Trophy className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(lotto)}
                      className="text-red-600 hover:text-red-700"
                      title="Supprimer"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Message si aucun résultat */}
      {filteredLottos.length === 0 && (
        <div className="text-center py-8">
          <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Aucun lotto trouvé</p>
        </div>
      )}
    </div>
  );
}