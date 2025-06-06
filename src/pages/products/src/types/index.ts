export interface Drone {
  id: number;
  name: string;
  description: string;
  image: string;
  includedIn: string[];
  price: number;
}

export interface Scenario {
  id: number;
  name: string;
  description: string;
  icon: string;
  image: string;
  includedIn: string[];
  price: number;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  billing: string;
  features: string[];
  buttonText: string;
  buttonVariant: 'primary' | 'secondary';
  mostPopular: boolean;
}

export interface Feature {
  id: number;
  name: string;
  description: string;
  icon: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  type: 'drone' | 'scenario' | 'plan' | 'addon';
  quantity: number;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string, type: string) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}