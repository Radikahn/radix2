import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import TanstackClientWrapper from '@/lib/providers'
import { HydrationBoundary } from '@tanstack/react-query';
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
  title: "Radix2>?",
  description: "I like to make things - 01110010 01100001 01100100 01101001 01111000",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        
        <TanstackClientWrapper>{children}</TanstackClientWrapper>

      </body>
    </html>
  );
}



