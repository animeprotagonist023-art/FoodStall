import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Address, CartItem, Order, OrderStatus } from './types';
import { getRestaurant, initialAddresses } from './data';
import { calculateCart, cartCount } from './lib';

type ToastKind = 'success' | 'error' | 'info';
interface ToastMessage { id: number; message: string; kind: ToastKind }
interface FoodStallContextValue {
  cart: CartItem[];
  favorites: string[];
  orders: Order[];
  addresses: Address[];
  toast: ToastMessage | null;
  voucher: string;
  cartItemsCount: number;
  showToast: (message: string, kind?: ToastKind) => void;
  addCartItem: (item: CartItem, replaceCart?: boolean) => 'added' | 'different-restaurant';
  updateQuantity: (id: string, quantity: number) => void;
  removeCartItem: (id: string) => void;
  replaceCartItem: (oldId: string, item: CartItem) => void;
  clearCart: () => void;
  toggleFavorite: (restaurantId: string) => void;
  applyVoucher: (code: string) => void;
  clearVoucher: () => void;
  createOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  reorder: (order: Order) => void;
  saveAddress: (address: Address) => void;
  deleteAddress: (id: string) => void;
}

const Context = createContext<FoodStallContextValue | null>(null);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function sanitizeStoredValue<T>(key: string, value: unknown, fallback: T): T {
  if (!Array.isArray(fallback)) return typeof value === typeof fallback ? value as T : fallback;
  if (!Array.isArray(value)) return fallback;
  if (key === 'foodstall-favorites-v1') return value.filter((item): item is string => typeof item === 'string') as T;
  if (key === 'foodstall-cart-v1') {
    return value.filter((item) => isRecord(item) && typeof item.id === 'string' && typeof item.restaurantId === 'string' && typeof item.dishId === 'string' && typeof item.name === 'string' && typeof item.image === 'string' && Number.isFinite(item.basePrice) && Number.isFinite(item.quantity) && Number(item.quantity) > 0 && Number.isFinite(item.optionCost) && Array.isArray(item.options)).map((item) => ({ ...item, instructions: typeof item.instructions === 'string' ? item.instructions : '' })) as T;
  }
  if (key === 'foodstall-addresses-v1') {
    return value.filter((item) => isRecord(item) && ['id', 'label', 'recipient', 'phone', 'street', 'city', 'instructions'].every((field) => typeof item[field] === 'string')) as T;
  }
  if (key === 'foodstall-orders-v1') {
    return value.filter((item) => isRecord(item) && typeof item.id === 'string' && typeof item.restaurantId === 'string' && typeof item.restaurantName === 'string' && Array.isArray(item.items) && isRecord(item.address) && typeof item.total === 'number' && ['placed', 'confirmed', 'preparing', 'picked-up', 'on-the-way', 'delivered'].includes(String(item.status))) as T;
  }
  return value as T;
}

function readStorage<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    if (!value) return fallback;
    return sanitizeStoredValue(key, JSON.parse(value) as unknown, fallback);
  } catch {
    return fallback;
  }
}

function usePersistedState<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => readStorage(key, fallback));
  const update = useCallback((next: T | ((previous: T) => T)) => {
    setValue((previous) => {
      const resolved = typeof next === 'function' ? (next as (previous: T) => T)(previous) : next;
      try { localStorage.setItem(key, JSON.stringify(resolved)); } catch { /* Storage can be disabled or full. */ }
      return resolved;
    });
  }, [key]);
  return [value, update] as const;
}

export function FoodStallProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = usePersistedState<CartItem[]>('foodstall-cart-v1', []);
  const [favorites, setFavorites] = usePersistedState<string[]>('foodstall-favorites-v1', []);
  const [orders, setOrders] = usePersistedState<Order[]>('foodstall-orders-v1', []);
  const [addresses, setAddresses] = usePersistedState<Address[]>('foodstall-addresses-v1', initialAddresses);
  const [voucher, setVoucher] = useState('');
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = useCallback((message: string, kind: ToastKind = 'success') => {
    const id = Date.now();
    setToast({ id, message, kind });
    window.setTimeout(() => setToast((current) => current?.id === id ? null : current), 2800);
  }, []);

  const addCartItem = useCallback((item: CartItem, replaceCart = false) => {
    if (cart.length && cart[0].restaurantId !== item.restaurantId && !replaceCart) return 'different-restaurant' as const;
    setCart((current) => {
      const base = replaceCart ? [] : current;
      const match = base.find((existing) => existing.id === item.id);
      if (match) return base.map((existing) => existing.id === item.id ? { ...existing, quantity: existing.quantity + item.quantity } : existing);
      return [...base, item];
    });
    if (replaceCart || (cart.length && cart[0].restaurantId !== item.restaurantId)) setVoucher('');
    showToast(`${item.name} added to your bag`);
    return 'added' as const;
  }, [cart, setCart, showToast]);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setCart((current) => quantity < 1 ? current.filter((item) => item.id !== id) : current.map((item) => item.id === id ? { ...item, quantity } : item));
  }, [setCart]);
  const removeCartItem = useCallback((id: string) => setCart((current) => current.filter((item) => item.id !== id)), [setCart]);
  const replaceCartItem = useCallback((oldId: string, item: CartItem) => {
    setCart((current) => {
      const without = current.filter((existing) => existing.id !== oldId);
      const match = without.find((existing) => existing.id === item.id);
      return match ? without.map((existing) => existing.id === item.id ? { ...existing, quantity: existing.quantity + item.quantity } : existing) : [...without, item];
    });
    showToast('Your item has been updated');
  }, [setCart, showToast]);
  const clearCart = useCallback(() => { setCart([]); setVoucher(''); }, [setCart]);
  const toggleFavorite = useCallback((restaurantId: string) => {
    const isSaved = favorites.includes(restaurantId);
    setFavorites((current) => isSaved ? current.filter((id) => id !== restaurantId) : [...current, restaurantId]);
    showToast(isSaved ? 'Removed from your favorites' : 'Saved to your favorites', 'info');
  }, [favorites, setFavorites, showToast]);
  const applyVoucher = useCallback((code: string) => {
    const normalized = code.trim().toUpperCase();
    if (!['SALO10', 'FREESHIP'].includes(normalized)) {
      setVoucher(''); showToast('That code is not recognized. Try SALO10 or FREESHIP.', 'error'); return;
    }
    const price = calculateCart(cart, cart[0] ? getRestaurant(cart[0].restaurantId) : undefined, normalized);
    if (price.discount <= 0) { setVoucher(''); showToast(price.voucherMessage || 'This voucher cannot be used on this order yet.', 'error'); return; }
    setVoucher(normalized); showToast(`${normalized} applied successfully`);
  }, [cart, showToast]);
  const clearVoucher = useCallback(() => setVoucher(''), []);
  const createOrder = useCallback((order: Order) => {
    setOrders((current) => [order, ...current]);
    setCart([]); setVoucher('');
  }, [setOrders, setCart]);
  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders((current) => current.map((order) => order.id === orderId ? { ...order, status } : order));
  }, [setOrders]);
  const reorder = useCallback((order: Order) => {
    const restaurant = getRestaurant(order.restaurantId);
    const validItems = order.items.filter((item) => restaurant?.dishes.some((dish) => dish.id === item.dishId));
    if (!restaurant || !validItems.length) { showToast('Some items are no longer available.', 'error'); return; }
    setCart(validItems.map((item) => ({ ...item, id: `${item.dishId}-${Date.now()}-${Math.random().toString(36).slice(2, 5)}` })));
    setVoucher('');
    showToast('Your previous order is back in your bag');
  }, [setCart, setVoucher, showToast]);
  const saveAddress = useCallback((address: Address) => {
    setAddresses((current) => current.some((item) => item.id === address.id) ? current.map((item) => item.id === address.id ? address : item) : [...current, address]);
    showToast('Address saved');
  }, [setAddresses, showToast]);
  const deleteAddress = useCallback((id: string) => setAddresses((current) => current.filter((address) => address.id !== id)), [setAddresses]);

  const value = useMemo(() => ({ cart, favorites, orders, addresses, toast, voucher, cartItemsCount: cartCount(cart), showToast, addCartItem, updateQuantity, removeCartItem, replaceCartItem, clearCart, toggleFavorite, applyVoucher, clearVoucher, createOrder, updateOrderStatus, reorder, saveAddress, deleteAddress }), [cart, favorites, orders, addresses, toast, voucher, showToast, addCartItem, updateQuantity, removeCartItem, replaceCartItem, clearCart, toggleFavorite, applyVoucher, clearVoucher, createOrder, updateOrderStatus, reorder, saveAddress, deleteAddress]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useFoodStall() {
  const context = useContext(Context);
  if (!context) throw new Error('useFoodStall must be used within FoodStallProvider');
  return context;
}
