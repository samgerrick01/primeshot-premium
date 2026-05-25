import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Loader2,
  ImageIcon,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useOrdersStore } from '@/store/ordersStore';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/utils/format';
import { ORDER_STATUS_LABELS, getTrackingUrl } from '@/constants/enums';
import FlashExpressTrackingModal from '@/components/FlashExpressTrackingModal';

interface OrderItem {
  id: number;
  order_id: number;
  product_name: string;
  quantity: number;
  price: number;
  grains?: string;
  diameter?: string;
  caliber?: string;
}

interface Order {
  id: number;
  user_id: string;
  customer_email: string | null;
  customer_name: string | null;
  total: number;
  status: string;
  shipping_address: string | null;
  payment_receipt_url: string | null;
  tracking_number: string | null;
  courier_service: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string | null;
}

const statusConfig: Record<
  string,
  { label: string; color: string; icon: any }
> = {
  for_verification: {
    label: 'For Verification',
    color:
      'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    icon: Clock,
  },
  paid: {
    label: 'Paid',
    color:
      'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
    icon: CheckCircle,
  },
  preparing: {
    label: 'Preparing',
    color:
      'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    icon: Package,
  },
  to_ship: {
    label: 'To Ship',
    color:
      'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
    icon: Package,
  },
  in_transit: {
    label: 'In Transit',
    color:
      'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800',
    icon: Truck,
  },
  delivered: {
    label: 'Delivered',
    color:
      'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    icon: CheckCircle,
  },
  cancelled: {
    label: 'Cancelled',
    color:
      'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
    icon: XCircle,
  },
};

function getStatusIcon(status: string) {
  const config = statusConfig[status];
  return config?.icon || Clock;
}

function getStatusColor(status: string) {
  const config = statusConfig[status];
  return config?.color || statusConfig.for_verification.color;
}

function getStatusLabel(status: string) {
  return (
    ORDER_STATUS_LABELS[status as keyof typeof ORDER_STATUS_LABELS] || status
  );
}

export function Orders() {
  const { user, loading: authLoading } = useAuthStore();
  const navigate = useNavigate();
  const markViewed = useOrdersStore((state) => state.markViewed);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [expandedItems, setExpandedItems] = useState<
    Record<number, OrderItem[]>
  >({});
  const [loadingItems, setLoadingItems] = useState<Record<number, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');

  // ── Tracking Modal State ────────────────────────────────────────
  const [trackingModal, setTrackingModal] = useState<{
    open: boolean;
    courier: string;
    trackingNumber: string;
  }>({ open: false, courier: '', trackingNumber: '' });
  const [trackingData, setTrackingData] = useState<any>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState<string | null>(null);

  const openTracking = (courier: string, trackingNumber: string) => {
    setTrackingModal({ open: true, courier, trackingNumber });
    if (courier === 'Flash Express') {
      fetchFlashExpressTracking(trackingNumber);
    }
  };

  const closeTracking = () => {
    setTrackingModal({ open: false, courier: '', trackingNumber: '' });
    setTrackingData(null);
    setTrackingError(null);
  };

  const fetchFlashExpressTracking = async (trackingNumber: string) => {
    setTrackingLoading(true);
    setTrackingError(null);
    setTrackingData(null);

    try {
      const { data, error } = await supabase.functions.invoke(
        'flash-express-tracking',
        {
          body: { tracking_number: trackingNumber },
        },
      );

      if (error) throw new Error(error.message);
      if (!data.success)
        throw new Error(data.error || 'Failed to fetch tracking');
      // Flash Express response: data.data = { code, message, data: { list, error_search } }
      // Extract the inner data object that contains list and error_search
      const flashExpressResponse = data.data;
      const trackingInfo = flashExpressResponse?.data || null;
      setTrackingData(trackingInfo);
    } catch (err: any) {
      console.error('[Orders] Flash Express tracking error:', err);
      setTrackingError(err?.message || 'Failed to load tracking data');
    } finally {
      setTrackingLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchOrders();
  }, [user, authLoading, navigate]);

  const fetchOrders = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setOrders(data || []);
      // Mark orders as viewed
      markViewed();
    } catch (err: any) {
      console.error('[Orders] Error fetching orders:', err);
      setError(err?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpandOrder = async (orderId: number) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
      return;
    }

    setExpandedOrder(orderId);

    // Fetch items if not already loaded
    if (!expandedItems[orderId]) {
      setLoadingItems((prev) => ({ ...prev, [orderId]: true }));
      try {
        const { data, error: itemsError } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', orderId);

        if (itemsError) throw itemsError;
        setExpandedItems((prev) => ({ ...prev, [orderId]: data || [] }));
      } catch (err: any) {
        console.error('[Orders] Error fetching order items:', err);
        setExpandedItems((prev) => ({ ...prev, [orderId]: [] }));
      } finally {
        setLoadingItems((prev) => ({ ...prev, [orderId]: false }));
      }
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredOrders = orders.filter((order) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      order.id.toString().includes(term) ||
      order.status.toLowerCase().includes(term) ||
      getStatusLabel(order.status).toLowerCase().includes(term) ||
      (order.tracking_number &&
        order.tracking_number.toLowerCase().includes(term)) ||
      (order.courier_service &&
        order.courier_service.toLowerCase().includes(term))
    );
  });

  // Guard: not authenticated
  if (authLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-600 dark:text-primary-400 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="section-title">My Orders</h1>
        <p className="section-subtitle mt-1">Track and manage your orders</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted dark:text-dark-text-muted" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by order ID, status, or tracking..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border dark:border-dark-border bg-white dark:bg-dark-surface text-text-primary dark:text-dark-text-primary placeholder:text-text-muted dark:placeholder:text-dark-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
        />
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary-600 dark:text-primary-400 animate-spin" />
        </div>
      ) : error ? (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag className="w-16 h-16 mx-auto text-text-muted dark:text-dark-text-muted mb-4" />
          <h2 className="font-serif text-xl font-bold text-text-primary dark:text-dark-text-primary mb-2">
            {searchTerm ? 'No matching orders' : 'No orders yet'}
          </h2>
          <p className="text-text-secondary dark:text-dark-text-secondary mb-6">
            {searchTerm
              ? 'Try a different search term'
              : 'Your order history will appear here'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => navigate('/shop')}
              className="btn-primary inline-flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              Start Shopping
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const StatusIcon = getStatusIcon(order.status);

              const isExpanded = expandedOrder === order.id;
              const items = expandedItems[order.id] || [];
              const isLoadingItems = loadingItems[order.id];

              return (
                <div key={order.id} className="card overflow-hidden">
                  {/* Order Header */}
                  <div
                    className="p-4 sm:p-5 cursor-pointer hover:bg-surface-tertiary/50 dark:hover:bg-dark-surface-tertiary/50 transition-colors"
                    onClick={() => toggleExpandOrder(order.id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          <span className="text-sm font-bold text-text-primary dark:text-dark-text-primary">
                            #{order.id}
                          </span>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${getStatusColor(order.status)}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {getStatusLabel(order.status)}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-text-muted dark:text-dark-text-muted hidden sm:inline">
                          {formatDate(order.created_at)}
                        </span>
                        <span className="font-bold text-text-primary dark:text-dark-text-primary">
                          {formatPrice(Number(order.total))}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-text-muted dark:text-dark-text-muted" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-text-muted dark:text-dark-text-muted" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-border dark:border-dark-border px-4 sm:px-5 py-4 bg-surface-secondary/50 dark:bg-dark-surface-secondary/50">
                      {/* Order Items */}
                      <div className="mb-4">
                        <p className="text-xs font-medium text-text-muted dark:text-dark-text-muted uppercase tracking-wider mb-2">
                          Order Items
                        </p>
                        {isLoadingItems ? (
                          <div className="flex items-center gap-2 text-sm text-text-secondary dark:text-dark-text-secondary py-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Loading items...
                          </div>
                        ) : items.length > 0 ? (
                          <div className="space-y-2">
                            {items.map((item) => (
                              <div
                                key={item.id}
                                className="flex justify-between items-start text-sm"
                              >
                                <div className="flex-1">
                                  <span className="text-text-primary dark:text-dark-text-primary font-medium">
                                    {item.product_name} × {item.quantity}
                                  </span>
                                  {(item.grains ||
                                    item.diameter ||
                                    item.caliber) && (
                                    <div className="flex flex-wrap gap-2 mt-1">
                                      {item.caliber && (
                                        <span className="inline-flex items-center gap-0.5 text-xs text-text-muted dark:text-dark-text-muted bg-surface-tertiary/50 dark:bg-dark-surface-tertiary/50 px-1.5 py-0.5 rounded">
                                          Caliber: {item.caliber}
                                        </span>
                                      )}
                                      {item.grains && (
                                        <span className="inline-flex items-center gap-0.5 text-xs text-text-muted dark:text-dark-text-muted bg-surface-tertiary/50 dark:bg-dark-surface-tertiary/50 px-1.5 py-0.5 rounded">
                                          {item.grains} gr
                                        </span>
                                      )}
                                      {item.diameter && (
                                        <span className="inline-flex items-center gap-0.5 text-xs text-text-muted dark:text-dark-text-muted bg-surface-tertiary/50 dark:bg-dark-surface-tertiary/50 px-1.5 py-0.5 rounded">
                                          Dia: {item.diameter}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                                <span className="text-text-primary dark:text-dark-text-primary font-medium ml-4 whitespace-nowrap">
                                  {formatPrice(Number(item.price))}
                                </span>
                              </div>
                            ))}
                            <div className="flex justify-between items-center text-sm pt-2 border-t border-border dark:border-dark-border">
                              <span className="text-text-muted dark:text-dark-text-muted">
                                Total
                              </span>
                              <span className="text-text-primary dark:text-dark-text-primary font-bold">
                                {formatPrice(Number(order.total))}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                            No item details available
                          </p>
                        )}
                      </div>

                      {/* Shipping Address */}
                      {order.shipping_address && (
                        <div className="mb-4">
                          <p className="text-xs font-medium text-text-muted dark:text-dark-text-muted uppercase tracking-wider mb-1">
                            Shipping Address
                          </p>
                          <p className="text-sm text-text-primary dark:text-dark-text-primary">
                            {order.shipping_address}
                          </p>
                        </div>
                      )}

                      {/* Payment Receipt */}
                      {order.payment_receipt_url && (
                        <div className="mb-4">
                          <p className="text-xs font-medium text-text-muted dark:text-dark-text-muted uppercase tracking-wider mb-1">
                            Payment Receipt
                          </p>
                          <div className="relative mt-1 rounded-lg overflow-hidden border border-border dark:border-dark-border bg-white dark:bg-dark-surface max-w-md">
                            <img
                              src={order.payment_receipt_url}
                              alt="Payment Receipt"
                              className="w-full h-auto object-contain max-h-60"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  'none';
                                (
                                  e.target as HTMLImageElement
                                ).nextElementSibling?.classList.remove(
                                  'hidden',
                                );
                              }}
                            />
                            <div className="hidden flex-col items-center justify-center py-6 text-text-muted dark:text-dark-text-muted">
                              <ImageIcon className="w-8 h-8 mb-2" />
                              <p className="text-sm">
                                Receipt image not available
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Tracking Info */}
                      {(order.tracking_number || order.courier_service) && (
                        <div className="mb-4">
                          <p className="text-xs font-medium text-text-muted dark:text-dark-text-muted uppercase tracking-wider mb-1">
                            Tracking Information
                          </p>
                          {order.courier_service && (
                            <p className="text-sm text-text-primary dark:text-dark-text-primary">
                              Courier: {order.courier_service}
                            </p>
                          )}
                          {order.tracking_number && (
                            <div className="mt-1 flex flex-wrap items-center gap-2">
                              {order.courier_service === 'Flash Express' ? (
                                <button
                                  onClick={() =>
                                    openTracking(
                                      order.courier_service!,
                                      order.tracking_number!,
                                    )
                                  }
                                  className="inline-flex items-center gap-1.5 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 underline underline-offset-2 transition-colors"
                                >
                                  <Truck className="w-3.5 h-3.5" />
                                  Track: {order.tracking_number}
                                </button>
                              ) : order.courier_service &&
                                order.courier_service !== 'Other' ? (
                                <a
                                  href={
                                    getTrackingUrl(
                                      order.courier_service,
                                      order.tracking_number,
                                    ) ?? '#'
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 underline underline-offset-2 transition-colors"
                                >
                                  <Truck className="w-3.5 h-3.5" />
                                  Track: {order.tracking_number}
                                </a>
                              ) : (
                                <p className="text-sm text-text-primary dark:text-dark-text-primary">
                                  Tracking: {order.tracking_number}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Order Date */}
                      <div>
                        <p className="text-xs font-medium text-text-muted dark:text-dark-text-muted uppercase tracking-wider mb-1">
                          Order Date
                        </p>
                        <p className="text-sm text-text-primary dark:text-dark-text-primary">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Tracking Modal ──────────────────────────────────── */}
          {trackingModal.open && trackingModal.courier === 'Flash Express' ? (
            <FlashExpressTrackingModal
              isOpen={trackingModal.open}
              onClose={closeTracking}
              trackingNumber={trackingModal.trackingNumber}
              data={trackingData}
              loading={trackingLoading}
              error={trackingError}
            />
          ) : trackingModal.open &&
            trackingModal.courier !== 'Flash Express' ? (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
              onClick={closeTracking}
            >
              <div
                className="w-full max-w-lg bg-white dark:bg-dark-surface rounded-xl shadow-xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 border-b border-border dark:border-dark-border">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <h3 className="font-semibold text-text-primary dark:text-dark-text-primary">
                      {trackingModal.courier} Tracking
                    </h3>
                  </div>
                  <button
                    onClick={closeTracking}
                    className="p-1 rounded-md hover:bg-surface-tertiary dark:hover:bg-dark-surface-tertiary transition-colors"
                  >
                    <XCircle className="w-5 h-5 text-text-muted dark:text-dark-text-muted" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-4 max-h-[70vh] overflow-y-auto">
                  <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                    Tracking for {trackingModal.courier} is handled externally.
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
