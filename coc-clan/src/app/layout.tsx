import type { Metadata } from 'next';
import '@/shared/styles/globals.scss';
import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
import { Montserrat } from 'next/font/google';
import { LoadImagesFallback } from '@/shared/ui/LoadImagesFallback';

// Конфигурируем шрифт Montserrat
const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-montserrat',
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
    <html lang="ru" className={montserrat.variable}>
      <body>
        <LoadImagesFallback />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
} 