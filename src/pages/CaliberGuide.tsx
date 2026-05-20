import { Ruler, Target, Wind, Zap } from 'lucide-react';

const calibers = [
  {
    name: '.177 (4.5mm)',
    icon: Target,
    description: 'The most popular caliber for target shooting and plinking',
    velocity: 'High',
    energy: 'Low to Medium',
    range: 'Short to Medium',
    applications: [
      'Target shooting and competitions',
      'Indoor shooting ranges',
      'Pest control (small targets)',
      'Training and practice',
      'Backyard plinking',
    ],
    advantages: [
      'Flat trajectory due to high velocity',
      'Less affected by wind at shorter ranges',
      'More shots per fill (PCP airguns)',
      'Lower cost per shot',
      'Widely available ammunition',
    ],
    considerations: [
      'Less kinetic energy for hunting',
      'More affected by wind at longer ranges',
      'Lighter pellets may be less stable',
    ],
  },
  {
    name: '.22 (5.5mm)',
    icon: Crosshair,
    description: 'The versatile all-rounder for hunting and target shooting',
    velocity: 'Medium to High',
    energy: 'Medium',
    range: 'Medium',
    applications: [
      'Small game hunting (birds, squirrels)',
      'Pest control',
      'Target shooting',
      'Field target competitions',
      'General purpose shooting',
    ],
    advantages: [
      'Excellent balance of power and accuracy',
      'Better wind resistance than .177',
      'Sufficient energy for small game',
      'Wide variety of pellet designs',
      'Most versatile caliber',
    ],
    considerations: [
      'Slightly more expensive than .177',
      'Fewer shots per fill than .177',
      'May be overkill for indoor target shooting',
    ],
  },
  {
    name: '.25 (6.35mm)',
    icon: Wind,
    description:
      'The power caliber for serious hunting and long-range shooting',
    velocity: 'Medium',
    energy: 'High',
    range: 'Medium to Long',
    applications: [
      'Medium game hunting (rabbits, raccoons)',
      'Long-range pest control',
      'Windy condition shooting',
      'Extreme accuracy competitions',
      'Serious hunting applications',
    ],
    advantages: [
      'Excellent wind resistance',
      'High kinetic energy for hunting',
      'Better penetration on game',
      'Stable flight characteristics',
      'Effective at longer ranges',
    ],
    considerations: [
      'Higher cost per shot',
      'Fewer shots per fill',
      'Requires more powerful airgun',
      'Louder report',
      'Limited ammunition selection',
    ],
  },
  {
    name: '.30 (7.62mm)',
    icon: Zap,
    description: 'The big bore option for maximum power and large game',
    velocity: 'Low to Medium',
    energy: 'Very High',
    range: 'Medium to Long',
    applications: [
      'Large game hunting (wild boar, deer)',
      'Maximum power requirements',
      'Long-range shooting',
      'Big bore competitions',
      'Professional pest control',
    ],
    advantages: [
      'Maximum kinetic energy',
      'Excellent for large game',
      'Superior wind resistance',
      'Heavy projectiles for penetration',
      'Devastating impact',
    ],
    considerations: [
      'Most expensive per shot',
      'Requires high-power PCP airgun',
      'Fewer shots per fill',
      'Loudest report',
      'Limited ammunition availability',
    ],
  },
];

function Crosshair(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="22" y1="12" x2="18" y2="12" />
      <line x1="6" y1="12" x2="2" y2="12" />
      <line x1="12" y1="6" x2="12" y2="2" />
      <line x1="12" y1="22" x2="12" y2="18" />
    </svg>
  );
}

export function CaliberGuide() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <Ruler className="w-16 h-16 mx-auto text-primary-600 dark:text-primary-400 mb-4" />
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-text-primary dark:text-dark-text-primary mb-4">
          Caliber Guide
        </h1>
        <p className="text-lg text-text-secondary dark:text-dark-text-secondary max-w-3xl mx-auto">
          Choosing the right caliber is crucial for your shooting success.
          Explore our comprehensive guide to find the perfect match for your
          airgun and shooting application.
        </p>
      </div>

      {/* Introduction */}
      <div className="card p-8 mb-12">
        <h2 className="font-serif text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-4">
          Understanding Airgun Calibers
        </h2>
        <div className="space-y-4 text-text-secondary dark:text-dark-text-secondary leading-relaxed">
          <p>
            Airgun caliber refers to the diameter of the projectile (pellet or
            slug) and the barrel bore. Each caliber offers unique
            characteristics that make it suitable for different applications,
            from precision target shooting to hunting.
          </p>
          <p>
            The four main calibers available in the Philippines are .177, .22,
            .25, and .30. Your choice should depend on your intended use, airgun
            power, shooting environment, and personal preferences.
          </p>
        </div>
      </div>

      {/* Caliber Details */}
      <div className="space-y-8 mb-12">
        {calibers.map((caliber, index) => {
          const Icon = caliber.icon;
          return (
            <div
              key={index}
              className="card overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-700 dark:to-primary-900 p-6 text-white">
                <div className="flex items-center gap-4">
                  <Icon className="w-12 h-12" />
                  <div>
                    <h3 className="font-serif text-3xl font-bold">
                      {caliber.name}
                    </h3>
                    <p className="text-primary-100 mt-1">
                      {caliber.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Specifications */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-surface-secondary dark:bg-dark-surface-secondary p-4 rounded-lg">
                    <p className="text-sm text-text-muted dark:text-dark-text-muted mb-1">
                      Velocity
                    </p>
                    <p className="font-semibold text-text-primary dark:text-dark-text-primary">
                      {caliber.velocity}
                    </p>
                  </div>
                  <div className="bg-surface-secondary dark:bg-dark-surface-secondary p-4 rounded-lg">
                    <p className="text-sm text-text-muted dark:text-dark-text-muted mb-1">
                      Energy
                    </p>
                    <p className="font-semibold text-text-primary dark:text-dark-text-primary">
                      {caliber.energy}
                    </p>
                  </div>
                  <div className="bg-surface-secondary dark:bg-dark-surface-secondary p-4 rounded-lg">
                    <p className="text-sm text-text-muted dark:text-dark-text-muted mb-1">
                      Effective Range
                    </p>
                    <p className="font-semibold text-text-primary dark:text-dark-text-primary">
                      {caliber.range}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Applications */}
                  <div>
                    <h4 className="font-semibold text-text-primary dark:text-dark-text-primary mb-3">
                      Best For:
                    </h4>
                    <ul className="space-y-2">
                      {caliber.applications.map((app, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-text-secondary dark:text-dark-text-secondary"
                        >
                          <span className="text-primary-600 dark:text-primary-400 mt-0.5">
                            •
                          </span>
                          <span>{app}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Advantages */}
                  <div>
                    <h4 className="font-semibold text-text-primary dark:text-dark-text-primary mb-3">
                      Advantages:
                    </h4>
                    <ul className="space-y-2">
                      {caliber.advantages.map((adv, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-text-secondary dark:text-dark-text-secondary"
                        >
                          <span className="text-green-600 dark:text-green-400 mt-0.5">
                            ✓
                          </span>
                          <span>{adv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Considerations */}
                  <div>
                    <h4 className="font-semibold text-text-primary dark:text-dark-text-primary mb-3">
                      Considerations:
                    </h4>
                    <ul className="space-y-2">
                      {caliber.considerations.map((con, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-text-secondary dark:text-dark-text-secondary"
                        >
                          <span className="text-yellow-600 dark:text-yellow-400 mt-0.5">
                            ⚠
                          </span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selection Tips */}
      <div className="card p-8 mb-12">
        <h2 className="font-serif text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-6">
          How to Choose Your Caliber
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-lg text-text-primary dark:text-dark-text-primary mb-3">
              For Target Shooting:
            </h3>
            <p className="text-text-secondary dark:text-dark-text-secondary mb-2">
              <strong className="text-primary-600 dark:text-primary-400">
                .177 caliber
              </strong>{' '}
              is ideal for precision target shooting and competitions due to its
              flat trajectory and high velocity.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg text-text-primary dark:text-dark-text-primary mb-3">
              For Hunting Small Game:
            </h3>
            <p className="text-text-secondary dark:text-dark-text-secondary mb-2">
              <strong className="text-primary-600 dark:text-primary-400">
                .22 caliber
              </strong>{' '}
              offers the best balance of power and accuracy for birds,
              squirrels, and similar-sized game.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg text-text-primary dark:text-dark-text-primary mb-3">
              For Medium Game Hunting:
            </h3>
            <p className="text-text-secondary dark:text-dark-text-secondary mb-2">
              <strong className="text-primary-600 dark:text-primary-400">
                .25 caliber
              </strong>{' '}
              provides sufficient energy for rabbits, raccoons, and shooting in
              windy conditions.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg text-text-primary dark:text-dark-text-primary mb-3">
              For Large Game:
            </h3>
            <p className="text-text-secondary dark:text-dark-text-secondary mb-2">
              <strong className="text-primary-600 dark:text-primary-400">
                .30 caliber
              </strong>{' '}
              delivers maximum power for wild boar, deer, and other large game
              hunting applications.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="p-8 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-xl border border-primary-200 dark:border-primary-800 text-center">
        <h3 className="font-serif text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-3">
          Ready to Find Your Perfect Caliber?
        </h3>
        <p className="text-text-secondary dark:text-dark-text-secondary mb-6">
          Browse our selection of premium pellets and slugs in all calibers.
          Still unsure? Contact us for personalized recommendations!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/shop" className="btn-primary">
            Shop by Caliber
          </a>
          <a href="/contact" className="btn-secondary">
            Get Expert Advice
          </a>
        </div>
      </div>
    </div>
  );
}
