import { Package, RotateCcw, Shield, Video, AlertCircle } from 'lucide-react';

export function ShippingReturns() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <Package className="w-16 h-16 mx-auto text-primary-600 dark:text-primary-400 mb-4" />
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-text-primary dark:text-dark-text-primary mb-4">
          Shipping & Returns Policy
        </h1>
        <p className="text-lg text-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
          Your satisfaction is our priority. Learn about our shipping process
          and return policy in accordance with Philippine consumer protection
          laws.
        </p>
      </div>

      {/* Shipping Policy */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Package className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          <h2 className="font-serif text-3xl font-bold text-text-primary dark:text-dark-text-primary">
            Shipping Policy
          </h2>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-semibold text-xl text-text-primary dark:text-dark-text-primary mb-3">
              Delivery Timeframes
            </h3>
            <ul className="space-y-2 text-text-secondary dark:text-dark-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-primary-600 dark:text-primary-400 mt-1">
                  •
                </span>
                <span>
                  <strong>Metro Manila:</strong> 2-3 business days
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 dark:text-primary-400 mt-1">
                  •
                </span>
                <span>
                  <strong>Luzon Provinces:</strong> 3-5 business days
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 dark:text-primary-400 mt-1">
                  •
                </span>
                <span>
                  <strong>Visayas & Mindanao:</strong> 5-7 business days
                </span>
              </li>
            </ul>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-xl text-text-primary dark:text-dark-text-primary mb-3">
              Shipping Fees
            </h3>
            <p className="text-text-secondary dark:text-dark-text-secondary mb-3">
              Shipping fees are based on your delivery location:
            </p>
            <ul className="space-y-2 text-text-secondary dark:text-dark-text-secondary mb-4">
              <li className="flex items-start gap-2">
                <span className="text-primary-600 dark:text-primary-400 mt-1">
                  •
                </span>
                <span>
                  <strong>Luzon:</strong> ₱100
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 dark:text-primary-400 mt-1">
                  •
                </span>
                <span>
                  <strong>Visayas:</strong> ₱150
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 dark:text-primary-400 mt-1">
                  •
                </span>
                <span>
                  <strong>Mindanao:</strong> ₱200
                </span>
              </li>
            </ul>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-green-800 dark:text-green-200 font-semibold">
                🎉 FREE SHIPPING on orders with 3 items or more!
              </p>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-xl text-text-primary dark:text-dark-text-primary mb-3">
              Order Processing
            </h3>
            <p className="text-text-secondary dark:text-dark-text-secondary">
              Orders are processed within 1-2 business days. You will receive a
              confirmation email with tracking information once your order
              ships. All shipments are handled by trusted courier services to
              ensure safe delivery of your ammunition.
            </p>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-xl text-text-primary dark:text-dark-text-primary mb-3">
              Shipping Restrictions
            </h3>
            <p className="text-text-secondary dark:text-dark-text-secondary">
              We currently ship only within the Philippines. All shipments
              comply with Philippine laws and regulations regarding airgun
              ammunition. Proper identification and documentation may be
              required upon delivery as per local ordinances.
            </p>
          </div>
        </div>
      </section>

      {/* Returns Policy */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <RotateCcw className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          <h2 className="font-serif text-3xl font-bold text-text-primary dark:text-dark-text-primary">
            Returns & Refunds Policy
          </h2>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-6 mb-6 rounded-r-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                Important: Unopened Tins Only
              </h3>
              <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                In accordance with Philippine consumer protection laws and for
                safety reasons, we can only accept returns for{' '}
                <strong>unopened tins</strong>. Once a tin is opened, it cannot
                be returned or refunded.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-semibold text-xl text-text-primary dark:text-dark-text-primary mb-3">
              Return Eligibility
            </h3>
            <ul className="space-y-3 text-text-secondary dark:text-dark-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-primary-600 dark:text-primary-400 mt-1">
                  ✓
                </span>
                <span>
                  Returns must be initiated within <strong>7 days</strong> of
                  delivery
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 dark:text-primary-400 mt-1">
                  ✓
                </span>
                <span>Product tins must be completely unopened and sealed</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 dark:text-primary-400 mt-1">
                  ✓
                </span>
                <span>
                  Original packaging and labels must be intact and undamaged
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 dark:text-primary-400 mt-1">
                  ✓
                </span>
                <span>
                  Proof of purchase (order number or receipt) required
                </span>
              </li>
            </ul>
          </div>

          <div className="card p-6 border-2 border-red-200 dark:border-red-800">
            <div className="flex items-start gap-3 mb-4">
              <Video className="w-8 h-8 text-red-600 dark:text-red-400 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-xl text-text-primary dark:text-dark-text-primary mb-2">
                  Defective or Damaged Products
                </h3>
                <p className="text-text-secondary dark:text-dark-text-secondary mb-3">
                  If you receive a defective or damaged product, you must
                  provide video evidence to process your return or replacement.
                </p>
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                Video Proof Requirements:
              </h4>
              <ul className="space-y-2 text-sm text-red-800 dark:text-red-200">
                <li className="flex items-start gap-2">
                  <span className="mt-1">1.</span>
                  <span>
                    Record a continuous, unedited video of the unboxing process
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">2.</span>
                  <span>Clearly show the sealed package before opening</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">3.</span>
                  <span>Display the shipping label and order details</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">4.</span>
                  <span>Show the defect or damage clearly in the video</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">5.</span>
                  <span>
                    Contact us within 24 hours of delivery with your video
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-xl text-text-primary dark:text-dark-text-primary mb-3">
              Refund Process
            </h3>
            <ol className="space-y-3 text-text-secondary dark:text-dark-text-secondary">
              <li className="flex items-start gap-3">
                <span className="font-bold text-primary-600 dark:text-primary-400">
                  1.
                </span>
                <span>
                  Contact our customer service team with your order number and
                  reason for return
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-primary-600 dark:text-primary-400">
                  2.
                </span>
                <span>
                  Await approval and return instructions (include video if
                  claiming defect)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-primary-600 dark:text-primary-400">
                  3.
                </span>
                <span>Ship the item back using our provided instructions</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-primary-600 dark:text-primary-400">
                  4.
                </span>
                <span>
                  Once received and inspected, refunds are processed within 5-7
                  business days
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-primary-600 dark:text-primary-400">
                  5.
                </span>
                <span>
                  Refunds will be issued to your original payment method
                </span>
              </li>
            </ol>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-xl text-text-primary dark:text-dark-text-primary mb-3">
              Non-Returnable Items
            </h3>
            <ul className="space-y-2 text-text-secondary dark:text-dark-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-red-600 dark:text-red-400 mt-1">✗</span>
                <span>Opened tins or packages</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 dark:text-red-400 mt-1">✗</span>
                <span>Products damaged due to misuse or improper storage</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 dark:text-red-400 mt-1">✗</span>
                <span>Items without proof of purchase</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 dark:text-red-400 mt-1">✗</span>
                <span>Products returned after 7 days from delivery</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Legal Compliance */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          <h2 className="font-serif text-3xl font-bold text-text-primary dark:text-dark-text-primary">
            Legal Compliance
          </h2>
        </div>

        <div className="card p-6">
          <p className="text-text-secondary dark:text-dark-text-secondary leading-relaxed mb-4">
            This policy complies with the{' '}
            <strong>
              Consumer Act of the Philippines (Republic Act No. 7394)
            </strong>{' '}
            and the <strong>E-Commerce Act (Republic Act No. 8792)</strong>. We
            are committed to protecting consumer rights while maintaining
            product safety and quality standards.
          </p>
          <p className="text-text-secondary dark:text-dark-text-secondary leading-relaxed">
            All transactions are subject to Philippine laws and regulations. By
            making a purchase, you acknowledge that you are of legal age and
            authorized to purchase airgun ammunition in accordance with local
            ordinances.
          </p>
        </div>
      </section>

      {/* Contact CTA */}
      <div className="p-8 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-xl border border-primary-200 dark:border-primary-800 text-center">
        <h3 className="font-serif text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-3">
          Need Help with a Return?
        </h3>
        <p className="text-text-secondary dark:text-dark-text-secondary mb-6">
          Our customer service team is ready to assist you with any questions or
          concerns about shipping and returns.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/contact" className="btn-primary">
            Contact Support
          </a>
          <a href="/faq" className="btn-secondary">
            View FAQ
          </a>
        </div>
      </div>
    </div>
  );
}
