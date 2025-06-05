import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Drone } from '../types';
import Card from './Card';
import Badge from './Badge';
import Button from './Button';
import { useCart } from '../context/CartContext';

interface DroneCardProps {
  drone: Drone;
}

const DroneCard: React.FC<DroneCardProps> = ({ drone }) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: drone.id.toString(),
      name: drone.name,
      price: drone.price,
      type: 'drone',
    });
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="h-48 overflow-hidden">
        <img 
          src={drone.image} 
          alt={drone.name} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold">{drone.name}</h3>
          {drone.includedIn.includes('free') ? (
            <Badge variant="success">Free</Badge>
          ) : drone.includedIn.includes('pro') ? (
            <Badge variant="primary">Pro Plan</Badge>
          ) : (
            <Badge variant="secondary">Add ₹{drone.price}</Badge>
          )}
        </div>
        <p className="text-gray-600 text-sm mb-4 flex-grow">{drone.description}</p>
        <Button 
          variant={drone.includedIn.includes('free') ? 'secondary' : 'primary'}
          onClick={handleAddToCart}
          fullWidth
          disabled={drone.includedIn.includes('free')}
        >
          <span className="flex items-center justify-center">
            <PlusCircle size={16} className="mr-2" />
            {drone.includedIn.includes('free') ? 'Included in Free Plan' : 'Add to Custom Plan'}
          </span>
        </Button>
      </div>
    </Card>
  );
};

export default DroneCard;