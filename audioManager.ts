import { GameState } from '../types';

class AudioManager {
  private ctx: AudioContext | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private masterGain: GainNode | null = null;
  private lfo: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;
  
  private beatInterval: number | null = null;
  public isMuted: boolean = true;
  private isInitialized: boolean = false;
  
  private impactBuffer: AudioBuffer | null = null;
  private engines: Map<string, { osc: OscillatorNode; filter: BiquadFilterNode; gain: GainNode }> = new Map();

  constructor() {
      // Properties initialized inline
  }

  init() {
    if (this.isInitialized) return;

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioContextClass();
    
    // Master Gain (Volume)
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0; // Start silent
    this.masterGain.connect(this.ctx.destination);

    // Filter
    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.value = 200;
    this.filter.Q.value = 1;
    this.filter.connect(this.masterGain);

    // LFO
    this.lfo = this.ctx.createOscillator();
    this.lfo.type = 'sine';
    this.lfo.frequency.value = 0.2; 
    this.lfoGain = this.ctx.createGain();
    this.lfoGain.gain.value = 100;
    this.lfo.connect(this.lfoGain);
    if (this.filter) {
        this.lfoGain.connect(this.filter.frequency);
    }
    this.lfo.start();

    // Drone 1
    this.droneOsc1 = this.ctx.createOscillator();
    this.droneOsc1.type = 'sawtooth';
    this.droneOsc1.frequency.value = 55; // A1
    this.droneOsc1.connect(this.filter);
    this.droneOsc1.start();

    // Drone 2
    this.droneOsc2 = this.ctx.createOscillator();
    this.droneOsc2.type = 'sawtooth';
    this.droneOsc2.frequency.value = 55.5; 
    this.droneOsc2.connect(this.filter);
    this.droneOsc2.start();

    // Impact Noise Buffer
    const bufferSize = this.ctx.sampleRate * 0.5;
    this.impactBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = this.impactBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - (i / bufferSize), 4);
    }

    this.isInitialized = true;
  }

  resume() {
    if (!this.isInitialized) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.isMuted = false;
    this.updateVolume();
  }

  toggleMute() {
    if (!this.isInitialized) this.resume();
    this.isMuted = !this.isMuted;
    this.updateVolume();
    return this.isMuted;
  }

  setGameState(gameState: GameState | string) {
    if (!this.ctx || !this.filter || !this.lfo) return;

    const now = this.ctx.currentTime;

    if (gameState === 'PLAYING' || gameState === 'COUNTDOWN') {
       this.filter.frequency.exponentialRampToValueAtTime(800, now + 2);
       this.lfo.frequency.exponentialRampToValueAtTime(4, now + 2); 
       this.startBeat();
    } else if (gameState === 'FINISHED' || gameState === 'PAUSED') {
       this.filter.frequency.exponentialRampToValueAtTime(150, now + 1);
       this.lfo.frequency.linearRampToValueAtTime(0.1, now + 1);
       this.stopBeat();
    } else {
       // MENU
       this.filter.frequency.exponentialRampToValueAtTime(300, now + 2);
       this.lfo.frequency.exponentialRampToValueAtTime(0.5, now + 2);
       this.stopBeat();
    }
  }

  resetEngines() {
      this.engines.forEach(e => {
          try {
            e.osc.stop();
            e.osc.disconnect();
            e.filter.disconnect();
            e.gain.disconnect();
          } catch (e) {}
      });
      this.engines.clear();
  }

  silenceEngines() {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      this.engines.forEach(e => {
          e.gain.gain.setTargetAtTime(0, now, 0.1);
      });
  }

  addEngine(id: string, isPlayer: boolean) {
      if (!this.ctx || !this.masterGain) return;

      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.value = isPlayer ? 50 : 60;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 100;
      filter.Q.value = 1;

      const gain = this.ctx.createGain();
      gain.gain.value = 0;

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      
      osc.start();

      this.engines.set(id, { osc, filter, gain });
  }

  updateEngine(id: string, speedRatio: number, volumeScale = 1.0, isPlayer: boolean) {
      const engine = this.engines.get(id);
      if (!engine || !this.ctx) return;

      const r = Math.max(0, Math.min(1.2, speedRatio));
      const now = this.ctx.currentTime;

      const baseFreq = isPlayer ? 50 : 70;
      const topFreq = isPlayer ? 300 : 400;
      
      const freq = baseFreq + (r * (topFreq - baseFreq));
      engine.osc.frequency.setTargetAtTime(freq, now, 0.1);

      const minFilter = 150;
      const maxFilter = 2500;
      const filterFreq = minFilter + (r * (maxFilter - minFilter));
      engine.filter.frequency.setTargetAtTime(filterFreq, now, 0.1);

      let vol = 0;
      if (!this.isMuted) {
          if (isPlayer) {
              vol = 0.15 + (r * 0.05);
          } else {
              vol = (0.05 + (r * 0.02)) * volumeScale;
          }
      }
      engine.gain.gain.setTargetAtTime(vol, now, 0.1);
  }

  playImpact(volume = 1.0) {
      if (this.isMuted || !this.ctx || !this.masterGain || !this.impactBuffer) return;

      const src = this.ctx.createBufferSource();
      src.buffer = this.impactBuffer;
      
      const gain = this.ctx.createGain();
      gain.gain.value = volume;
      
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1500; 
      
      src.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      
      src.start();
  }

  playCountdownBeep(count: number) {
      if (this.isMuted || !this.ctx || !this.masterGain) return;

      const isFinal = count === 0;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      let freq = 440;
      let vol = 0.3;

      if (count === 3) { freq = 440; vol = 0.3; }
      else if (count === 2) { freq = 550; vol = 0.5; }
      else if (count === 1) { freq = 660; vol = 0.8; }
      else if (count === 0) { freq = 880; vol = 1.0; }

      osc.type = isFinal ? 'square' : 'sine';
      osc.frequency.value = freq; 

      const now = this.ctx.currentTime;
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(vol, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (isFinal ? 0.8 : 0.4));
      
      osc.connect(gain);
      gain.connect(this.masterGain);
      
      osc.start(now);
      osc.stop(now + (isFinal ? 1.0 : 0.5));
  }

  updateVolume() {
     if (!this.masterGain || !this.ctx) return;
     const now = this.ctx.currentTime;
     this.masterGain.gain.cancelScheduledValues(now);
     this.masterGain.gain.linearRampToValueAtTime(this.isMuted ? 0 : 0.25, now + 0.2);
  }

  startBeat() {
    if (this.beatInterval) return;
    this.beatInterval = window.setInterval(() => this.playDrum(), 500); 
  }

  stopBeat() {
    if (this.beatInterval) {
      clearInterval(this.beatInterval);
      this.beatInterval = null;
    }
  }

  playDrum() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.frequency.value = 150;
    osc.frequency.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);
    
    gain.gain.value = 0.6;
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.5);
  }
}

export default new AudioManager();