'use client';

/**
 * Theme Provider - Dark/Light Mode Support
 * Wraps the app with ThemeProvider from next-themes
 */

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
