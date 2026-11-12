/**
 * Architectural Solar Simulation & Sun Study Engine (Matching Reference Feature)
 * Simulates real-time sun azimuth, elevation, color temperature, and atmospheric sky/fog,
 * seamlessly balancing natural sunlight against artificial soffit and landscape lighting.
 */

export interface SolarParameters {
  timeOfDay: number; // 6.0 to 22.0
  timeString: string; // e.g. "02:30 PM"
  periodLabel: 'Dawn / Sunrise' | 'Morning' | 'Noon' | 'Afternoon' | 'Golden Hour' | 'Dusk / Twilight' | 'Night';
  sunPosition: [number, number, number];
  sunColor: string;
  sunIntensity: number;
  ambientColor: string;
  ambientIntensity: number;
  skyColor: string;
  fogColor: string;
  hemisphereGroundColor: string;
  artificialMultiplier: number;
}

export type SolarPresetKey = 'SUNRISE' | 'NOON' | 'GOLDEN_HOUR' | 'NIGHT';

export const SOLAR_PRESETS: Record<SolarPresetKey, { label: string; time: number; icon: string }> = {
  SUNRISE: { label: 'Sunrise', time: 7.0, icon: '🌅' },
  NOON: { label: 'Noon', time: 12.5, icon: '☀️' },
  GOLDEN_HOUR: { label: 'Golden Hour', time: 17.5, icon: '🌇' },
  NIGHT: { label: 'Night', time: 21.0, icon: '🌙' },
};

export function formatTimeOfDay(time: number): string {
  const hours24 = Math.floor(time);
  const minutes = Math.round((time - hours24) * 60);
  const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const hoursStr = hours12 < 10 ? `0${hours12}` : `${hours12}`;
  return `${hoursStr}:${minutesStr} ${period}`;
}

export function computeSolarParameters(time: number): SolarParameters {
  // Clamp between 6.0 (06:00 AM) and 22.0 (10:00 PM)
  const clampedTime = Math.max(6.0, Math.min(22.0, time));
  const timeString = formatTimeOfDay(clampedTime);

  // Period categorization
  let periodLabel: SolarParameters['periodLabel'] = 'Afternoon';
  if (clampedTime < 8.0) periodLabel = 'Dawn / Sunrise';
  else if (clampedTime < 11.5) periodLabel = 'Morning';
  else if (clampedTime <= 13.5) periodLabel = 'Noon';
  else if (clampedTime < 17.0) periodLabel = 'Afternoon';
  else if (clampedTime < 18.75) periodLabel = 'Golden Hour';
  else if (clampedTime < 20.0) periodLabel = 'Dusk / Twilight';
  else periodLabel = 'Night';

  // 1. Daytime calculations (6.0 to 18.5)
  if (clampedTime <= 18.5) {
    const progress = (clampedTime - 6.0) / 12.5; // 0.0 to 1.0
    // Sun elevation angle (radians): peaks at noon (progress = 0.52)
    const elevAngle = Math.sin(progress * Math.PI) * (Math.PI * 0.38); // max ~68 deg
    // Azimuth angle (radians): runs East to West
    const azimAngle = (progress - 0.5) * (Math.PI * 0.85);

    const R = 32;
    const sunX = R * Math.sin(azimAngle) * Math.cos(elevAngle);
    const sunY = Math.max(2.5, R * Math.sin(elevAngle));
    const sunZ = R * Math.cos(azimAngle) * Math.cos(elevAngle) * 0.7 + 10;

    if (clampedTime < 8.5) {
      // Dawn / Sunrise
      const t = (clampedTime - 6.0) / 2.5;
      return {
        timeOfDay: clampedTime,
        timeString,
        periodLabel,
        sunPosition: [sunX, sunY, sunZ],
        sunColor: '#FFB885',
        sunIntensity: 0.85 + t * 0.3,
        ambientColor: '#FFD4B8',
        ambientIntensity: 0.45 + t * 0.1,
        skyColor: '#D2B9A6',
        fogColor: '#D8C3B2',
        hemisphereGroundColor: '#7A6B5D',
        artificialMultiplier: 0.8 - t * 0.5,
      };
    } else if (clampedTime <= 16.5) {
      // Bright Midday Sun
      return {
        timeOfDay: clampedTime,
        timeString,
        periodLabel,
        sunPosition: [sunX, sunY, sunZ],
        sunColor: '#FFF6E5',
        sunIntensity: 1.35,
        ambientColor: '#FFF8EE',
        ambientIntensity: 0.58,
        skyColor: '#D6E2EC',
        fogColor: '#DBE6EF',
        hemisphereGroundColor: '#8E9B89',
        artificialMultiplier: 0.2, // downlights subtle in bright noon
      };
    } else {
      // Golden Hour (16.5 to 18.5)
      const t = (clampedTime - 16.5) / 2.0;
      return {
        timeOfDay: clampedTime,
        timeString,
        periodLabel,
        sunPosition: [sunX, sunY, sunZ],
        sunColor: '#FFA347',
        sunIntensity: 1.45,
        ambientColor: '#FFCB9E',
        ambientIntensity: 0.52,
        skyColor: '#DDA074',
        fogColor: '#E6AF86',
        hemisphereGroundColor: '#6B5848',
        artificialMultiplier: 0.4 + t * 0.8,
      };
    }
  }

  // 2. Twilight / Dusk (18.5 to 20.0)
  if (clampedTime < 20.0) {
    const t = (clampedTime - 18.5) / 1.5;
    return {
      timeOfDay: clampedTime,
      timeString,
      periodLabel,
      sunPosition: [22, 5, 20],
      sunColor: '#7E9BC4',
      sunIntensity: 0.38 - t * 0.22,
      ambientColor: '#3B4D66',
      ambientIntensity: 0.32 - t * 0.1,
      skyColor: '#1A2438',
      fogColor: '#1D2A40',
      hemisphereGroundColor: '#151D28',
      artificialMultiplier: 1.4 + t * 0.6, // downlights & bollards shine brightly!
    };
  }

  // 3. Night / Moonlight (20.0 to 22.0)
  return {
    timeOfDay: clampedTime,
    timeString,
    periodLabel,
    sunPosition: [-16, 24, 18], // Soft moon position
    sunColor: '#8DA6CE', // Cool moonbeam
    sunIntensity: 0.18,
    ambientColor: '#1A2233',
    ambientIntensity: 0.22,
    skyColor: '#090E17',
    fogColor: '#0C1320',
    hemisphereGroundColor: '#080C14',
    artificialMultiplier: 2.2, // Maximum cinematic illumination from downlights and fixtures
  };
}
