import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Plan } from '../types';
import Card from './Card';
import Button from './Button';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

interface PlanCardProps {
  plan: Plan;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan }) => {
  if (!plan || typeof plan !== 'object') return null; // ✅ defensive check
  const { addItem } = useCart();

const handleAddToCart = () => {
  const userEmail = sessionStorage.getItem('auth_email');

  if (!userEmail) {
    toast.warning('⚠️ Please log in and try again.', {
      position: 'top-center',
    });
    return;
  }

  if (plan.id === 'Student') {
    const isEducational = /(@edu\.|\.edu$|@students?\.|\.ac(\.|$))/i.test(userEmail);

    if (!isEducational) {
      toast.error('🎓 You must use an educational or academic (.edu or .ac) email to access the Student Plan.', {
        position: 'top-center',
      });
      return;
    }
  }

  if (plan.id === 'institution') {
    window.location.href = '/contact';
    return;
  }

  if (plan.id === 'free') {
    window.location.href = '/register';
    return;
  }

  addItem({
    id: plan.id,
    name: plan.name,
    price: plan.price,
    type: 'plan',
    stripe_price_id: plan.stripe_price_id,
  });

  toast.success('✅ Plan added to cart!', {
    position: 'top-center',
  });
};



  return (
    <Card highlighted={plan.mostPopular} className="h-full flex flex-col">
      {plan.mostPopular && (
        <div className="bg-orange-500 text-white py-1 px-4 text-center text-sm font-semibold">
          Most Popular
        </div>
      )}
      <div className="p-6 flex flex-col h-full">
        <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
        {plan.id !== 'institution' && (
          <div className="mb-4">
            <span className="text-3xl font-bold">${plan.price}</span>
            <span className="text-gray-500 ml-1">{plan.billing}</span>
          </div>
        )}
        <ul className="mb-6 flex-grow">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start mb-3">
              <CheckCircle size={18} className="text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
        <Button
          variant={plan.buttonVariant}
          onClick={handleAddToCart}
          fullWidth
        >
          {plan.buttonText}
        </Button>
      </div>
    </Card>
  );
};

export default PlanCard;