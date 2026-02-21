'use client';

/**
 * Animated Dark/Light Mode Toggle Button
 * Smooth transition between themes with visual feedback
 */

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="fixed top-20 right-4 z-50 w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
    );
  }

  const isDark = theme === 'dark';

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="fixed top-20 right-4 z-50 p-3 rounded-full shadow-lg transition-colors duration-300
        bg-gray-200 dark:bg-gray-800
        hover:bg-gray-300 dark:hover:bg-gray-700
        border-2 border-gray-300 dark:border-gray-600"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isDark ? 'dark' : 'light'}
          initial={{ y: -20, opacity: 0, rotate: -180 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 20, opacity: 0, rotate: 180 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="relative"
        >
          {isDark ? (
            <Moon className="w-6 h-6 text-gray-800" strokeWidth={2} />
          ) : (
            <Sun className="w-6 h-6 text-yellow-600" strokeWidth={2} />
          )}
        </motion.div>
      </AnimatePresence>

      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          boxShadow: isDark
            ? '0 0 20px rgba(255, 255, 255, 0.3)'
            : '0 0 20px rgba(251, 191, 36, 0.3)',
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
}

export default ThemeToggle;
