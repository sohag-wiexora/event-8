
'use client';

import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { authClient } from '@/lib/auth-client';

interface EventFormData {
  title: string;
  description: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string;
}

const initialFormData: EventFormData = {
  title: '',
  description: '',
  eventType: '',
  thumbnail: '',
  location: '',
  eventDate: '',
};

export default function CreateEventPage() {
  const [formData, setFormData] =
    useState<EventFormData>(initialFormData);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage('');
    setError('');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMessage('');
    setError('');

    const cleanedData = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      thumbnail: formData.thumbnail.trim(),
      location: formData.location.trim(),
    };

    if (
      !cleanedData.title ||
      !cleanedData.description ||
      !cleanedData.eventType ||
      !cleanedData.thumbnail ||
      !cleanedData.location ||
      !cleanedData.eventDate
    ) {
      setError('Please fill in all required fields.');
      return;
    }

    // Validate event date using the browser's local date.
    const today = new Date();
    const selectedDate = new Date(
      `${cleanedData.eventDate}T00:00:00`
    );

    today.setHours(0, 0, 0, 0);

    if (
      Number.isNaN(selectedDate.getTime()) ||
      selectedDate < today
    ) {
      setError('Please select today or a future date.');
      return;
    }

    try {
      const imageUrl = new URL(cleanedData.thumbnail);

      if (!['http:', 'https:'].includes(imageUrl.protocol)) {
        throw new Error('Invalid image URL');
      }
    } catch {
      setError('Please enter a valid image URL.');
      return;
    }

    try {
      setSubmitting(true);

      const { data: tokenData, error: tokenError } =
        await authClient.token();

      if (tokenError || !tokenData?.token) {
        setError('Authentication failed. Please login again.');
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenData.token}`,
          },
          body: JSON.stringify(cleanedData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create event.');
      }

      setMessage('Event created successfully!');
      setFormData(initialFormData);

      console.log('Created Event:', result.data);
    } catch (error) {
      console.error('Create Event Error:', error);

      setError(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputClasses =
    'w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-blue-400';

  const labelClasses =
    'mb-2 block font-medium text-gray-800 dark:text-gray-200';

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-100 px-4 py-12 transition-colors duration-200 dark:bg-[#0a0a0a]">
        <div className="mx-auto max-w-2xl rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-colors duration-200 sm:p-8 dark:border-gray-800 dark:bg-[#171717]">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
            Create New Event
          </h1>

          <p className="mb-8 text-gray-500 dark:text-gray-400">
            Share an event and bring your community together.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="title" className={labelClasses}>
                Event Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter event title"
                required
                maxLength={100}
                className={inputClasses}
              />
            </div>

            <div>
              <label htmlFor="description" className={labelClasses}>
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your event..."
                required
                rows={5}
                maxLength={2000}
                className={inputClasses}
              />
            </div>

            <div>
              <label htmlFor="eventType" className={labelClasses}>
                Event Category
              </label>
              <select
                id="eventType"
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                required
                className={inputClasses}
              >
                <option value="">Select category</option>
                <option value="Donation">Donation</option>
                <option value="Plantation">Plantation</option>
                <option value="Cleanup">Cleanup</option>
                <option value="Blood Donation">Blood Donation</option>
                <option value="Education">Education</option>
                <option value="Community">Community</option>
              </select>
            </div>

            <div>
              <label htmlFor="thumbnail" className={labelClasses}>
                Event Image URL
              </label>
              <input
                id="thumbnail"
                type="url"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                required
                className={inputClasses}
              />
            </div>

            <div>
              <label htmlFor="location" className={labelClasses}>
                Event Location
              </label>
              <input
                id="location"
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter event location"
                required
                className={inputClasses}
              />
            </div>

            <div>
              <label htmlFor="eventDate" className={labelClasses}>
                Event Date
              </label>
              <input
                id="eventDate"
                type="date"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                required
                className={inputClasses}
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Past dates are not allowed.
              </p>
            </div>

            {message && (
              <p className="rounded-lg bg-green-100 p-3 text-sm text-green-700 dark:bg-green-950/50 dark:text-green-300">
                {message}
              </p>
            )}

            {error && (
              <p className="rounded-lg bg-red-100 p-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-black p-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              {submitting ? 'Creating Event...' : 'Create Event'}
            </button>
          </form>
        </div>
      </main>
    </ProtectedRoute>
  );
}
