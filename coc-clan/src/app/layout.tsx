import type { Metadata } from 'next';
import '@/shared/styles/globals.scss';
import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
import { Oxygen, MedievalSharp } from 'next/font/google';
import { LoadImagesFallback } from '@/shared/ui/LoadImagesFallback';

// Конфигурируем шрифт Oxygen
const oxygen = Oxygen({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  display: 'swap',
  variable: '--font-oxygen',
});

// Конфигурируем шрифт MedievalSharp
const medievalSharp = MedievalSharp({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  variable: '--font-medieval',
});

export const metadata: Metadata = {
  title: 'Лучшие | Clan Clash of Clans',
  description: 'Статистика клана Лучшие в Clash of Clans #20GL2UPP2',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${oxygen.variable} ${medievalSharp.variable}`}>
      <body>
        <LoadImagesFallback />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
} 