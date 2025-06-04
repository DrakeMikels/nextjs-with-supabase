import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "RSC BiWeekly Tracker",
  description: "Regional Safety Coaches Bi-Weekly Touch Base Tracker - Freedom Forever Safety Management System",
  keywords: ["safety", "coaches", "tracking", "bi-weekly", "freedom forever", "safety management"],
  authors: [{ name: "Freedom Forever" }],
  creator: "Freedom Forever",
  publisher: "Freedom Forever",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: defaultUrl,
    title: "RSC BiWeekly Tracker",
    description: "Regional Safety Coaches Bi-Weekly Touch Base Tracker - Freedom Forever Safety Management System",
    siteName: "RSC BiWeekly Tracker",
  },
  twitter: {
    card: "summary_large_image",
    title: "RSC BiWeekly Tracker",
    description: "Regional Safety Coaches Bi-Weekly Touch Base Tracker - Freedom Forever Safety Management System",
    creator: "@freedomforever",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
