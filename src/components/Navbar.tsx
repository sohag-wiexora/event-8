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
  const [profileOpen, setProfileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const avatarFallback = user?.name?.charAt(0)?.toUpperCase() || 'U';

  const closeMenus = () => {
    setMenuOpen(false);
    setProfileOpen(false);
  };

  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      await authClient.signOut();
      closeMenus();
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
          onClick={closeMenus}
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

          {user && (
            <>
              <Link href="/create-event" className={linkClass('/create-event')}>
                Create Event
              </Link>

              <Link href="/manage-events" className={linkClass('/manage-events')}>
                Manage Events
              </Link>
            </>
          )}
        </div>

        {/* Desktop Right Side */}
        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />

          {isPending ? (
            <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
          ) : user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                aria-label="Open profile menu"
                aria-expanded={profileOpen}
                className="flex items-center gap-2 rounded-full p-1 transition hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {/* Profile Image */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-blue-100 text-sm font-bold text-blue-700 dark:border-gray-700 dark:bg-blue-950 dark:text-blue-300">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || 'User profile'}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    avatarFallback
                  )}
                </div>

                <span className="max-w-28 truncate text-sm font-semibold text-gray-700 dark:text-gray-200">
                  {user.name}
                </span>

                <span className="text-xs text-gray-500">
                  {profileOpen ? '▲' : '▼'}
                </span>
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">
                  <div className="border-b border-gray-200 p-4 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-blue-100 text-sm font-bold text-blue-700 dark:border-gray-700 dark:bg-blue-950 dark:text-blue-300">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name || 'User profile'}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          avatarFallback
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                          {user.name}
                        </p>
                        <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 p-2">
                    <Link
                      href="/joined-events"
                      onClick={closeMenus}
                      className={linkClass('/joined-events')}
                    >
                      Joined Events
                    </Link>

                    <Link
                      href="/create-event"
                      onClick={closeMenus}
                      className={linkClass('/create-event')}
                    >
                      Create Event
                    </Link>

                    <Link
                      href="/manage-events"
                      onClick={closeMenus}
                      className={linkClass('/manage-events')}
                    >
                      Manage Events
                    </Link>

                    <button
                      type="button"
                      onClick={handleSignOut}
                      disabled={signingOut}
                      className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-950"
                    >
                      {signingOut ? 'Signing out...' : 'Logout'}
                    </button>
                  </div>
                </div>
              )}
            </div>
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
          <ThemeToggle />

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
                onClick={closeMenus}
                className={linkClass(link.href)}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <>
                {/* Mobile Profile */}
                <div className="my-3 flex items-center gap-3 border-y border-gray-200 py-4 dark:border-gray-800">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-blue-100 text-sm font-bold text-blue-700 dark:border-gray-700 dark:bg-blue-950 dark:text-blue-300">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name || 'User profile'}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      avatarFallback
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </div>

                <Link
                  href="/joined-events"
                  onClick={closeMenus}
                  className={linkClass('/joined-events')}
                >
                  Joined Events
                </Link>

                <Link
                  href="/create-event"
                  onClick={closeMenus}
                  className={linkClass('/create-event')}
                >
                  Create Event
                </Link>

                <Link
                  href="/manage-events"
                  onClick={closeMenus}
                  className={linkClass('/manage-events')}
                >
                  Manage Events
                </Link>

                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                >
                  {signingOut ? 'Signing out...' : 'Logout'}
                </button>
              </>
            ) : (
              <div className="flex gap-3 border-t border-gray-200 pt-3 dark:border-gray-800">
                <Link
                  href="/login"
                  onClick={closeMenus}
                  className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-center text-sm font-semibold text-gray-700 dark:border-gray-700 dark:text-gray-300"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={closeMenus}
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