import './globals.css';

import type { Metadata } from 'next';
import { geistMono, geistSans } from '@/fonts';

import ProgressBarProvider from '@/components/providers/progress-bar-provider';
import { ReactQueryProvider } from '@/components/providers/react-query-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: 'CMS',
  description: 'Content Management System by Neelo',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute='class'
          themes={['light', 'dark']}
          defaultTheme='dark'
          enableSystem
          disableTransitionOnChange
        >
          <ReactQueryProvider>
            <ProgressBarProvider>{children}</ProgressBarProvider>
          </ReactQueryProvider>
          <Toaster richColors position='top-right' offset={15} closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
