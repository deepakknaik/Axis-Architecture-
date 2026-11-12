'use client';

import * as React from 'react';
import { Sun, Moon, Play, Pause, Clock, Sunset, Sunrise } from 'lucide-react';
import {
  computeSolarParameters,
  formatTimeOfDay,
  SOLAR_PRESETS,
  SolarPresetKey,
} from '@/lib/reconstruction/solar-types';

export interface SolarSliderControlProps {
  timeOfDay: number;
  onChangeTimeOfDay: (newTime: number) => void;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
  className?: string;
}

export function SolarSliderControl({
  timeOfDay,
  onChangeTimeOfDay,
  isPlaying = false,
  onTogglePlay,
  className = '',
}: SolarSliderControlProps) {
  const solarParams = React.useMemo(() => computeSolarParameters(timeOfDay), [timeOfDay]);
  const timeRef = React.useRef(timeOfDay);
  timeRef.current = timeOfDay;

  // Handle continuous time animation when playing
  React.useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      let next = timeRef.current + 0.08;
      if (next > 22.0) next = 6.0; // Loop sunrise to night
      onChangeTimeOfDay(Number(next.toFixed(2)));
    }, 60);

    return () => clearInterval(interval);
  }, [isPlaying, onChangeTimeOfDay]);

  return (
    <div
      className={`pointer-events-auto flex items-center gap-2.5 p-1.5 px-3 bg-stone-950/95 backdrop-blur-md border border-stone-800 rounded-2xl shadow-2xl font-mono text-xs select-none ${className}`}
    >
      {/* 1. Play / Pause Sun Animation */}
      <button
        type="button"
        onClick={onTogglePlay}
        title={isPlaying ? 'Pause Sun Simulation' : 'Play 24h Sun Study Animation'}
        className={`w-7 h-7 rounded-xl flex items-center justify-center border transition-all ${
          isPlaying
            ? 'bg-amber-600 border-amber-400 text-white shadow-amber-900/40 shadow-md'
            : 'bg-stone-900 border-stone-700/80 text-amber-400 hover:text-white hover:bg-stone-800'
        }`}
      >
        {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
      </button>

      {/* 2. Quick Presets (Sunrise, Noon, Golden Hour, Night) */}
      <div className="flex items-center gap-1 border-r border-stone-800 pr-2">
        {(Object.keys(SOLAR_PRESETS) as SolarPresetKey[]).map((pKey) => {
          const preset = SOLAR_PRESETS[pKey];
          const isCurrent = Math.abs(timeOfDay - preset.time) < 0.8;

          return (
            <button
              key={pKey}
              type="button"
              onClick={() => onChangeTimeOfDay(preset.time)}
              title={`${preset.label} (${formatTimeOfDay(preset.time)})`}
              className={`px-2 py-1 rounded-lg text-[10.5px] flex items-center gap-1 transition-all ${
                isCurrent
                  ? 'bg-amber-500/25 border border-amber-400/80 text-amber-300 font-bold'
                  : 'bg-stone-900/60 border border-stone-800/80 text-stone-400 hover:text-white hover:bg-stone-800'
              }`}
            >
              <span>{preset.icon}</span>
              <span className="hidden sm:inline">{preset.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Range Slider */}
      <div className="flex items-center gap-2 min-w-[140px] sm:min-w-[180px]">
        <Sunrise className="w-3.5 h-3.5 text-amber-400/70 shrink-0" />
        <input
          type="range"
          min={6.0}
          max={22.0}
          step={0.1}
          value={timeOfDay}
          onChange={(e) => onChangeTimeOfDay(parseFloat(e.target.value))}
          className="w-full accent-amber-500 cursor-pointer h-1.5 bg-stone-800 rounded-lg"
        />
        <Moon className="w-3.5 h-3.5 text-blue-400/70 shrink-0" />
      </div>

      {/* 4. Live Time & Period Badge */}
      <div className="flex items-center gap-1.5 pl-1 text-[11px] whitespace-nowrap">
        <Clock className="w-3.5 h-3.5 text-amber-400" />
        <span className="font-bold text-white">{solarParams.timeString}</span>
        <span className="text-[9.5px] px-1.5 py-0.5 rounded bg-stone-800/90 text-amber-300 hidden md:inline border border-stone-700/50">
          {solarParams.periodLabel}
        </span>
      </div>
    </div>
  );
}
