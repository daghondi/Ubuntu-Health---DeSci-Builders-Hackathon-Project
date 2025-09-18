import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { UbuntuPhilosophyBanner } from '@/components/common/UbuntuPhilosophyBanner';
import { WalletConnection } from '@/components/common/WalletConnection';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  showUbuntuBanner?: boolean;
  requireWallet?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  title = 'Ubuntu Health',
  description = 'Community-driven decentralized healthcare platform rooted in Ubuntu philosophy',
  showUbuntuBanner = true,
  requireWallet = false,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{title} | {t('site.tagline')}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="ubuntu, health, desci, blockchain, healthcare, community" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/images/ubuntu-health-og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="/images/ubuntu-health-twitter.png" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/images/ubuntu-symbols/apple-touch-icon.png" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Ubuntu Philosophy Banner */}
        {showUbuntuBanner && <UbuntuPhilosophyBanner />}

        {/* Header with Navigation */}
        <Header />

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 min-h-[calc(100vh-200px)]">
          {requireWallet && (
            <div className="mb-8">
              <WalletConnection />
            </div>
          )}
          
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* Ubuntu Cultural Elements */}
      <div className="fixed bottom-4 right-4 z-40">
        <div className="flex flex-col gap-2">
          {/* Ubuntu Philosophy Tooltip */}
          <div className="group relative">
            <button className="bg-ubuntu-orange hover:bg-ubuntu-orange-dark text-white p-3 rounded-full shadow-lg transition-all duration-300">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </button>
            <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
              <div className="bg-gray-900 text-white p-3 rounded-lg text-sm w-64 shadow-xl">
                <h4 className="font-bold text-ubuntu-orange mb-1">{t('ubuntu.philosophy.title')}</h4>
                <p className="text-xs">{t('ubuntu.philosophy.motto')}</p>
                <p className="text-xs mt-1 opacity-75">{t('ubuntu.philosophy.meaning')}</p>
              </div>
            </div>
          </div>

          {/* Cultural Wisdom Quote */}
          <div className="group relative">
            <button className="bg-ubuntu-red hover:bg-ubuntu-red-dark text-white p-3 rounded-full shadow-lg transition-all duration-300">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14,17H7L2,12L7,7H14V10H21V14H14V17Z" />
              </svg>
            </button>
            <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
              <div className="bg-ubuntu-red text-white p-3 rounded-lg text-sm w-72 shadow-xl">
                <h4 className="font-bold mb-1">{t('ubuntu.wisdom.title')}</h4>
                <p className="text-xs italic">"{t('ubuntu.wisdom.quote')}"</p>
                <p className="text-xs mt-1 opacity-75">- {t('ubuntu.wisdom.source')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ubuntu Pattern Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-5">
        <div className="w-full h-full bg-ubuntu-pattern bg-repeat"></div>
      </div>
    </>
  );
};
