'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const passwordRules = {
    minLength: password.length >= 6,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const isStrongPassword = Object.values(passwordRules).every(Boolean);

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');

    if (!passwordRules.minLength) {
      setMessage('Password must be at least 6 characters.');
      return;
    }

    if (!passwordRules.uppercase) {
      setMessage('Password must contain an uppercase letter (A-Z).');
      return;
    }

    if (!passwordRules.lowercase) {
      setMessage('Password must contain a lowercase letter (a-z).');
      return;
    }

    if (!passwordRules.number) {
      setMessage('Password must contain a number (0-9).');
      return;
    }

    if (!passwordRules.special) {
      setMessage(
        'Password must contain a special character (e.g. $, @, #, !).',
      );
      return;
    }

    try {
      setLoading(true);

      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        image: photoURL,
      });

      if (error) {
        setMessage(error.message || 'Registration failed.');
        return;
      }

      setMessage('Registration successful!');
    } catch {
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-10 transition-colors dark:bg-gray-950">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md space-y-4 rounded-xl border border-gray-200 bg-white p-8 shadow-lg transition-colors dark:border-gray-800 dark:bg-gray-900"
      >
        <h1 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
          Create Account
        </h1>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 outline-none placeholder:text-gray-500 focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400"
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 outline-none placeholder:text-gray-500 focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400"
        />

        <input
          type="url"
          placeholder="Photo URL"
          value={photoURL}
          onChange={(e) => setPhotoURL(e.target.value)}
          required
          className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 outline-none placeholder:text-gray-500 focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400"
        />

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-lg border border-gray-300 bg-white p-3 pr-12 text-gray-900 outline-none placeholder:text-gray-500 focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
          <p className="mb-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
            Password requirements
          </p>

          <ul className="grid grid-cols-1 gap-1 text-xs sm:grid-cols-2">
            <li
              className={`flex items-center gap-2 ${
                passwordRules.minLength
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {passwordRules.minLength ? (
                <Check size={15} />
              ) : (
                <X size={15} />
              )}
              <span>At least 6 characters</span>
            </li>

            <li
              className={`flex items-center gap-2 ${
                passwordRules.uppercase
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {passwordRules.uppercase ? (
                <Check size={15} />
              ) : (
                <X size={15} />
              )}
              <span>One uppercase letter</span>
            </li>

            <li
              className={`flex items-center gap-2 ${
                passwordRules.lowercase
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {passwordRules.lowercase ? (
                <Check size={15} />
              ) : (
                <X size={15} />
              )}
              <span>One lowercase letter</span>
            </li>

            <li
              className={`flex items-center gap-2 ${
                passwordRules.number
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {passwordRules.number ? (
                <Check size={15} />
              ) : (
                <X size={15} />
              )}
              <span>One number</span>
            </li>

            <li
              className={`flex items-center gap-2 ${
                passwordRules.special
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {passwordRules.special ? (
                <Check size={15} />
              ) : (
                <X size={15} />
              )}
              <span>One special character</span>
            </li>
          </ul>
        </div>

        {message && (
          <p
            role="status"
            className={`text-sm ${
              message === 'Registration successful!'
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !isStrongPassword}
          className="w-full rounded-lg bg-black p-3 font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>
    </main>
  );
}