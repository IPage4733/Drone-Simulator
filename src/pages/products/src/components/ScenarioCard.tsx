import React from 'react';
import { PlusCircle } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Scenario } from '../types';
import Card from './Card';
import Badge from './Badge';
import Button from './Button';
import { useCart } from '../context/CartContext';

interface ScenarioCardProps {
  scenario: Scenario;
}

const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario }) => {
  const { addItem } = useCart();
  
  // Dynamically select the icon from lucide-react
  const IconComponent = (LucideIcons as any)[
    scenario.icon.charAt(0).toUpperCase() + scenario.icon.slice(1)
  ] || LucideIcons.Activity;

  const handleAddToCart = () => {
    addItem({
      id: scenario.id.toString(),
      name: scenario.name,
      price: scenario.price,
      type: 'scenario',
    });
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-orange-100 p-3 rounded-lg text-orange-600">
            <IconComponent size={24} />
          </div>
          {scenario.includedIn.includes('free') ? (
            <Badge variant="success">Free</Badge>
          ) : scenario.includedIn.includes('pro') ? (
            <Badge variant="primary">Pro Plan</Badge>
          ) : (
            <Badge variant="secondary">₹{scenario.price}</Badge>
          )}
        </div>
        <h3 className="text-lg font-bold mb-2">{scenario.name}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow">{scenario.description}</p>
        <Button 
          variant="primary"
          onClick={handleAddToCart}
          fullWidth
        >
          <span className="flex items-center justify-center">
            <PlusCircle size={16} className="mr-2" />
            Add to Custom Plan
          </span>
        </Button>
      </div>
    </Card>
  );
};

export default ScenarioCard;