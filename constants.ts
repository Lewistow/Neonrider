export const CANVAS_WIDTH = 1920;
export const CANVAS_HEIGHT = 1080;

export const COLORS = {
  backgroundTop: '#2d1b4e',
  backgroundBottom: '#0f0518',
  trackCore: '#ffffff',
  trackGlow: '#00f3ff',
  playerGlow: '#ff0055', // Red/Pink neon
  opponentGlow: '#00aaff', // Blue neon
  buildingNear: '#1a0b2e',
  buildingFar: '#25123d',
};

export const GAME_CONFIG = {
  fps: 60,
  gravity: 0.6, // Stronger gravity for better hill feel
  acceleration: 0.4, // Manual gas acceleration
  friction: 0.96, // Drag when not pressing gas
  cameraSmoothnessY: 0.1, // Only smooth Y axis
  slopeGravity: 0.5, // Effect of slope on speed
  maxSpeed: 35, // Higher top speed since we have drag
};

export const UPGRADE_CONFIG = {
  speedCostBase: 450, 
  accelCostBase: 450, 
  speedIncrement: 0.6, // How much maxSpeed increases per level
  accelIncrement: 0.04, // How much acceleration increases per level
  maxLevel: 5
};

export const REWARDS = {
  first: 500,
  second: 250,
  third: 100,
  participation: 40
};

export const RIVAL_DB = [
  { id: 'rival', name: 'RIVAL', color: '#00aaff', description: 'Your first challenge. A balanced racer with standard factory specs.', stats: { speed: 40, aggro: 30 } },
  { id: 'viper', name: 'VIPER', color: '#39ff14', description: 'Aggressive and toxic. Loves to cut you off on sharp turns.', stats: { speed: 50, aggro: 60 } },
  { id: 'phantom', name: 'PHANTOM', color: '#d946ef', description: 'A ghost in the machine. Hard to predict and harder to catch.', stats: { speed: 60, aggro: 50 } },
  { id: 'cobra', name: 'COBRA', color: '#ffaa00', description: 'Strike first, strike hard. Dominates the straightaways.', stats: { speed: 70, aggro: 70 } },
  { id: 'nemesis', name: 'NEMESIS', color: '#ff0000', description: 'Your ultimate test. Fueled by pure rage and horsepower.', stats: { speed: 80, aggro: 90 } },
  { id: 'omega', name: 'OMEGA', color: '#ffffff', description: 'The Alpha and the Omega. A rogue AI with god-tier specs.', stats: { speed: 85, aggro: 80 } },
  { id: 'titan', name: 'TITAN', color: '#ccff00', description: 'An immovable object with unstoppable force. Absolute unit.', stats: { speed: 90, aggro: 85 } },
  { id: 'vortex', name: 'VORTEX', color: '#00ffaa', description: 'A glitch in the system. Breaks physics to win.', stats: { speed: 95, aggro: 100 } },
  { id: 'hydra', name: 'HYDRA', color: '#06b6d4', description: 'Cut off one head, two more take its place. Relentless.', stats: { speed: 98, aggro: 95 } },
  { id: 'zeus', name: 'ZEUS', color: '#7c3aed', description: 'The King of the Track. Rules with thunderous speed.', stats: { speed: 100, aggro: 100 } },
  { id: 'kronos', name: 'KRONOS', color: '#b91c1c', description: 'The Time Eater. Ancient, red-lined specs. Brakes are disabled.', stats: { speed: 105, aggro: 105 } },
  { id: 'oblivion', name: 'OBLIVION', color: '#ffffff', description: 'The Void itself. A black hole on wheels that consumes the track.', stats: { speed: 110, aggro: 110 } },
  { id: 'ragnarok', name: 'RAGNAROK', color: '#ff1493', description: 'The Doom of Gods. Reality bends around this machine.', stats: { speed: 120, aggro: 120 } },
];