'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  ClerkLoading,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from '@clerk/nextjs';

interface SmorfiaEntry {
  number: number;
  meaning: string;
}

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();
  const [smorfiaData, setSmorfiaData] = useState<SmorfiaEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState('pastel-light');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof SmorfiaEntry;
    direction: 'ascending' | 'descending';
  } | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'pastel-light';
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        document.documentElement.setAttribute(
          'data-theme',
          mediaQuery.matches ? 'dark' : 'light',
        );
      };
      handleChange();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  // Auto-fetch data when user is signed in
  useEffect(() => {
    if (isLoaded && isSignedIn && smorfiaData.length === 0) {
      fetchSmorfiaData();
    }
  }, [isLoaded, isSignedIn, smorfiaData.length]);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const sortedSmorfiaData = useMemo(() => {
    const sortableItems = [...smorfiaData];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [smorfiaData, sortConfig]);

  const requestSort = (key: keyof SmorfiaEntry) => {
    if (sortConfig && sortConfig.key === key) {
      if (sortConfig.direction === 'ascending') {
        setSortConfig({ key, direction: 'descending' });
      } else {
        setSortConfig(null);
      }
    } else {
      setSortConfig({ key, direction: 'ascending' });
    }
  };

  const getSortIndicator = (key: keyof SmorfiaEntry) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <span className="opacity-50"> ↕</span>;
    }
    return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
  };

  const fetchSmorfiaData = async () => {
    setError(null);
    setIsLoading(true);
    setSmorfiaData([]);

    try {
      // Fetch both endpoints concurrently
      const [randomRes, smorfiaRes] = await Promise.all([
        fetch('/api/v1/random'),
        fetch('/api/v1/smorfia'),
      ]);

      if (!randomRes.ok) {
        throw new Error(`Failed to fetch random numbers: ${randomRes.statusText}`);
      }
      if (!smorfiaRes.ok) {
        throw new Error(`Failed to fetch smorfia data: ${smorfiaRes.statusText}`);
      }

      const randomData = await randomRes.json();
      const smorfiaNumbers: SmorfiaEntry[] = await smorfiaRes.json();

      // Create a map for quick lookups
      const smorfiaMap = new Map(
        smorfiaNumbers.map((item) => [item.number, item.meaning]),
      );

      // Combine the data
      const combinedData = randomData.numbers.map((num: number) => ({
        number: num,
        meaning: smorfiaMap.get(num) || 'Meaning not found',
      }));

      setSmorfiaData(combinedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-base-100 text-base-content">
      <header className="navbar bg-base-200">
        <div className="navbar-start">
          <a className="btn btn-ghost text-xl">RJA Fecit</a>
        </div>
        <div className="navbar-end">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn m-1">
              Theme
              <svg
                width="12px"
                height="12px"
                className="h-2 w-2 fill-current opacity-60 inline-block"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 2048 2048"
              >
                <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] p-2 shadow-2xl bg-base-300 rounded-box w-52"
            >
              <li>
                <input
                  type="radio"
                  name="theme-dropdown"
                  className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                  aria-label="Pastel Light"
                  value="pastel-light"
                  checked={theme === 'pastel-light'}
                  onChange={() => handleThemeChange('pastel-light')}
                />
              </li>
              <li>
                <input
                  type="radio"
                  name="theme-dropdown"
                  className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                  aria-label="Pastel Dark"
                  value="pastel-dark"
                  checked={theme === 'pastel-dark'}
                  onChange={() => handleThemeChange('pastel-dark')}
                />
              </li>
              <li>
                <input
                  type="radio"
                  name="theme-dropdown"
                  className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                  aria-label="Light"
                  value="light"
                  checked={theme === 'light'}
                  onChange={() => handleThemeChange('light')}
                />
              </li>
              <li>
                <input
                  type="radio"
                  name="theme-dropdown"
                  className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                  aria-label="Dark"
                  value="dark"
                  checked={theme === 'dark'}
                  onChange={() => handleThemeChange('dark')}
                />
              </li>
              <li>
                <input
                  type="radio"
                  name="theme-dropdown"
                  className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                  aria-label="System"
                  value="system"
                  checked={theme === 'system'}
                  onChange={() => handleThemeChange('system')}
                />
              </li>
            </ul>
          </div>
          <ClerkLoading>
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          </ClerkLoading>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center p-4 sm:p-8">
        <div className="w-full max-w-4xl">
          <div className="hero bg-base-200 rounded-box glass">
            <div className="hero-content text-center">
              <div className="max-w-md">
                <ClerkLoading>
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                </ClerkLoading>
                <SignedIn>
                  <h1 className="text-5xl font-bold">Welcome</h1>
                  <p className="py-6">
                    Click the button below to fetch a new set of random numbers.
                  </p>
                  <button
                    className="btn btn-primary shadow-lg hover:shadow-xl transition-all duration-200"
                    onClick={fetchSmorfiaData}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Loading...' : 'Get Random'}
                  </button>
                </SignedIn>
                <SignedOut>
                  <h1 className="text-5xl font-bold">Hello there</h1>
                  <p className="py-6">
                    Please <SignInButton><a className="link link-primary">sign in</a></SignInButton> to use the application.
                  </p>
                  <SignInButton>
                    <button className="btn btn-primary shadow-lg hover:shadow-xl transition-all duration-200">Get Started</button>
                  </SignInButton>
                </SignedOut>
              </div>
            </div>
          </div>

          {error && (
            <div className="toast toast-top toast-center">
              <div className="alert alert-error">
                <span>{error}</span>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="mt-8 text-center">
              <span className="loading loading-lg loading-spinner text-primary"></span>
              <p>Fetching the numbers from the oracle...</p>
            </div>
          )}

          {smorfiaData.length > 0 && (
            <div className="mt-8">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-primary mb-2 flex items-center justify-center gap-2">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                  La Smorfia Napoletana
                  <span className="w-2 h-2 bg-secondary rounded-full"></span>
                </h2>
                <div className="flex justify-center gap-4 text-sm">
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => requestSort('number')}
                  >
                    Sort by Number {getSortIndicator('number')}
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => requestSort('meaning')}
                  >
                    Sort by Meaning {getSortIndicator('meaning')}
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedSmorfiaData.map((item) => (
                  <div 
                    key={item.number}
                    className="card bg-gradient-to-br from-base-100 to-base-200 shadow-lg hover:shadow-xl transition-all duration-300 border border-primary/10 hover:border-primary/20"
                  >
                    <div className="card-body p-3 text-center">
                      <div className="mb-2">
                        <div className="badge badge-primary font-mono font-bold text-base px-2 py-2">
                          {item.number}
                        </div>
                      </div>
                      <div>
                        <p className="text-base-content font-serif text-base leading-snug">
                          {item.meaning}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="footer footer-center p-4 bg-base-300 text-base-content">
        <aside>
          <p>© 2025 R. Alexander. All rights reserved. Licensed under the MIT License.<br></br> Contributions and collaborations are welcome</p>
        </aside>
      </footer>
    </div>
  );
}
