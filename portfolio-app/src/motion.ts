import { Vector3 } from 'three';

export const clamp = (value: number) => Math.min(1, Math.max(0, value));
export const smooth = (start: number, end: number, value: number) => {
  const amount = clamp((value - start) / (end - start));
  return amount * amount * (3 - 2 * amount);
};
export const phases = [[0.25, 0.42], [0.42, 0.60], [0.60, 0.78]];
export const docking = (progress: number, index: number) => {
  const [start, end] = phases[Math.floor(index / 3)];
  return smooth(start + (index % 3) * 0.012, end, progress);
};

const shellOrder = [0, 6, 3, 8, 1, 2, 4, 5, 7];
const horizontalAxis = new Vector3(1, 0, 0);
const verticalAxis = new Vector3(0, 1, 0);
const depthAxis = new Vector3(0, 0, 1);

export function orbit(index: number, progress: number, idleClock: number, width: number, height: number) {
  const compact = width < 700;
  const slot = shellOrder[index];
  const latitude = 1 - 2 * (slot + 0.5) / shellOrder.length;
  const longitude = slot * Math.PI * (3 - Math.sqrt(5));
  const ringRadius = Math.sqrt(1 - latitude * latitude);
  const radius = compact ? Math.min(width * 0.33, height * 0.25) : Math.min(width * 0.30, height * 0.29, 330);
  const phase = idleClock * 0.27 + progress * 0.8;
  const portraitWidth = compact || height <= 650 ? 850 : width >= 1600 ? 1300 : Math.min(1180, width * 1.1);
  const headCenter = -height / 2 + (compact ? 35 : 0) + portraitWidth * 941 / 1672 * 0.60;
  const position = new Vector3(Math.cos(longitude) * ringRadius, latitude, Math.sin(longitude) * ringRadius)
    .applyAxisAngle(horizontalAxis, -0.35 + idleClock * 0.075)
    .applyAxisAngle(verticalAxis, phase)
    .applyAxisAngle(depthAxis, Math.sin(phase * 0.5) * 0.22);
  const elevation = -0.05 + (position.y + 1) * 0.365;
  const heading = Math.atan2(position.z, position.x);
  const horizontalRadius = Math.sqrt(1 - elevation * elevation);
  position.set(Math.cos(heading) * horizontalRadius, elevation, Math.sin(heading) * horizontalRadius).multiplyScalar(radius);
  const spin = phase * 1.25 + longitude + Math.sin(idleClock * 0.42 + longitude) * 0.22;
  const rotation = [Math.sin(phase * 0.8 + longitude) * 0.48, spin, Math.sin(longitude + phase * 0.65) * 0.28];
  position.y += headCenter;
  return {
    position,
    rotation,
    bend: Math.sin(phase * 1.15 + longitude) * 1.25 + Math.sin(phase * 0.55 + index) * 0.35,
    scale: compact ? 0.27 : Math.min(0.55, width / 1900),
  };
}
