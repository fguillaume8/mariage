import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { InviteProvider } from './context/InviteContext'
import LayoutClient from './LayoutClient'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mariage 💍",
  description: "Site de mariage personnalisé",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <InviteProvider>
          <LayoutClient>
            {children}
          </LayoutClient>
        </InviteProvider>
      </body>
    </html>
  )
}