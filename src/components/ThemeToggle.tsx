
'use client';

import { useTheme } from 'next-themes';

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      suppressHydrationWarning
      className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-xl transition-colors hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
}
