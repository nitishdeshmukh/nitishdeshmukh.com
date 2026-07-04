"use client";

import { useEffect, useState } from "react";

export type WeatherState =
  | "sunny"
  | "night"
  | "cloudy"
  | "rainy"
  | "snowy"
  | "fallback";

// WMO Weather Code → WeatherState mapping
// https://open-meteo.com/en/docs#weathervariables
function mapWmoToState(code: number, isDay: boolean): WeatherState {
  if (!isDay) return "night";

  // Clear sky
  if (code === 0 || code === 1) return "sunny";

  // Partly cloudy / overcast
  if (code === 2 || code === 3) return "cloudy";

  // Fog, rime
  if (code >= 45 && code <= 48) return "cloudy";

  // Drizzle, rain, showers, thunderstorm
  if (
    (code >= 51 && code <= 67) ||
    (code >= 80 && code <= 82) ||
    (code >= 95 && code <= 99)
  )
    return "rainy";

  // Snow
  if (
    (code >= 71 && code <= 77) ||
    (code >= 85 && code <= 86)
  )
    return "snowy";

  return "cloudy";
}

function getTimeOfDayFallback(): WeatherState {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return "sunny"; // morning
  if (hour >= 12 && hour < 18) return "sunny"; // afternoon
  if (hour >= 18 && hour < 21) return "cloudy"; // evening
  return "night"; // night
}

const CACHE_KEY = "weather_cache";
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

interface WeatherCache {
  state: WeatherState;
  cachedAt: number;
}

export function useWeather() {
  const [weatherState, setWeatherState] = useState<WeatherState>("fallback");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage cache
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const cache: WeatherCache = JSON.parse(raw);
        if (Date.now() - cache.cachedAt < CACHE_TTL) {
          setWeatherState(cache.state);
          setLoading(false);
          return;
        }
      }
    } catch {
      // ignore
    }

    // Request geolocation
    if (!navigator.geolocation) {
      setWeatherState(getTimeOfDayFallback());
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=weather_code,is_day`
          );
          const data = await res.json();
          const code: number = data.current?.weather_code ?? 0;
          const isDay: boolean = data.current?.is_day === 1;

          const state = mapWmoToState(code, isDay);

          // Cache result
          const cache: WeatherCache = { state, cachedAt: Date.now() };
          localStorage.setItem(CACHE_KEY, JSON.stringify(cache));

          setWeatherState(state);
        } catch {
          setWeatherState(getTimeOfDayFallback());
        } finally {
          setLoading(false);
        }
      },
      () => {
        // Geolocation denied → time-of-day fallback
        setWeatherState(getTimeOfDayFallback());
        setLoading(false);
      },
      { timeout: 5000 }
    );
  }, []);

  return { weatherState, loading };
}
