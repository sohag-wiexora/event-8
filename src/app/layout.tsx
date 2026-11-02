
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Suspense } from 'react';
import ThemeProvider from '@/components/ThemeProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'EventHub | Social Development Events',
  description:
    'Discover community events, connect with people, and make a positive impact through EventHub.',
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
  className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
>
<body className="flex min-h-full flex-col">
  <ThemeProvider>
    <Suspense
      fallback={<div className="h-20 border-b border-gray-200" />}
    >
      <Navbar />
    </Suspense>

    <div className="flex-1">{children}</div>

    <Footer />
  </ThemeProvider>
</body>
  </html>
)};