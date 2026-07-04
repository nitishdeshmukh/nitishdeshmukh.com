import type { WeatherState } from "@/hooks/use-weather";
import { cn } from "@workspace/ui/lib/utils";

const GRADIENT_MAP: Record<WeatherState, string> = {
  sunny:
    "bg-[radial-gradient(ellipse_at_top,_#fde68a_0%,_#fb923c_40%,_#f97316_100%)]",
  night:
    "bg-[radial-gradient(ellipse_at_top,_#1e1b4b_0%,_#0f0a1e_60%,_#000000_100%)]",
  cloudy:
    "bg-[radial-gradient(ellipse_at_top,_#94a3b8_0%,_#64748b_50%,_#475569_100%)]",
  rainy:
    "bg-[radial-gradient(ellipse_at_top,_#312e81_0%,_#1e1b4b_50%,_#1e3a5f_100%)]",
  snowy:
    "bg-[radial-gradient(ellipse_at_top,_#e0f2fe_0%,_#bae6fd_50%,_#c7d2fe_100%)]",
  fallback:
    "bg-[radial-gradient(ellipse_at_top,_#dbeafe_0%,_#93c5fd_50%,_#6366f1_100%)]",
};

interface WeatherGradientProps {
  state: WeatherState;
}

export function WeatherGradient({ state }: WeatherGradientProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 transition-all duration-[2000ms] ease-in-out",
        GRADIENT_MAP[state]
      )}
    />
  );
}
