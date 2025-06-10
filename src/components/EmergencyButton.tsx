import React, { useState } from 'react';
import { AlertTriangle, Phone } from 'lucide-react';
import { VoiceUtils } from '../utils/voiceUtils';

interface EmergencyButtonProps {
  onEmergencyTriggered: () => void;
}

export const EmergencyButton: React.FC<EmergencyButtonProps> = ({ onEmergencyTriggered }) => {
  const [isPressed, setIsPressed] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const handleEmergencyPress = () => {
    setIsPressed(true);
    setCountdown(3);
    
    VoiceUtils.speak('Emergency button pressed. Activating emergency assistance in 3 seconds. Press again to cancel.', 'high');
    
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownInterval);
          if (prev === 1) {
            triggerEmergency();
          }
          return null;
        }
        
        VoiceUtils.speak(String(prev - 1), 'high');
        return prev - 1;
      });
    }, 1000);

    setTimeout(() => {
      if (isPressed) {
        setIsPressed(false);
        setCountdown(null);
      }
    }, 5000);
  };

  const triggerEmergency = () => {
    setIsPressed(false);
    setCountdown(null);
    
    VoiceUtils.speak('Emergency assistance activated. Attempting to contact emergency services and your emergency contacts.', 'high');
    onEmergencyTriggered();
    
    // Simulate emergency call
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationText = `Emergency location: ${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`;
          VoiceUtils.speak(locationText, 'high');
          
          // In a real app, this would send location to emergency services
          console.log('Emergency location:', position.coords);
        },
        (error) => {
          VoiceUtils.speak('Unable to get precise location for emergency services.', 'high');
          console.error('Emergency location error:', error);
        }
      );
    }
  };

  const cancelEmergency = () => {
    setIsPressed(false);
    setCountdown(null);
    VoiceUtils.speak('Emergency call cancelled.', 'medium');
  };

  return (
    <div className="emergency-section">
      <button
        onClick={isPressed ? cancelEmergency : handleEmergencyPress}
        className={`
          w-full h-20 rounded-lg font-bold text-xl transition-all duration-200
          focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900
          active:scale-95 transform
          ${isPressed 
            ? 'bg-yellow-600 text-gray-900 animate-pulse' 
            : 'bg-red-600 hover:bg-red-500 text-white'
          }
        `}
        aria-label={isPressed ? "Cancel emergency call" : "Emergency assistance button"}
      >
        <div className="flex items-center justify-center space-x-3">
          {isPressed ? (
            <>
              <AlertTriangle size={28} />
              <span>
                {countdown ? `CANCELLING IN ${countdown}` : 'TAP TO CANCEL'}
              </span>
            </>
          ) : (
            <>
              <Phone size={28} />
              <span>EMERGENCY</span>
            </>
          )}
        </div>
      </button>
      
      {isPressed && (
        <p className="text-yellow-400 text-center mt-2 font-medium">
          Emergency assistance activating...
        </p>
      )}
    </div>
  );
};