import { Geist, Geist_Mono } from 'next/font/google';

export const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

export const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});
