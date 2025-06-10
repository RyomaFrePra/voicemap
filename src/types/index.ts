export interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface NavigationState {
  isListening: boolean;
  isNavigating: boolean;
  currentLocation: Location | null;
  destination: string | null;
  lastCommand: string | null;
}

export interface VoiceCommand {
  command: string;
  action: () => void;
  description: string;
}

export interface Hazard {
  id: string;
  location: Location;
  description: string;
  reportedAt: number;
  severity: 'low' | 'medium' | 'high';
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}