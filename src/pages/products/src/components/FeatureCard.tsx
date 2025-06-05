import React from 'react';
import * as LucideIcons from 'lucide-react';
import { Feature } from '../types';
import Card from './Card';

interface FeatureCardProps {
  feature: Feature;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature }) => {
  // Dynamically select the icon from lucide-react
  const IconComponent = (LucideIcons as any)[
    feature.icon.charAt(0).toUpperCase() + feature.icon.slice(1)
  ] || LucideIcons.Activity;

  return (
    <Card className="h-full">
      <div className="p-6">
        <div className="bg-orange-100 p-3 rounded-lg text-orange-600 inline-block mb-4">
          <IconComponent size={24} />
        </div>
        <h3 className="text-lg font-bold mb-2">{feature.name}</h3>
        <p className="text-gray-600">{feature.description}</p>
      </div>
    </Card>
  );
};

export default FeatureCard;