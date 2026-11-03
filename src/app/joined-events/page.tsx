
'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import ProtectedRoute from '@/components/ProtectedRoute';

interface JoinedEvent {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string;
  creatorName: string;
  joinedAt: string;
}

function JoinedEventsContent() {
  const [events, setEvents] = useState<JoinedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadJoinedEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const { data, error: tokenError } = await authClient.token();

      if (tokenError || !data?.token) {
        throw new Error('Authentication token not found.');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events/joined-events`,
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
          cache: 'no-store',
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || 'Failed to load joined events.'
        );
      }

      setEvents(result.events || []);
    } catch (err) {
      console.error('Joined Events Error:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Load joined events without calling a state-updating callback directly
  // inside the effect body.
  
  useEffect(() => {
    let cancelled = false;

    const fetchJoinedEvents = async () => {
      try {
        const { data, error: tokenError } = await authClient.token();

        if (tokenError || !data?.token) {
          throw new Error('Authentication token not found.');
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/events/joined-events`,
          {
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
            cache: 'no-store',
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || 'Failed to load joined events.'
          );
        }

        if (!cancelled) {
          setEvents(result.events || []);
        }
      } catch (err) {
        console.error('Joined Events Error:', err);

        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Something went wrong.'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchJoinedEvents();

    return () => {
      cancelled = true;
    };
  }, []);

  const formatDate = (date: string) => {
    if (!date) return 'Date unavailable';

    return new Date(`${date.slice(0, 10)}T12:00:00`).toLocaleDateString(
      'en-US',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }
    );
  };

  const formatJoinedDate = (date: string) => {
    if (!date) return 'Recently joined';

    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl">
        
        {/* Page Header */}

        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            Your Activities
          </p>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Joined Events
          </h1>

          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Explore the events you have joined and stay connected
            with your community.
          </p>
        </div>

        {/* Event Count */}

        {!loading && !error && (
          <div className="mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              You have joined{' '}
              <span className="font-bold text-gray-900 dark:text-white">
                {events.length}
              </span>{' '}
              {events.length === 1 ? 'event' : 'events'}.
            </p>
          </div>
        )}

        {/* Loading Skeleton */}

        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse overflow-hidden rounded-2xl bg-white shadow dark:bg-gray-900"
              >
                <div className="h-52 bg-gray-200 dark:bg-gray-800" />

                <div className="space-y-4 p-5">
                  <div className="h-5 w-2/3 rounded bg-gray-200 dark:bg-gray-800" />
                  <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-800" />
                  <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900 dark:bg-red-950/30">
            <p className="font-medium text-red-600 dark:text-red-400">
              {error}
            </p>

            <button
              onClick={loadJoinedEvents}
              className="mt-5 rounded-lg bg-red-600 px-5 py-2.5 text-white transition hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}

        {!loading && !error && events.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center dark:border-gray-700 dark:bg-gray-900">
            <div className="mb-4 text-5xl">📅</div>

            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              No Joined Events Yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-gray-600 dark:text-gray-400">
              You haven&apos;t joined any events yet. Explore upcoming
              events and find something interesting to participate in.
            </p>

            <Link
              href="/upcoming-events"
              className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              Explore Events
            </Link>
          </div>
        )}

        {/* Joined Events Grid */}

        {!loading && !error && events.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <article
                key={event._id}
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
              >
                {/* Event Image */}

                <div className="relative h-52 overflow-hidden bg-gray-200 dark:bg-gray-800">
                  {event.thumbnail ? (
                    <Image
                      src={event.thumbnail}
                      alt={event.title}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      No Image Available
                    </div>
                  )}

                  <span className="absolute left-4 top-4 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                    {event.eventType}
                  </span>
                </div>

                {/* Event Information */}

                <div className="p-5">
                  <h2 className="line-clamp-2 text-xl font-bold text-gray-900 dark:text-white">
                    {event.title}
                  </h2>

                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                    {event.description}
                  </p>

                  <div className="mt-5 space-y-3 border-t border-gray-100 pt-4 text-sm dark:border-gray-800">
                    <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <span>📅</span>
                      {formatDate(event.eventDate)}
                    </p>

                    <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <span>📍</span>
                      <span className="line-clamp-1">
                        {event.location}
                      </span>
                    </p>

                    <p className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <span>👤</span>
                      Organized by{' '}
                      {event.creatorName || 'Community Member'}
                    </p>
                  </div>

                  {/* Joined Information */}

                  <div className="mt-5 flex items-center justify-between rounded-lg bg-green-50 px-4 py-3 dark:bg-green-950/30">
                    <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                      ✓ Joined
                    </span>

                    <span className="text-xs text-green-700 dark:text-green-400">
                      {formatJoinedDate(event.joinedAt)}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default function JoinedEventsPage() {
  return (
    <ProtectedRoute>
      <JoinedEventsContent />
    </ProtectedRoute>
  );
}
