import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { DesignProvider } from '@/components/layout/DesignProvider';
import { RecordingsProvider } from '@/providers/RecordingsContext';

export const metadata: Metadata = {
  title: 'Brain ASR',
  description: 'ASR website',
};

const inter = Inter({
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} custom-scrollbar scroll-smooth antialiased`}
      >
        <DesignProvider>
          <RecordingsProvider>{children}</RecordingsProvider>
        </DesignProvider>
      </body>
    </html>
  );
}
