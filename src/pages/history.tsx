import { Link } from 'react-router-dom';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import type { Metadata } from '../types';

export function History() {
  const { user } = useDynamicContext();

  const history = (user?.metadata as Metadata)?.history ?? [];

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="mt-10 w-lg max-w-full mx-auto">
      <div className="bg-white p-4">
        <h1 className="text-xl font-bold mb-4">Game History</h1>
        {history.length ? (
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Date</th>
                <th className="text-left">Outcome</th>
                <th className="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry, index) => {
                let wonColumn = '';
                if (entry.won === undefined && entry.date === today) {
                  wonColumn = 'In Progress';
                } else {
                  wonColumn = entry.won ? 'Won' : 'Lost';
                }

                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-2">{entry.date}</td>
                    <td className="py-2">{wonColumn}</td>
                    <td className="py-2">
                      {entry.date === today && wonColumn === 'In Progress' && (
                        <Link
                          to="/"
                          className="border-b border-green-500 text-green-500 hover:opacity-80"
                        >
                          Continue game
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>
            No game history available.{' '}
            <Link
              to="/"
              className="border-b border-green-500 text-green-500 hover:opacity-80"
            >
              Play now
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  );
}
