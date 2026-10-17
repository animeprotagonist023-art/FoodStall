export type Cuisine = 'Filipino' | 'Burgers' | 'Pizza' | 'Japanese' | 'Korean' | 'Healthy' | 'Cafe' | 'Desserts' | 'Chinese' | 'Thai';

export interface DishOption {
  id: string;
  name: string;
  price: number;
}

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  popular?: boolean;
  requiredOptions?: { label: string; options: DishOption[] };
  extras?: DishOption[];
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: Cuisine;
  tags: string[];
  rating: number;
  ratingCount: number;
  deliveryMinutes: [number, number];
  deliveryFee: number;
  minOrder: number;
  image: string;
  cover: string;
  description: string;
  offer?: string;
  featured?: boolean;
  dishes: Dish[];
}

export interface CartItem {
  id: string;
  restaurantId: string;
  dishId: string;
  name: string;
  basePrice: number;
  quantity: number;
  image: string;
  options: string[];
  optionCost: number;
  instructions: string;
}

export interface Address {
  id: string;
  label: string;
  recipient: string;
  phone: string;
  street: string;
  city: string;
  instructions: string;
}

export type OrderStatus = 'placed' | 'confirmed' | 'preparing' | 'picked-up' | 'on-the-way' | 'delivered';
export interface Order {
  id: string;
  createdAt: string;
  restaurantId: string;
  restaurantName: string;
  restaurantImage: string;
  items: CartItem[];
  address: Address;
  payment: string;
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  discount: number;
  voucher: string;
  total: number;
  status: OrderStatus;
  eta: string;
}
