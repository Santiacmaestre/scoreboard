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
      <body className="min-h-full flex flex-col bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: "url('/Banner-Colorful.png')" }}>
        {children}
        <footer className="py-6 flex flex-col items-center gap-2">
          <img src="/logo-colorful.svg" alt="AI AWS UG Colombia" className="h-10 w-10 drop-shadow-md" />
          <p className="text-gray-500 text-sm font-medium tracking-wide">
            Made with <span className="text-red-400">&#9829;</span> by AI AWS UG Colombia
          </p>
        </footer>
      </body>
    </html>
  );
}
