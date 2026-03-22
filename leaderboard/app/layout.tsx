import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  title: "Leaderboard",
  description: "Leaderboard de contribuidores y líderes",
  openGraph: {
    title: "Leaderboard",
    description: "Leaderboard de contribuidores y líderes",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 1200,
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: "url('/Banner-Colorful.png')" }}>{children}</body>
    </html>
  );
}
