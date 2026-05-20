import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

// Facebook icon component
function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export function Contact() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <Mail className="w-16 h-16 mx-auto text-primary-600 dark:text-primary-400 mb-4" />
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-text-primary dark:text-dark-text-primary mb-4">
          Contact Us
        </h1>
        <p className="text-lg text-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
          Have questions about our products or need assistance? We're here to
          help! Reach out to us through any of the channels below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Contact Information */}
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="font-serif text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-6">
              Get In Touch
            </h2>

            {/* Email */}
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-lg">
                <Mail className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary dark:text-dark-text-primary mb-1">
                  Email
                </h3>
                <a
                  href="mailto:desilva.sam17.sgds@gmail.com"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  desilva.sam17.sgds@gmail.com
                </a>
                <p className="text-sm text-text-muted dark:text-dark-text-muted mt-1">
                  We'll respond within 24 hours
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-lg">
                <Phone className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary dark:text-dark-text-primary mb-1">
                  Phone / Text
                </h3>
                <a
                  href="tel:+639480140546"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  +63 948 014 0546
                </a>
                <p className="text-sm text-text-muted dark:text-dark-text-muted mt-1">
                  Mon-Sat, 9:00 AM - 6:00 PM
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-lg">
                <MapPin className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary dark:text-dark-text-primary mb-1">
                  Address
                </h3>
                <p className="text-text-secondary dark:text-dark-text-secondary">
                  Purok 6, Dulangan
                  <br />
                  San Luis, Batangas
                  <br />
                  Philippines, 4210
                </p>
              </div>
            </div>

            {/* Business Hours */}
            <div className="flex items-start gap-4">
              <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary dark:text-dark-text-primary mb-1">
                  Business Hours
                </h3>
                <div className="text-text-secondary dark:text-dark-text-secondary text-sm space-y-1">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 9:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="card p-6">
            <h2 className="font-serif text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-4">
              Follow Us on Social Media
            </h2>
            <p className="text-text-secondary dark:text-dark-text-secondary mb-6">
              Stay connected for updates, promotions, and airgun tips!
            </p>

            <div className="space-y-4">
              {/* Personal Facebook */}
              <a
                href="https://www.facebook.com/alisha.samantha01"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-surface-secondary dark:bg-dark-surface-secondary rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors group"
              >
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                  <FacebookIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary dark:text-dark-text-primary">
                    Personal Facebook
                  </h3>
                  <p className="text-sm text-text-muted dark:text-dark-text-muted">
                    @alisha.samantha01
                  </p>
                </div>
              </a>

              {/* Facebook Page */}
              <a
                href="https://www.facebook.com/profile.php?id=61587336478141"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-surface-secondary dark:bg-dark-surface-secondary rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors group"
              >
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                  <FacebookIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary dark:text-dark-text-primary">
                    PrimeShot Facebook Page
                  </h3>
                  <p className="text-sm text-text-muted dark:text-dark-text-muted">
                    Official Business Page
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="card p-6">
          <h2 className="font-serif text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-2">
            Send Us a Message
          </h2>
          <p className="text-text-secondary dark:text-dark-text-secondary mb-6">
            Fill out the form below and we'll get back to you as soon as
            possible.
          </p>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 mb-6 rounded-r-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Note:</strong> Contact form functionality is currently
              being set up. For immediate assistance, please use email or phone
              above.
            </p>
          </div>

          <form className="space-y-4">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-2"
              >
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                disabled
                className="input-field opacity-60 cursor-not-allowed"
                placeholder="Juan Dela Cruz"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-2"
              >
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                disabled
                className="input-field opacity-60 cursor-not-allowed"
                placeholder="juan@example.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-2"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                disabled
                className="input-field opacity-60 cursor-not-allowed"
                placeholder="+63 912 345 6789"
              />
            </div>

            {/* Subject */}
            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-2"
              >
                Subject *
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                disabled
                className="input-field opacity-60 cursor-not-allowed"
                placeholder="Product inquiry"
              />
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-2"
              >
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                disabled
                className="input-field opacity-60 cursor-not-allowed resize-none"
                placeholder="Tell us how we can help you..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled
              className="btn-primary w-full opacity-60 cursor-not-allowed"
            >
              <Send className="w-4 h-4 mr-2" />
              Send Message (Coming Soon)
            </button>
          </form>
        </div>
      </div>

      {/* FAQ CTA */}
      <div className="p-8 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-xl border border-primary-200 dark:border-primary-800 text-center">
        <h3 className="font-serif text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-3">
          Looking for Quick Answers?
        </h3>
        <p className="text-text-secondary dark:text-dark-text-secondary mb-6">
          Check out our FAQ page for answers to common questions about products,
          shipping, and returns.
        </p>
        <a href="/faq" className="btn-primary inline-flex items-center gap-2">
          View FAQ
        </a>
      </div>
    </div>
  );
}
