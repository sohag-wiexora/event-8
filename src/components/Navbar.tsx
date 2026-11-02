'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import ThemeToggle from '@/components/ThemeToggle';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Upcoming Events', href: '/upcoming-events' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      await authClient.signOut();
      setMenuOpen(false);
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Sign out failed:', error);
    } finally {
      setSigningOut(false);
    }
  };

  const linkClass = (href: string) =>
    `block rounded-lg px-3 py-2 text-sm font-medium transition ${
      pathname === href
        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
        : 'text-gray-700 hover:bg-gray-100 hover:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-blue-300'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">

        {/* Logo */}
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white"
        >
          Event<span className="text-blue-600">Hub</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-2 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={linkClass(link.href)}
            >
              {link.label}
            </Link>
          ))}

          {session?.user && (
            <>
              <Link href="/create-event" className={linkClass('/create-event')}>
                Create Event
              </Link>

              <Link href="/manage-events" className={linkClass('/manage-events')}>
                Manage Events
              </Link>

              <Link href="/joined-events" className={linkClass('/joined-events')}>
                Joined Events
              </Link>
            </>
          )}
        </div>

        {/* Desktop Right Side */}
        <div className="hidden items-center gap-3 lg:flex">

          {/* Theme Toggle */}
          <ThemeToggle />

          {isPending ? (
            <div className="h-9 w-20 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
          ) : session?.user ? (
            <>
              <span className="max-w-32 truncate text-sm font-medium text-gray-600 dark:text-gray-300">
                {session.user.name}
              </span>

              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                {signingOut ? 'Signing out...' : 'Logout'}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Right Side */}
        <div className="flex items-center gap-3 lg:hidden">

          {/* Mobile Theme Toggle */}
          <ThemeToggle />

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="rounded-lg border border-gray-200 px-3 py-2 text-xl text-gray-800 dark:border-gray-700 dark:text-white"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-t border-gray-200 bg-white px-5 py-4 dark:border-gray-800 dark:bg-gray-950 lg:hidden">
          <div className="mx-auto max-w-7xl space-y-2">

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={linkClass(link.href)}
              >
                {link.label}
              </Link>
            ))}

            {session?.user ? (
              <>
                <Link
                  href="/create-event"
                  onClick={() => setMenuOpen(false)}
                  className={linkClass('/create-event')}
                >
                  Create Event
                </Link>

                <Link
                  href="/manage-events"
                  onClick={() => setMenuOpen(false)}
                  className={linkClass('/manage-events')}
                >
                  Manage Events
                </Link>

                <Link
                  href="/joined-events"
                  onClick={() => setMenuOpen(false)}
                  className={linkClass('/joined-events')}
                >
                  Joined Events
                </Link>

                <div className="border-t border-gray-200 pt-3 dark:border-gray-800">
                  <p className="mb-3 truncate text-sm text-gray-500 dark:text-gray-400">
                    {session.user.name}
                  </p>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50 dark:bg-blue-600"
                  >
                    {signingOut ? 'Signing out...' : 'Logout'}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex gap-3 border-t border-gray-200 pt-3 dark:border-gray-800">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-center text-sm font-semibold text-gray-700 dark:border-gray-700 dark:text-gray-300"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
