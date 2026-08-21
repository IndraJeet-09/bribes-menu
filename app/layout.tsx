import type { Metadata } from "next";
import { Playfair_Display, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const serifFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const sansFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "The Unofficial Fine Menu — Reported Offence Estimates (India)",
  description:
    "You know what you did. We know what people say it costs. Crowdsourced, unofficial reported figures for common traffic, vehicle, government, tax, and municipal situations across India.",
  keywords: [
    "unofficial fines",
    "traffic challan",
    "india traffic rates",
    "rto estimates",
    "dl fees",
    "unofficial fine menu",
  ],
  authors: [{ name: "The Unofficial Fine Menu" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${serifFont.variable} ${sansFont.variable} ${monoFont.variable}`}
    >
      <body className="min-h-screen flex flex-col antialiased selection:bg-black selection:text-white bg-background text-foreground">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
