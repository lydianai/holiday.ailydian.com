import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Navigation2, Maximize2 } from 'lucide-react';
import { Coordinates } from '../../lib/types/review-system';
import logger from '../../lib/logger';

// Dynamically import Leaflet components (client-side only)
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);
const ZoomControl = dynamic(
  () => import('react-leaflet').then((mod) => mod.ZoomControl),
  { ssr: false }
);

interface LocationMapProps {
  coordinates: Coordinates;
  locationName: string;
  address?: string;
  zoom?: number;
  height?: string;
  showControls?: boolean;
  interactive?: boolean;
}

const LocationMap: React.FC<LocationMapProps> = ({
  coordinates,
  locationName,
  address,
  zoom = 15,
  height = 'h-64',
  showControls = true,
  interactive = true
}) => {
  const [isClient, setIsClient] = useState(false);
  const [mapKey, setMapKey] = useState(0);

  useEffect(() => {
    setIsClient(true);
    // Force re-render when coordinates change
    setMapKey(prev => prev + 1);
  }, [coordinates]);

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`;
    window.open(url, '_blank');
  };

  const openFullscreen = () => {
    const url = `https://www.openstreetmap.org/?mlat=${coordinates.lat}&mlon=${coordinates.lng}#map=${zoom}/${coordinates.lat}/${coordinates.lng}`;
    window.open(url, '_blank');
  };

  if (!isClient) {
    // SSR fallback
    return (
      <div className={`w-full ${height} relative`}>
        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-lydian-primary mx-auto mb-2 animate-pulse" />
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${height} relative`}>
      {/* Real Interactive Map */}
      <div className="w-full h-full rounded-lg overflow-hidden border-2 border-white/20 shadow-lg">
        <MapContainer
          key={mapKey}
          center={[coordinates.lat, coordinates.lng]}
          zoom={zoom}
          scrollWheelZoom={interactive}
          zoomControl={false}
          className="w-full h-full z-0"
          style={{ height: '100%', width: '100%' }}
        >
          {/* OpenStreetMap Tiles - Free and Production-Ready */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />

          {/* Custom Zoom Controls */}
          {showControls && <ZoomControl position="topright" />}

          {/* Location Marker */}
          <Marker position={[coordinates.lat, coordinates.lng]}>
            <Popup>
              <div className="text-center p-2">
                <h3 className="font-bold text-lg mb-1">{locationName}</h3>
                {address && <p className="text-sm text-gray-600 mb-2">{address}</p>}
                <div className="text-xs text-gray-500 mb-2">
                  <p>{coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}</p>
                </div>
                <button
                  onClick={openInGoogleMaps}
                  className="bg-lydian-primary hover:bg-lydian-primary-hover text-white px-3 py-1 rounded text-xs transition-colors"
                >
                  Get Directions
                </button>
              </div>
            </Popup>
          </Marker>
        </MapContainer>

        {/* Action Buttons */}
        {showControls && (
          <div className="absolute bottom-4 left-4 flex gap-2 z-10">
            <button
              onClick={openInGoogleMaps}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all text-sm font-medium flex items-center gap-2"
              title="Open in Google Maps"
            >
              <Navigation2 className="w-4 h-4" />
              Directions
            </button>
            <button
              onClick={openFullscreen}
              className="bg-white/90 backdrop-blur text-gray-800 px-3 py-2 rounded-lg shadow-lg hover:bg-white transition-all"
              title="Open fullscreen map"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Load Leaflet CSS */}
      <style jsx global>{`
        @import url('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');

        .leaflet-container {
          font-family: inherit;
        }

        .leaflet-popup-content-wrapper {
          border-radius: 8px;
        }

        .leaflet-popup-content {
          margin: 0;
          min-width: 200px;
        }
      `}</style>
    </div>
  );
};

export default LocationMap;