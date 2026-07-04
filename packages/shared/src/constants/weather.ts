export const WEATHER_STATES = {
  sunny: [0, 1],                    // Clear sky, mainly clear
  cloudy: [2, 3, 45, 48],           // Partly cloudy, overcast, fog
  rainy: [51, 53, 55, 61, 63, 65, 80, 81, 82], // Drizzle, rain, showers
  snowy: [71, 73, 75, 77, 85, 86],  // Snow, snow grains, snow showers
  stormy: [95, 96, 99],             // Thunderstorm
} as const;

export type WeatherState = keyof typeof WEATHER_STATES | "night";
