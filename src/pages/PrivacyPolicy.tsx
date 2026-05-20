import { Shield, Lock, Eye, FileText, UserCheck, Database } from 'lucide-react';

export function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <Shield className="w-16 h-16 mx-auto text-primary-600 dark:text-primary-400 mb-4" />
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-text-primary dark:text-dark-text-primary mb-4">
          Privacy Policy
        </h1>
        <p className="text-lg text-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
          Your privacy is important to us. This policy explains how we collect,
          use, and protect your personal information in compliance with the Data
          Privacy Act of 2012 (Republic Act No. 10173).
        </p>
        <p className="text-sm text-text-muted dark:text-dark-text-muted mt-4">
          Last Updated: May 20, 2026
        </p>
      </div>

      {/* Introduction */}
      <div className="card p-6 mb-8">
        <p className="text-text-secondary dark:text-dark-text-secondary leading-relaxed">
          PrimeShot Premium Pellet/Slugs ("we," "our," or "us") is committed to
          protecting your privacy and ensuring the security of your personal
          information. This Privacy Policy describes how we collect, use,
          disclose, and safeguard your information when you visit our website
          and make purchases from our online store.
        </p>
      </div>

      {/* Information We Collect */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Database className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          <h2 className="font-serif text-3xl font-bold text-text-primary dark:text-dark-text-primary">
            Information We Collect
          </h2>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-semibold text-xl text-text-primary dark:text-dark-text-primary mb-3">
              Personal Information
            </h3>
            <p className="text-text-secondary dark:text-dark-text-secondary mb-3">
              When you create an account or place an order, we collect:
            </p>
            <ul className="space-y-2 text-text-secondary dark:text-dark-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-primary-600 dark:text-primary-400 mt-1">
                  •
                </span>
                <span>Full name and nickname</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 dark:text-primary-400 mt-1">
                  •
                </span>
                <span>Email address</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 dark:text-primary-400 mt-1">
                  •
                </span>
                <span>Phone number</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 dark:text-primary-400 mt-1">
                  •
                </span>
                <span>
                  Shipping address (street, barangay, city, province, zip code)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 dark:text-primary-400 mt-1">
                  •
                </span>
                <span>Payment information (processed securely)</span>
              </li>
            </ul>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-xl text-text-primary dark:text-dark-text-primary mb-3">
              Automatically Collected Information
            </h3>
            <p className="text-text-secondary dark:text-dark-text-secondary mb-3">
              When you visit our website, we automatically collect:
            </p>
            <ul className="space-y-2 text-text-secondary dark:text-dark-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-primary-600 dark:text-primary-400 mt-1">
                  •
                </span>
                <span>IP address and browser type</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 dark:text-primary-400 mt-1">
                  •
                </span>
                <span>Device information and operating system</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 dark:text-primary-400 mt-1">
                  •
                </span>
                <span>Pages visited and time spent on our site</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 dark:text-primary-400 mt-1">
                  •
                </span>
                <span>Referring website and search terms used</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* How We Use Your Information */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          <h2 className="font-serif text-3xl font-bold text-text-primary dark:text-dark-text-primary">
            How We Use Your Information
          </h2>
        </div>

        <div className="card p-6">
          <p className="text-text-secondary dark:text-dark-text-secondary mb-4">
            We use your personal information for the following purposes:
          </p>
          <ul className="space-y-3 text-text-secondary dark:text-dark-text-secondary">
            <li className="flex items-start gap-2">
              <span className="text-primary-600 dark:text-primary-400 mt-1">
                ✓
              </span>
              <span>
                <strong>Order Processing:</strong> To process and fulfill your
                orders, including shipping and delivery
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 dark:text-primary-400 mt-1">
                ✓
              </span>
              <span>
                <strong>Communication:</strong> To send order confirmations,
                shipping updates, and respond to inquiries
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 dark:text-primary-400 mt-1">
                ✓
              </span>
              <span>
                <strong>Account Management:</strong> To create and maintain your
                account and provide customer support
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 dark:text-primary-400 mt-1">
                ✓
              </span>
              <span>
                <strong>Marketing:</strong> To send promotional emails about new
                products and special offers (with your consent)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 dark:text-primary-400 mt-1">
                ✓
              </span>
              <span>
                <strong>Improvement:</strong> To analyze website usage and
                improve our products and services
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 dark:text-primary-400 mt-1">
                ✓
              </span>
              <span>
                <strong>Legal Compliance:</strong> To comply with Philippine
                laws and regulations
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* Data Protection */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          <h2 className="font-serif text-3xl font-bold text-text-primary dark:text-dark-text-primary">
            How We Protect Your Information
          </h2>
        </div>

        <div className="card p-6">
          <p className="text-text-secondary dark:text-dark-text-secondary mb-4">
            We implement appropriate technical and organizational security
            measures to protect your personal information:
          </p>
          <ul className="space-y-3 text-text-secondary dark:text-dark-text-secondary">
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400 mt-1">
                🔒
              </span>
              <span>Secure SSL encryption for all data transmission</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400 mt-1">
                🔒
              </span>
              <span>Secure database storage with access controls</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400 mt-1">
                🔒
              </span>
              <span>Regular security audits and updates</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400 mt-1">
                🔒
              </span>
              <span>Limited employee access to personal information</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400 mt-1">
                🔒
              </span>
              <span>Secure payment processing through trusted providers</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Your Rights */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <UserCheck className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          <h2 className="font-serif text-3xl font-bold text-text-primary dark:text-dark-text-primary">
            Your Rights Under Philippine Law
          </h2>
        </div>

        <div className="card p-6">
          <p className="text-text-secondary dark:text-dark-text-secondary mb-4">
            Under the Data Privacy Act of 2012, you have the following rights:
          </p>
          <ul className="space-y-3 text-text-secondary dark:text-dark-text-secondary">
            <li className="flex items-start gap-2">
              <span className="text-primary-600 dark:text-primary-400 mt-1">
                ✓
              </span>
              <span>
                <strong>Right to be Informed:</strong> You have the right to
                know how your data is being collected and used
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 dark:text-primary-400 mt-1">
                ✓
              </span>
              <span>
                <strong>Right to Access:</strong> You can request a copy of your
                personal information we hold
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 dark:text-primary-400 mt-1">
                ✓
              </span>
              <span>
                <strong>Right to Correction:</strong> You can request
                corrections to inaccurate or incomplete data
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 dark:text-primary-400 mt-1">
                ✓
              </span>
              <span>
                <strong>Right to Erasure:</strong> You can request deletion of
                your personal information (subject to legal requirements)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 dark:text-primary-400 mt-1">
                ✓
              </span>
              <span>
                <strong>Right to Object:</strong> You can object to processing
                of your data for marketing purposes
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 dark:text-primary-400 mt-1">
                ✓
              </span>
              <span>
                <strong>Right to Data Portability:</strong> You can request your
                data in a structured, commonly used format
              </span>
            </li>
          </ul>
          <p className="text-text-secondary dark:text-dark-text-secondary mt-4">
            To exercise any of these rights, please contact us at{' '}
            <a
              href="mailto:desilva.sam17.sgds@gmail.com"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              desilva.sam17.sgds@gmail.com
            </a>
          </p>
        </div>
      </section>

      {/* Information Sharing */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Eye className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          <h2 className="font-serif text-3xl font-bold text-text-primary dark:text-dark-text-primary">
            Information Sharing and Disclosure
          </h2>
        </div>

        <div className="card p-6">
          <p className="text-text-secondary dark:text-dark-text-secondary mb-4">
            We do not sell, trade, or rent your personal information to third
            parties. We may share your information only in the following
            circumstances:
          </p>
          <ul className="space-y-3 text-text-secondary dark:text-dark-text-secondary">
            <li className="flex items-start gap-2">
              <span className="text-primary-600 dark:text-primary-400 mt-1">
                •
              </span>
              <span>
                <strong>Service Providers:</strong> With courier services for
                order delivery and payment processors for transactions
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 dark:text-primary-400 mt-1">
                •
              </span>
              <span>
                <strong>Legal Requirements:</strong> When required by Philippine
                law or to protect our legal rights
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 dark:text-primary-400 mt-1">
                •
              </span>
              <span>
                <strong>Business Transfers:</strong> In the event of a merger,
                acquisition, or sale of assets
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* Cookies */}
      <section className="mb-12">
        <div className="card p-6">
          <h3 className="font-semibold text-xl text-text-primary dark:text-dark-text-primary mb-3">
            Cookies and Tracking Technologies
          </h3>
          <p className="text-text-secondary dark:text-dark-text-secondary mb-3">
            We use cookies and similar tracking technologies to enhance your
            browsing experience, analyze site traffic, and understand user
            preferences. You can control cookie settings through your browser
            preferences.
          </p>
        </div>
      </section>

      {/* Data Retention */}
      <section className="mb-12">
        <div className="card p-6">
          <h3 className="font-semibold text-xl text-text-primary dark:text-dark-text-primary mb-3">
            Data Retention
          </h3>
          <p className="text-text-secondary dark:text-dark-text-secondary">
            We retain your personal information for as long as necessary to
            fulfill the purposes outlined in this policy, comply with legal
            obligations, resolve disputes, and enforce our agreements. Account
            information is retained until you request deletion, while order
            information is kept for 5 years as required by Philippine tax and
            business laws.
          </p>
        </div>
      </section>

      {/* Children's Privacy */}
      <section className="mb-12">
        <div className="card p-6">
          <h3 className="font-semibold text-xl text-text-primary dark:text-dark-text-primary mb-3">
            Children's Privacy
          </h3>
          <p className="text-text-secondary dark:text-dark-text-secondary">
            Our services are not intended for individuals under 18 years of age.
            We do not knowingly collect personal information from minors. If you
            are a parent or guardian and believe your child has provided us with
            personal information, please contact us immediately.
          </p>
        </div>
      </section>

      {/* Changes to Policy */}
      <section className="mb-12">
        <div className="card p-6">
          <h3 className="font-semibold text-xl text-text-primary dark:text-dark-text-primary mb-3">
            Changes to This Privacy Policy
          </h3>
          <p className="text-text-secondary dark:text-dark-text-secondary">
            We may update this Privacy Policy from time to time to reflect
            changes in our practices or legal requirements. We will notify you
            of any material changes by posting the new policy on this page and
            updating the "Last Updated" date. Your continued use of our services
            after such changes constitutes acceptance of the updated policy.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="mb-12">
        <div className="card p-6 bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-200 dark:border-primary-800">
          <h3 className="font-semibold text-xl text-text-primary dark:text-dark-text-primary mb-3">
            Contact Us
          </h3>
          <p className="text-text-secondary dark:text-dark-text-secondary mb-4">
            If you have any questions, concerns, or requests regarding this
            Privacy Policy or our data practices, please contact us:
          </p>
          <div className="space-y-2 text-text-secondary dark:text-dark-text-secondary">
            <p>
              <strong>Email:</strong>{' '}
              <a
                href="mailto:desilva.sam17.sgds@gmail.com"
                className="text-primary-600 dark:text-primary-400 hover:underline"
              >
                desilva.sam17.sgds@gmail.com
              </a>
            </p>
            <p>
              <strong>Phone:</strong>{' '}
              <a
                href="tel:+639480140546"
                className="text-primary-600 dark:text-primary-400 hover:underline"
              >
                +63 948 014 0546
              </a>
            </p>
            <p>
              <strong>Address:</strong> Purok 6, Dulangan, San Luis, Batangas,
              Philippines, 4210
            </p>
          </div>
        </div>
      </section>

      {/* Legal Compliance */}
      <div className="card p-6 bg-surface-secondary dark:bg-dark-surface-secondary">
        <p className="text-sm text-text-secondary dark:text-dark-text-secondary leading-relaxed">
          This Privacy Policy is designed to comply with the{' '}
          <strong>Data Privacy Act of 2012 (Republic Act No. 10173)</strong> and
          its Implementing Rules and Regulations. PrimeShot Premium Pellet/Slugs
          is committed to protecting your privacy rights as a Filipino consumer
          and data subject.
        </p>
      </div>
    </div>
  );
}
