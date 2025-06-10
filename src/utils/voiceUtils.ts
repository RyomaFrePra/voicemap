export class VoiceUtils {
  private static synth = window.speechSynthesis;
  private static recognition: SpeechRecognition | null = null;

  static speak(text: string, priority: 'low' | 'medium' | 'high' = 'medium'): Promise<void> {
    return new Promise((resolve) => {
      // Cancel current speech if high priority
      if (priority === 'high') {
        this.synth.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      // Use a clear, friendly voice
      const voices = this.synth.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang.startsWith('en') && voice.name.includes('Female')
      ) || voices.find(voice => voice.lang.startsWith('en'));
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      this.synth.speak(utterance);
    });
  }

  static stopSpeaking(): void {
    this.synth.cancel();
  }

  static initializeRecognition(): SpeechRecognition | null {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported');
      return null;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';
    this.recognition.maxAlternatives = 1;

    return this.recognition;
  }

  static startListening(onResult: (transcript: string) => void, onError?: (error: string) => void): void {
    if (!this.recognition) {
      this.recognition = this.initializeRecognition();
    }

    if (!this.recognition) {
      onError?.('Speech recognition not available');
      return;
    }

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      onResult(transcript);
    };

    this.recognition.onerror = (event) => {
      onError?.(event.error);
    };

    this.recognition.start();
  }

  static stopListening(): void {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  static formatLocationForSpeech(lat: number, lng: number): string {
    const latDir = lat >= 0 ? 'North' : 'South';
    const lngDir = lng >= 0 ? 'East' : 'West';
    
    return `You are located at ${Math.abs(lat).toFixed(4)} degrees ${latDir}, ${Math.abs(lng).toFixed(4)} degrees ${lngDir}`;
  }

  static announceLocationUpdate(accuracy: number): string {
    if (accuracy < 10) {
      return "Location updated with high precision.";
    } else if (accuracy < 50) {
      return "Location updated with good precision.";
    } else {
      return "Location updated with approximate precision.";
    }
  }
}