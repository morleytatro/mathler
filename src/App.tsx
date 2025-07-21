import { Navigate, Outlet, RouterProvider, createBrowserRouter, useLocation } from 'react-router-dom';
import { useIsLoggedIn } from '@dynamic-labs/sdk-react-core';
import { Header } from './components/Header';
import { Profile } from './pages/profile';
import { Game } from './pages';
import { Login } from './pages/login';
import { History } from './pages/history';

function AuthWrapper() {
    const isLoggedIn = useIsLoggedIn();
    const { pathname } = useLocation();

    return !isLoggedIn ? <Navigate to={`/login?redirectPath=${pathname}`} /> : <Outlet />;
}

const routes = createBrowserRouter([
  {
    element: (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <Outlet />
      </div>
    ),
    children: [
      {
        element: <AuthWrapper />,
        children: [
          {
            index: true,
            element: <Game />,
          },
          {
            path: 'profile',
            element: <Profile />,
          },
          {
            path: 'history',
            element: <History />,
          }
        ]
      },
      {
        path: 'login',
        element: <Login />,
      },
    ],
  },
]);

export function App() {
  return <RouterProvider router={routes} />;
}
