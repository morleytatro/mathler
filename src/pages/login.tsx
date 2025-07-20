import { useSearchParams, Navigate } from 'react-router-dom';
import {
  DynamicEmbeddedWidget,
  useIsLoggedIn,
} from '@dynamic-labs/sdk-react-core';

export function Login() {
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirectPath');
  const isLoggedIn = useIsLoggedIn();

  return isLoggedIn ? <Navigate to={redirectPath ?? '/'} /> : (
    <div className="mt-10 w-96 max-w-full mx-auto">
      <div className="bg-white">
        <DynamicEmbeddedWidget />
      </div>
    </div>
  );
}
