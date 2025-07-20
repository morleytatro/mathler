import { Link, NavLink } from 'react-router-dom';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { twMerge } from 'tailwind-merge';

export function Header() {
  const { handleLogOut, user } = useDynamicContext();

  const isLoggedIn = user !== undefined;

  return (
    <header className="bg-black w-full text-white flex justify-between items-stretch">
      <Link to="/" className="p-4">
        Morley's Mathler
      </Link>
      <div className="flex gap-2 items-stretch">
        {isLoggedIn ? (
          <>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                twMerge(
                  'px-4 flex items-center',
                  isActive ? 'text-green-500' : 'hover:text-green-500'
                )
              }
            >
              Profile
            </NavLink>
            <NavLink
              to="/history"
              className={({ isActive }) =>
                twMerge(
                  'px-4 flex items-center',
                  isActive ? 'text-green-500' : 'hover:text-green-500'
                )
              }
            >
              History
            </NavLink>
            <button className="px-4 bg-green-500" onClick={handleLogOut}>
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="px-4 hover:text-green-500 flex items-center"
            >
              Log In
            </Link>
            <Link to="/login" className="px-4 bg-green-500 flex items-center">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
