import React from 'react';
import { Link } from 'react-router-dom';

export default function WelcomeHero() {
  return (
    <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
      <div className="relative max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
            Vivez le Sport Intensément
          </h1>
          <p className="text-base sm:text-lg text-blue-100 mb-4 max-w-2xl mx-auto">
            Pariez en direct sur plus de 1000 événements sportifs quotidiens
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-6 py-2 sm:px-8 sm:py-3 text-base font-semibold rounded-lg bg-green-500 hover:bg-green-600 transition-colors"
            >
              Commencer à Parier
            </Link>
            <Link
              to="/live"
              className="inline-flex items-center justify-center px-6 py-2 sm:px-8 sm:py-3 text-base font-semibold rounded-lg border-2 border-white hover:bg-white/10 transition-colors"
            >
              Paris en Direct
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}