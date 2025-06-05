import { Drone } from '../types';

const drones: Drone[] = [
  {
    id: 1,
    name: 'Agriculture Drone',
    description: 'Specialized for agricultural monitoring and spraying operations',
    image: 'https://images.pexels.com/photos/442589/pexels-photo-442589.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    includedIn: ['pro', 'institution'],
    price: 499,
  },
  {
    id: 2,
    name: 'DJI MATRICE 350 RTK',
    description: 'Enterprise-grade drone with RTK positioning for precise flight control',
    image: 'https://images.pexels.com/photos/1087180/pexels-photo-1087180.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    includedIn: ['pro', 'institution'],
    price: 499,
  },
  {
    id: 3,
    name: 'Racing Drone',
    description: 'High-speed drone designed for competitive racing and agility training',
    image: 'https://images.pexels.com/photos/1087181/pexels-photo-1087181.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    includedIn: ['pro', 'institution'],
    price: 499,
  },
  {
    id: 4,
    name: 'Fighter-VTOL',
    description: 'Vertical take-off and landing drone with advanced maneuverability',
    image: 'https://images.pexels.com/photos/336232/pexels-photo-336232.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    includedIn: ['pro', 'institution'],
    price: 499,
  },
  {
    id: 5,
    name: 'Crystalball Model V',
    description: 'Compact and versatile drone perfect for beginners and intermediate users',
    image: 'https://images.pexels.com/photos/207779/pexels-photo-207779.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    includedIn: ['free', 'pro', 'institution'],
    price: 0,
  },
  {
    id: 6,
    name: 'DJI Mavic',
    description: 'Popular consumer drone with excellent camera quality and flight stability',
    image: 'https://images.pexels.com/photos/1576332/pexels-photo-1576332.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    includedIn: ['free', 'pro', 'institution'],
    price: 0,
  },
];

export default drones;