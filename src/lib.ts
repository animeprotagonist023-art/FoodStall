import type { CartItem, Restaurant } from './types';

export const money = (value: number) => new Intl.NumberFormat('en-PH', {
  style: 'currency', currency: 'PHP', maximumFractionDigits: 0,
}).format(value).replace('PHP', '₱');

export const cartSubtotal = (items: CartItem[]) => items.reduce((sum, item) => sum + (item.basePrice + item.optionCost) * item.quantity, 0);
export const cartCount = (items: CartItem[]) => items.reduce((sum, item) => sum + item.quantity, 0);
export const serviceFeeFor = (subtotal: number) => subtotal > 0 ? Math.max(10, Math.round(subtotal * 0.05)) : 0;

export interface PriceBreakdown {
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  discount: number;
  total: number;
  voucherMessage: string;
}

export function calculateCart(items: CartItem[], restaurant?: Restaurant, voucher = ''): PriceBreakdown {
  const subtotal = cartSubtotal(items);
  const deliveryFee = items.length ? (restaurant?.deliveryFee ?? 0) : 0;
  const serviceFee = serviceFeeFor(subtotal);
  let discount = 0;
  let voucherMessage = '';
  const normalized = voucher.trim().toUpperCase();

  if (normalized === 'SALO10') {
    if (subtotal >= 299 && subtotal > 0) {
      discount = Math.min(80, Math.round(subtotal * 0.1));
      voucherMessage = `Nice! ${money(discount)} off your food subtotal.`;
    } else if (subtotal > 0) {
      voucherMessage = `Add ${money(299 - subtotal)} more to use SALO10 (minimum subtotal ₱299).`;
    }
  } else if (normalized === 'FREESHIP') {
    if (deliveryFee > 0 && subtotal >= 199) {
      discount = deliveryFee;
      voucherMessage = 'Delivery fee covered by FREESHIP.';
    } else if (subtotal > 0) {
      voucherMessage = `FREESHIP needs a ₱199 food subtotal and an eligible delivery fee.`;
    }
  }
  return { subtotal, deliveryFee, serviceFee, discount, total: Math.max(0, subtotal + deliveryFee + serviceFee - discount), voucherMessage };
}

export const imageFallback = 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80';
