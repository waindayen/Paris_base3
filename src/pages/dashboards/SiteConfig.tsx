import React, { useState, useEffect } from 'react';
import { Image, Type, Trophy, Save, AlertCircle } from 'lucide-react';
import BaseDashboard from './BaseDashboard';
import FileUpload from '../../components/FileUpload';
import { ConfigService, SiteConfig as SiteConfigType } from '../../services/config';
import { StorageService } from '../../services/storage';

export default function SiteConfig() {
  const [config, setConfig] = useState<SiteConfigType | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'saving' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setStatus('loading');
      const data = await ConfigService.getConfig();
      setConfig(data);
      setStatus('idle');
    } catch (err) {
      setError('Erreur lors du chargement de la configuration');
      setStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setConfig(prev => prev ? {
      ...prev,
      [name]: value
    } : null);
  };

  const handleLogoUpload = async (file: File) => {
    try {
      setStatus('saving');
      const url = await StorageService.uploadImage(file);
      setConfig(prev => prev ? {
        ...prev,
        logoUrl: url
      } : null);
      setStatus('idle');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du téléchargement du logo');
      setStatus('error');
    }
  };

  const handleHeroUpload = async (file: File) => {
    try {
      setStatus('saving');
      const url = await StorageService.uploadImage(file);
      setConfig(prev => prev ? {
        ...prev,
        heroBackgroundUrl: url
      } : null);
      setStatus('idle');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du téléchargement de l\'image');
      setStatus('error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;

    try {
      setStatus('saving');
      setError(null);
      await ConfigService.saveConfig(config);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setStatus('error');
    }
  };

  if (status === 'loading' || !config) {
    return (
      <BaseDashboard title="Configuration du Site">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </BaseDashboard>
    );
  }

  return (
    <BaseDashboard title="Configuration du Site">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">
        {/* Identité du site */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-semibold">Identité du site</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-1">
                Nom du site
              </label>
              <input
                type="text"
                id="siteName"
                name="siteName"
                value={config.siteName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo du site
              </label>
              <FileUpload
                onUpload={handleLogoUpload}
                currentImage={config.logoUrl}
              />
            </div>
          </div>
        </div>

        {/* Section Hero */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <Type className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-semibold">Section d'accueil</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="welcomeTitle" className="block text-sm font-medium text-gray-700 mb-1">
                Titre principal
              </label>
              <input
                type="text"
                id="welcomeTitle"
                name="welcomeTitle"
                value={config.welcomeTitle}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="welcomeSubtitle" className="block text-sm font-medium text-gray-700 mb-1">
                Sous-titre
              </label>
              <input
                type="text"
                id="welcomeSubtitle"
                name="welcomeSubtitle"
                value={config.welcomeSubtitle}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image de fond
              </label>
              <FileUpload
                onUpload={handleHeroUpload}
                currentImage={config.heroBackgroundUrl}
              />
            </div>
          </div>
        </div>

        {/* Messages de statut */}
        {status === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-green-500" />
            <p className="text-green-700">Configuration sauvegardée avec succès</p>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700">{error || 'Une erreur est survenue'}</p>
          </div>
        )}

        {/* Bouton de sauvegarde */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={status === 'saving'}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'saving' ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Sauvegarde...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Sauvegarder</span>
              </>
            )}
          </button>
        </div>
      </form>
    </BaseDashboard>
  );
}