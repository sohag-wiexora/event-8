
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface EventItem {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const features = [
  {
    number: '01',
    title: 'Create Events',
    description:
      'Bring people together by creating meaningful community events.',
  },
  {
    number: '02',
    title: 'Join Community',
    description:
      'Discover local activities and participate in positive change.',
  },
  {
    number: '03',
    title: 'Make an Impact',
    description:
      'Turn small contributions into meaningful community impact.',
  },
];

const gallery = [
  {
    image:
      'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800',
    title: 'Community Together',
  },
  {
    image:
      'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800',
    title: 'Helping Hands',
  },
  {
    image:
      'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800',
    title: 'Making a Difference',
  },
];

export default function HomePage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/events?limit=6`
        );

        const result = await response.json();

        if (response.ok && result.success) {
          setEvents(result.data || []);
        }
      } catch (error) {
        console.error('Failed to load events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (date: string) => {
    return new Date(
      `${date.slice(0, 10)}T00:00:00`
    ).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubscribed(true);
    setEmail('');
  };

  return (
    <main className="min-h-screen bg-white text-gray-900 transition-colors duration-200 dark:bg-[#0a0a0a] dark:text-gray-100">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=1600"
            alt="Community volunteers working together"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 sm:px-8 lg:grid-cols-2 lg:py-32">
          <div>
            <span className="inline-block rounded-full border border-white/30 px-4 py-2 text-sm font-medium text-blue-200">
              Together We Can Make a Difference
            </span>

            <h1 className="mt-7 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              Connect. Participate.
              <span className="block text-blue-400">
                Create Impact.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-gray-300 sm:text-lg">
              Discover meaningful community events, meet passionate
              people, and become part of something bigger.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/upcoming-events"
                className="rounded-lg bg-blue-600 px-7 py-3.5 font-semibold text-white transition hover:bg-blue-700"
              >
                Explore Events
              </Link>

              <Link
                href="/create-event"
                className="rounded-lg border border-white/50 px-7 py-3.5 font-semibold text-white transition hover:bg-white hover:text-slate-950"
              >
                Create an Event
              </Link>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
              <img
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1000"
                alt="Volunteers helping their community"
                className="h-[380px] w-full rounded-xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              Discover Opportunities
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Upcoming Events
            </h2>

            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Find events that inspire you to make a difference.
            </p>
          </div>

          <Link
            href="/upcoming-events"
            className="font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            View All Events →
          </Link>
        </div>

        {loading ? (
          <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="animate-pulse overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="h-52 bg-gray-200 dark:bg-gray-800" />

                <div className="space-y-3 p-5">
                  <div className="h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
                  <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-800" />
                  <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
                </div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="mt-10 rounded-xl bg-gray-50 py-16 text-center dark:bg-gray-900">
            <h3 className="text-xl font-semibold">
              No Upcoming Events
            </h3>

            <p className="mt-2 text-gray-500 dark:text-gray-400">
              New community events will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <article
                key={event._id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:shadow-black/30"
              >
                <div className="h-52 overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img
                    src={event.thumbnail}
                    alt={event.title}
                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                  />
                </div>

                <div className="p-5">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    {event.eventType}
                  </span>

                  <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
                    {event.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                    {event.description}
                  </p>

                  <div className="mt-5 space-y-2 text-sm text-gray-500 dark:text-gray-400">
                    <p>📅 {formatDate(event.eventDate)}</p>
                    <p>📍 {event.location}</p>
                  </div>

                  <Link
                    href={`/events/${event._id}`}
                    className="mt-5 inline-block font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    View Details →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="bg-gray-50 px-5 py-20 transition-colors duration-200 dark:bg-gray-900 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              Our Community
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Small Actions, Big Impact
            </h2>

            <p className="mt-4 leading-7 text-gray-600 dark:text-gray-400">
              A platform designed to make community participation
              easier, more meaningful, and accessible to everyone.
            </p>
          </div>

          <div className="mt-12 grid gap-7 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.number}
                className="rounded-xl border border-gray-200 bg-white p-8 transition-colors duration-200 dark:border-gray-800 dark:bg-gray-950"
              >
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  {feature.number}
                </span>

                <h3 className="mt-5 text-xl font-bold">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-7 text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Gallery */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="text-center">
          <p className="font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            Moments That Matter
          </p>

          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Our Community Gallery
          </h2>

          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Every action tells a story of kindness and connection.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {gallery.map((item) => (
            <div
              key={item.title}
              className="group relative h-72 overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-800"
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />

              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 to-transparent p-6">
                <h3 className="text-xl font-bold text-white">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-blue-700 px-5 py-16 text-white sm:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Stay Connected With Our Community
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-blue-100">
            Discover upcoming activities and find new opportunities
            to contribute to your community.
          </p>

          {subscribed ? (
            <div
              role="status"
              className="mx-auto mt-8 max-w-xl rounded-lg border border-white/30 bg-white/10 px-5 py-4 text-sm font-medium text-white"
            >
              Thank you for your interest in our community!
            </div>
          ) : (
            <form
              onSubmit={handleSubscribe}
              className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="min-w-0 flex-1 rounded-lg bg-white px-5 py-3.5 text-gray-900 outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-blue-300"
              />

              <button
                type="submit"
                className="rounded-lg bg-slate-950 px-7 py-3.5 font-semibold text-white transition hover:bg-slate-800"
              >
                Subscribe
              </button>
            </form>
          )}

          <p className="mt-4 text-xs text-blue-100">
            Newsletter subscription is currently a static demo.
          </p>
        </div>
      </section>

    </main>
  );
}
