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
    id: 'Student',
    name: 'Student Plan',
    price: 9.99,
    billing: 'USD per year',
    features: [
      'ALL scenarios and drones are included',
      'Free, Drawing & Automation modes',
      'Digital Certificate',
      'Only .edu or .ac emails are allowed.',
    ],
    buttonText: 'Add to Cart',
    buttonVariant: 'primary',
    mostPopular: true,
    stripe_price_id: 'price_1ReFCPCKYG7gRDVPCr3307yG'
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    price: 34.99,
    billing: 'USD per year',
    features: [
      'Access to ALL drones',
      'ALL scenarios included',
      'Free, Drawing & Automation modes',
      'Digital Certificate',
    ],
    buttonText: 'Add to Cart',
    buttonVariant: 'primary',
    mostPopular: true,
    stripe_price_id: 'price_1ReFBMCKYG7gRDVPSE55nhzo'
  },
  {
    id: 'institution',
    name: 'Institution Plan',
    price: 29000 ,
    billing: ' USD per year',
    features: [
      '30 user accounts',
      'ALL features included',
      'Admin Panel & Monitoring',
      'Bulk Certificate Generation',
      'Analytics Included',
    ],
    buttonText: 'Contact Us',
    buttonVariant: 'secondary',
    mostPopular: false,
    stripe_price_id: 'price_1RcJttCKYG7gRDVPBkHPkocp'
  },
];

export default plans;