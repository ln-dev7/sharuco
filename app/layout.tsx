import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Providers from '@/utils/provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Sharuco',
    template: '%s | Sharuco',
  },
  description:
    'Sharuco allows you to share code codes that you have found useful.',
  openGraph: {
    url: 'https://sharuco.lndev.me/',
    title: 'Sharuco',
    description:
      'Sharuco allows you to share code codes that you have found useful.',
    images: [
      {
        url: 'https://sharuco.lndev.me/sharuco-banner.png',
        alt: 'Sharuco',
        type: 'image/jpeg',
        secureUrl: 'https://sharuco.lndev.me/sharuco-banner.png',
      },
    ],
    siteName: 'Sharuco',
  },
  twitter: {
    creator: '@ln_dev7',
    site: '@ln_dev7',
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
        className={`min-h-screen bg-white font-sans text-zinc-900 antialiased dark:bg-zinc-900 dark:text-zinc-50 ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
