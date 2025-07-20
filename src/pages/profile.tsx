import { Link } from 'react-router-dom';
import {
  DynamicEmbeddedWidget,
  useIsLoggedIn,
} from '@dynamic-labs/sdk-react-core';

export function Profile() {
  const isLoggedIn = useIsLoggedIn();

  return (
    <div className="mt-10 w-96 max-w-full mx-auto">
      <div className="bg-white">
        <DynamicEmbeddedWidget />
      </div>
      {isLoggedIn && (
        <div className="flex justify-center mt-4">
          <Link
            to="/"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Play now!
          </Link>
        </div>
      )}
    </div>
  );
}
