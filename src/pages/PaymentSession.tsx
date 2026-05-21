import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Clock,
  Copy,
  Check,
  X,
  ArrowLeft,
  Upload,
  Loader2,
  ShoppingCart,
} from 'lucide-react';
import { PAYMENT_INFO } from '@/constants/enums';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/utils/format';

// ── Receipt Upload Modal ──────────────────────────────────────
function ReceiptUploadModal({
  isOpen,
  onClose,
  onUpload,
  isUploading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
  isUploading: boolean;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
      setPreview(null);
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative w-full max-w-md bg-white dark:bg-dark-surface rounded-2xl shadow-2xl p-6 z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-lg font-bold text-text-primary dark:text-dark-text-primary">
            Upload GCash Receipt
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-surface-tertiary dark:hover:bg-dark-surface-tertiary transition-colors"
          >
            <X className="w-5 h-5 text-text-muted dark:text-dark-text-muted" />
          </button>
        </div>

        <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-4">
          Please upload a screenshot or image of your GCash payment receipt so
          we can verify your payment.
        </p>

        {/* File input area */}
        <label className="block w-full cursor-pointer">
          <div className="border-2 border-dashed border-border dark:border-dark-border rounded-xl p-6 text-center hover:border-primary-500 dark:hover:border-primary-400 transition-colors">
            {preview ? (
              <img
                src={preview}
                alt="Receipt preview"
                className="max-h-48 mx-auto rounded-lg object-contain"
              />
            ) : (
              <div>
                <Upload className="w-10 h-10 mx-auto text-text-muted dark:text-dark-text-muted mb-2" />
                <p className="text-sm font-medium text-text-primary dark:text-dark-text-primary">
                  Click to select receipt image
                </p>
                <p className="text-xs text-text-muted dark:text-dark-text-muted mt-1">
                  PNG, JPG, or WEBP
                </p>
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

        {selectedFile && (
          <p className="text-xs text-text-secondary dark:text-dark-text-secondary mt-2 truncate">
            Selected: {selectedFile.name}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-5">
          <button
            onClick={onClose}
            className="btn-secondary flex-1 flex items-center justify-center gap-2"
            disabled={isUploading}
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
          <button
            onClick={() => selectedFile && onUpload(selectedFile)}
            disabled={!selectedFile || isUploading}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Upload & Confirm
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main PaymentSession Page ─────────────────────────────────
export function PaymentSession() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const {
    items,
    selectedItems,
    getSelectedTotal,
    getSelectedItemCount,
    getTotal,
    getItemCount,
    removeItem,
    clearCart,
  } = useCartStore();

  // Session timer (60 minutes from now)
  const expiresAt = PAYMENT_INFO.SESSION_DURATION * 60; // seconds
  const [timeLeft, setTimeLeft] = useState(expiresAt);
  const [isExpired, setIsExpired] = useState(false);

  // Receipt modal state
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Copy GCash number
  const [copied, setCopied] = useState(false);
  const copyNumber = useCallback(() => {
    navigator.clipboard.writeText(PAYMENT_INFO.GCASH_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Which items are being purchased
  const checkoutItems =
    selectedItems.size > 0
      ? items.filter((item) => selectedItems.has(item.id))
      : items;
  const total = selectedItems.size > 0 ? getSelectedTotal() : getTotal();
  const itemCount =
    selectedItems.size > 0 ? getSelectedItemCount() : getItemCount();

  // Cancel order session
  const handleCancel = () => {
    navigate('/cart');
  };

  // Handle receipt upload + order creation
  const handleReceiptUpload = async (file: File) => {
    if (!user) {
      setError('Please sign in first.');
      return;
    }
    if (checkoutItems.length === 0) {
      setError('Your cart is empty.');
      return;
    }
    if (isExpired) {
      setError('This payment session has expired. Please try again.');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // 1. Upload receipt to Supabase Storage
      const fileExt = file.name.split('.').pop() || 'png';
      const fileName = `receipts/${user.id}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('primeshot')
        .upload(fileName, file);

      if (uploadError) throw new Error(uploadError.message);

      // 2. Get public URL for the receipt
      const { data: publicUrlData } = supabase.storage
        .from('primeshot')
        .getPublicUrl(fileName);
      const receiptUrl = publicUrlData?.publicUrl || '';

      // 3. Build shipping address
      const shippingAddress =
        [user.street, user.barangay, user.city, user.province, user.zipcode]
          .filter(Boolean)
          .join(', ') || null;

      // 4. Create the order with status "for_verification"
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          customer_email: user.email,
          customer_name:
            `${user.firstname || ''} ${user.lastname || ''}`.trim() || null,
          total,
          status: 'for_verification',
          shipping_address: shippingAddress,
          payment_receipt_url: receiptUrl,
        })
        .select('id')
        .single();

      if (orderError) throw new Error(orderError.message);

      // 5. Insert order items with grains, diameter, caliber
      const orderItems = checkoutItems.map((item) => ({
        order_id: order.id,
        product_name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        grains: item.product.grains || null,
        diameter: item.product.diameter || null,
        caliber: item.product.caliber || null,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw new Error(itemsError.message);

      // 6. Remove ordered items from cart
      checkoutItems.forEach((item) => {
        removeItem(item.product_id);
      });

      setSuccess(true);

      // 7. Redirect to orders page after a brief moment
      setTimeout(() => {
        navigate('/orders');
      }, 1500);
    } catch (err: any) {
      console.error('[PaymentSession] Error:', err);
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsUploading(false);
      setShowReceiptModal(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <button
        onClick={() => navigate('/cart')}
        className="flex items-center gap-1 text-sm text-text-muted dark:text-dark-text-muted hover:text-text-primary dark:hover:text-dark-text-primary transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Cart
      </button>

      <h1 className="section-title mb-2">Payment Session</h1>
      <p className="section-subtitle mb-8">
        Complete your payment within the session window
      </p>

      {success ? (
        /* ── Success state ─────────────────────────────────── */
        <div className="max-w-lg mx-auto text-center py-12">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="font-serif text-xl font-bold text-text-primary dark:text-dark-text-primary mb-2">
            Order Placed Successfully!
          </h2>
          <p className="text-text-secondary dark:text-dark-text-secondary mb-6">
            Your order is now <strong>For Verification</strong>. We'll review
            your payment receipt and update the status shortly.
          </p>
          <button
            onClick={() => navigate('/orders')}
            className="btn-primary inline-flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            View My Orders
          </button>
        </div>
      ) : (
        /* ── Payment session ───────────────────────────────── */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: GCash Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Timer */}
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-lg font-bold text-text-primary dark:text-dark-text-primary">
                  Session Timer
                </h2>
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-lg font-bold font-mono ${
                    isExpired
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                      : timeLeft <= 300
                        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                        : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                  }`}
                >
                  <Clock className="w-5 h-5" />
                  {isExpired ? 'EXPIRED' : formatTime(timeLeft)}
                </span>
              </div>
              <p className="text-xs text-text-muted dark:text-dark-text-muted mt-2">
                You have {PAYMENT_INFO.SESSION_DURATION} hour to complete your
                payment. If the timer expires, please start over.
              </p>
            </div>

            {/* GCash Payment Details */}
            <div className="card p-6">
              <h2 className="font-serif text-lg font-bold text-text-primary dark:text-dark-text-primary mb-4">
                Pay via GCash
              </h2>

              {/* QR Code placeholder */}
              <div className="mb-6 p-6 bg-white rounded-xl flex items-center justify-center border border-border dark:border-dark-border">
                <div className="text-center">
                  <div className="w-48 h-48 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">
                      GCash QR
                    </span>
                  </div>
                  <p className="text-xs text-text-muted dark:text-dark-text-muted">
                    Scan to pay via GCash app
                  </p>
                </div>
              </div>

              {/* GCash Name */}
              <div className="mb-4">
                <label className="block text-xs text-text-muted dark:text-dark-text-muted uppercase tracking-wider mb-1">
                  GCash Account Name
                </label>
                <p className="text-lg font-bold text-text-primary dark:text-dark-text-primary">
                  {PAYMENT_INFO.GCASH_NAME}
                </p>
              </div>

              {/* GCash Number with Copy */}
              <div>
                <label className="block text-xs text-text-muted dark:text-dark-text-muted uppercase tracking-wider mb-1">
                  GCash Number
                </label>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold text-text-primary dark:text-dark-text-primary font-mono">
                    {PAYMENT_INFO.GCASH_NUMBER}
                  </p>
                  <button
                    onClick={copyNumber}
                    className="p-2 rounded-lg bg-surface-secondary dark:bg-dark-surface-secondary hover:bg-surface-tertiary dark:hover:bg-dark-surface-tertiary transition-colors"
                    title="Copy number"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-text-muted dark:text-dark-text-muted" />
                    )}
                  </button>
                </div>
                {copied && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    Copied to clipboard!
                  </p>
                )}
              </div>
            </div>

            {/* Instructions */}
            <div className="card p-6">
              <h2 className="font-serif text-lg font-bold text-text-primary dark:text-dark-text-primary mb-3">
                How to Pay
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-sm text-text-secondary dark:text-dark-text-secondary">
                <li>Open your GCash app</li>
                <li>
                  Send the exact amount of{' '}
                  <strong className="text-text-primary dark:text-dark-text-primary">
                    {formatPrice(total)}
                  </strong>{' '}
                  to <strong>{PAYMENT_INFO.GCASH_NAME}</strong> (
                  {PAYMENT_INFO.GCASH_NUMBER})
                </li>
                <li>Take a screenshot of your successful payment receipt</li>
                <li>
                  Click <strong>"I Already Paid"</strong> below and upload the
                  screenshot
                </li>
                <li>
                  Wait for admin to verify your payment (status will update to
                  "Paid")
                </li>
              </ol>
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}
          </div>

          {/* Right: Summary & Actions */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24 space-y-4">
              <h2 className="font-serif text-xl font-bold text-text-primary dark:text-dark-text-primary">
                Order Summary
              </h2>

              {/* Items */}
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {checkoutItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-text-secondary dark:text-dark-text-secondary truncate mr-2">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="text-text-primary dark:text-dark-text-primary font-medium whitespace-nowrap">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <hr className="border-border dark:border-dark-border" />

              <div className="flex justify-between font-bold text-text-primary dark:text-dark-text-primary">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => setShowReceiptModal(true)}
                  disabled={isExpired}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />I Already Paid
                </button>

                <button
                  onClick={handleCancel}
                  className="btn-secondary w-full flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>

              {isExpired && (
                <p className="text-xs text-center text-red-500 dark:text-red-400">
                  Session expired. Please go back to cart and try again.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Receipt Upload Modal */}
      <ReceiptUploadModal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        onUpload={handleReceiptUpload}
        isUploading={isUploading}
      />
    </div>
  );
}
