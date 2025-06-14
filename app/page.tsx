'use client';

import { useState, useEffect, useMemo } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

interface SmorfiaEntry {
  number: number;
  meaning: string;
}

export default function Home() {
  const [smorfiaData, setSmorfiaData] = useState<SmorfiaEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState('system');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof SmorfiaEntry;
    direction: 'ascending' | 'descending';
  } | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'system';
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
                <SignedIn>
                  <h1 className="text-5xl font-bold">Welcome</h1>
                  <p className="py-6">
                    Click the button below to fetch a new set of random numbers.
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={fetchSmorfiaData}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Loading...' : 'Get Random'}
                  </button>
                </SignedIn>
                <SignedOut>
                  <h1 className="text-5xl font-bold">Hello there</h1>
                  <p className="py-6">
                    Please log in to use the application.
                  </p>
                  <SignInButton>
                    <button className="btn btn-primary">Get Started</button>
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
            <div className="mt-8 card bg-base-200 shadow-xl w-full glass">
              <div className="card-body">
                <h2 className="card-title">La Smorfia Napoletana</h2>
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th
                          className="cursor-pointer w-1/4 text-right pr-2"
                          onClick={() => requestSort('number')}
                        >
                          Number {getSortIndicator('number')}
                        </th>
                        <th
                          className="cursor-pointer"
                          onClick={() => requestSort('meaning')}
                        >
                          Meaning {getSortIndicator('meaning')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedSmorfiaData.map((item) => (
                        <tr key={item.number}>
                          <th className="text-right pr-2">{item.number}</th>
                          <td className="pl-2 text-lg">{item.meaning}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="footer footer-center p-4 bg-base-300 text-base-content">
        <aside>
          <p>Copyright © 2024 - All right reserved by RJA Industries Ltd</p>
        </aside>
      </footer>
    </div>
  );
}
