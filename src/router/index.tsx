import { createBrowserRouter } from 'react-router-dom';
import App from '@/App';
import { Home } from '@/pages/Home';
import { Shop } from '@/pages/Shop';
import { Categories } from '@/pages/Categories';
import { About } from '@/pages/About';
import { Auth } from '@/pages/Auth';
import { Account } from '@/pages/Account';
import { Orders } from '@/pages/Orders';
import { Cart } from '@/pages/Cart';
import { Checkout } from '@/pages/Checkout';
import { OrderConfirmation } from '@/pages/OrderConfirmation';
import { PaymentSession } from '@/pages/PaymentSession';
import { ProductDetail } from '@/pages/ProductDetail';
import { NotFound } from '@/pages/NotFound';
import { FAQ } from '@/pages/FAQ';
import { ShippingReturns } from '@/pages/ShippingReturns';
import { CaliberGuide } from '@/pages/CaliberGuide';
import { PrivacyPolicy } from '@/pages/PrivacyPolicy';
import { Contact } from '@/pages/Contact';
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
import { AdminCalibers } from '@/pages/admin/AdminCalibers';

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
      { path: 'checkout', element: <Checkout /> },
      { path: 'order-confirmation/:id', element: <OrderConfirmation /> },
      { path: 'orders', element: <Orders /> },
      { path: 'payment-session', element: <PaymentSession /> },
      { path: 'product/:id', element: <ProductDetail /> },
      { path: 'faq', element: <FAQ /> },
      { path: 'shipping-returns', element: <ShippingReturns /> },
      { path: 'caliber-guide', element: <CaliberGuide /> },
      { path: 'privacy-policy', element: <PrivacyPolicy /> },
      { path: 'contact', element: <Contact /> },
      { path: '*', element: <NotFound /> },
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
      { path: 'calibers', element: <AdminCalibers /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
