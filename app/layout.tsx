import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";
import { AuthProvider } from "@/lib/auth";
import { ToastProvider } from "@/components/toast";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { CommandPalette } from "@/components/command-palette";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: `${siteConfig.name} — ${siteConfig.tagline}`, template: `%s · ${siteConfig.name}` },
  description: siteConfig.description,
  openGraph: {
    title: `${siteConfig.name} — where startups, students and tech connect`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    type: "website",
    url: siteConfig.url,
  },
  twitter: { card: "summary_large_image", title: siteConfig.name, description: siteConfig.description },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen bg-black font-body text-white antialiased">
        <AuthProvider>
          <ToastProvider>
            <Nav />
            <main id="main" className="min-h-[60vh]">
              {children}
            </main>
            <Footer />
            <CommandPalette />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
