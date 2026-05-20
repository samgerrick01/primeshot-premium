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
            From humble beginnings to premium quality - discover how PrimeShot
            became your trusted source for precision pellets and slugs.
          </p>
        </div>
      </section>

      {/* The Journey */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-text-primary dark:text-dark-text-primary mb-6">
              The Journey Begins
            </h2>
            <div className="space-y-4 text-text-secondary dark:text-dark-text-secondary leading-relaxed">
              <p>
                <strong className="text-primary-600 dark:text-primary-400">
                  2025
                </strong>{' '}
                - PrimeShot was born from a passion for airgun sports. I started
                with a <strong>local press slug</strong>, learning the craft of
                creating precision ammunition one pellet at a time. Every shot
                taught me something new about consistency, quality, and what
                shooters truly need.
              </p>
              <p>
                As demand grew and my skills sharpened, I knew it was time to
                level up. I invested in
                <strong className="text-primary-600 dark:text-primary-400">
                  {' '}
                  imported press slug equipment from Thor
                </strong>
                , a brand renowned for its precision engineering. This upgrade
                transformed my production capabilities, allowing me to create
                slugs with even tighter tolerances and superior performance.
              </p>
              <p>
                But I didn't stop there. To offer a complete range of premium
                ammunition, I also acquired a
                <strong className="text-primary-600 dark:text-primary-400">
                  {' '}
                  Thor pellet mold
                </strong>
                . With Thor's industry-leading tools, I could now produce both
                pellets and slugs that meet the highest standards of accuracy
                and consistency.
              </p>
              <p>
                <strong className="text-text-primary dark:text-dark-text-primary">
                  Today
                </strong>
                , every pellet and slug that bears the PrimeShot name is crafted
                with Thor equipment and years of dedication. Whether you're
                competing at the highest level or enjoying weekend plinking, you
                can trust that our ammunition delivers exceptional quality shot
                after shot.
              </p>
            </div>
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
