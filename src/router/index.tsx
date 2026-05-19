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
import { AdminLayout } from '@/pages/admin/AdminLayout';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminOrders } from '@/pages/admin/AdminOrders';
import { AdminUsers } from '@/pages/admin/AdminUsers';
import { AdminAddProduct } from '@/pages/admin/AdminAddProduct';
import { AdminProducts } from '@/pages/admin/AdminProducts';
import { AdminDiameters } from '@/pages/admin/AdminDiameters';
import { AdminCategories } from '@/pages/admin/AdminCategories';
import { AdminGrains } from '@/pages/admin/AdminGrains';

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
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'orders', element: <AdminOrders /> },
      { path: 'users', element: <AdminUsers /> },
      { path: 'products', element: <AdminProducts /> },
      { path: 'products/add', element: <AdminAddProduct /> },
      { path: 'categories', element: <AdminCategories /> },
      { path: 'grains', element: <AdminGrains /> },
      { path: 'diameters', element: <AdminDiameters /> },
    ],
  },
]);
