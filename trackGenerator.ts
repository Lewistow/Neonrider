import { CANVAS_HEIGHT } from '../constants';
import { Point, Obstacle } from '../types';

// Helper to add points
const addLine = (points: Point[], start: Point, length: number, angleDeg: number): Point => {
  const rad = (angleDeg * Math.PI) / 180;
  const steps = length / 5; // 5px resolution
  for (let i = 0; i < steps; i++) {
    points.push({
      x: start.x + Math.cos(rad) * (i * 5),
      y: start.y + Math.sin(rad) * (i * 5),
    });
  }
  return points[points.length - 1];
};

const addSineWave = (points: Point[], start: Point, length: number, amplitude: number, freq: number): Point => {
  const steps = length / 5;
  for (let i = 0; i < steps; i++) {
    const px = i * 5;
    points.push({
      x: start.x + px,
      y: start.y + Math.sin(px * freq) * amplitude
    });
  }
  return points[points.length - 1];
};

// Helper for sawtooth/jagged terrain
const addSawtooth = (points: Point[], start: Point, length: number, height: number, width: number): Point => {
    const steps = length / 5;
    let currentY = start.y;
    let direction = -1; // -1 up, 1 down
    
    for (let i = 0; i < steps; i++) {
        const px = i * 5;
        const cycle = px % width;
        
        if (cycle < 5) direction = -1; 
        else if (cycle > width / 2) direction = 1; 
        
        currentY += direction * (height / (width/10)); 

        points.push({
            x: start.x + px,
            y: currentY
        });
    }
    return points[points.length - 1];
};

// Helper for random noise
const addNoise = (points: Point[], start: Point, length: number, roughness: number): Point => {
    const steps = length / 5;
    let currentY = start.y;
    
    for (let i = 0; i < steps; i++) {
        const px = i * 5;
        const jitter = (Math.random() - 0.5) * roughness;
        currentY += jitter;
        
        if (i < steps * 0.5) currentY += 0.5;
        else currentY -= 0.5;

        points.push({
            x: start.x + px,
            y: currentY
        });
    }
    return points[points.length - 1];
}

export const generateTrack = (level: number = 1): Point[] => {
  const points: Point[] = [];
  let currentPos = { x: 0, y: CANVAS_HEIGHT / 2 + 200 };

  // 1. Start Straight
  currentPos = addLine(points, currentPos, 800, 0);

  if (level >= 11) {
      currentPos = addLine(points, currentPos, 2000, 15);
      currentPos = addNoise(points, currentPos, 5000, 200);
      currentPos = addLine(points, currentPos, 3000, -60);
      currentPos = addLine(points, currentPos, 3000, 60);
      currentPos = addSawtooth(points, currentPos, 4000, 250, 25);
      currentPos = addSineWave(points, currentPos, 2000, 300, 0.1);
      currentPos = addLine(points, currentPos, 500, 0);
      currentPos = addSineWave(points, currentPos, 2000, 300, 0.1);
      currentPos = addLine(points, currentPos, 2500, 89);
      currentPos = addNoise(points, currentPos, 6000, 250);
      currentPos = addLine(points, currentPos, 3000, -30);
  } else if (level === 10) {
      currentPos = addLine(points, currentPos, 1500, 10);
      currentPos = addLine(points, currentPos, 3000, 88); 
      currentPos = addNoise(points, currentPos, 6000, 150);
      currentPos = addSineWave(points, currentPos, 4000, 400, 0.3);
      currentPos = addLine(points, currentPos, 2000, -88);
      currentPos = addSawtooth(points, currentPos, 3000, 200, 30);
      currentPos = addLine(points, currentPos, 1000, 80);
      currentPos = addLine(points, currentPos, 1000, -80);
      currentPos = addNoise(points, currentPos, 4000, 200);
      currentPos = addLine(points, currentPos, 2000, 0);
  } else if (level === 9) {
      currentPos = addLine(points, currentPos, 2000, -55);
      currentPos = addSawtooth(points, currentPos, 4000, 200, 40);
      currentPos = addLine(points, currentPos, 1500, 85);
      currentPos = addNoise(points, currentPos, 5000, 120); 
      currentPos = addLine(points, currentPos, 1000, 0);
      currentPos = addSawtooth(points, currentPos, 3000, 150, 20); 
      currentPos = addSineWave(points, currentPos, 2500, 300, 0.15);
      currentPos = addLine(points, currentPos, 1500, -65);
      currentPos = addLine(points, currentPos, 1000, 45);
  } else if (level === 8) {
      currentPos = addLine(points, currentPos, 2000, 85); 
      currentPos = addNoise(points, currentPos, 4000, 80); 
      currentPos = addSawtooth(points, currentPos, 3000, 180, 30); 
      currentPos = addLine(points, currentPos, 1500, -80); 
      currentPos = addSineWave(points, currentPos, 2500, 250, 0.2); 
      currentPos = addNoise(points, currentPos, 3000, 100); 
      currentPos = addLine(points, currentPos, 1000, 60);
      currentPos = addSawtooth(points, currentPos, 2000, 100, 20); 
      currentPos = addLine(points, currentPos, 4000, 0); 
      currentPos = addLine(points, currentPos, 1000, -45);
  } else if (level === 7) {
      currentPos = addLine(points, currentPos, 1500, 80); 
      currentPos = addNoise(points, currentPos, 3000, 45); 
      currentPos = addLine(points, currentPos, 1000, -85); 
      currentPos = addSawtooth(points, currentPos, 2500, 150, 40); 
      currentPos = addSineWave(points, currentPos, 2000, 200, 0.15); 
      currentPos = addLine(points, currentPos, 3500, 10); 
      currentPos = addNoise(points, currentPos, 2500, 60); 
      currentPos = addLine(points, currentPos, 1000, -50);
      currentPos = addLine(points, currentPos, 1000, 50);
  } else if (level === 6) {
      currentPos = addLine(points, currentPos, 1200, 75);
      currentPos = addNoise(points, currentPos, 2500, 30);
      currentPos = addLine(points, currentPos, 1000, -65);
      currentPos = addSawtooth(points, currentPos, 2000, 120, 60);
      currentPos = addLine(points, currentPos, 3000, 15);
      currentPos = addSineWave(points, currentPos, 1500, 180, 0.15);
      currentPos = addLine(points, currentPos, 1500, 60);
      currentPos = addSawtooth(points, currentPos, 1200, 60, 40);
      currentPos = addLine(points, currentPos, 1000, -45);
  } else if (level === 5) {
      currentPos = addLine(points, currentPos, 500, -30);
      currentPos = addSawtooth(points, currentPos, 800, 60, 50);
      currentPos = addLine(points, currentPos, 1000, 60);
      currentPos = addNoise(points, currentPos, 1500, 15);
      currentPos = addLine(points, currentPos, 400, -80);
      currentPos = addLine(points, currentPos, 400, 80);
      currentPos = addSineWave(points, currentPos, 1200, 30, 0.2);
      currentPos = addLine(points, currentPos, 800, -45);
  } else if (level === 4) {
      currentPos = addLine(points, currentPos, 600, 45);
      currentPos = addSawtooth(points, currentPos, 1000, 80, 100);
      currentPos = addLine(points, currentPos, 800, 85); 
      currentPos = addLine(points, currentPos, 600, -10);
      currentPos = addSineWave(points, currentPos, 1500, 40, 0.2);
      currentPos = addLine(points, currentPos, 800, -70);
      currentPos = addLine(points, currentPos, 600, 0);
      currentPos = addSineWave(points, currentPos, 1200, 250, 0.03);
  } else if (level === 3) {
    currentPos = addLine(points, currentPos, 400, -30);
    currentPos = addLine(points, currentPos, 600, 45);
    currentPos = addSineWave(points, currentPos, 1200, 50, 0.1);
    currentPos = addLine(points, currentPos, 600, -75);
    currentPos = addLine(points, currentPos, 700, 80);
    currentPos = addLine(points, currentPos, 500, 0);
    currentPos = addSineWave(points, currentPos, 1000, 300, 0.02);
  } else if (level === 2) {
    currentPos = addLine(points, currentPos, 400, -30);
    currentPos = addLine(points, currentPos, 600, 45);
    currentPos = addLine(points, currentPos, 500, -60);
    currentPos = addSineWave(points, currentPos, 1000, 200, 0.03);
    currentPos = addLine(points, currentPos, 600, 70);
    currentPos = addLine(points, currentPos, 1000, 0);
  } else {
    currentPos = addLine(points, currentPos, 400, -30);
    currentPos = addLine(points, currentPos, 600, 45);
    currentPos = addSineWave(points, currentPos, 1200, 150, 0.01);
  }

  if (level < 4) {
      currentPos = addSineWave(points, currentPos, 800, 300, 0.015);
  }

  currentPos = addLine(points, currentPos, 500, 0);
  currentPos = addLine(points, currentPos, 300, -45);
  currentPos = addLine(points, currentPos, 300, 0);
  currentPos = addLine(points, currentPos, 300, 45);

  let finalFreq = 0.02;
  let finalAmp = 100;

  if (level === 2) { finalFreq = 0.04; finalAmp = 150; }
  else if (level === 3) { finalFreq = 0.06; finalAmp = 180; }
  else if (level === 4) { finalFreq = 0.08; finalAmp = 200; }
  else if (level >= 5) { finalFreq = 0.1; finalAmp = 100; }

  currentPos = addSineWave(points, currentPos, 1500, finalAmp, finalFreq);
  currentPos = addLine(points, currentPos, 1000, 0);

  return points;
};

export const generateBuildings = (trackLength: number) => {
  const buildings = [];
  const count = Math.floor(trackLength / 200); 
  for (let i = 0; i < count; i++) {
    buildings.push({
      x: (i * 1000) + (Math.random() * 500),
      y: CANVAS_HEIGHT,
      w: 100 + Math.random() * 200,
      h: 300 + Math.random() * 600,
      layer: Math.random() > 0.5 ? 1 : 2 
    });
  }
  return buildings;
};

export const generateObstacles = (level: number, trackLength: number): Obstacle[] => {
    if (level < 5) return [];

    const obstacles: Obstacle[] = [];
    let density = 500;
    if (level === 6) density = 350;
    if (level === 7) density = 250;
    if (level === 8) density = 200; 
    if (level === 9) density = 180; 
    if (level >= 10) density = 150; 
    
    for (let i = 1000; i < trackLength - 1500; i += density + (Math.random() * 500)) {
        obstacles.push({
            pathIndex: i,
            type: Math.random() > 0.6 ? 'BARRIER' : 'DEBRIS'
        });
    }
    return obstacles;
};