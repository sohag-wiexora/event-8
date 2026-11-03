
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

interface EventItem {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string;
  creatorName?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function UpcomingEventsPage() {
  const router = useRouter();

  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [joinedIds, setJoinedIds] = useState<string[]>([]);
  const [joiningId, setJoiningId] = useState('');
  const [message, setMessage] = useState('');

  const { data: session, isPending } = authClient.useSession();

  // Load upcoming events
  
  useEffect(() => {
    let cancelled = false;

    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_URL}/api/events`, {
          cache: 'no-store',
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || 'Failed to load events.');
        }

        const upcoming = (result.data || []).filter(
          (event: EventItem) =>
            new Date(`${event.eventDate.slice(0, 10)}T23:59:59`) >=
            new Date()
        );

        if (!cancelled) {
          setEvents(upcoming);
        }
      } catch (error) {
        console.error('Load Events Error:', error);

        if (!cancelled) {
          setMessage('Unable to load events. Please try again.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchEvents();

    return () => {
      cancelled = true;
    };
  }, []);

  // Load IDs of events already joined by the current user

  useEffect(() => {
    let cancelled = false;

    const fetchJoinedIds = async () => {
      try {
       
        // Wait until the session state has settled.

        await Promise.resolve();

        if (!session?.user) {
          if (!cancelled) {
            setJoinedIds([]);
          }
          return;
        }

        const { data, error } = await authClient.token();

        if (error || !data?.token) return;

        const response = await fetch(
          `${API_URL}/api/events/joined-events`,
          {
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
            cache: 'no-store',
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success || cancelled) return;

        setJoinedIds(
          (result.events || []).map((event: EventItem) => event._id)
        );
      } catch (error) {
        console.error('Load Joined IDs Error:', error);
      }
    };

    if (!isPending) {
      void fetchJoinedIds();
    }

    return () => {
      cancelled = true;
    };
  }, [isPending, session?.user]);

  // Join event

  const handleJoin = async (eventId: string) => {
    setMessage('');

    if (!session?.user) {
      router.push('/login');
      return;
    }

    try {
      setJoiningId(eventId);

      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        router.push('/login');
        return;
      }

      const response = await fetch(
        `${API_URL}/api/events/${eventId}/join`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setJoinedIds((previous) =>
            previous.includes(eventId)
              ? previous
              : [...previous, eventId]
          );
        }

        throw new Error(result.message || 'Unable to join event.');
      }

      setJoinedIds((previous) =>
        previous.includes(eventId)
          ? previous
          : [...previous, eventId]
      );

      setMessage(result.message || 'Successfully joined the event!');
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Something went wrong.'
      );
    } finally {
      setJoiningId('');
    }
  };

  // Search and category filters

  const categories = [
    'All',
    ...Array.from(new Set(events.map((event) => event.eventType))),
  ];

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.location.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === 'All' || event.eventType === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-blue-600">
            Discover & Participate
          </p>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-5xl">
            Upcoming Events
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600 dark:text-gray-400">
            Discover meaningful community events, connect with people,
            and make a positive difference together.
          </p>
        </div>

        {/* Search and Filter */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events or locations..."
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item === 'All' ? 'All Categories' : item}
              </option>
            ))}
          </select>
        </div>

        {/* Feedback */}

        {message && (
          <div
            role="status"
            className="mb-6 rounded-xl bg-blue-50 p-4 text-sm text-blue-700 dark:bg-blue-950/30 dark:text-blue-300"
          >
            {message}
          </div>
        )}

        {/* Loading Skeleton */}

        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="animate-pulse overflow-hidden rounded-2xl bg-white dark:bg-gray-900"
              >
                <div className="h-52 bg-gray-200 dark:bg-gray-800" />

                <div className="space-y-4 p-5">
                  <div className="h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
                  <div className="h-4 rounded bg-gray-200 dark:bg-gray-800" />
                  <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}

        {!loading && filteredEvents.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center dark:border-gray-700 dark:bg-gray-900">
            <div className="mb-4 text-5xl">📅</div>

            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              No Events Found
            </h2>

            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Try another search or check back later for new events.
            </p>

            <button
              onClick={() => {
                setSearch('');
                setCategory('All');
              }}
              className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Events Grid */}

        {!loading && filteredEvents.length > 0 && (
          <>
            <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
              Showing {filteredEvents.length} upcoming events
            </p>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => {
                const alreadyJoined = joinedIds.includes(event._id);

                return (
                  <article
                    key={event._id}
                    className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
                  >
                    {/* Image */}

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

                    {/* Content */}

                    <div className="p-5">
                      <h2 className="line-clamp-2 text-xl font-bold text-gray-900 dark:text-white">
                        {event.title}
                      </h2>

                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                        {event.description}
                      </p>

                      <div className="mt-5 space-y-3 text-sm text-gray-600 dark:text-gray-400">
                        <p>📅 {event.eventDate.slice(0, 10)}</p>
                        <p className="line-clamp-1">📍 {event.location}</p>
                        <p>👤 {event.creatorName || 'Community Member'}</p>
                      </div>

                      {/* Actions */}

                      <div className="mt-6 flex gap-3">
                        <Link
                          href={`/events/${event._id}`}
                          className="flex-1 rounded-lg border border-gray-300 px-3 py-3 text-center text-sm font-semibold text-gray-800 transition hover:bg-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
                        >
                          View Details
                        </Link>

                        <button
                          onClick={() => handleJoin(event._id)}
                          disabled={
                            alreadyJoined || joiningId === event._id
                          }
                          className={`flex-1 rounded-lg px-3 py-3 text-sm font-semibold text-white transition ${
                            alreadyJoined
                              ? 'cursor-not-allowed bg-green-600'
                              : 'bg-blue-600 hover:bg-blue-700 disabled:opacity-50'
                          }`}
                        >
                          {alreadyJoined
                            ? '✓ Joined'
                            : joiningId === event._id
                              ? 'Joining...'
                              : 'Join Event'}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
