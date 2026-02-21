/**
 * Tailwind CSS Configuration - Consolidated Design System
 * Single source of truth for all colors (light + dark mode)
 */

const typographyTokens = require('./src/design-system/tokens/typography.tokens.cjs');

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // ==================== PRIMARY COLORS ====================
        // Main brand color - Lydian Blue/Indigo
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#667EEA', // Main primary
          600: '#5568D3', // Lydian brand
          700: '#4C51BF',
          800: '#434190',
          900: '#3730A3',
          950: '#1E1B4B',
        },

        // ==================== SEMANTIC COLORS ====================
        // Success green
        success: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },

        // Warning yellow
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },

        // Error red
        error: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },

        // ==================== NEUTRAL GRAYS ====================
        // For text, borders, backgrounds
        neutral: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
          950: '#030712',
        },

        // ==================== DARK MODE COLORS ====================
        dark: {
          bg: '#0F172A',        // Main background
          bgRaised: '#1E293B',  // Elevated surfaces
          bgLower: '#020617',   // Lower surfaces
          text: '#F1F5F9',      // Primary text
          textSecondary: '#94A3B8', // Secondary text
          border: '#334155',    // Borders
        },

        // ==================== LIGHT MODE COLORS ====================
        light: {
          bg: '#FFFFFF',        // Main background
          bgRaised: '#F9FAFB',  // Elevated surfaces
          bgLower: '#F3F4F6',   // Lower surfaces
          text: '#111827',      // Primary text
          textSecondary: '#6B7280', // Secondary text
          border: '#E5E7EB',    // Borders
        },
      },

      // Typography tokens
      fontFamily: typographyTokens.fontFamily,
      fontSize: typographyTokens.fontSize,
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
