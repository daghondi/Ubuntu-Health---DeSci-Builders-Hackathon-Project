import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export const UbuntuPhilosophyBanner: React.FC = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(true);
  const [currentQuote, setCurrentQuote] = useState(0);

  const ubuntuQuotes = [
    {
      text: t('ubuntu.quotes.quote1'),
      author: t('ubuntu.quotes.author1'),
      language: 'Zulu'
    },
    {
      text: t('ubuntu.quotes.quote2'),
      author: t('ubuntu.quotes.author2'),
      language: 'Xhosa'
    },
    {
      text: t('ubuntu.quotes.quote3'),
      author: t('ubuntu.quotes.author3'),
      language: 'English'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % ubuntuQuotes.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [ubuntuQuotes.length]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      className="bg-gradient-to-r from-ubuntu-orange via-ubuntu-red to-ubuntu-orange text-white relative overflow-hidden"
    >
      {/* Ubuntu Pattern Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-ubuntu-pattern bg-repeat"></div>
      </div>

      <div className="container mx-auto px-4 py-3 relative z-10">
        <div className="flex items-center justify-between">
          {/* Ubuntu Symbol and Philosophy */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <svg className="w-8 h-8 text-white" viewBox="0 0 100 100" fill="currentColor">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2"/>
                <circle cx="50" cy="20" r="8" fill="currentColor"/>
                <circle cx="25" cy="65" r="8" fill="currentColor"/>
                <circle cx="75" cy="65" r="8" fill="currentColor"/>
                <path d="M50 42 C45 42, 42 45, 42 50 C42 55, 45 58, 50 58 C55 58, 58 55, 58 50 C58 45, 55 42, 50 42Z" fill="currentColor"/>
              </svg>
              <div>
                <h2 className="font-bold text-lg">{t('ubuntu.banner.title')}</h2>
                <p className="text-sm opacity-90">{t('ubuntu.banner.subtitle')}</p>
              </div>
            </div>
          </div>

          {/* Rotating Ubuntu Quotes */}
          <div className="flex-1 mx-8 text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuote}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-1"
              >
                <p className="text-lg font-medium italic">
                  "{ubuntuQuotes[currentQuote].text}"
                </p>
                <p className="text-sm opacity-75">
                  — {ubuntuQuotes[currentQuote].author} ({ubuntuQuotes[currentQuote].language})
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Community Health Stats */}
          <div className="flex items-center space-x-6 text-sm">
            <div className="text-center">
              <div className="font-bold text-xl">247</div>
              <div className="opacity-75">{t('ubuntu.stats.patients')}</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-xl">89</div>
              <div className="opacity-75">{t('ubuntu.stats.communities')}</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-xl">156</div>
              <div className="opacity-75">{t('ubuntu.stats.healingJourneys')}</div>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={() => setIsVisible(false)}
            className="ml-4 p-2 hover:bg-white/20 rounded-full transition-colors"
            aria-label={t('ubuntu.banner.close')}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Animated Ubuntu Circles */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-24 h-24 border-2 border-white/20 rounded-full"
            style={{
              left: `${20 + i * 30}%`,
              top: '50%',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
              rotate: [0, 360],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};
