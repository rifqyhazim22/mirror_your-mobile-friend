import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mirror | Teman Curhat AI dengan Empati Real-Time",
  description:
    "Mirror adalah teman curhat AI dengan deteksi emosi wajah, insight psikologi ilmiah, dan akses psikolog profesional untuk Generasi Z.",
  manifest: "/manifest.json",
  metadataBase: new URL("https://mirror.vercel.app"),
  openGraph: {
    title: "Mirror | Teman Curhat AI dengan Empati Real-Time",
    description:
      "Teman curhat AI yang memadukan deteksi emosi, profil MBTI & Enneagram, serta akses psikolog profesional.",
    url: "https://mirror.vercel.app",
    siteName: "Mirror",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Mirror | Teman Curhat AI dengan Empati Real-Time",
    description:
      "Ceritakan isi hati ke Mirror ✨ Teman AI yang peka, aman, dan siap 24/7 membantu kesejahteraan mentalmu.",
    creator: "@mirror",
    images: ["/icons/icon-512.png"]
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }
    ]
  },
  alternates: {
    canonical: "/"
  },
  other: {
    "x-mirror-monetization": "mock-stage"
  }
};

export const viewport: Viewport = {
  themeColor: "#7a5cff",
  colorScheme: "dark light"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-night`}
      >
        {children}
      </body>
    </html>
  );
}
