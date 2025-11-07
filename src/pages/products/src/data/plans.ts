import { Plan } from '../types';

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free Basic Plan',
    price: 0,
    billing: 'Free',
    features: [
      'Available Drones: Agriculture Drone, Racing Drone, DJI Mavic',
      'Permitted Zones: RPTO Ground, Agriculture Zone, City',
      'Access to 3 basic drones',
      'Free Flight Mode Only',
      'No Certificate'
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
    originalPrice: 99.99,
    billing: 'USD per year ($99.99) (90% Off)',
    features: [
      'Available Drones: Agriculture Drone, Racing Drone, DJI Mavic, DJI Matrice 350 RTK, Crystalball Model V (Except Fighter-VTOL)',
      'Permitted Zones: RPTO Ground, Agriculture, City, Bridge & Road, HV Lines & Solar Panel, Factory Except Defence',
      'Free, Drawing & Automation modes',
      'Digital Certificate',
      'Only .edu or .ac emails are allowed.'
    ],
    buttonText: 'Add to Cart',
    buttonVariant: 'primary',
    mostPopular: false,
    stripe_price_id: 'price_1ReFCPCKYG7gRDVPCr3307yG'
  },
  {
    id: 'zone',
    name: 'Zone Plan',
    price: 34.99,
    originalPrice: 119.99,
    billing: 'USD per Zone/year ($119.99) (80% Off)',
    features: [
      'Available Drones: Agriculture Drone, Racing Drone, DJI Mavic, DJI Matrice 350 RTK, Crystalball Model V (except Fighter-VTOL)',
      'Permitted Zone: Any one Zone of RPTO Ground, Agriculture, City, Bridge & Road, HV Lines & Solar Panel, Factory except Defence',
      'Free Flight, Drawing & Automation Modes'
    ],
    buttonText: 'Add to Cart',
    buttonVariant: 'primary',
    mostPopular: false,
    stripe_price_id: ''
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    price: 99.99,
    billing: 'USD per year',
    features: [
      'Available Drones: Agriculture Drone, Racing Drone, DJI Mavic, DJI Matrice 350 RTK, Crystalball Model V (except Fighter-VTOL)',
      'Permitted Zones: RPTO Ground, Agriculture, City, Bridge & Road, HV Lines & Solar Panel, Factory except Defence',
      'Free Flight, Drawing & Automation Modes',
      'Digital Certificate'
    ],
    buttonText: 'Add to Cart',
    buttonVariant: 'primary',
    mostPopular: true,
    stripe_price_id: 'price_1ReFBMCKYG7gRDVPSE55nhzo'
  },
  {
    id: 'institution',
    name: 'Enterprise Plan',
    price: 29000 ,
    billing: ' USD per year',
    features: [
      'Available Drones: Agriculture Drone, Racing Drone, DJI Mavic, DJI Matrice 350 RTK, Crystalball Model V, including Fighter-VTOL',
      'Permitted Zones: RPTO Ground, Agriculture, City, Bridge & Road, HV Lines & Solar Panel, Factory including Defence',
      'Advanced Scenario Customization',
      'Admin Panel & Monitoring',
      'Bulk Certificate Generation',
      'Analytics Included',
      'Module-Based Pricing'
    ],
    buttonText: 'Contact Us',
    buttonVariant: 'secondary',
    mostPopular: false,
    stripe_price_id: 'price_1RcJttCKYG7gRDVPBkHPkocp'
  },
];

export default plans;