import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    category: 'Orders & Shipping',
    questions: [
      {
        q: 'How long does shipping take?',
        a: 'Standard shipping within Metro Manila takes 2-3 business days. Provincial deliveries take 3-7 business days depending on your location. We ship via trusted courier services to ensure your pellets and slugs arrive safely.',
      },
      {
        q: 'Do you offer free shipping?',
        a: 'Yes! We offer free shipping on all orders. Your satisfaction is our priority, and we want to make premium ammunition accessible to all airgun enthusiasts across the Philippines.',
      },
      {
        q: 'Can I track my order?',
        a: 'Absolutely! Once your order ships, you will receive a tracking number via email. You can use this to monitor your delivery status in real-time.',
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept GCash payments only. Payment must be made first before order processing. You will receive GCash payment details during checkout, and you need to upload your payment receipt for verification.',
      },
    ],
  },
  {
    category: 'Products',
    questions: [
      {
        q: 'Do you offer free shipping?',
        a: 'Shipping fees vary by region: Luzon ₱100, Visayas ₱150, Mindanao ₱200. However, orders with 3 items or more qualify for FREE SHIPPING nationwide!',
      },
      {
        q: 'Are your pellets and slugs made locally?',
        a: 'Yes! We started with local press slug equipment and have since upgraded to imported Thor press slug equipment and Thor pellet molds. Every product is crafted with precision right here in the Philippines.',
      },
      {
        q: 'What is the difference between pellets and slugs?',
        a: 'Pellets are typically lighter with a waisted diabolo design, ideal for shorter ranges and general shooting. Slugs are heavier, solid projectiles designed for longer range accuracy and higher impact energy. We can help you choose the right ammunition for your specific needs.',
      },
      {
        q: 'How should I store my ammunition?',
        a: 'Store your pellets and slugs in a cool, dry place away from direct sunlight. Keep them in their original tins to maintain quality. Proper storage ensures consistent performance and longevity.',
      },
    ],
  },
  {
    category: 'Returns & Refunds',
    questions: [
      {
        q: 'What is your return policy?',
        a: 'We accept returns within 7 days of delivery for unopened tins only. Once a tin is opened, we cannot accept returns due to quality and safety standards. Please inspect your order carefully upon delivery.',
      },
      {
        q: 'What if my product arrives damaged or defective?',
        a: 'If you receive a damaged or defective product, you must provide a video recording of the unboxing process showing the defect. This is required as proof for processing returns or replacements. Contact us immediately with your video evidence.',
      },
      {
        q: 'How do I initiate a return?',
        a: 'Contact our customer service team with your order number and the reason for return. If the product is defective, include your unboxing video. We will review your request and provide instructions for the return process.',
      },
      {
        q: 'When will I receive my refund?',
        a: 'Approved refunds are processed within 5-7 business days after we receive and inspect the returned item. Refunds will be issued to your original payment method.',
      },
    ],
  },
  {
    category: 'Account & Support',
    questions: [
      {
        q: 'Do I need an account to place an order?',
        a: 'While you can browse our products without an account, creating one allows you to track orders, save your shipping information, and enjoy a faster checkout experience.',
      },
      {
        q: 'How do I contact customer support?',
        a: 'You can reach us through our Contact Us page, email us at desilva.sam17.sgds@gmail.com, or call/text us at +63 948 014 0546. We typically respond within 24 hours during business days.',
      },
      {
        q: 'Are you active on social media?',
        a: 'Yes! Follow us on Facebook for updates, promotions, and airgun tips. Connect with our community and stay informed about new products and special offers.',
      },
      {
        q: 'Do you offer bulk discounts?',
        a: 'Yes, we offer special pricing for bulk orders. Contact us directly to discuss your requirements and we will provide a customized quote.',
      },
    ],
  },
];

export function FAQ() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <HelpCircle className="w-16 h-16 mx-auto text-primary-600 dark:text-primary-400 mb-4" />
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-text-primary dark:text-dark-text-primary mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
          Find answers to common questions about our products, shipping, and
          policies. Can't find what you're looking for? Contact us directly!
        </p>
      </div>

      {/* FAQ Categories */}
      <div className="space-y-8">
        {faqs.map((category, categoryIndex) => (
          <div key={categoryIndex}>
            <h2 className="font-serif text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-4 pb-2 border-b-2 border-primary-600 dark:border-primary-400">
              {category.category}
            </h2>
            <div className="space-y-3">
              {category.questions.map((faq, faqIndex) => {
                const key = `${categoryIndex}-${faqIndex}`;
                const isOpen = openItems[key];

                return (
                  <div
                    key={key}
                    className="card overflow-hidden transition-all duration-200"
                  >
                    <button
                      onClick={() => toggleItem(key)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-surface-secondary dark:hover:bg-dark-surface-secondary transition-colors"
                    >
                      <span className="font-semibold text-text-primary dark:text-dark-text-primary pr-4">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-4 text-text-secondary dark:text-dark-text-secondary leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Still Have Questions */}
      <div className="mt-12 p-8 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-xl border border-primary-200 dark:border-primary-800 text-center">
        <h3 className="font-serif text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-3">
          Still Have Questions?
        </h3>
        <p className="text-text-secondary dark:text-dark-text-secondary mb-6">
          Our team is here to help! Reach out and we'll get back to you as soon
          as possible.
        </p>
        <a
          href="/contact"
          className="btn-primary inline-flex items-center gap-2"
        >
          Contact Us
        </a>
      </div>
    </div>
  );
}
