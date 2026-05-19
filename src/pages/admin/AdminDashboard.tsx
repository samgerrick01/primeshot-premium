import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { useDashboard } from '@/hooks/adminQueries';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  processing: 'bg-blue-500/20 text-blue-400',
  shipped: 'bg-purple-500/20 text-purple-400',
  delivered: 'bg-green-500/20 text-green-400',
  cancelled: 'bg-red-500/20 text-red-400',
};

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export function AdminDashboard() {
  const navigate = useNavigate();
  const { data, isLoading } = useDashboard();

  // Compute stats using useMemo to avoid recalculations
  const stats = useMemo(() => {
    if (!data) {
      return [
        {
          label: 'Total Revenue',
          value: '₱0',
          change: '0%',
          icon: DollarSign,
          color: 'text-green-400',
          bg: 'bg-green-500/10',
        },
        {
          label: 'Total Orders',
          value: '0',
          change: '0%',
          icon: ShoppingCart,
          color: 'text-blue-400',
          bg: 'bg-blue-500/10',
        },
        {
          label: 'Total Products',
          value: '0',
          change: '0%',
          icon: Package,
          color: 'text-purple-400',
          bg: 'bg-purple-500/10',
        },
        {
          label: 'Total Users',
          value: '0',
          change: '0%',
          icon: Users,
          color: 'text-orange-400',
          bg: 'bg-orange-500/10',
        },
      ];
    }

    const { orders, productCount, userCount } = data;
    const totalRevenue = orders.reduce(
      (sum, o) => sum + (Number(o.total) || 0),
      0,
    );
    const totalOrders = orders.length;

    return [
      {
        label: 'Total Revenue',
        value: `₱${totalRevenue.toLocaleString()}`,
        change: 'Today',
        icon: DollarSign,
        color: 'text-green-400',
        bg: 'bg-green-500/10',
      },
      {
        label: 'Total Orders',
        value: `${totalOrders}`,
        change: 'Today',
        icon: ShoppingCart,
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
      },
      {
        label: 'Total Products',
        value: `${productCount || 0}`,
        change: 'All time',
        icon: Package,
        color: 'text-purple-400',
        bg: 'bg-purple-500/10',
      },
      {
        label: 'Total Users',
        value: `${userCount || 0}`,
        change: 'All time',
        icon: Users,
        color: 'text-orange-400',
        bg: 'bg-orange-500/10',
      },
    ];
  }, [data]);

  // Stable callback for navigation
  const handleNavigation = useCallback(
    (path: string) => {
      navigate(path);
    },
    [navigate],
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const recentOrders = data?.orders || [];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark-text-primary flex items-center gap-3">
          <LayoutDashboard className="w-6 h-6 text-primary-400" />
          Dashboard
        </h1>
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
            <button
              onClick={() => navigate('/admin/orders')}
              className="text-sm text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-8 h-8 text-dark-text-muted mx-auto mb-2" />
              <p className="text-sm text-dark-text-secondary">No orders yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-dark-border">
                    <th className="text-left py-3 px-2 text-dark-text-muted font-medium">
                      Order #
                    </th>
                    <th className="text-left py-3 px-2 text-dark-text-muted font-medium">
                      Customer
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
                        #{order.id}
                      </td>
                      <td className="py-3 px-2 text-dark-text-secondary">
                        {order.customer_name || 'Guest'}
                      </td>
                      <td className="py-3 px-2 text-dark-text-primary text-right font-medium">
                        ₱{Number(order.total).toLocaleString()}
                      </td>
                      <td className="py-3 px-2 text-right">
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            statusColors[order.status] ||
                            'bg-gray-500/20 text-gray-400'
                          }`}
                        >
                          {statusLabels[order.status] || order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
              <button
                onClick={() => navigate('/admin/products/add')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-dark-surface hover:bg-dark-surface-tertiary border border-dark-border transition-colors text-left"
              >
                <Package className="w-4 h-4 text-primary-400" />
                <span className="text-sm text-dark-text-primary">
                  Add New Product
                </span>
              </button>
              <button
                onClick={() => navigate('/admin/orders')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-dark-surface hover:bg-dark-surface-tertiary border border-dark-border transition-colors text-left"
              >
                <ShoppingCart className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-dark-text-primary">
                  View All Orders
                </span>
              </button>
              <button
                onClick={() => navigate('/admin/users')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-dark-surface hover:bg-dark-surface-tertiary border border-dark-border transition-colors text-left"
              >
                <Users className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-dark-text-primary">
                  Manage Users
                </span>
              </button>
              <button
                onClick={() => navigate('/admin/diameters')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-dark-surface hover:bg-dark-surface-tertiary border border-dark-border transition-colors text-left"
              >
                <Activity className="w-4 h-4 text-orange-400" />
                <span className="text-sm text-dark-text-primary">
                  Manage Diameters
                </span>
              </button>
            </div>
          </div>

          {/* Store Info */}
          <div className="bg-dark-surface-secondary rounded-xl border border-dark-border p-6">
            <h3 className="text-lg font-semibold text-dark-text-primary mb-4">
              Store Overview
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-dark-text-muted">Products</span>
                <span className="text-dark-text-primary font-medium">
                  {stats[2].value}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-text-muted">Orders</span>
                <span className="text-dark-text-primary font-medium">
                  {stats[1].value}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-text-muted">Users</span>
                <span className="text-dark-text-primary font-medium">
                  {stats[3].value}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-text-muted">Revenue</span>
                <span className="text-green-400 font-medium">
                  {stats[0].value}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
