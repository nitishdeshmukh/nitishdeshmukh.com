import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "@workspace/ui/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AudioProvider } from "@/context/audio-context";
import { StickyPlayer } from "@/components/music/sticky-player";
import { FloatingDock } from "@/components/navigation/floating-dock";
import { MobileHeader } from "@/components/navigation/mobile-header";
import { ScrollToTop } from "@/components/navigation/scroll-to-top";
import { WeatherBackground } from "@/components/weather/weather-background";
import { RealtimeProvider } from "@/providers/realtime-provider";
import { cn } from "@workspace/ui/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Nitish Deshmukh — Part-Time Web Developer",
    template: "%s | Nitish Deshmukh",
  },
  description:
    "Portfolio of Nitish Deshmukh — Full Stack Developer, Open Source Enthusiast based in India.",
  metadataBase: new URL("https://nitishdeshmukh.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nitishdeshmukh.com",
    siteName: "Nitish Deshmukh",
    title: "Nitish Deshmukh — Part-Time Web Developer",
    description:
      "Portfolio of Nitish Deshmukh — Full Stack Developer, Open Source Enthusiast based in India.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nitish Deshmukh",
    description: "Part-Time Web Developer",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        inter.variable,
        geistMono.variable,
        "font-sans"
      )}
    >
      <body className="bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <RealtimeProvider>
            <AudioProvider>
              {/* Dynamic weather background */}
              <WeatherBackground />

              {/* Mobile navigation */}
              <MobileHeader />

              {/* Page content — padded bottom so floating dock doesn't overlap */}
              <main className="pb-28">{children}</main>

              {/* Desktop floating dock */}
              <StickyPlayer />
              <FloatingDock />

              {/* Scroll to top */}
              <ScrollToTop />
            </AudioProvider>
          </RealtimeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
