import React from 'react';
import { ShoppingCart, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Button from './Button';

const MiniCart: React.FC = () => {
  const { items, totalPrice, totalItems, isCartOpen, setIsCartOpen, removeItem } = useCart();

  if (totalItems === 0) {
    return (
      <div 
        className="fixed bottom-4 right-4 z-50 bg-orange-500 text-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-orange-600 transition-all"
        onClick={() => setIsCartOpen(true)}
      >
        <ShoppingCart size={24} />
      </div>
    );
  }

  return (
    <>
      {!isCartOpen ? (
        <div 
          className="fixed bottom-4 right-4 z-50 bg-orange-500 text-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-orange-600 transition-all flex items-center justify-center"
          onClick={() => setIsCartOpen(true)}
        >
          <ShoppingCart size={24} />
          <span className="ml-2 font-bold">{totalItems}</span>
        </div>
      ) : (
        <div className="fixed bottom-0 right-0 z-50 w-full md:w-96 bg-white shadow-xl rounded-t-xl p-4 transition-all duration-300 transform translate-y-0 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Your Cart ({totalItems})</h3>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          
          {items.length > 0 ? (
            <>
              <div className="max-h-60 overflow-y-auto mb-4">
                {items.map((item) => (
                  <div key={`${item.id}-${item.type}`} className="flex justify-between items-center py-2 border-b">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        ₹{item.price} × {item.quantity}
                      </p>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id, item.type)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center font-bold mb-4">
                <span>Total:</span>
                <span>₹{totalPrice}</span>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsCartOpen(false)} 
                  fullWidth
                >
                  Continue Shopping
                </Button>
                <Button 
                  variant="primary" 
                  onClick={() => window.location.href = '/product/checkout'}
                  fullWidth
                >
                  Checkout
                </Button>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500 my-4">Your cart is empty</p>
          )}
        </div>
      )}
    </>
  );
};

export default MiniCart;