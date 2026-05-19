import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  LogOut,
  Home,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { USER_ROLE } from '@/constants/enums';

// Mock data for the dashboard
const stats = [
  {
    label: 'Total Revenue',
    value: '₱45,280',
    change: '+12.5%',
    icon: DollarSign,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
  },
  {
    label: 'Total Orders',
    value: '156',
    change: '+8.2%',
    icon: ShoppingCart,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    label: 'Total Products',
    value: '48',
    change: '+3.1%',
    icon: Package,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
  {
    label: 'Total Users',
    value: '1,024',
    change: '+15.3%',
    icon: Users,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
  },
];

const recentOrders = [
  {
    id: '#ORD-001',
    customer: 'Juan Dela Cruz',
    product: 'Premium Pellets .22',
    amount: '₱1,250',
    status: 'Completed',
    date: '2026-05-19',
  },
  {
    id: '#ORD-002',
    customer: 'Maria Santos',
    product: 'Match Grade Slugs',
    amount: '₱2,400',
    status: 'Processing',
    date: '2026-05-18',
  },
  {
    id: '#ORD-003',
    customer: 'Pedro Reyes',
    product: 'Hollow Point .177',
    amount: '₱890',
    status: 'Shipped',
    date: '2026-05-18',
  },
  {
    id: '#ORD-004',
    customer: 'Ana Gonzales',
    product: 'Diabolo Pellets Tin',
    amount: '₱450',
    status: 'Pending',
    date: '2026-05-17',
  },
  {
    id: '#ORD-005',
    customer: 'Carlos Mendoza',
    product: 'Slug Bundle Pack',
    amount: '₱3,600',
    status: 'Completed',
    date: '2026-05-17',
  },
];

const statusColors: Record<string, string> = {
  Completed: 'bg-green-500/20 text-green-400',
  Processing: 'bg-blue-500/20 text-blue-400',
  Shipped: 'bg-purple-500/20 text-purple-400',
  Pending: 'bg-yellow-500/20 text-yellow-400',
};

export function AdminDashboard() {
  const { user, loading, initialize, signOut } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!loading && (!user || user.role !== USER_ROLE.ADMIN)) {
      navigate('/admin');
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin');
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-dark-surface flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-surface">
      {/* Top Navigation Bar */}
      <header className="bg-dark-surface-secondary border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary-600/20 border border-primary-500/30 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-dark-text-primary">
                  PrimeShot
                </h1>
                <p className="text-xs text-dark-text-muted -mt-0.5">
                  Admin Dashboard
                </p>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-3 py-2 text-sm text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-surface-tertiary rounded-lg transition-colors"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">View Site</span>
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-dark-text-primary">
            Welcome back, {user.firstname || 'Admin'}
          </h2>
          <p className="text-dark-text-secondary mt-1">
            Here's what's happening with your store today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-dark-surface-secondary rounded-xl border border-dark-border p-5 hover:border-primary-500/30 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className={`p-2.5 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className="text-sm font-medium text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-dark-text-primary mt-4">
                {stat.value}
              </p>
              <p className="text-sm text-dark-text-secondary mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-dark-surface-secondary rounded-xl border border-dark-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-dark-text-primary flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary-400" />
                Recent Orders
              </h3>
              <button className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-dark-border">
                    <th className="text-left py-3 px-2 text-dark-text-muted font-medium">
                      Order
                    </th>
                    <th className="text-left py-3 px-2 text-dark-text-muted font-medium">
                      Customer
                    </th>
                    <th className="text-left py-3 px-2 text-dark-text-muted font-medium hidden md:table-cell">
                      Product
                    </th>
                    <th className="text-right py-3 px-2 text-dark-text-muted font-medium">
                      Amount
                    </th>
                    <th className="text-right py-3 px-2 text-dark-text-muted font-medium">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-dark-border/50 hover:bg-dark-surface-tertiary/50 transition-colors"
                    >
                      <td className="py-3 px-2 text-dark-text-primary font-medium">
                        {order.id}
                      </td>
                      <td className="py-3 px-2 text-dark-text-secondary">
                        {order.customer}
                      </td>
                      <td className="py-3 px-2 text-dark-text-secondary hidden md:table-cell">
                        {order.product}
                      </td>
                      <td className="py-3 px-2 text-dark-text-primary text-right font-medium">
                        {order.amount}
                      </td>
                      <td className="py-3 px-2 text-right">
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[order.status] || 'bg-gray-500/20 text-gray-400'}`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions & Info */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-dark-surface-secondary rounded-xl border border-dark-border p-6">
              <h3 className="text-lg font-semibold text-dark-text-primary mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary-400" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-dark-surface hover:bg-dark-surface-tertiary border border-dark-border transition-colors text-left">
                  <Package className="w-4 h-4 text-primary-400" />
                  <span className="text-sm text-dark-text-primary">
                    Add New Product
                  </span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-dark-surface hover:bg-dark-surface-tertiary border border-dark-border transition-colors text-left">
                  <ShoppingCart className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-dark-text-primary">
                    View All Orders
                  </span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-dark-surface hover:bg-dark-surface-tertiary border border-dark-border transition-colors text-left">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-dark-text-primary">
                    Manage Users
                  </span>
                </button>
              </div>
            </div>

            {/* Admin Info */}
            <div className="bg-dark-surface-secondary rounded-xl border border-dark-border p-6">
              <h3 className="text-lg font-semibold text-dark-text-primary mb-4">
                Admin Info
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-dark-text-muted">Email</span>
                  <span className="text-dark-text-primary">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-text-muted">Role</span>
                  <span className="text-primary-400 font-medium capitalize">
                    {user.role}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-text-muted">Name</span>
                  <span className="text-dark-text-primary">
                    {user.firstname} {user.lastname}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
