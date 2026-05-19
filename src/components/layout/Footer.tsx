import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Target, Crosshair, Globe } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-surface-secondary dark:bg-dark-surface-secondary border-t border-border dark:border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link
              to="/"
              className="font-serif text-2xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent"
            >
              PrimeShot
            </Link>
            <p className="mt-3 text-sm text-text-secondary dark:text-dark-text-secondary">
              Premium airgun pellets and slugs for precision shooters and
              enthusiasts alike.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a
                href="#"
                className="btn-ghost p-2 rounded-full"
                aria-label="Target"
              >
                <Target className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="btn-ghost p-2 rounded-full"
                aria-label="Crosshair"
              >
                <Crosshair className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="btn-ghost p-2 rounded-full"
                aria-label="Website"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-text-primary dark:text-dark-text-primary mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {['Shop', 'Categories', 'About Us', 'Contact'].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-sm text-text-secondary dark:text-dark-text-secondary hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold text-text-primary dark:text-dark-text-primary mb-3">
              Customer Service
            </h3>
            <ul className="space-y-2">
              {[
                'Shipping & Returns',
                'FAQ',
                'Caliber Guide',
                'Privacy Policy',
              ].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-sm text-text-secondary dark:text-dark-text-secondary hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-text-primary dark:text-dark-text-primary mb-3">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-text-secondary dark:text-dark-text-secondary">
                <Mail className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                desilva.sam17.sgds@gmail.com
              </li>
              <li className="flex items-center gap-2 text-sm text-text-secondary dark:text-dark-text-secondary">
                <Phone className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                +63 948 014 0546
              </li>
              <li className="flex items-center gap-2 text-sm text-text-secondary dark:text-dark-text-secondary">
                <MapPin className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                Purok 6, Dulangan, San Luis, Batangas, Philippines, 4210
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border dark:border-dark-border text-center text-sm text-text-muted dark:text-dark-text-muted">
          &copy; {new Date().getFullYear()} PrimeShot Premium Pellet/Slugs. All
          rights reserved.
        </div>
      </div>
    </footer>
  );
}
