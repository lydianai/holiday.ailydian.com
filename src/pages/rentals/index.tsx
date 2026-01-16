/**
 * Rentals Listing Page - Neo-Glass Futuristic Design
 * Redesigned to match holiday.ailydian.com design system
 * Features: FuturisticCard, NeoHero, Glassmorphism, 3D effects
 */

import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import {
  Home,
  MapPin,
  Star,
  Users,
  Bed,
  Bath,
  Wifi,
  Car,
  Waves,
  Sun,
  Shield,
  Heart,
  Filter,
  Search,
  X,
  TrendingUp,
  Award,
  Sparkles,
} from 'lucide-react';
import { ModernHeader } from '../../components/layout/ModernHeader';
import { FuturisticCard, FuturisticButton, NeoSection } from '../../components/neo-glass';
import antalyaRentals, { type AntalyaRentalProperty } from '../../data/antalya-rentals';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from 'next-i18next';

// Client-side animation wrapper - loads after hydration
const RentalsClientWrapper = dynamic(() => import('../../components/rentals/RentalsClientWrapper'), { ssr: false });

const RentalsPage: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { addToast } = useToast();

  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [minGuests, setMinGuests] = useState<number>(1);
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Property types
  const propertyTypes = [
    { value: 'all', label: 'Tümü', icon: Home },
    { value: 'villa', label: 'Villa', icon: Home },
    { value: 'apartment', label: 'Daire', icon: Home },
    { value: 'penthouse', label: 'Penthouse', icon: Home },
    { value: 'hotel', label: 'Otel', icon: Home },
  ];

  // Regions
  const regions = [
    { value: 'all', label: 'Tüm Bölgeler' },
    { value: 'antalya-city', label: 'Antalya Merkez' },
    { value: 'lara', label: 'Lara' },
    { value: 'kundu', label: 'Kundu' },
    { value: 'belek', label: 'Belek' },
    { value: 'side', label: 'Side' },
    { value: 'alanya', label: 'Alanya' },
    { value: 'kemer', label: 'Kemer' },
    { value: 'konyaalti', label: 'Konyaaltı' },
  ];

  // Filter and search properties
  const filteredProperties = useMemo(() => {
    return antalyaRentals.filter((property) => {
      // Search query
      if (searchQuery && !property.name.tr.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !property.region.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Property type
      if (selectedType !== 'all' && property.propertyType !== selectedType) {
        return false;
      }

      // Region
      if (selectedRegion !== 'all' && property.region !== selectedRegion) {
        return false;
      }

      // Price range
      if (property.pricing.perNight < priceRange[0] || property.pricing.perNight > priceRange[1]) {
        return false;
      }

      // Min guests
      if (property.capacity.guests < minGuests) {
        return false;
      }

      return true;
    });
  }, [antalyaRentals, searchQuery, selectedType, selectedRegion, priceRange, minGuests]);

  // Featured properties (first 6)
  const featuredProperties = useMemo(() => {
    return antalyaRentals.slice(0, 6);
  }, []);

  // Toggle favorite
  const toggleFavorite = (id: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
      addToast('Favorilerden kaldırıldı', 'info');
    } else {
      newFavorites.add(id);
      addToast('Favorilere eklendi', 'success');
    }
    setFavorites(newFavorites);
  };

  // Handle reservation
  const handleReserve = (property: AntalyaRentalProperty) => {
    router.push(`/rentals/${property.seo.slug.tr}`);
  };

  return (
    <>
      <Head>
        <title>Tatil Evleri & Villalar | Travel.Ailydian.com</title>
        <meta name="description" content="Antalya'nın en özel tatil evleri, villaları ve lüks konaklama seçenekleri. %2 daha uygun fiyatlarla hemen rezervasyon yapın." />
        <meta name="keywords" content="antalya villa, tatil evi, lüks konaklama, kiralık villa, penthouse" />
      </Head>

      <ModernHeader />

      {/* 🎬 CLIENT-SIDE HERO (loads after hydration) */}
      <RentalsClientWrapper
        searchQuery={searchQuery}
        selectedType={selectedType}
        propertyTypes={propertyTypes}
        onSearchChange={setSearchQuery}
        onTypeChange={setSelectedType}
      />

      {/* Stats Section */}
      <NeoSection className="py-8 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10"
            >
              <Home className="w-12 h-12 mx-auto mb-3 text-blue-400" />
              <div className="text-3xl font-bold text-white mb-1">{antalyaRentals.length}+</div>
              <div className="text-gray-300">Özellik</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10"
            >
              <TrendingUp className="w-12 h-12 mx-auto mb-3 text-green-400" />
              <div className="text-3xl font-bold text-white mb-1">%2</div>
              <div className="text-gray-300">Daha Ucuz</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10"
            >
              <Star className="w-12 h-12 mx-auto mb-3 text-yellow-400" />
              <div className="text-3xl font-bold text-white mb-1">4.8+</div>
              <div className="text-gray-300">Ortalama Puan</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10"
            >
              <Shield className="w-12 h-12 mx-auto mb-3 text-purple-400" />
              <div className="text-3xl font-bold text-white mb-1">100%</div>
              <div className="text-gray-300">Güvenli Ödeme</div>
            </motion.div>
          </div>
        </div>
      </NeoSection>

      {/* Filter Bar */}
      <div className="sticky top-20 z-30 bg-gray-900/95 backdrop-blur-xl border-b border-white/10 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-gray-400">
              <Filter className="w-5 h-5" />
              <span className="font-medium">{filteredProperties.length} özellik bulundu</span>
            </div>

            {/* Region Filter */}
            <div className="flex flex-wrap gap-2">
              {regions.slice(0, 5).map((region) => (
                <button
                  key={region.value}
                  onClick={() => setSelectedRegion(region.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedRegion === region.value
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                      : 'bg-white/5 text-gray-400 hover:bg-lydian-bg/10 border border-white/10'
                  }`}
                >
                  {region.label}
                </button>
              ))}
            </div>

            {/* Advanced Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
            >
              <Filter className="w-4 h-4 inline mr-2" />
              Gelişmiş Filtreler
            </button>
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Fiyat Aralığı (₺/gece)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-lydian-primary"
                      placeholder="Min"
                    />
                    <span className="text-gray-300">-</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-lydian-primary"
                      placeholder="Max"
                    />
                  </div>
                </div>

                {/* Min Guests */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Minimum Misafir Sayısı
                  </label>
                  <select
                    value={minGuests}
                    onChange={(e) => setMinGuests(Number(e.target.value))}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-lydian-primary"
                  >
                    {[1, 2, 4, 6, 8, 10].map((num) => (
                      <option key={num} value={num}>{num}+ Kişi</option>
                    ))}
                  </select>
                </div>

                {/* Region Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Bölge
                  </label>
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-lydian-primary"
                  >
                    {regions.map((region) => (
                      <option key={region.value} value={region.value}>
                        {region.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedType('all');
                    setSelectedRegion('all');
                    setPriceRange([0, 10000]);
                    setMinGuests(1);
                  }}
                  className="px-6 py-2 bg-white/5 hover:bg-lydian-bg/10 text-gray-400 rounded-lg font-medium transition-all border border-white/10"
                >
                  Filtreleri Temizle
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Properties Grid */}
      <NeoSection className="py-16 bg-gradient-to-b from-gray-950 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property, index) => (
              <FuturisticCard
                key={property.id}
                image={property.images[0]}
                title={property.name.tr}
                description={property.shortDescription.tr}
                price={property.pricing.perNight}
                badge={property.propertyType === 'villa' ? 'Villa' : property.propertyType === 'penthouse' ? 'Penthouse' : 'Özellik'}
                badges={[
                  `${property.capacity.guests} Kişi`,
                  `${property.capacity.bedrooms} Yatak Odası`,
                  property.features.pool ? 'Havuz' : '',
                ].filter(Boolean)}
                rating={property.rating}
                reviews={property.reviewCount}
                metadata={[
                  { label: 'Bölge', value: regions.find(r => r.value === property.region)?.label || property.region },
                  { label: 'Tür', value: property.propertyType },
                ]}
                onClick={() => handleReserve(property)}
                onFavorite={() => toggleFavorite(property.id)}
                categoryColor="from-blue-500 to-cyan-500"
              />
            ))}
          </div>

          {filteredProperties.length === 0 && (
            <div className="text-center py-16">
              <Home className="w-24 h-24 mx-auto mb-6 text-lydian-text-secondary" />
              <h3 className="text-2xl font-bold text-white mb-3">Özellik Bulunamadı</h3>
              <p className="text-gray-300 mb-6">
                Arama kriterlerinize uygun özellik bulunamadı. Filtreleri değiştirerek tekrar deneyin.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedType('all');
                  setSelectedRegion('all');
                  setPriceRange([0, 10000]);
                  setMinGuests(1);
                }}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
              >
                Filtreleri Temizle
              </button>
            </div>
          )}
        </div>
      </NeoSection>

      {/* Why Choose Us Section */}
      <NeoSection className="py-16 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent"
            >
              Neden Travel.Ailydian.com?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-300"
            >
              Rakiplerimizden daha avantajlı konaklama deneyimi
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl rounded-2xl border border-blue-500/20"
            >
              <TrendingUp className="w-16 h-16 mb-4 text-blue-400" />
              <h3 className="text-2xl font-bold text-white mb-3">%2 Daha Ucuz</h3>
              <p className="text-gray-300">
                Airbnb, Booking.com ve Vrbo'dan %2 daha uygun fiyatlarla aynı özellikleri sunuyoruz.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-2xl border border-purple-500/20"
            >
              <Shield className="w-16 h-16 mb-4 text-purple-400" />
              <h3 className="text-2xl font-bold text-white mb-3">Güvenli Ödeme</h3>
              <p className="text-gray-300">
                256-bit SSL şifreleme ile güvenli ödeme. Para iade garantisi.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-8 bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl rounded-2xl border border-green-500/20"
            >
              <Award className="w-16 h-16 mb-4 text-green-400" />
              <h3 className="text-2xl font-bold text-white mb-3">Doğrulanmış Özellikler</h3>
              <p className="text-gray-300">
                Tüm özellikler ekibimiz tarafından doğrulanmış ve onaylanmıştır.
              </p>
            </motion.div>
          </div>
        </div>
      </NeoSection>
    </>
  );
};

// CRITICAL: Add i18n support for this page
// Without this, language changes won't work
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'tr', ['common'])),
    },
  };
};

export default RentalsPage;
