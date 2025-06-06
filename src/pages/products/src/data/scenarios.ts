import { Scenario } from '../types';

const scenarios: Scenario[] = [
  {
    id: 1,
    name: 'RPTO Ground',
    description: 'Remote Pilot Training Organization ground-based flight training scenarios',
    icon: 'school',
    image: '/images/scenarios/RPTOzone.jpeg',
    includedIn: ['pro', 'institution'],
    price: 499,
  },
  {
    id: 2,
    name: 'Agriculture Zone',
    description: 'Agricultural mapping, crop monitoring, and precision spraying simulations',
    icon: 'wheat',
    image: '/images/scenarios/AgriZone.jpeg',
    includedIn: ['pro', 'institution'],
    price: 499,
  },
  {
    id: 3,
    name: 'Defense Zone',
    description: 'Military-grade training scenarios for surveillance and reconnaissance',
    icon: 'shield',
    image: '/images/scenarios/Defencezone.jpeg',
    includedIn: ['pro', 'institution'],
    price: 499,
  },
  {
    id: 4,
    name: 'HV Line / Solar Panel',
    description: 'Inspection scenarios for high voltage lines and solar panel installations',
    icon: 'zap',
    image: '/images/scenarios/HVSOLARZone.jpeg',
    includedIn: ['pro', 'institution'],
    price: 499,
  },
  {
    id: 5,
    name: 'Factory',
    description: 'Industrial inspection and monitoring simulations in factory environments',
    icon: 'factory',
    image: '/images/scenarios/FactoryZone.jpeg',
    includedIn: ['pro', 'institution'],
    price: 499,
  },
  {
    id: 6,
    name: 'Bridge & Road',
    description: 'Infrastructure inspection and traffic monitoring simulation scenarios',
    icon: 'bridge',
    image: '/images/scenarios/Roadinspectionzone.jpeg',
    includedIn: ['pro', 'institution'],
    price: 499,
  },
  {
    id: 7,
    name: 'City',
    description: 'Urban flight navigation, building inspection, and delivery simulations',
    icon: 'building-2',
    image: '/images/scenarios/Urbanplanningzone.jpeg',
    includedIn: ['pro', 'institution'],
    price: 499,
  },
];

export default scenarios;