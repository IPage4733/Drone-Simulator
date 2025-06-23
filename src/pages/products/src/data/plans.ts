import { Plan } from '../types';

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free Basic Plan',
    price: 0,
    billing: 'Forever Free',
    features: [
      'Access to 3 basic drones',
      'Free Flight Mode Only',
      'Basic training scenarios',
      'No Certificate',
      'No Analytics',
    ],
    buttonText: 'Start Free',
    buttonVariant: 'secondary',
    mostPopular: false,
    stripe_price_id: 'price_1RcJttCKYG7gRDVPBkHPkocp'
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    price: 2999,
    billing: 'per year',
    features: [
      'Access to ALL drones',
      'ALL scenarios included',
      'Free, Drawing & Automation modes',
      'Digital Certificate',
      'Analytics available (+₹799/year)',
    ],
    buttonText: 'Add to Cart',
    buttonVariant: 'primary',
    mostPopular: true,
    stripe_price_id: 'price_1RcJttCKYG7gRDVPBkHPkocp'
  },
  {
    id: 'institution',
    name: 'Institution Plan',
    price: 29000,
    billing: 'per year',
    features: [
      '30 user accounts',
      'ALL features included',
      'Admin Panel & Monitoring',
      'Bulk Certificate Generation',
      'Analytics Included',
    ],
    buttonText: 'Book Demo',
    buttonVariant: 'secondary',
    mostPopular: false,
    stripe_price_id: 'price_1RcJttCKYG7gRDVPBkHPkocp'
  },
];

export default plans;