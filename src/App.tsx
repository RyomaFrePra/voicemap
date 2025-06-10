import React, { useEffect, useState } from 'react';
import { Navigation2, Shield, Users, Home } from 'lucide-react';
import { VoiceInterface } from './components/VoiceInterface';
import { LocationDisplay } from './components/LocationDisplay';
import { EmergencyButton } from './components/EmergencyButton';
import { useLocation } from './hooks/useLocation';
import { useVoiceCommands } from './hooks/useVoiceCommands';
import { VoiceCommand, Hazard } from './types';
import { VoiceUtils } from './utils/voiceUtils';

function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'navigate' | 'hazards' | 'emergency'>('home');
  const [isNavigating, setIsNavigating] = useState(false);
  const [hazards, setHazards] = useState<Hazard[]>([]);
  
  const {
    location,
    isTracking,
    error: locationError,
    startTracking,
    stopTracking,
    announceCurrentLocation
  } = useLocation();

  // Define voice commands
  const voiceCommands: VoiceCommand[] = [
    {
      command: 'where am i',
      action: announceCurrentLocation,
      description: 'Announce current location'
    },
    {
      command: 'navigate',
      action: () => {
        setActiveTab('navigate');
        setIsNavigating(true);
        VoiceUtils.speak('Navigation mode activated. Please specify your destination.', 'medium');
      },
      description: 'Start navigation mode'
    },
    {
      command: 'report hazard',
      action: () => {
        setActiveTab('hazards');
        VoiceUtils.speak('Hazard reporting mode. Please describe the hazard you want to report.', 'medium');
      },
      description: 'Report a hazard or obstacle'
    },
    {
      command: 'emergency',
      action: () => {
        setActiveTab('emergency');
        VoiceUtils.speak('Emergency mode activated. Press the emergency button or say activate emergency for immediate assistance.', 'high');
      },
      description: 'Activate emergency assistance'
    },
    {
      command: 'home',
      action: () => {
        setActiveTab('home');
        VoiceUtils.speak('Returned to home screen.', 'medium');
      },
      description: 'Return to home screen'
    },
    {
      command: 'start tracking',
      action: () => {
        startTracking();
        VoiceUtils.speak('Location tracking started.', 'medium');
      },
      description: 'Start location tracking'
    },
    {
      command: 'stop tracking',
      action: () => {
        stopTracking();
        VoiceUtils.speak('Location tracking stopped.', 'medium');
      },
      description: 'Stop location tracking'
    }
  ];

  const {
    isListening,
    lastCommand,
    isInitialized,
    startListening,
    stopListening
  } = useVoiceCommands(voiceCommands);

  // Initialize app
  useEffect(() => {
    const initializeApp = async () => {
      // Welcome message
      await VoiceUtils.speak('Welcome to Voice Map. Your accessible navigation assistant.', 'high');
      
      // Start location tracking automatically
      startTracking();
      
      // Load saved hazards from localStorage
      const savedHazards = localStorage.getItem('voicemap-hazards');
      if (savedHazards) {
        setHazards(JSON.parse(savedHazards));
      }
    };

    initializeApp();
  }, [startTracking]);

  // Save hazards to localStorage
  useEffect(() => {
    localStorage.setItem('voicemap-hazards', JSON.stringify(hazards));
  }, [hazards]);

  const handleEmergencyTriggered = () => {
    VoiceUtils.speak('Emergency services have been notified. Help is on the way. Stay calm and remain in your current location if safe.', 'high');
    
    // In a real app, this would trigger actual emergency protocols
    console.log('Emergency triggered at location:', location);
  };

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    
    const tabMessages = {
      home: 'Home screen active',
      navigate: 'Navigation screen active',
      hazards: 'Hazard reporting screen active',
      emergency: 'Emergency assistance screen active'
    };
    
    VoiceUtils.speak(tabMessages[tab], 'low');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-2">VoiceMap</h1>
              <p className="text-gray-300 text-lg">Your Voice-First Navigation Assistant</p>
            </div>
            
            <LocationDisplay
              location={location}
              isTracking={isTracking}
              error={locationError}
              onLocationRequest={announceCurrentLocation}
            />
            
            <VoiceInterface
              isListening={isListening}
              onStartListening={startListening}
              onStopListening={stopListening}
              lastCommand={lastCommand}
              isInitialized={isInitialized}
            />
          </div>
        );
        
      case 'navigate':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white text-center">Navigation</h2>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 text-center">
              <Navigation2 size={48} className="text-yellow-400 mx-auto mb-4" />
              <p className="text-white text-lg mb-4">
                Navigation features coming soon!
              </p>
              <p className="text-gray-400">
                Voice commands for turn-by-turn directions will be available in the next update.
              </p>
            </div>
          </div>
        );
        
      case 'hazards':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white text-center">Hazard Reporting</h2>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 text-center">
              <Shield size={48} className="text-yellow-400 mx-auto mb-4" />
              <p className="text-white text-lg mb-4">
                Community hazard reporting coming soon!
              </p>
              <p className="text-gray-400">
                Report obstacles, construction, and other hazards to help the community navigate safely.
              </p>
            </div>
          </div>
        );
        
      case 'emergency':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white text-center">Emergency Assistance</h2>
            <EmergencyButton onEmergencyTriggered={handleEmergencyTriggered} />
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <h3 className="text-yellow-400 font-medium mb-2">Emergency Features:</h3>
              <ul className="text-white text-sm space-y-1">
                <li>• Automatic location sharing</li>
                <li>• Emergency contact notification</li>
                <li>• Voice-guided assistance</li>
                <li>• Direct emergency services connection</li>
              </ul>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Main content */}
      <main className="pb-20 p-4">
        <div className="max-w-md mx-auto">
          {renderTabContent()}
        </div>
      </main>

      {/* Bottom navigation */}
      <nav 
        className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700"
        role="tablist"
        aria-label="Main navigation"
      >
        <div className="flex">
          <button
            onClick={() => handleTabChange('home')}
            className={`
              flex-1 p-4 text-center transition-colors duration-200
              focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:ring-inset
              ${activeTab === 'home' ? 'bg-yellow-600 text-gray-900' : 'text-gray-300 hover:text-white hover:bg-gray-700'}
            `}
            role="tab"
            aria-selected={activeTab === 'home'}
            aria-label="Home screen"
          >
            <Home size={24} className="mx-auto mb-1" />
            <span className="text-xs font-medium">Home</span>
          </button>
          
          <button
            onClick={() => handleTabChange('navigate')}
            className={`
              flex-1 p-4 text-center transition-colors duration-200
              focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:ring-inset
              ${activeTab === 'navigate' ? 'bg-yellow-600 text-gray-900' : 'text-gray-300 hover:text-white hover:bg-gray-700'}
            `}
            role="tab"
            aria-selected={activeTab === 'navigate'}
            aria-label="Navigation screen"
          >
            <Navigation2 size={24} className="mx-auto mb-1" />
            <span className="text-xs font-medium">Navigate</span>
          </button>
          
          <button
            onClick={() => handleTabChange('hazards')}
            className={`
              flex-1 p-4 text-center transition-colors duration-200
              focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:ring-inset
              ${activeTab === 'hazards' ? 'bg-yellow-600 text-gray-900' : 'text-gray-300 hover:text-white hover:bg-gray-700'}
            `}
            role="tab"
            aria-selected={activeTab === 'hazards'}
            aria-label="Hazard reporting screen"
          >
            <Shield size={24} className="mx-auto mb-1" />
            <span className="text-xs font-medium">Hazards</span>
          </button>
          
          <button
            onClick={() => handleTabChange('emergency')}
            className={`
              flex-1 p-4 text-center transition-colors duration-200
              focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:ring-inset
              ${activeTab === 'emergency' ? 'bg-red-600 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-700'}
            `}
            role="tab"
            aria-selected={activeTab === 'emergency'}
            aria-label="Emergency assistance screen"
          >
            <Users size={24} className="mx-auto mb-1" />
            <span className="text-xs font-medium">Emergency</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default App;