import { useState, useCallback, useEffect } from 'react';
import { VoiceCommand } from '../types';
import { VoiceUtils } from '../utils/voiceUtils';

export const useVoiceCommands = (commands: VoiceCommand[]) => {
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeVoiceRecognition = useCallback(() => {
    const recognition = VoiceUtils.initializeRecognition();
    if (recognition) {
      setIsInitialized(true);
      VoiceUtils.speak('Voice commands ready. Say "help" for available commands.', 'medium');
    } else {
      VoiceUtils.speak('Voice recognition not available on this device.', 'high');
    }
  }, []);

  const processCommand = useCallback((transcript: string) => {
    console.log('Processing command:', transcript);
    setLastCommand(transcript);
    
    // Find matching command
    const matchedCommand = commands.find(cmd => 
      transcript.includes(cmd.command.toLowerCase()) ||
      cmd.command.toLowerCase().includes(transcript)
    );

    if (matchedCommand) {
      VoiceUtils.speak(`Executing: ${matchedCommand.description}`, 'medium');
      matchedCommand.action();
    } else {
      // Handle common variations and provide helpful responses
      if (transcript.includes('help') || transcript.includes('what can')) {
        const helpText = `Available commands: ${commands.map(cmd => cmd.command).join(', ')}`;
        VoiceUtils.speak(helpText, 'high');
      } else if (transcript.includes('repeat') || transcript.includes('say again')) {
        if (lastCommand) {
          VoiceUtils.speak(`Last command was: ${lastCommand}`, 'medium');
        } else {
          VoiceUtils.speak('No previous command to repeat.', 'medium');
        }
      } else {
        VoiceUtils.speak(`Command not recognized: ${transcript}. Say "help" for available commands.`, 'medium');
      }
    }
  }, [commands, lastCommand]);

  const startListening = useCallback(() => {
    if (!isInitialized) {
      initializeVoiceRecognition();
      return;
    }

    setIsListening(true);
    VoiceUtils.speak('Listening for command...', 'low');
    
    VoiceUtils.startListening(
      (transcript) => {
        setIsListening(false);
        processCommand(transcript);
      },
      (error) => {
        setIsListening(false);
        console.error('Voice recognition error:', error);
        VoiceUtils.speak('Voice recognition error. Please try again.', 'medium');
      }
    );
  }, [isInitialized, initializeVoiceRecognition, processCommand]);

  const stopListening = useCallback(() => {
    setIsListening(false);
    VoiceUtils.stopListening();
    VoiceUtils.speak('Stopped listening.', 'low');
  }, []);

  useEffect(() => {
    // Initialize voice recognition on component mount
    initializeVoiceRecognition();
  }, [initializeVoiceRecognition]);

  return {
    isListening,
    lastCommand,
    isInitialized,
    startListening,
    stopListening,
    processCommand
  };
};