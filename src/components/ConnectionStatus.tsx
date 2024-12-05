import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { useConnection } from '../contexts/ConnectionContext';

export default function ConnectionStatus() {
  const { isOnline } = useConnection();

  return (
    <div className={`flex items-center gap-1 text-sm ${
      isOnline ? 'text-green-600' : 'text-red-500'
    }`}>
      {isOnline ? (
        <>
          <Wifi className="w-4 h-4" />
          <span className="hidden sm:inline">Connecté</span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4" />
          <span className="hidden sm:inline">Déconnecté</span>
        </>
      )}
    </div>
  );
}