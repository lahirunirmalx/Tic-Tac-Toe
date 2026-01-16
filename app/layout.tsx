import type { Metadata } from "next";
import { Orbitron, Rajdhani } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Tic-Tac-Toe | Play Against AI",
  description: "A beautiful Tic-Tac-Toe game with an AI opponent. Challenge the bot and test your skills!",
  keywords: ["tic-tac-toe", "game", "AI", "nextjs", "react"],
  authors: [{ name: "Your Name" }],
  openGraph: {
    title: "Tic-Tac-Toe | Play Against AI",
    description: "A beautiful Tic-Tac-Toe game with an AI opponent",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${orbitron.variable} ${rajdhani.variable} antialiased`}
        style={{ fontFamily: "'Orbitron', 'Rajdhani', system-ui, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
