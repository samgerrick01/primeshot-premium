import { Link } from 'react-router-dom';
import { Target, Crosshair, CircleDot, Swords, Zap, Ruler } from 'lucide-react';

const categories = [
  {
    name: 'Pellets',
    description: 'Precision diabolo pellets for air rifles',
    icon: Target,
    color: 'from-blue-500 to-blue-700',
    count: '24 products',
  },
  {
    name: 'Slugs',
    description: 'High-performance monolithic slugs',
    icon: Crosshair,
    color: 'from-purple-500 to-purple-700',
    count: '36 products',
  },
  {
    name: 'Hollow Point',
    description: 'Expanding hollow point ammunition',
    icon: CircleDot,
    color: 'from-yellow-500 to-yellow-700',
    count: '18 products',
  },
  {
    name: 'Match Grade',
    description: 'Competition-grade precision rounds',
    icon: Swords,
    color: 'from-green-500 to-green-700',
    count: '12 products',
  },
  {
    name: 'Diabolo',
    description: 'Classic waisted diabolo pellets',
    icon: Zap,
    color: 'from-red-500 to-red-700',
    count: '42 products',
  },
  {
    name: 'Accessories',
    description: 'Pellet tins, targets, and more',
    icon: Ruler,
    color: 'from-indigo-500 to-indigo-700',
    count: '15 products',
  },
];

export function Categories() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-10">
        <h1 className="section-title">Categories</h1>
        <p className="section-subtitle mt-2">Browse our product categories</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link
            key={category.name}
            to={`/shop?category=${category.name}`}
            className="group card overflow-hidden"
          >
            <div
              className={`bg-gradient-to-br ${category.color} p-6 text-white`}
            >
              <category.icon className="w-12 h-12 mb-3 opacity-80 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="font-serif text-xl font-bold">{category.name}</h3>
              <p className="text-sm opacity-80 mt-1">{category.description}</p>
            </div>
            <div className="p-4 flex items-center justify-between">
              <span className="text-sm text-text-secondary dark:text-dark-text-secondary">
                {category.count}
              </span>
              <span className="text-sm font-medium text-primary-600 dark:text-primary-400 group-hover:underline">
                Browse &rarr;
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
