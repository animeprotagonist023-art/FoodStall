import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, BadgePercent, CircleHelp, Gift, ShieldCheck, ShoppingBag, Trash2, Utensils, X } from 'lucide-react';
import { getDish, getRestaurant } from '../data';
import { calculateCart, money } from '../lib';
import { useFoodStall } from '../store';
import type { CartItem } from '../types';
import { DishImage, EmptyState, Modal, QuantityControl } from '../components/common';
import DishCustomizer from '../components/DishCustomizer';

export default function CartPage() {
  const { cart, voucher, applyVoucher, clearVoucher, clearCart, updateQuantity, removeCartItem, replaceCartItem, showToast } = useFoodStall();
  const navigate = useNavigate();
  const restaurant = cart.length ? getRestaurant(cart[0].restaurantId) : undefined;
  const price = calculateCart(cart, restaurant, voucher);
  const [voucherInput, setVoucherInput] = useState(voucher);
  const [editing, setEditing] = useState<CartItem | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const editItem = (item: CartItem) => setEditing(item);
  const submitEdit = (item: CartItem, oldId?: string) => {
    if (oldId) replaceCartItem(oldId, item);
    setEditing(null);
  };

  if (!cart.length || !restaurant) return <div className="page-shell cart-page empty-cart-page"><div className="page-heading-block"><div><span className="eyebrow">THE GOOD STUFF GOES HERE</span><h1>Your bag is <em>waiting.</em></h1></div></div><EmptyState icon={<ShoppingBag size={26} />} title="Nothing in the bag. Yet." description="The best kind of plans start with a little browsing. Find something that sounds good and we’ll take it from there." action="Find something delicious" to="/search" /></div>;

  return <div className="page-shell cart-page">
    <div className="breadcrumb-row"><Link to="/search"><ArrowRight className="breadcrumb-back-arrow" size={15} /> Keep browsing</Link><span>/</span><span>Your bag</span></div>
    <div className="page-heading-block cart-page-heading"><div><span className="eyebrow">ALMOST THE BEST PART</span><h1>Your bag of <em>good things.</em></h1><p>Review the good stuff before it makes its way to you.</p></div><div className="bag-count-stamp"><span>{cart.reduce((sum, item) => sum + item.quantity, 0).toString().padStart(2, '0')}</span><small>ITEMS IN<br />YOUR BAG</small></div></div>
    <div className="cart-layout">
      <section className="cart-items-column">
        <div className="cart-restaurant-heading"><img src={restaurant.image} alt="" /><div><small>ORDERING FROM</small><h2>{restaurant.name}</h2><p>{restaurant.cuisine} <span>·</span> {restaurant.deliveryMinutes[0]}–{restaurant.deliveryMinutes[1]} min</p></div><Link to={`/restaurant/${restaurant.id}`} className="edit-order-link">Add more <ArrowRight size={15} /></Link></div>
        <div className="cart-item-list">{cart.map((item) => <CartItemRow key={item.id} item={item} onEdit={() => editItem(item)} onRemove={() => { removeCartItem(item.id); showToast(`${item.name} removed from your bag`, 'info'); }} onQuantity={(quantity) => updateQuantity(item.id, quantity)} />)}</div>
        <div className="cart-notes-card"><div className="cart-notes-icon"><Utensils size={18} /></div><div><strong>Made with care, ordered by you.</strong><p>Special requests can be added by editing an item. We’ll show your order summary before the demo checkout.</p></div></div>
        <button className="clear-bag-button" onClick={() => setShowClearConfirm(true)}><Trash2 size={15} /> Clear bag</button>
      </section>
      <aside className="order-summary-column"><div className="order-summary-card"><span className="eyebrow">THE NUMBERS BIT</span><h2>Order summary<span>.</span></h2>
        <form className="voucher-form" onSubmit={(event) => { event.preventDefault(); applyVoucher(voucherInput); }}><label htmlFor="voucher-code">Got a little code?</label><div className="voucher-input-wrap"><Gift size={16} /><input id="voucher-code" value={voucherInput} onChange={(event) => setVoucherInput(event.target.value.toUpperCase())} placeholder="Enter voucher" aria-label="Voucher code" /><button type="submit">Apply</button></div>{voucher && <div className="voucher-applied"><span><BadgePercent size={14} /> {voucher} is on your order</span><button type="button" onClick={() => { clearVoucher(); setVoucherInput(''); }} aria-label="Remove voucher"><X size={14} /></button></div>}<p className="voucher-hint">Try <button type="button" onClick={() => setVoucherInput('SALO10')}>SALO10</button> for 10% off or <button type="button" onClick={() => setVoucherInput('FREESHIP')}>FREESHIP</button> to cover delivery.</p></form>
        <div className="price-breakdown"><PriceRow label="Food subtotal" value={money(price.subtotal)} /><PriceRow label="Delivery fee" value={money(price.deliveryFee)} /><PriceRow label="Service fee" value={money(price.serviceFee)} /><PriceRow label="Voucher savings" value={price.discount ? `−${money(price.discount)}` : '—'} savings={price.discount > 0} /></div>
        {!!price.voucherMessage && voucher && <p className={`voucher-message ${price.discount > 0 ? 'good' : 'warning'}`}>{price.voucherMessage}</p>}
        <div className="price-total-row"><span>Total to pay</span><strong>{money(price.total)}</strong></div><p className="tax-note">Fees and discounts are sample values for this demo.</p>
        <button className="button button-primary checkout-button" onClick={() => navigate('/checkout')}>Go to checkout <ArrowRight size={17} /></button>
        <div className="secure-demo-note"><ShieldCheck size={15} /><span><strong>Safe to explore.</strong> Checkout is simulated and never charges you.</span></div>
      </div><div className="need-help-note"><CircleHelp size={18} /><p>Need a hand with something? <Link to="/help">We’re right here.</Link></p></div></aside>
    </div>
    {editing && restaurant && getDish(restaurant.id, editing.dishId) && <DishCustomizer restaurant={restaurant} dish={getDish(restaurant.id, editing.dishId)!} editing={editing} onClose={() => setEditing(null)} onSubmit={submitEdit} />}
    {showClearConfirm && <Modal title="A clean slate?" onClose={() => setShowClearConfirm(false)}><div className="confirm-modal-body"><p>Clear all the good stuff from your bag? This can’t be undone.</p><div className="confirm-modal-actions"><button className="button button-secondary" onClick={() => setShowClearConfirm(false)}>Keep my items</button><button className="button button-danger" onClick={() => { clearCart(); setShowClearConfirm(false); showToast('Your bag is empty now', 'info'); }}>Clear bag</button></div></div></Modal>}
  </div>;
}

function CartItemRow({ item, onEdit, onRemove, onQuantity }: { item: CartItem; onEdit: () => void; onRemove: () => void; onQuantity: (quantity: number) => void }) {
  return <article className="cart-item-row"><DishImage src={item.image} alt={item.name} className="cart-item-image" /><div className="cart-item-main"><div className="cart-item-title"><h3>{item.name}</h3><strong>{money((item.basePrice + item.optionCost) * item.quantity)}</strong></div><p>{item.options.join(' · ') || 'Made just the way it comes'}</p>{item.instructions && <p className="cart-item-instructions">“{item.instructions}”</p>}<div className="cart-item-actions"><QuantityControl quantity={item.quantity} onChange={onQuantity} label={`Quantity of ${item.name}`} /><button className="edit-item-button" onClick={onEdit}>Edit</button><button className="remove-item-button" onClick={onRemove} aria-label={`Remove ${item.name}`}><Trash2 size={14} /><span>Remove</span></button></div></div></article>;
}
function PriceRow({ label, value, savings = false }: { label: string; value: string; savings?: boolean }) { return <div className={`price-row ${savings ? 'price-row-savings' : ''}`}><span>{label}</span><strong>{value}</strong></div>; }
