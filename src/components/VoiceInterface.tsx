import React from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { VoiceUtils } from '../utils/voiceUtils';

interface VoiceInterfaceProps {
  isListening: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  lastCommand: string | null;
  isInitialized: boolean;
}

export const VoiceInterface: React.FC<VoiceInterfaceProps> = ({
  isListening,
  onStartListening,
  onStopListening,
  lastCommand,
  isInitialized
}) => {
  const handleVoiceToggle = () => {
    if (isListening) {
      onStopListening();
    } else {
      onStartListening();
    }
  };

  const testSpeech = () => {
    VoiceUtils.speak('Voice Map is working correctly. All systems ready for navigation assistance.', 'medium');
  };

  return (
    <div className="voice-interface space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-bold text-white mb-4">Voice Commands</h2>
        
        <button
          onClick={handleVoiceToggle}
          disabled={!isInitialized}
          className={`
            w-full h-16 rounded-lg font-bold text-lg transition-all duration-200
            focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900
            active:scale-95 transform
            ${isListening 
              ? 'bg-yellow-600 text-gray-900 animate-pulse' 
              : 'bg-blue-600 hover:bg-blue-500 text-white disabled:bg-gray-600 disabled:cursor-not-allowed'
            }
          `}
          aria-label={isListening ? "Stop listening for voice commands" : "Start listening for voice commands"}
        >
          <div className="flex items-center justify-center space-x-3">
            {isListening ? <Mic size={24} /> : <MicOff size={24} />}
            <span>
              {!isInitialized 
                ? 'INITIALIZING...'
                : isListening 
                  ? 'LISTENING...' 
                  : 'TAP TO SPEAK'
              }
            </span>
          </div>
        </button>
      </div>

      <button
        onClick={testSpeech}
        className="
          w-full h-12 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium
          focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900
          transition-all duration-200 active:scale-95 transform
        "
        aria-label="Test voice output"
      >
        <div className="flex items-center justify-center space-x-2">
          <Volume2 size={20} />
          <span>TEST VOICE</span>
        </div>
      </button>

      {lastCommand && (
        <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
          <p className="text-yellow-400 text-sm font-medium">Last Command:</p>
          <p className="text-white text-base mt-1">"{lastCommand}"</p>
        </div>
      )}

      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <h3 className="text-yellow-400 font-medium mb-2">Available Commands:</h3>
        <ul className="text-white text-sm space-y-1">
          <li>• "Where am I?" - Get current location</li>
          <li>• "Navigate to [place]" - Start navigation</li>
          <li>• "Report hazard" - Report obstacle</li>
          <li>• "Emergency" - Emergency assistance</li>
          <li>• "Help" - List all commands</li>
        </ul>
      </div>
    </div>
  );
};