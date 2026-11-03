
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { authClient } from '@/lib/auth-client';

interface EventItem {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string;
  creatorId?: string;
  creatorName?: string;
  creatorEmail?: string;
  createdAt?: string;
}

function EventDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const { data: session, isPending } = authClient.useSession();

  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!eventId) return;

    let cancelled = false;

    const fetchEvent = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/events/${eventId}`
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || 'Event not found.');
        }

        if (!cancelled) {
          setEvent(result.event || result.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Failed to load event.'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchEvent();

    return () => {
      cancelled = true;
    };
  }, [eventId, API_URL]);

  // Check korbe logged-in user already joined

  useEffect(() => {
    if (isPending || !session?.user || !eventId) return;

    let cancelled = false;

    const checkJoined = async () => {
      try {
        const { data, error } = await authClient.token();

        if (error || !data?.token) return;

        const response = await fetch(
          `${API_URL}/api/events/joined-events`,
          {
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success || cancelled) return;

        const joined = (result.events || []).some(
          (item: EventItem) => item._id === eventId
        );

        if (!cancelled) {
          setIsJoined(joined);
        }
      } catch (err) {
        console.error('Join status check failed:', err);
      }
    };

    checkJoined();

    return () => {
      cancelled = true;
    };
  }, [session?.user, isPending, eventId, API_URL]);

  // event Join 

  const handleJoin = async () => {
    if (!session?.user) {
      router.push('/login');
      return;
    }

    try {
      setJoining(true);
      setMessage('');
      setError('');

      const { data, error: tokenError } = await authClient.token();

      if (tokenError || !data?.token) {
        throw new Error(
          'Authentication token not found. Please login again.'
        );
      }

      const response = await fetch(
        `${API_URL}/api/events/${eventId}/join`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${data.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const result = await response.json();

      if (response.status === 409) {
        setIsJoined(true);
        setMessage('You have already joined this event.');
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || 'Unable to join this event.'
        );
      }

      setIsJoined(true);
      setMessage('Successfully joined this event!');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong.'
      );
    } finally {
      setJoining(false);
    }
  };

  // Loading section

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-12 dark:bg-gray-950">
        <div className="mx-auto max-w-5xl animate-pulse space-y-6">
          <div className="h-80 rounded-2xl bg-gray-200 dark:bg-gray-800" />
          <div className="h-8 w-2/3 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
        </div>
      </main>
    );
  }

  // Event not found section

  if (error && !event) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Event Not Found
        </h2>

        <p className="mt-3 text-gray-600 dark:text-gray-400">
          {error}
        </p>

        <Link
          href="/upcoming-events"
          className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Back to Events
        </Link>
      </main>
    );
  }

  if (!event) return null;

  const formattedDate = new Date(
    `${event.eventDate.slice(0, 10)}T00:00:00`
  ).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const isPastEvent =
    new Date(`${event.eventDate.slice(0, 10)}T23:59:59`) <
    new Date();

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:py-14 dark:bg-gray-950">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/upcoming-events"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          ← Back to Upcoming Events
        </Link>

        <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          
          {/* Event Image */}

          <div className="relative h-64 w-full bg-gray-200 dark:bg-gray-800 sm:h-96">
            <Image
              src={event.thumbnail}
              alt={event.title}
              fill
              unoptimized
              sizes="(max-width: 640px) 100vw, 1024px"
              className="object-cover"
            />

            <span className="absolute left-5 top-5 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow">
              {event.eventType}
            </span>
          </div>

          <div className="p-5 sm:p-8 lg:p-10">
            
            {/* Event Title */}

            <div className="border-b border-gray-200 pb-6 dark:border-gray-700">
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Event Details
              </p>

              <h1 className="mt-3 text-3xl font-bold leading-tight text-gray-900 dark:text-white sm:text-4xl">
                {event.title}
              </h1>

              <p className="mt-4 leading-7 text-gray-600 dark:text-gray-300">
                {event.description}
              </p>
            </div>

            {/* Event Information */}

            <div className="grid gap-5 border-b border-gray-200 py-7 dark:border-gray-700 sm:grid-cols-2">
              <div className="rounded-xl bg-gray-50 p-5 dark:bg-gray-800">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Event Date
                </p>
                <p className="mt-2 font-semibold text-gray-900 dark:text-white">
                  {formattedDate}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-5 dark:bg-gray-800">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Location
                </p>
                <p className="mt-2 font-semibold text-gray-900 dark:text-white">
                  {event.location}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-5 dark:bg-gray-800">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Event Category
                </p>
                <p className="mt-2 font-semibold text-gray-900 dark:text-white">
                  {event.eventType}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-5 dark:bg-gray-800">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Organizer
                </p>

                <p className="mt-2 font-semibold text-gray-900 dark:text-white">
                  {event.creatorName || 'Community Organizer'}
                </p>

                {event.creatorEmail && (
                  <p className="mt-1 break-all text-sm text-gray-500 dark:text-gray-400">
                    {event.creatorEmail}
                  </p>
                )}
              </div>
            </div>

            {/* Joined Event */}

            <div className="pt-7">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Participate in This Event
              </h2>

              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Join this event and become part of the community.
              </p>

              {message && (
                <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm font-medium text-green-700 dark:bg-green-950 dark:text-green-300">
                  {message}
                </p>
              )}

              {error && event && (
                <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700 dark:bg-red-950 dark:text-red-300">
                  {error}
                </p>
              )}

              <button
                onClick={handleJoin}
                disabled={
                  joining ||
                  (Boolean(session?.user) && isJoined) ||
                  isPastEvent
                }
                className="mt-5 w-full rounded-lg bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400 sm:w-auto"
              >
                {isPastEvent
                  ? 'Event Ended'
                  : joining
                    ? 'Joining...'
                    : session?.user && isJoined
                      ? 'Already Joined ✓'
                      : 'Join Event'}
              </button>

              {!isPending && !session?.user && !isPastEvent && (
                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                  Please login to join this event.
                </p>
              )}
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}

export default function EventDetailsPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
          <p className="text-gray-600 dark:text-gray-300">
            Loading event details...
          </p>
        </main>
      }
    >
      <EventDetailsContent />
    </Suspense>
  );
}
