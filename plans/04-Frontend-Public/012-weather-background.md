# Plan 012: Dynamic Weather Background

## Status
- **Priority**: P1 | **Effort**: L (6-10h) | **Risk**: MED
- **Depends on**: 011 (layout) | **Phase**: 04-Frontend-Public

## Objective (Kya)
Create a full-page dynamic background layer that adjusts based on the visitor's
local weather conditions using the free Open-Meteo API + browser Geolocation.

## Timeline (Kab)
After layout exists. Visually impactful but non-blocking — other pages work without it.

## Implementation Strategy (Kaise)

### Data flow
```
Browser Geolocation API → lat/lon
  → Open-Meteo API (free, no key): GET https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=weather_code,is_day
  → WMO weather code + is_day boolean
  → Map to visual state using WEATHER_STATES from @workspace/shared
  → Render corresponding CSS/canvas animation
```

### Weather visual states (all CSS-based for performance)

| State | Background | Animation |
|-------|-----------|-----------|
| ☀️ Sunny | Warm amber→yellow gradient | Floating light particles (CSS `@keyframes`) |
| ☁️ Cloudy | Slate→gray gradient | Drifting cloud shapes (CSS translateX loop) |
| 🌧️ Rainy | Indigo→dark blue gradient | Animated rain streaks (thin white lines falling) |
| ❄️ Snowy | Blue-white gradient | Falling snowflakes (CSS animation with varied sizes) |
| 🌙 Night | Navy→black gradient | Twinkling star dots (CSS opacity animation) |
| 🌫️ Fallback | Time-of-day gradient | None — subtle gradient based on hour |

### Architecture

```
components/weather/
├── weather-background.tsx    # Main wrapper — renders on <body> level, behind content
├── weather-particles.tsx     # Rain/snow/star particles via CSS animations
└── weather-gradient.tsx      # Gradient layer with smooth transitions
hooks/
└── use-weather.ts            # Geolocation → Open-Meteo → weather state
```

### Key implementation
- **`use-weather.ts`**: Uses `navigator.geolocation.getCurrentPosition()`, caches
  result in `localStorage` for 30 minutes, fetches Open-Meteo, returns `WeatherState`
- **Smooth transitions**: CSS `transition: background 2s ease` between weather states
- **Performance**: Pure CSS animations, no canvas/WebGL — stays under 60fps
- **Blur layer**: Semi-transparent backdrop-blur between background and content
- **Fallback**: If geolocation denied → use time-of-day (morning/afternoon/evening/night)

**Verify**: Open site with geolocation allowed → background matches local weather.
**Verify**: Deny geolocation → falls back to time-of-day gradient.
**Verify**: Lighthouse performance stays above 90.

## Done Criteria
- [ ] `use-weather.ts` hook fetches and caches weather data
- [ ] 6 weather visual states render correctly
- [ ] Smooth CSS transitions between states
- [ ] Geolocation fallback to time-of-day
- [ ] No performance regression (<5ms layout shift)
- [ ] `plans/README.md` 012 → DONE

## STOP Conditions
- Open-Meteo API changes response format — check docs at https://open-meteo.com/en/docs
- CSS animations cause jank on mobile — simplify to gradient-only on mobile breakpoints
