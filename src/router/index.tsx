import { createBrowserRouter } from 'react-router-dom';
import App from '@/App';
import { Home } from '@/pages/Home';
import { Shop } from '@/pages/Shop';
import { Categories } from '@/pages/Categories';
import { About } from '@/pages/About';
import { Auth } from '@/pages/Auth';
import { Account } from '@/pages/Account';
import { Cart } from '@/pages/Cart';
import { ProductDetail } from '@/pages/ProductDetail';
import { AdminSignIn } from '@/pages/admin/AdminSignIn';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'shop', element: <Shop /> },
      { path: 'categories', element: <Categories /> },
      { path: 'about', element: <About /> },
      { path: 'auth', element: <Auth /> },
      { path: 'account', element: <Account /> },
      { path: 'cart', element: <Cart /> },
      { path: 'product/:id', element: <ProductDetail /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminSignIn />,
  },
  {
    path: '/admin/dashboard',
    element: <AdminDashboard />,
  },
]);
