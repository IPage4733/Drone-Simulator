import { Scenario } from '../types';

const scenarios: Scenario[] = [
  {
    id: 1,
    name: 'RPTO Ground',
    description: 'Remote Pilot Training Organization ground-based flight training scenarios',
    icon: 'school',
    includedIn: ['pro', 'institution'],
    price: 499,
  },
  {
    id: 2,
    name: 'Agriculture Zone',
    description: 'Agricultural mapping, crop monitoring, and precision spraying simulations',
    icon: 'wheat',
    includedIn: ['pro', 'institution'],
    price: 499,
  },
  {
    id: 3,
    name: 'Defense Zone',
    description: 'Military-grade training scenarios for surveillance and reconnaissance',
    icon: 'shield',
    includedIn: ['pro', 'institution'],
    price: 499,
  },
  {
    id: 4,
    name: 'HV Line / Solar Panel',
    description: 'Inspection scenarios for high voltage lines and solar panel installations',
    icon: 'zap',
    includedIn: ['pro', 'institution'],
    price: 499,
  },
  {
    id: 5,
    name: 'Factory',
    description: 'Industrial inspection and monitoring simulations in factory environments',
    icon: 'factory',
    includedIn: ['pro', 'institution'],
    price: 499,
  },
  {
    id: 6,
    name: 'Bridge & Road',
    description: 'Infrastructure inspection and traffic monitoring simulation scenarios',
    icon: 'bridge',
    includedIn: ['pro', 'institution'],
    price: 499,
  },
  {
    id: 7,
    name: 'City',
    description: 'Urban flight navigation, building inspection, and delivery simulations',
    icon: 'building-2',
    includedIn: ['pro', 'institution'],
    price: 499,
  },
];

export default scenarios;