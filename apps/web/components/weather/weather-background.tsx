"use client";

import { useWeather } from "@/hooks/use-weather";
import { WeatherGradient } from "./weather-gradient";
import { WeatherParticles } from "./weather-particles";

export function WeatherBackground() {
  const { weatherState, loading } = useWeather();

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{ opacity: loading ? 0 : 1, transition: "opacity 1.5s ease" }}
    >
      {/* Gradient base layer */}
      <WeatherGradient state={weatherState} />

      {/* Particle layer */}
      <WeatherParticles state={weatherState} />

      {/* Blur + darkness overlay so content stays readable */}
      <div className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-[2px]" />
    </div>
  );
}
