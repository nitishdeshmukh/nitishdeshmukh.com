import type { WeatherState } from "@/hooks/use-weather";

// ---- Rain ----
function RainParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 60 }).map((_, i) => (
        <div
          key={i}
          className="absolute top-0 w-px opacity-30"
          style={{
            left: `${Math.random() * 100}%`,
            height: `${10 + Math.random() * 20}px`,
            background: "rgba(255,255,255,0.8)",
            animationName: "rain-fall",
            animationDuration: `${0.5 + Math.random() * 0.5}s`,
            animationDelay: `${Math.random() * 2}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            transform: "rotate(15deg)",
          }}
        />
      ))}
    </div>
  );
}

// ---- Snow ----
function SnowParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 50 }).map((_, i) => {
        const size = 3 + Math.random() * 5;
        return (
          <div
            key={i}
            className="absolute rounded-full bg-white opacity-70"
            style={{
              width: size,
              height: size,
              left: `${Math.random() * 100}%`,
              top: `-${size}px`,
              animationName: "snow-fall",
              animationDuration: `${3 + Math.random() * 4}s`,
              animationDelay: `${Math.random() * 5}s`,
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
            }}
          />
        );
      })}
    </div>
  );
}

// ---- Stars ----
function StarParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 80 }).map((_, i) => {
        const size = 1 + Math.random() * 2;
        return (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: size,
              height: size,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              animationName: "star-twinkle",
              animationDuration: `${2 + Math.random() * 3}s`,
              animationDelay: `${Math.random() * 4}s`,
              animationTimingFunction: "ease-in-out",
              animationIterationCount: "infinite",
              animationDirection: "alternate",
            }}
          />
        );
      })}
    </div>
  );
}

// ---- Sunny orbs ----
function SunnyParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 6 }).map((_, i) => {
        const size = 80 + Math.random() * 120;
        return (
          <div
            key={i}
            className="absolute rounded-full opacity-20 blur-3xl"
            style={{
              width: size,
              height: size,
              left: `${Math.random() * 90}%`,
              top: `${Math.random() * 50}%`,
              background: "#fde68a",
              animationName: "orb-drift",
              animationDuration: `${8 + Math.random() * 6}s`,
              animationDelay: `${Math.random() * 4}s`,
              animationTimingFunction: "ease-in-out",
              animationIterationCount: "infinite",
              animationDirection: "alternate",
            }}
          />
        );
      })}
    </div>
  );
}

// ---- Cloud blobs ----
function CloudyParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 5 }).map((_, i) => {
        const width = 200 + Math.random() * 300;
        return (
          <div
            key={i}
            className="absolute rounded-full opacity-20 blur-3xl bg-white"
            style={{
              width,
              height: width * 0.4,
              top: `${10 + i * 12}%`,
              left: `-${width}px`,
              animationName: "cloud-drift",
              animationDuration: `${20 + Math.random() * 20}s`,
              animationDelay: `${i * -8}s`,
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
            }}
          />
        );
      })}
    </div>
  );
}

interface WeatherParticlesProps {
  state: WeatherState;
}

export function WeatherParticles({ state }: WeatherParticlesProps) {
  if (state === "rainy") return <RainParticles />;
  if (state === "snowy") return <SnowParticles />;
  if (state === "night") return <StarParticles />;
  if (state === "sunny") return <SunnyParticles />;
  if (state === "cloudy") return <CloudyParticles />;
  return null;
}
