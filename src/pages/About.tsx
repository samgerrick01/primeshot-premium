import { Target, Award, Users, Crosshair } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ABOUT_STATS } from '@/constants/enums';

const statIcons = [Award, Users, Crosshair, Target];

export function About() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Target className="w-16 h-16 mx-auto mb-6 text-primary-300" />
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Our Story
          </h1>
          <p className="text-lg text-primary-100 max-w-2xl mx-auto">
            PrimeShot Premium Pellet/Slugs was born from a passion for airgun
            sports and a commitment to providing the highest quality ammunition
            for shooters at every level.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-text-primary dark:text-dark-text-primary">
              Our Mission
            </h2>
            <p className="mt-4 text-text-secondary dark:text-dark-text-secondary leading-relaxed">
              We believe that great accuracy starts with great ammunition.
              That's why we carefully manufacture every pellet and slug in our
              collection, ensuring that each round meets our rigorous standards
              for precision, consistency, and performance.
            </p>
            <p className="mt-4 text-text-secondary dark:text-dark-text-secondary leading-relaxed">
              Whether you're a competitive shooter or a weekend enthusiast,
              we're here to help you hit your mark with confidence.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {ABOUT_STATS.map((stat, index) => {
              const Icon = statIcons[index];
              return (
                <div key={stat.label} className="card p-6 text-center">
                  <Icon className="w-8 h-8 mx-auto text-primary-600 dark:text-primary-400 mb-2" />
                  <p className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">
                    {stat.value}
                  </p>
                  <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-surface-secondary dark:bg-dark-surface-secondary border-y border-border dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="font-serif text-3xl font-bold text-text-primary dark:text-dark-text-primary mb-4">
            Ready to Improve Your Accuracy?
          </h2>
          <p className="text-text-secondary dark:text-dark-text-secondary mb-8 max-w-xl mx-auto">
            Explore our collection and find the perfect ammunition for your next
            session.
          </p>
          <Link to="/shop" className="btn-primary">
            Browse Products
          </Link>
        </div>
      </section>
    </div>
  );
}
