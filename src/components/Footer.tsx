
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-3">
        <div>
          <Link href="/" className="text-2xl font-extrabold">
            Event<span className="text-blue-400">Hub</span>
          </Link>

          <p className="mt-4 max-w-sm text-sm leading-7 text-gray-400">
            Connecting people through meaningful community events.
            Together, we can create positive change.
          </p>
        </div>

        <div>
          <h3 className="font-bold">Quick Links</h3>
          <ul className="mt-4 space-y-3 text-sm text-gray-400">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/upcoming-events">Upcoming Events</Link></li>
            <li><Link href="/create-event">Create Event</Link></li>
            <li><Link href="/joined-events">Joined Events</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold">Be Part of the Community</h3>
          <p className="mt-4 text-sm leading-7 text-gray-400">
            Discover opportunities, meet people, and contribute to
            meaningful community activities.
          </p>

          <Link
            href="/upcoming-events"
            className="mt-5 inline-block rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold hover:bg-blue-700"
          >
            Explore Events →
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 text-center text-sm text-gray-400 sm:px-8 md:flex-row md:justify-between">
         <p>© 2026 EventHub. All rights reserved.</p>
          <p>Made for stronger communities.</p>
        </div>
      </div>
    </footer>
  );
}
