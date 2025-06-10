import React from 'react';
import { MapPin, Navigation, Clock } from 'lucide-react';
import { Location } from '../types';

interface LocationDisplayProps {
  location: Location | null;
  isTracking: boolean;
  error: string | null;
  onLocationRequest: () => void;
}

export const LocationDisplay: React.FC<LocationDisplayProps> = ({
  location,
  isTracking,
  error,
  onLocationRequest
}) => {
  const formatLocation = (loc: Location) => {
    return {
      coordinates: `${loc.latitude.toFixed(6)}, ${loc.longitude.toFixed(6)}`,
      accuracy: loc.accuracy < 10 ? 'High' : loc.accuracy < 50 ? 'Good' : 'Approximate',
      timestamp: new Date(loc.timestamp).toLocaleTimeString()
    };
  };

  return (
    <div className="location-display space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-bold text-white mb-4">Location Status</h2>
        
        <button
          onClick={onLocationRequest}
          className="
            w-full h-16 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold text-lg
            focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900
            transition-all duration-200 active:scale-95 transform
            disabled:bg-gray-600 disabled:cursor-not-allowed
          "
          aria-label="Get current location and announce it"
        >
          <div className="flex items-center justify-center space-x-3">
            <MapPin size={24} />
            <span>WHERE AM I?</span>
          </div>
        </button>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-600 p-4 rounded-lg">
          <p className="text-red-400 font-medium">Location Error:</p>
          <p className="text-white mt-1">{error}</p>
        </div>
      )}

      {location && (
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 space-y-3">
          <div className="flex items-center space-x-2 text-yellow-400">
            <Navigation size={20} />
            <span className="font-medium">Current Location</span>
          </div>
          
          {(() => {
            const formatted = formatLocation(location);
            return (
              <>
                <div className="text-white">
                  <p className="text-sm text-gray-400">Coordinates:</p>
                  <p className="font-mono text-base">{formatted.coordinates}</p>
                </div>
                
                <div className="flex justify-between text-sm">
                  <div>
                    <p className="text-gray-400">Accuracy:</p>
                    <p className="text-white">{formatted.accuracy}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Updated:</p>
                    <p className="text-white">{formatted.timestamp}</p>
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      )}

      <div className="flex items-center justify-center space-x-2 text-sm">
        <Clock size={16} className="text-gray-400" />
        <span className="text-gray-400">
          Tracking: {isTracking ? 'Active' : 'Inactive'}
        </span>
      </div>
    </div>
  );
};