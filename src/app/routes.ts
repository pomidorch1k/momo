import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { CartPage } from './pages/CartPage';
import { AdminPage } from './pages/AdminPage';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { SetAdminPage } from './pages/SetAdminPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: 'cart', Component: CartPage },
      { path: 'admin', Component: AdminPage },
      { path: 'login', Component: LoginPage },
      { path: 'set-admin', Component: SetAdminPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
]);