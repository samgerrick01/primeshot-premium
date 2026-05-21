import { useState } from 'react';
import {
  XCircle,
  Loader2,
  Package,
  PackageCheck,
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Warehouse,
  FileSignature,
  ImageIcon,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────
interface RouteEvent {
  message: string;
  route_action: string;
  routed_at: string;
  route_icon: number;
  state: number;
  state_text: string;
  staff_info_name?: string;
  staff_info_phone?: string;
  dst_detail_address?: string;
}

interface SignInfo {
  signer_show: string;
  image_url_list?: Array<{
    other_image_url?: string;
    other_image_url_th?: string;
  }>;
}

interface TrackingParcel {
  pno_display: string;
  search_no: string;
  state: number;
  state_text: string;
  src_province_name: string;
  dst_province_name: string;
  store_phone?: string;
  routes: RouteEvent[];
  sign_info?: SignInfo;
  ticket_pickup_store_name?: string;
}

interface FlashExpressData {
  list: TrackingParcel[];
  error_search?: string[];
}

interface FlashExpressTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  trackingNumber: string;
  data: FlashExpressData | null;
  loading: boolean;
  error: string | null;
}

// ── Helpers ────────────────────────────────────────────────────

function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr.replace(' ', 'T'));
  return d.toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getStateInfo(state: number): {
  label: string;
  color: string;
  bgColor: string;
  icon: any;
} {
  switch (state) {
    case 5:
      return {
        label: 'Delivered',
        color: 'text-emerald-600 dark:text-emerald-400',
        bgColor:
          'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700',
        icon: PackageCheck,
      };
    case 4:
      return {
        label: 'Out for Delivery',
        color: 'text-blue-600 dark:text-blue-400',
        bgColor:
          'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700',
        icon: Truck,
      };
    case 3:
      return {
        label: 'On Delivery',
        color: 'text-blue-600 dark:text-blue-400',
        bgColor:
          'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700',
        icon: Truck,
      };
    case 2:
      return {
        label: 'In Transit',
        color: 'text-amber-600 dark:text-amber-400',
        bgColor:
          'bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700',
        icon: TrendingUp,
      };
    case 1:
      return {
        label: 'Picked Up',
        color: 'text-violet-600 dark:text-violet-400',
        bgColor:
          'bg-violet-100 dark:bg-violet-900/30 border-violet-300 dark:border-violet-700',
        icon: Package,
      };
    default:
      return {
        label: 'Pending',
        color: 'text-gray-600 dark:text-gray-400',
        bgColor:
          'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600',
        icon: Clock,
      };
  }
}

function getRouteIcon(routeIcon: number) {
  switch (routeIcon) {
    case 3:
      return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    case 2:
      return <Truck className="w-4 h-4 text-blue-500" />;
    case 1:
      return <Package className="w-4 h-4 text-violet-500" />;
    default:
      return <Warehouse className="w-4 h-4 text-amber-500" />;
  }
}

// ── Component ──────────────────────────────────────────────────

export default function FlashExpressTrackingModal({
  isOpen,
  onClose,
  trackingNumber,
  data,
  loading,
  error,
}: FlashExpressTrackingModalProps) {
  const [showSignInfo, setShowSignInfo] = useState(false);

  if (!isOpen) return null;

  const parcel = data?.list?.[0];
  const statusInfo = parcel ? getStateInfo(parcel.state) : null;
  const routes = parcel?.routes || [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-dark-surface rounded-2xl shadow-2xl overflow-hidden border border-border dark:border-dark-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ────────────────────────────────────────── */}
        <div className="flex items-center justify-between p-5 border-b border-border dark:border-dark-border bg-gradient-to-r from-primary-50 to-primary-100/50 dark:from-dark-surface-tertiary dark:to-dark-surface">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <Truck className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary dark:text-dark-text-primary">
                Flash Express Tracking
              </h3>
              <p className="text-xs text-text-muted dark:text-dark-text-muted font-mono mt-0.5">
                {trackingNumber}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-tertiary dark:hover:bg-dark-surface-tertiary transition-colors"
          >
            <XCircle className="w-5 h-5 text-text-muted dark:text-dark-text-muted" />
          </button>
        </div>

        {/* ── Body ──────────────────────────────────────────── */}
        <div className="p-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative">
                <Loader2 className="w-12 h-12 text-primary-600 dark:text-primary-400 animate-spin" />
                <div className="absolute inset-0 rounded-full bg-primary-500/10 animate-ping" />
              </div>
              <p className="text-sm text-text-secondary dark:text-dark-text-secondary mt-4">
                Fetching tracking data...
              </p>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
                <AlertCircle className="w-7 h-7 text-red-500" />
              </div>
              <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">
                Tracking Unavailable
              </p>
              <p className="text-xs text-text-muted dark:text-dark-text-muted max-w-xs">
                {error}
              </p>
            </div>
          )}

          {/* No data */}
          {!loading && !error && !parcel && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center mb-4">
                <Package className="w-7 h-7 text-amber-500" />
              </div>
              <p className="text-sm font-medium text-text-primary dark:text-dark-text-primary mb-1">
                No Tracking Information
              </p>
              <p className="text-xs text-text-muted dark:text-dark-text-muted max-w-xs">
                No tracking data available for this number yet. Please check
                back later.
              </p>
            </div>
          )}

          {/* Tracking Data */}
          {!loading && !error && parcel && statusInfo && (
            <div className="space-y-5">
              {/* ── Status Card ──────────────────────────────── */}
              <div className={`rounded-xl border p-4 ${statusInfo.bgColor}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/80 dark:bg-dark-surface/80 flex items-center justify-center shadow-sm">
                      <statusInfo.icon
                        className={`w-5 h-5 ${statusInfo.color}`}
                      />
                    </div>
                    <div>
                      <p className={`text-lg font-bold ${statusInfo.color}`}>
                        {statusInfo.label}
                      </p>
                      {parcel.store_phone && (
                        <p className="text-xs text-text-muted dark:text-dark-text-muted mt-0.5">
                          Store: {parcel.store_phone}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-text-muted dark:text-dark-text-muted">
                    {parcel.ticket_pickup_store_name || 'Flash Express'}
                  </span>
                </div>
              </div>

              {/* ── Route Info ───────────────────────────────── */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted dark:text-dark-text-muted mb-3 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" />
                  Shipment Route
                </h4>
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex-1 p-3 rounded-lg bg-surface-tertiary/50 dark:bg-dark-surface-tertiary/50 border border-border dark:border-dark-border">
                    <p className="text-[10px] uppercase tracking-wider text-text-muted dark:text-dark-text-muted mb-0.5">
                      Origin
                    </p>
                    <p className="font-medium text-text-primary dark:text-dark-text-primary">
                      {parcel.src_province_name || 'N/A'}
                    </p>
                  </div>
                  <TrendingUp className="w-4 h-4 text-text-muted dark:text-dark-text-muted shrink-0" />
                  <div className="flex-1 p-3 rounded-lg bg-surface-tertiary/50 dark:bg-dark-surface-tertiary/50 border border-border dark:border-dark-border">
                    <p className="text-[10px] uppercase tracking-wider text-text-muted dark:text-dark-text-muted mb-0.5">
                      Destination
                    </p>
                    <p className="font-medium text-text-primary dark:text-dark-text-primary">
                      {parcel.dst_province_name || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* ── Timeline ─────────────────────────────────── */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted dark:text-dark-text-muted mb-3 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  Tracking Timeline
                  <span className="text-[10px] font-normal normal-case ml-auto">
                    {routes.length} {routes.length === 1 ? 'event' : 'events'}
                  </span>
                </h4>

                <div className="relative">
                  {routes.map((event, idx) => {
                    const isLast = idx === routes.length - 1;
                    const isFirst = idx === 0;
                    return (
                      <div
                        key={idx}
                        className="relative pl-8 pb-5 last:pb-0 group"
                      >
                        {/* Timeline line */}
                        {!isLast && (
                          <div className="absolute left-[13px] top-5 bottom-0 w-0.5 bg-gradient-to-b from-primary-300 to-primary-100 dark:from-primary-700 dark:to-primary-900" />
                        )}

                        {/* Timeline dot */}
                        <div
                          className={`absolute left-[9px] top-1 w-[10px] h-[10px] rounded-full border-2 ${
                            isFirst
                              ? 'bg-primary-500 border-primary-200 dark:border-primary-800 shadow-sm shadow-primary-400/30'
                              : isLast
                                ? 'bg-emerald-500 border-emerald-200 dark:border-emerald-800 shadow-sm shadow-emerald-400/30'
                                : 'bg-white dark:bg-dark-surface border-gray-300 dark:border-gray-600'
                          }`}
                        />

                        {/* Event content */}
                        <div
                          className={`p-3 rounded-xl border ${
                            isFirst
                              ? 'bg-primary-50/80 dark:bg-primary-900/10 border-primary-200 dark:border-primary-800'
                              : isLast
                                ? 'bg-emerald-50/80 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800'
                                : 'bg-surface-secondary dark:bg-dark-surface-secondary border-border dark:border-dark-border'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <div className="mt-0.5 shrink-0">
                              {getRouteIcon(event.route_icon)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p
                                className={`text-sm leading-relaxed ${
                                  isFirst || isLast
                                    ? 'font-medium text-text-primary dark:text-dark-text-primary'
                                    : 'text-text-secondary dark:text-dark-text-secondary'
                                }`}
                              >
                                {event.message}
                              </p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-[11px] text-text-muted dark:text-dark-text-muted">
                                  {formatDateTime(event.routed_at)}
                                </span>
                                {event.staff_info_name && (
                                  <>
                                    <span className="text-[11px] text-text-muted">
                                      •
                                    </span>
                                    <span className="text-[11px] text-text-muted dark:text-dark-text-muted">
                                      {event.staff_info_name}
                                      {event.staff_info_phone &&
                                        ` (${event.staff_info_phone})`}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── Signature / Delivery Proof ────────────────── */}
              {parcel.sign_info && (
                <div className="border-t border-border dark:border-dark-border pt-4">
                  <button
                    onClick={() => setShowSignInfo(!showSignInfo)}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <div className="flex items-center gap-2">
                      <FileSignature className="w-4 h-4 text-text-muted dark:text-dark-text-muted" />
                      <span className="text-sm font-medium text-text-primary dark:text-dark-text-primary">
                        Delivery Proof
                      </span>
                    </div>
                    {showSignInfo ? (
                      <ChevronUp className="w-4 h-4 text-text-muted" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-text-muted" />
                    )}
                  </button>

                  {showSignInfo && (
                    <div className="mt-3 space-y-3">
                      {parcel.sign_info.signer_show && (
                        <div className="text-sm">
                          <span className="text-text-muted dark:text-dark-text-muted text-xs">
                            Signed by:
                          </span>{' '}
                          <span className="font-medium text-text-primary dark:text-dark-text-primary">
                            {parcel.sign_info.signer_show}
                          </span>
                        </div>
                      )}

                      {parcel.sign_info.image_url_list?.map((img, idx) =>
                        img.other_image_url ? (
                          <div
                            key={idx}
                            className="rounded-xl overflow-hidden border border-border dark:border-dark-border bg-surface-tertiary/50 dark:bg-dark-surface-tertiary/50"
                          >
                            <img
                              src={img.other_image_url}
                              alt={`Delivery proof ${idx + 1}`}
                              className="w-full h-auto max-h-64 object-contain"
                              loading="lazy"
                            />
                            {img.other_image_url_th && (
                              <a
                                href={img.other_image_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-center text-xs text-primary-600 dark:text-primary-400 py-2 hover:underline"
                              >
                                <ImageIcon className="w-3 h-3 inline mr-1" />
                                View full image
                              </a>
                            )}
                          </div>
                        ) : null,
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ── Error Search List ─────────────────────────── */}
              {data?.error_search && data.error_search.length > 0 && (
                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800">
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    The following tracking numbers were not found:{' '}
                    {data.error_search.join(', ')}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
