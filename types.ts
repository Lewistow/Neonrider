
export interface Point {
  x: number;
  y: number;
}

export enum GameState {
  MENU = 'MENU',
  SHOP = 'SHOP',
  ROSTER = 'ROSTER',
  COUNTDOWN = 'COUNTDOWN',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  FINISHED = 'FINISHED',
  REPLAY = 'REPLAY',
  PAYWALL = 'PAYWALL'
}

export interface Bike {
  name?: string; // Display name (e.g., RIVAL, VIPER)
  color: string;
  glowColor: string;
  pathIndex: number; // Current position along the track array
  speed: number;
  maxSpeed: number;
  acceleration: number;
  isThrottling: boolean;
  isPlayer: boolean;
  turboCharge: number; // Visual meter (0-100)
  lateralOffset?: number; // Visual offset from track center (swerving)
  lastObstacleHit?: number; // Track index of last hit obstacle to prevent double-hits
}

export interface OpponentInfo {
  name: string;
  progress: number;
  color: string;
}

export interface Obstacle {
  pathIndex: number;
  type: 'BARRIER' | 'DEBRIS';
}

export interface GameConfig {
  trackLength: number;
  segmentLength: number;
}

export interface PlayerStats {
  credits: number;
  speedLevel: number;
  accelLevel: number;
  isPremium: boolean;
}