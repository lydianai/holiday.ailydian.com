/**
 * Rentals Client Wrapper - Client-side animations ONLY
 * NeoHero + Framer Motion components that cannot run on server
 * @client-side-only
 */

'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Search, X, Home } from 'lucide-react';

// Dynamic imports with ssr: false - animations load after hydration
const NeoHero = dynamic(() => import('../neo-glass/NeoHero').then(mod => mod.NeoHero), { ssr: false });

interface PropertyType {
  value: string;
  label: string;
  icon: any;
}

interface RentalsClientWrapperProps {
  searchQuery: string;
  selectedType: string;
  propertyTypes: PropertyType[];
  onSearchChange: (value: string) => void;
  onTypeChange: (value: string) => void;
}

export const RentalsClientWrapper: React.FC<RentalsClientWrapperProps> = ({
  searchQuery,
  selectedType,
  propertyTypes,
  onSearchChange,
  onTypeChange,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Server-side: render placeholder with actual content
  if (!mounted) {
    return (
      <div className="relative w-full min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-cyan-600 via-blue-600 to-cyan-800">
        <div className="text-center z-10 px-4 max-w-4xl mx-auto w-full">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
            Tatil Evleri & Villalar
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8">
            Antalya'nın en özel konaklama seçenekleri, %2 daha uygun fiyatlarla
          </p>

          {/* Server-rendered search bar placeholder */}
          <div className="max-w-4xl mx-auto mt-8">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-white/60" />
              <input
                type="text"
                placeholder="Konum, özellik veya bölge ara..."
                className="w-full pl-16 pr-16 py-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-white/60"
                readOnly
              />
            </div>

            {/* Property type filters placeholder */}
            <div className="flex flex-wrap gap-3 mt-6 justify-center">
              {propertyTypes.map((type) => (
                <button
                  key={type.value}
                  className={`px-6 py-3 rounded-xl font-medium backdrop-blur-xl ${
                    selectedType === type.value
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'bg-white/10 text-white border border-white/20'
                  }`}
                  disabled
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Client-side: render full NeoHero with animations
  return (
    <NeoHero
      title="Tatil Evleri & Villalar"
      subtitle="Antalya'nın en özel konaklama seçenekleri, %2 daha uygun fiyatlarla"
      gradient="ocean"
      height="60vh"
    >
      <div className="max-w-4xl mx-auto mt-8">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-white/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Konum, özellik veya bölge ara..."
            className="w-full pl-16 pr-16 py-5 bg-lydian-bg/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all text-lg"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-3 mt-6 justify-center">
          {propertyTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => onTypeChange(type.value)}
              className={`px-6 py-3 rounded-xl font-medium transition-all backdrop-blur-xl ${
                selectedType === type.value
                  ? 'bg-lydian-bg text-blue-500 shadow-lg scale-105'
                  : 'bg-lydian-bg/10 text-white hover:bg-lydian-bg/20 border border-white/20'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>
    </NeoHero>
  );
};

export default RentalsClientWrapper;
