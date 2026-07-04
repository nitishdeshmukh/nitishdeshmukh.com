import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "@workspace/ui/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { SidebarProvider, SidebarTrigger } from "@workspace/ui/components/sidebar";
import { Toaster } from "sonner";
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
  title: "Admin Dashboard | Nitish Deshmukh",
  description: "Admin panel for managing portfolio content.",
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
      <body className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col selection:bg-neutral-200 dark:selection:bg-neutral-800">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <AdminSidebar />
            <div className="flex flex-1 flex-col overflow-hidden w-full relative">
              <header className="flex h-14 lg:h-16 items-center gap-4 border-b bg-white dark:bg-neutral-900 px-4 sm:px-6 shadow-sm z-10 shrink-0">
                <SidebarTrigger className="-ml-1" />
                <h1 className="font-semibold hidden sm:block">Dashboard</h1>
              </header>
              <main className="flex-1 overflow-auto bg-neutral-50 dark:bg-neutral-950">
                <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
                  {children}
                </div>
              </main>
            </div>
            <Toaster position="bottom-right" />
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
