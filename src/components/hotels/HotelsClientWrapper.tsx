/**
 * Hotels Client Wrapper - Client-side animations ONLY
 * NeoHero + Framer Motion components that cannot run on server
 * @client-side-only
 */

'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Calendar, Users, Search } from 'lucide-react';

// Dynamic imports with ssr: false - animations load after hydration
const NeoHero = dynamic(() => import('../neo-glass/NeoHero').then(mod => mod.NeoHero), { ssr: false });
const FuturisticButton = dynamic(() => import('../neo-glass/FuturisticButton').then(mod => mod.FuturisticButton), { ssr: false });

interface HotelsClientWrapperProps {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  loading: boolean;
  onDestinationChange: (value: string) => void;
  onCheckInChange: (value: string) => void;
  onCheckOutChange: (value: string) => void;
  onGuestsChange: (value: number) => void;
  onSearch: () => void;
}

export const HotelsClientWrapper: React.FC<HotelsClientWrapperProps> = ({
  destination,
  checkIn,
  checkOut,
  guests,
  loading,
  onDestinationChange,
  onCheckInChange,
  onCheckOutChange,
  onGuestsChange,
  onSearch,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Server-side: render placeholder with actual content
  if (!mounted) {
    return (
      <div className="relative w-full min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800">
        <div className="text-center z-10 px-4 max-w-6xl mx-auto w-full">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
            Hayalinizdeki Oteli Bulun
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-12">
            Binlerce gerçek otel, anlık fiyatlar ve güvenli rezervasyon ile kusursuz konaklama deneyimi
          </p>

          {/* Server-rendered search form placeholder */}
          <div className="w-full max-w-6xl mx-auto mt-12">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Nereye gidiyorsunuz?"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder-gray-400"
                    readOnly
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white"
                    readOnly
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white"
                    readOnly
                  />
                </div>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
                  <select
                    className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white appearance-none"
                    disabled
                  >
                    <option>2 Misafir</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-center">
                <button
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold"
                  disabled
                >
                  Otel Ara
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Client-side: render full NeoHero with animations
  return (
    <NeoHero
      title="Hayalinizdeki Oteli Bulun"
      subtitle="Binlerce gerçek otel, anlık fiyatlar ve güvenli rezervasyon ile kusursuz konaklama deneyimi"
      gradient="twilight"
      height="60vh"
      overlayOpacity={0.3}
      showFloatingElements={true}>

      {/* Search Form in Hero */}
      <div className="w-full max-w-6xl mx-auto mt-12">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_-15px_rgba(59,130,246,0.3)]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative group">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5 transition-all group-hover:scale-110" />
              <input
                type="text"
                value={destination}
                onChange={(e) => onDestinationChange(e.target.value)}
                placeholder="Nereye gidiyorsunuz?"
                className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all hover:bg-white/5 backdrop-blur-xl"
              />
            </div>

            <div className="relative group">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5 transition-all group-hover:scale-110" />
              <input
                type="date"
                value={checkIn}
                onChange={(e) => onCheckInChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all hover:bg-white/5 backdrop-blur-xl"
              />
            </div>

            <div className="relative group">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5 transition-all group-hover:scale-110" />
              <input
                type="date"
                value={checkOut}
                onChange={(e) => onCheckOutChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all hover:bg-white/5 backdrop-blur-xl"
              />
            </div>

            <div className="relative group">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5 transition-all group-hover:scale-110" />
              <select
                value={guests}
                onChange={(e) => onGuestsChange(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all hover:bg-white/5 backdrop-blur-xl appearance-none cursor-pointer">

                <option value={1} className="bg-gray-900 text-white">1 Misafir</option>
                <option value={2} className="bg-gray-900 text-white">2 Misafir</option>
                <option value={3} className="bg-gray-900 text-white">3 Misafir</option>
                <option value={4} className="bg-gray-900 text-white">4 Misafir</option>
                <option value={5} className="bg-gray-900 text-white">5+ Misafir</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <FuturisticButton
              onClick={onSearch}
              disabled={loading}
              loading={loading}
              variant="gradient"
              size="lg"
              leftIcon={<Search className="w-5 h-5" />}>

              {loading ? 'Aranıyor...' : 'Otel Ara'}
            </FuturisticButton>
          </div>
        </div>
      </div>
    </NeoHero>
  );
};

export default HotelsClientWrapper;
