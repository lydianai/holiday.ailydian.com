/**
 * Transfers Client Wrapper - Client-side animations ONLY
 * Framer Motion components that cannot run on server
 * @client-side-only
 */

'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bus } from 'lucide-react';
import TransferRouteSelector from '@/components/transfers/TransferRouteSelector';
import type { AdvancedLocationSuggestion } from '@/lib/location-service-advanced';

interface TransfersClientWrapperProps {
  searchForm: {
    from: string;
    to: string;
    dateTime: string;
    passengers: number;
    vehicleType: string;
  };
  onSearchFormChange: (form: any) => void;
  onSearch: () => void;
}

export const TransfersClientWrapper: React.FC<TransfersClientWrapperProps> = ({
  searchForm,
  onSearchFormChange,
  onSearch,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Server-side: render placeholder
  if (!mounted) {
    return (
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full mb-6">
              <Bus className="w-5 h-5" />
              <span className="text-sm font-medium">Transfer Hizmetleri</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
              Güvenli ve Konforlu
              <br />
              <span className="text-blue-200">Transfer Deneyimi</span>
            </h1>

            <p className="text-xl text-blue-50 mb-2 leading-relaxed max-w-3xl mx-auto">
              D2 belgeli transfer firmaları ile havaalanı, otel ve şehir içi transferleriniz güvende. 7/24 hizmet.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Client-side: render full animation
  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white py-24">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12">

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full mb-6">
            <Bus className="w-5 h-5" />
            <span className="text-sm font-medium">Transfer Hizmetleri</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
            Güvenli ve Konforlu
            <br />
            <span className="text-blue-200">Transfer Deneyimi</span>
          </h1>

          <p className="text-xl text-blue-50 mb-2 leading-relaxed max-w-3xl mx-auto">
            D2 belgeli transfer firmaları ile havaalanı, otel ve şehir içi transferleriniz güvende. 7/24 hizmet.
          </p>
        </motion.div>

        {/* Full Width Transfer Route Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-6xl mx-auto">

          <TransferRouteSelector
            from={searchForm.from}
            to={searchForm.to}
            dateTime={searchForm.dateTime}
            passengers={searchForm.passengers}
            vehicleType={searchForm.vehicleType}
            onFromChange={(value, location) => {
              onSearchFormChange({ ...searchForm, from: value });
            }}
            onToChange={(value, location) => {
              onSearchFormChange({ ...searchForm, to: value });
            }}
            onDateTimeChange={(value) => onSearchFormChange({ ...searchForm, dateTime: value })}
            onPassengersChange={(value) => onSearchFormChange({ ...searchForm, passengers: value })}
            onVehicleTypeChange={(value) => onSearchFormChange({ ...searchForm, vehicleType: value })}
            onSearch={onSearch} />

        </motion.div>
      </div>
    </section>
  );
};

export default TransfersClientWrapper;
