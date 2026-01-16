import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Loader2, Navigation } from 'lucide-react';
import { searchAdvancedLocations, AdvancedLocationSuggestion } from '@/lib/location-service-advanced';

interface LocationSuggestion {
  id: string;
  name: string;
  city: string;
  region?: string;
  country: string;
  type: 'city' | 'airport' | 'hotel' | 'region';
  code?: string; // Airport code like IST, AYT
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string, suggestion?: LocationSuggestion) => void;
  placeholder?: string;
  type?: 'city' | 'airport' | 'hotel' | 'all';
  icon?: React.ReactNode;
  className?: string;
}

export const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  value,
  onChange,
  placeholder = 'Nereye gitmek istersiniz?',
  type = 'all',
  icon,
  className = ''
}) => {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | undefined>();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Get user location for distance-based sorting
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          // Geolocation failed, continue without it
        },
        { timeout: 5000 }
      );
    }
  }, []);

  // Search suggestions with advanced search
  useEffect(() => {
    if (value.length < 2) {
      // Show popular locations when no query
      const popularResults = searchAdvancedLocations('', {
        type: type === 'all' ? undefined : type,
        limit: 8,
        popularFirst: true
      });
      setSuggestions(convertToLocationSuggestions(popularResults));
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);

    // Use advanced search with fuzzy matching
    const results = searchAdvancedLocations(value, {
      type: type === 'all' ? undefined : type,
      limit: 10,
      userLocation,
      popularFirst: true
    });

    setSuggestions(convertToLocationSuggestions(results));
    setShowSuggestions(true);
    setIsLoading(false);
  }, [value, type, userLocation]);

  // Convert AdvancedLocationSuggestion to LocationSuggestion
  const convertToLocationSuggestions = (
    advancedSuggestions: AdvancedLocationSuggestion[]
  ): LocationSuggestion[] => {
    return advancedSuggestions.map(loc => ({
      id: loc.id,
      name: loc.name,
      city: loc.city,
      region: loc.region,
      country: loc.country,
      type: loc.type as any,
      code: loc.code,
      coordinates: loc.coordinates
    }));
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSelectSuggestion(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
    }
  };

  const handleSelectSuggestion = (suggestion: LocationSuggestion) => {
    onChange(suggestion.name, suggestion);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'airport':
        return '✈️';
      case 'hotel':
        return '🏨';
      case 'region':
        return '🏖️';
      case 'city':
      default:
        return '📍';
    }
  };

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
          {icon || <MapPin className="text-gray-300 w-5 h-5 group-hover:scale-110 group-focus-within:scale-110 group-focus-within:text-blue-500 transition-all" />}
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => value.length >= 2 && setShowSuggestions(true)}
          placeholder={placeholder}
          className="w-full pl-12 pr-10 py-4 text-base bg-gradient-to-br from-slate-900 via-black to-slate-800 border-2 border-white/20/10 rounded-2xl focus:ring-2 focus:ring-lydian-primary focus:border-blue-500 outline-none text-white placeholder-lydian-text-tertiary font-medium shadow-sm hover:shadow-lg hover:border-blue-500/50 transition-all duration-200"
          autoComplete="off" />

        {isLoading &&
        <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5 animate-spin" />
        }
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 &&
      <div className="absolute z-50 w-full mt-2 bg-gradient-to-br from-slate-900 via-black to-slate-800 rounded-2xl shadow-2xl border-2 border-white/20 overflow-hidden max-h-96 overflow-y-auto">
          {suggestions.map((suggestion, index) =>
        <button
          key={suggestion.id}
          onClick={() => handleSelectSuggestion(suggestion)}
          className={`w-full px-5 py-4 flex items-start gap-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 text-left border-b border-white/20 last:border-b-0 ${
          index === selectedIndex ? 'bg-gradient-to-r from-blue-600/10 to-purple-700/10' : ''}`
          }>

              <span className="text-2xl mt-0.5 transform hover:scale-125 transition-transform">{getLocationIcon(suggestion.type)}</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white truncate">{suggestion.name}</div>
                <div className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">
                    {suggestion.city}
                    {suggestion.region && `, ${suggestion.region}`}
                    {' • '}
                    {suggestion.country}
                  </span>
                  {suggestion.code &&
              <span className="ml-2 px-2 py-0.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md text-xs font-mono font-semibold shadow-sm flex-shrink-0">
                      {suggestion.code}
                    </span>
              }
                </div>
              </div>
              {suggestion.type === 'airport' &&
          <Navigation className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
          }
            </button>
        )}
        </div>
      }

      {/* No results */}
      {showSuggestions && !isLoading && value.length >= 2 && suggestions.length === 0 &&
      <div className="absolute z-50 w-full mt-2 bg-gradient-to-br from-slate-900 via-black to-slate-800 rounded-2xl shadow-2xl border-2 border-white/20 p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
            <Search className="w-8 h-8 text-gray-300" />
          </div>
          <div className="font-semibold text-white mb-1">Sonuç bulunamadı</div>
          <div className="text-sm text-gray-300">Farklı bir arama terimi deneyin</div>
        </div>
      }
    </div>);

};

export default LocationAutocomplete;