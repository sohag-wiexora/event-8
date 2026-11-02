
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setMessage('');

    try {
      setLoading(true);

     const { error } = await authClient.signIn.email({
     email,
     password,
     callbackURL: `${window.location.origin}/`,
     });

      if (error) {
        setMessage(error.message || 'Login failed.');
        return;
      }

      router.push('/');
      router.refresh();
    } catch {
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setMessage('');

    try {
      setGoogleLoading(true);

      await authClient.signIn.social({
       provider: 'google',
      callbackURL: `${window.location.origin}/`,
       });

    } catch {
      setMessage('Google login failed. Please try again.');
      setGoogleLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-10 dark:bg-gray-950">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md space-y-4 rounded-xl bg-white p-8 shadow-lg dark:border dark:border-gray-800 dark:bg-gray-900"
      >
        <h1 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
          Welcome Back
        </h1>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Login to your Event-8 account
        </p>

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 bg-white p-3 pr-12 text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            {showPassword ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}
          </button>
        </div>

        {message && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || googleLoading}
          className="w-full rounded-lg bg-black p-3 font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className="relative flex items-center">
          <div className="flex-1grow border-t border-gray-300 dark:border-gray-700" />
          <span className="px-3 text-sm text-gray-500 dark:text-gray-400">
            OR
          </span>
          <div className="flex-1grow border-t border-gray-300 dark:border-gray-700" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading || loading}
          className="w-full rounded-lg border border-gray-300 bg-white p-3 font-semibold text-gray-800 transition hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
        >
          {googleLoading
            ? 'Connecting to Google...'
            : 'Continue with Google'}
        </button>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
          >
            Register
          </Link>
        </p>
      </form>
    </main>
  );
}
