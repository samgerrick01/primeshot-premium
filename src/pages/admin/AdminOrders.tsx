import { useState, useMemo, useCallback } from 'react';
import {
  ShoppingCart,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Package,
  Save,
  Eye,
} from 'lucide-react';
import {
  useOrders,
  useOrderItems,
  useUpdateOrderStatus,
  useUpdateOrderTracking,
} from '@/hooks/adminQueries';
import { useToast } from '@/components/Toast';
import { formatPrice } from '@/utils/format';

// ── Status Flow ────────────────────────────────────────────────
// for_verification → paid → preparing → to_ship → in_transit → done
//                                                                 ↓
//                                                             cancelled

type StatusKey =
  | 'for_verification'
  | 'paid'
  | 'preparing'
  | 'to_ship'
  | 'in_transit'
  | 'done'
  | 'cancelled';

const NEXT_STATUS: Record<StatusKey, StatusKey[]> = {
  for_verification: ['paid', 'cancelled'],
  paid: ['preparing', 'cancelled'],
  preparing: ['to_ship', 'cancelled'],
  to_ship: ['in_transit', 'cancelled'],
  in_transit: ['done', 'cancelled'],
  done: [],
  cancelled: [],
};

const statusConfig: Record<
  StatusKey,
  { label: string; color: string; icon: any }
> = {
  for_verification: {
    label: 'For Verification',
    color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    icon: Clock,
  },
  paid: {
    label: 'Paid',
    color: 'bg-green-500/20 text-green-400 border-green-500/30',
    icon: CheckCircle,
  },
  preparing: {
    label: 'Preparing',
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    icon: Package,
  },
  to_ship: {
    label: 'To Ship',
    color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    icon: Truck,
  },
  in_transit: {
    label: 'In Transit',
    color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    icon: Truck,
  },
  done: {
    label: 'Done',
    color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    icon: CheckCircle,
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-500/20 text-red-400 border-red-500/30',
    icon: XCircle,
  },
};

export function AdminOrders() {
  const { data: orders, isLoading } = useOrders();
  const { mutateAsync: updateStatus } = useUpdateOrderStatus();
  const { mutateAsync: updateTracking } = useUpdateOrderTracking();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // Tracking form state per order
  const [trackingForms, setTrackingForms] = useState<
    Record<number, { tracking_number: string; courier_service: string }>
  >({});

  // Only fetch items when an order is expanded
  const { data: expandedItems } = useOrderItems(expandedOrder);

  // Stable callback for toggling expanded order
  const handleToggleExpand = useCallback(
    (orderId: number) => {
      setExpandedOrder((prev) => (prev === orderId ? null : orderId));
      // Initialize tracking form when expanding
      setTrackingForms((prev) => {
        if (!prev[orderId]) {
          const order = orders?.find((o) => o.id === orderId);
          if (order) {
            return {
              ...prev,
              [orderId]: {
                tracking_number: order.tracking_number || '',
                courier_service: order.courier_service || '',
              },
            };
          }
        }
        return prev;
      });
    },
    [orders],
  );

  // Stable callback for updating status
  const handleUpdateStatus = useCallback(
    async (orderId: number, newStatus: string) => {
      setUpdatingId(orderId);
      try {
        await updateStatus({ orderId, newStatus });
        const statusLabel =
          statusConfig[newStatus as StatusKey]?.label || newStatus;
        showToast(`Order #${orderId} updated to ${statusLabel}!`, 'success');
      } catch (err: any) {
        console.error('[AdminOrders] update error:', err);
        showToast(err?.message || 'Failed to update order status', 'error');
      }
      setUpdatingId(null);
    },
    [updateStatus, showToast],
  );

  // Save tracking info
  const handleSaveTracking = useCallback(
    async (orderId: number) => {
      const form = trackingForms[orderId];
      if (!form) return;
      setUpdatingId(orderId);
      try {
        await updateTracking({
          orderId,
          tracking_number: form.tracking_number,
          courier_service: form.courier_service,
        });
        showToast(`Tracking info saved for Order #${orderId}!`, 'success');
      } catch (err: any) {
        console.error('[AdminOrders] tracking update error:', err);
        showToast(err?.message || 'Failed to save tracking info', 'error');
      }
      setUpdatingId(null);
    },
    [trackingForms, updateTracking, showToast],
  );

  // Memoized filtered + sorted orders
  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    return orders.filter((order) => {
      const matchesSearch =
        !searchTerm ||
        order.id.toString().includes(searchTerm) ||
        order.customer_email
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.tracking_number?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark-text-primary flex items-center gap-3">
          <ShoppingCart className="w-6 h-6 text-primary-400" />
          Orders
        </h1>
        <p className="text-dark-text-secondary mt-1">
          Manage and track all customer orders
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-text-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by order ID, email, name, or tracking..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-dark-border bg-dark-surface text-dark-text-primary placeholder:text-dark-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-text-muted" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2.5 rounded-lg border border-dark-border bg-dark-surface text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm appearance-none cursor-pointer"
          >
            <option value="all">All Status</option>
            {Object.entries(statusConfig).map(([key, config]) => (
              <option key={key} value={key}>
                {config.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-text-muted pointer-events-none" />
        </div>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingCart className="w-12 h-12 text-dark-text-muted mx-auto mb-4" />
          <p className="text-dark-text-secondary">No orders found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const statusInfo =
              statusConfig[order.status as StatusKey] ||
              statusConfig.for_verification;
            const StatusIcon = statusInfo.icon;
            const nextStatuses = NEXT_STATUS[order.status as StatusKey] || [];

            return (
              <div
                key={order.id}
                className="bg-dark-surface-secondary rounded-xl border border-dark-border overflow-hidden"
              >
                {/* Order Header */}
                <div
                  className="p-4 sm:p-5 cursor-pointer hover:bg-dark-surface-tertiary/50 transition-colors"
                  onClick={() => handleToggleExpand(order.id)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <span className="text-sm font-bold text-dark-text-primary">
                          #{order.id}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${statusInfo.color}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {statusInfo.label}
                        </span>
                        {order.tracking_number && (
                          <span className="inline-flex items-center gap-1 text-xs text-dark-text-muted">
                            <Truck className="w-3 h-3" />
                            {order.tracking_number}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-dark-text-muted hidden sm:inline">
                        {formatDate(order.created_at)}
                      </span>
                      <span className="font-bold text-dark-text-primary">
                        {formatPrice(Number(order.total))}
                      </span>
                      {expandedOrder === order.id ? (
                        <ChevronUp className="w-4 h-4 text-dark-text-muted" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-dark-text-muted" />
                      )}
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                    {order.customer_name && (
                      <span className="text-dark-text-primary">
                        {order.customer_name}
                      </span>
                    )}
                    {order.customer_email && (
                      <span className="text-dark-text-muted">
                        {order.customer_email}
                      </span>
                    )}
                  </div>
                </div>

                {/* Expanded Items */}
                {expandedOrder === order.id && (
                  <div className="border-t border-dark-border px-4 sm:px-5 py-4 bg-dark-surface/50">
                    {expandedItems && expandedItems.length > 0 ? (
                      <div className="space-y-2 mb-4">
                        <p className="text-xs font-medium text-dark-text-muted uppercase tracking-wider">
                          Order Items
                        </p>
                        {expandedItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between items-start text-sm"
                          >
                            <div className="flex-1">
                              <span className="text-dark-text-primary font-medium">
                                {item.product_name} × {item.quantity}
                              </span>
                              {(item.grains ||
                                item.diameter ||
                                item.caliber) && (
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {item.caliber && (
                                    <span className="inline-flex items-center gap-0.5 text-xs text-dark-text-muted bg-dark-surface-tertiary/50 px-1.5 py-0.5 rounded">
                                      Caliber: {item.caliber}
                                    </span>
                                  )}
                                  {item.grains && (
                                    <span className="inline-flex items-center gap-0.5 text-xs text-dark-text-muted bg-dark-surface-tertiary/50 px-1.5 py-0.5 rounded">
                                      {item.grains} gr
                                    </span>
                                  )}
                                  {item.diameter && (
                                    <span className="inline-flex items-center gap-0.5 text-xs text-dark-text-muted bg-dark-surface-tertiary/50 px-1.5 py-0.5 rounded">
                                      Dia: {item.diameter}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            <span className="text-dark-text-primary font-medium ml-4 whitespace-nowrap">
                              {formatPrice(Number(item.price))}
                            </span>
                          </div>
                        ))}
                        <div className="flex justify-between items-center text-sm pt-2 border-t border-dark-border">
                          <span className="text-dark-text-muted">Total</span>
                          <span className="text-dark-text-primary font-bold">
                            {formatPrice(Number(order.total))}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-dark-text-muted mb-4">
                        No item details available
                      </p>
                    )}

                    {/* Shipping Address */}
                    {order.shipping_address && (
                      <div className="mb-4">
                        <p className="text-xs font-medium text-dark-text-muted uppercase tracking-wider mb-1">
                          Shipping Address
                        </p>
                        <p className="text-sm text-dark-text-primary">
                          {order.shipping_address}
                        </p>
                      </div>
                    )}

                    {/* Payment Receipt */}
                    {order.payment_receipt_url && (
                      <div className="mb-4">
                        <p className="text-xs font-medium text-dark-text-muted uppercase tracking-wider mb-1">
                          Payment Receipt
                        </p>
                        <div className="relative mt-1 rounded-lg overflow-hidden border border-dark-border bg-dark-surface max-w-md">
                          <img
                            src={order.payment_receipt_url}
                            alt="Payment Receipt"
                            className="w-full h-auto object-contain max-h-60"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                'none';
                              (
                                e.target as HTMLImageElement
                              ).nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                          <div className="hidden flex-col items-center justify-center py-6 text-dark-text-muted">
                            <Eye className="w-8 h-8 mb-2" />
                            <p className="text-sm">
                              Receipt image not available
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Tracking Info (editable when status is to_ship, in_transit, or done) */}
                    {['to_ship', 'in_transit', 'done'].includes(
                      order.status,
                    ) && (
                      <div className="mb-4 p-3 rounded-lg bg-dark-surface border border-dark-border">
                        <p className="text-xs font-medium text-dark-text-muted uppercase tracking-wider mb-2">
                          Tracking Information
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                          <div>
                            <label className="block text-xs text-dark-text-muted mb-1">
                              Courier Service
                            </label>
                            <select
                              value={
                                trackingForms[order.id]?.courier_service || ''
                              }
                              onChange={(e) =>
                                setTrackingForms((prev) => ({
                                  ...prev,
                                  [order.id]: {
                                    ...prev[order.id],
                                    courier_service: e.target.value,
                                  },
                                }))
                              }
                              className="w-full text-sm px-3 py-1.5 rounded-lg border border-dark-border bg-dark-surface text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                              <option value="">Select courier</option>
                              <option value="Flash Express">
                                Flash Express
                              </option>
                              <option value="J&T Express">J&T Express</option>
                              <option value="LBC">LBC</option>
                              <option value="Ninja Van">Ninja Van</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-dark-text-muted mb-1">
                              Tracking Number
                            </label>
                            <input
                              type="text"
                              value={
                                trackingForms[order.id]?.tracking_number || ''
                              }
                              onChange={(e) =>
                                setTrackingForms((prev) => ({
                                  ...prev,
                                  [order.id]: {
                                    ...prev[order.id],
                                    tracking_number: e.target.value,
                                  },
                                }))
                              }
                              placeholder="Enter tracking number"
                              className="w-full text-sm px-3 py-1.5 rounded-lg border border-dark-border bg-dark-surface text-dark-text-primary placeholder:text-dark-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => handleSaveTracking(order.id)}
                          disabled={updatingId === order.id}
                          className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 transition-colors"
                        >
                          {updatingId === order.id ? (
                            <div className="w-3 h-3 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Save className="w-3 h-3" />
                          )}
                          Save Tracking
                        </button>
                      </div>
                    )}

                    {/* Status Update */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-dark-text-muted uppercase tracking-wider">
                        Update Status:
                      </span>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleUpdateStatus(order.id, e.target.value)
                        }
                        disabled={
                          updatingId === order.id || nextStatuses.length === 0
                        }
                        className="text-sm px-3 py-1.5 rounded-lg border border-dark-border bg-dark-surface text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value={order.status}>
                          {statusConfig[order.status as StatusKey]?.label ||
                            order.status}
                        </option>
                        {nextStatuses.map((status) => (
                          <option key={status} value={status}>
                            {statusConfig[status]?.label || status}
                          </option>
                        ))}
                      </select>
                      {updatingId === order.id && (
                        <div className="w-4 h-4 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Summary */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {Object.entries(statusConfig).map(([key, config]) => {
          const count = (orders ?? []).filter((o) => o.status === key).length;
          const Icon = config.icon;
          return (
            <div
              key={key}
              className="bg-dark-surface-secondary rounded-lg border border-dark-border p-3 text-center"
            >
              <Icon
                className={`w-4 h-4 mx-auto mb-1 ${config.color.split(' ')[1]}`}
              />
              <p className="text-lg font-bold text-dark-text-primary">
                {count}
              </p>
              <p className="text-xs text-dark-text-muted">{config.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
