
'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { authClient } from '@/lib/auth-client';
import ProtectedRoute from '@/components/ProtectedRoute';

interface EventItem {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string;
  creatorId: string;
}

const initialForm = {
  title: '',
  description: '',
  eventType: '',
  thumbnail: '',
  location: '',
  eventDate: '',
};

function ManageEventsContent() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState(initialForm);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const apiURL = process.env.NEXT_PUBLIC_API_URL;

  const getToken = useCallback(async () => {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
      throw new Error('Authentication failed. Please login again.');
    }

    return data.token;
  }, []);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const token = await getToken();

      const response = await fetch(`${apiURL}/api/events/my-events`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to load events.');
      }

      setEvents(result.data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Something went wrong.'
      );
    } finally {
      setLoading(false);
    }
  }, [apiURL, getToken]);

  useEffect(() => {
    let cancelled = false;

    const fetchEvents = async () => {
      setError('');

      try {
        const token = await getToken();

        const response = await fetch(
          `${apiURL}/api/events/my-events`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Failed to load events.');
        }

        if (!cancelled) {
          setEvents(result.data || []);
        }
      } catch (err) {
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

    void fetchEvents();

    return () => {
      cancelled = true;
    };
  }, [apiURL, getToken]);

  const handleEdit = (event: EventItem) => {
    setEditingId(event._id);

    setFormData({
      title: event.title,
      description: event.description,
      eventType: event.eventType,
      thumbnail: event.thumbnail,
      location: event.location,
      eventDate: event.eventDate,
    });

    setMessage('');
    setError('');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSaving(true);
    setMessage('');
    setError('');

    try {
      const token = await getToken();

      const response = await fetch(
        `${apiURL}/api/events/${editingId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update event.');
      }

      setMessage('Event updated successfully!');
      setEditingId(null);
      setFormData(initialForm);

      await loadEvents();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to update event.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setSaving(true);
    setMessage('');
    setError('');

    try {
      const token = await getToken();

      const response = await fetch(
        `${apiURL}/api/events/${deleteId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete event.');
      }

      setMessage('Event deleted successfully!');
      setDeleteId(null);

      if (editingId === deleteId) {
        setEditingId(null);
        setFormData(initialForm);
      }

      await loadEvents();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to delete event.'
      );
      setDeleteId(null);
    } finally {
      setSaving(false);
    }
  };

  const inputClasses =
    'w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500';

  const labelClasses =
    'mb-2 block text-sm font-medium text-gray-800 dark:text-gray-200';

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 text-gray-900 transition-colors duration-200 dark:bg-[#0a0a0a] dark:text-gray-100">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            Event Dashboard
          </p>

          <h1 className="text-3xl font-bold md:text-4xl">
            Manage My Events
          </h1>

          <p className="mt-3 text-gray-600 dark:text-gray-400">
            View, update and manage the events you have created.
          </p>
        </div>

        {message && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}

        {editingId && (
          <section className="mb-10 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#171717]">
            <h2 className="mb-6 text-xl font-bold">Edit Event</h2>

            <form onSubmit={handleUpdate} className="space-y-5">
              <div>
                <label className={labelClasses}>Event Title</label>
                <input
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className={inputClasses}
                />
              </div>

              <div>
                <label className={labelClasses}>Description</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  className={inputClasses}
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className={labelClasses}>Event Type</label>
                  <input
                    required
                    value={formData.eventType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        eventType: e.target.value,
                      })
                    }
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className={labelClasses}>Location</label>
                  <input
                    required
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: e.target.value,
                      })
                    }
                    className={inputClasses}
                  />
                </div>
              </div>

              <div>
                <label className={labelClasses}>Thumbnail URL</label>
                <input
                  required
                  type="url"
                  value={formData.thumbnail}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      thumbnail: e.target.value,
                    })
                  }
                  className={inputClasses}
                />
              </div>

              <div>
                <label className={labelClasses}>Event Date</label>
                <input
                  required
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.eventDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      eventDate: e.target.value,
                    })
                  }
                  className={inputClasses}
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  disabled={saving}
                  type="submit"
                  className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData(initialForm);
                    setError('');
                  }}
                  className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-800 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">Your Events</h2>
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            {events.length} Events
          </span>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-[#171717]"
              >
                <div className="h-48 bg-gray-200 dark:bg-gray-800" />
                <div className="space-y-3 p-5">
                  <div className="h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
                  <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
                  <div className="h-10 rounded bg-gray-200 dark:bg-gray-800" />
                </div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-[#171717]">
            <h3 className="text-xl font-semibold">No Events Found</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              You have not created any events yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <article
                key={event._id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-[#171717]"
              >
                <img
                  src={event.thumbnail}
                  alt={event.title}
                  className="h-48 w-full object-cover"
                />

                <div className="p-5">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    {event.eventType}
                  </span>

                  <h3 className="mt-4 text-lg font-bold">
                    {event.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                    {event.description}
                  </p>

                  <div className="mt-4 space-y-2 text-sm text-gray-500 dark:text-gray-400">
                    <p>📍 {event.location}</p>
                    <p>📅 {event.eventDate}</p>
                  </div>

                  <div className="mt-5 flex gap-3">
                    <button
                      onClick={() => handleEdit(event)}
                      disabled={saving}
                      className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => setDeleteId(event._id)}
                      disabled={saving}
                      className="flex-1 rounded-lg bg-red-50 px-4 py-2.5 font-medium text-red-600 hover:bg-red-100 disabled:opacity-50 dark:bg-red-950/50 dark:text-red-300 dark:hover:bg-red-950"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-[#171717]">
              <h2 className="text-xl font-bold">Delete Event?</h2>

              <p className="mt-3 text-gray-600 dark:text-gray-400">
                Are you sure you want to delete this event? This action
                cannot be undone.
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  disabled={saving}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDelete}
                  disabled={saving}
                  className="rounded-lg bg-red-600 px-5 py-2.5 font-medium text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {saving ? 'Deleting...' : 'Yes, Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function ManageEventsPage() {
  return (
    <ProtectedRoute>
      <ManageEventsContent />
    </ProtectedRoute>
  );
}
