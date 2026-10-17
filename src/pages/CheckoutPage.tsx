import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, CreditCard, ShieldCheck, Wallet } from 'lucide-react';
import { getRestaurant } from '../data';
import { calculateCart, money } from '../lib';
import { useFoodStall } from '../store';
import type { Address, Order } from '../types';
import { DishImage, EmptyState } from '../components/common';

export default function CheckoutPage() {
  const { cart, voucher, addresses, createOrder, saveAddress } = useFoodStall();
  const navigate = useNavigate();
  const restaurant = cart.length ? getRestaurant(cart[0].restaurantId) : undefined;
  const price = calculateCart(cart, restaurant, voucher);
  const [selectedAddressId, setSelectedAddressId] = useState(addresses[0]?.id ?? '');
  const [address, setAddress] = useState<Address>(addresses[0] ?? { id: `address-${Date.now()}`, label: 'Home', recipient: '', phone: '', street: '', city: 'Quezon City, Metro Manila', instructions: '' });
  const [payment, setPayment] = useState('Cash on delivery');
  const [deliveryNotes, setDeliveryNotes] = useState(addresses[0]?.instructions ?? '');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveThisAddress, setSaveThisAddress] = useState(false);

  if (!cart.length || !restaurant) return <div className="page-shell checkout-page"><EmptyState icon={<CreditCard size={24} />} title="Nothing to check out." description="Your bag is empty for now. The next good bite is only a few clicks away." action="Find something delicious" to="/search" /></div>;

  const updateAddress = (field: keyof Address, value: string) => setAddress((current) => ({ ...current, [field]: value }));
  const chooseAddress = (id: string) => {
    const found = addresses.find((item) => item.id === id);
    if (found) { setSelectedAddressId(id); setAddress(found); setDeliveryNotes(found.instructions); }
  };

  const placeOrder = (event: FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;
    if (!address.recipient.trim() || !address.phone.trim() || !address.street.trim() || !address.city.trim()) {
      setError('Please fill in the recipient, phone number, street address, and city.'); return;
    }
    if (!/^[0-9+()\-\s]{7,20}$/.test(address.phone.trim())) { setError('Please enter a valid phone number.'); return; }
    setError(''); setIsSubmitting(true);
    const createdAt = new Date().toISOString();
    const order: Order = {
      id: `FS-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      createdAt, restaurantId: restaurant.id, restaurantName: restaurant.name, restaurantImage: restaurant.image,
      items: cart.map((item) => ({ ...item })), address: { ...address, instructions: deliveryNotes }, payment,
      subtotal: price.subtotal, deliveryFee: price.deliveryFee, serviceFee: price.serviceFee,
      discount: price.discount, voucher, total: price.total, status: 'placed', eta: `${restaurant.deliveryMinutes[0]}–${restaurant.deliveryMinutes[1]} min`,
    };
    window.setTimeout(() => {
      if (saveThisAddress) saveAddress({ ...address, instructions: deliveryNotes });
      createOrder(order);
      navigate(`/order/${order.id}?new=1`);
    }, 420);
  };

  return <div className="page-shell checkout-page">
    <div className="breadcrumb-row"><Link to="/cart"><ArrowLeft size={15} /> Back to bag</Link><span>/</span><span>Checkout</span></div>
    <div className="page-heading-block checkout-title"><div><span className="eyebrow">THE FINAL FEW STEPS</span><h1>Let’s get this <em>to you.</em></h1><p>Good food is on its way. Well, the demo version of it.</p></div><div className="checkout-stepper"><span className="completed-step"><Check size={13} /></span><span className="step-line" /><span className="current-step">02</span><span className="step-line" /><span className="future-step">03</span></div></div>
    <form onSubmit={placeOrder} className="checkout-layout">
      <div className="checkout-main-column">
        <section className="checkout-section"><div className="checkout-section-heading"><span className="checkout-step-number">01</span><div><h2>Where’s it going?</h2><p>Make sure the good stuff knows where to find you.</p></div></div>
          {addresses.length > 0 && <div className="saved-address-options">{addresses.map((saved) => <button type="button" key={saved.id} className={`saved-address-option ${selectedAddressId === saved.id ? 'selected' : ''}`} onClick={() => chooseAddress(saved.id)}><span className="address-radio" /> <span className="saved-address-copy"><strong>{saved.label}</strong><small>{saved.street}, {saved.city}</small></span>{selectedAddressId === saved.id && <Check size={16} />}</button>)}</div>}
          <div className="checkout-form-grid"><label className="form-field"><span>Recipient name <b>*</b></span><input value={address.recipient} onChange={(event) => updateAddress('recipient', event.target.value)} autoComplete="name" required placeholder="Full name" /></label><label className="form-field"><span>Mobile number <b>*</b></span><input value={address.phone} onChange={(event) => updateAddress('phone', event.target.value)} autoComplete="tel" inputMode="tel" required placeholder="09XX XXX XXXX" /></label><label className="form-field form-field-full"><span>Street, building, unit <b>*</b></span><input value={address.street} onChange={(event) => updateAddress('street', event.target.value)} autoComplete="street-address" required placeholder="House / unit no., street, subdivision" /></label><label className="form-field form-field-full"><span>City / municipality <b>*</b></span><input value={address.city} onChange={(event) => updateAddress('city', event.target.value)} autoComplete="address-level2" required placeholder="e.g. Quezon City, Metro Manila" /></label><label className="form-field form-field-full"><span>Delivery instructions <small>Optional</small></span><textarea rows={2} value={deliveryNotes} onChange={(event) => setDeliveryNotes(event.target.value)} placeholder="Landmarks, gate code, or how to find you" /></label></div>
          <label className="save-address-check"><input type="checkbox" checked={saveThisAddress} onChange={(event) => setSaveThisAddress(event.target.checked)} /><span className="custom-checkbox">{saveThisAddress && '✓'}</span> Save this address for next time</label>
        </section>
        <section className="checkout-section payment-section"><div className="checkout-section-heading"><span className="checkout-step-number">02</span><div><h2>How would you like to pay?</h2><p>Demo payments only. No money moves here.</p></div></div><div className="payment-method-list"><label className={`payment-method-option ${payment === 'Cash on delivery' ? 'selected' : ''}`}><input type="radio" name="payment" value="Cash on delivery" checked={payment === 'Cash on delivery'} onChange={(event) => setPayment(event.target.value)} /><span className="payment-method-icon"><Wallet size={20} /></span><span><strong>Cash on delivery</strong><small>Pay cash when the order arrives (demo).</small></span><span className="payment-radio" /></label><label className={`payment-method-option ${payment === 'Simulated e-wallet' ? 'selected' : ''}`}><input type="radio" name="payment" value="Simulated e-wallet" checked={payment === 'Simulated e-wallet'} onChange={(event) => setPayment(event.target.value)} /><span className="payment-method-icon"><CreditCard size={20} /></span><span><strong>E-wallet <em>· simulated</em></strong><small>A demo selection only. No real wallet is connected.</small></span><span className="payment-radio" /></label></div></section>
        <section className="checkout-section final-check-section"><div className="checkout-section-heading"><span className="checkout-step-number">03</span><div><h2>One last look.</h2><p>{restaurant.name} · {cart.reduce((sum, item) => sum + item.quantity, 0)} items in your order</p></div></div><div className="checkout-order-items">{cart.map((item) => <div className="checkout-order-item" key={item.id}><DishImage src={item.image} alt={item.name} className="checkout-order-image" /><span className="checkout-item-qty">{item.quantity}×</span><div><strong>{item.name}</strong><small>{item.options.join(' · ')}</small></div><strong>{money((item.basePrice + item.optionCost) * item.quantity)}</strong></div>)}</div></section>
        {error && <p className="checkout-error" role="alert">{error}</p>}
        <div className="checkout-final-button-row"><button className="button button-primary checkout-place-order" type="submit" disabled={isSubmitting}>{isSubmitting ? <><span className="button-spinner" /> Preparing your demo order…</> : <>Place demo order <ArrowRight size={17} /></>}</button><p><ShieldCheck size={15} /> Your order is simulated. No payment is processed and no courier is dispatched.</p></div>
      </div>
      <aside className="checkout-summary-column"><div className="checkout-summary-card"><span className="eyebrow">YOUR GOOD THINGS</span><div className="checkout-summary-restaurant"><img src={restaurant.image} alt="" /><div><strong>{restaurant.name}</strong><small>{restaurant.cuisine} · {restaurant.deliveryMinutes[0]}–{restaurant.deliveryMinutes[1]} min</small></div></div><div className="price-breakdown"><CheckoutPriceRow label={`Food (${cart.reduce((sum, item) => sum + item.quantity, 0)} items)`} value={money(price.subtotal)} /><CheckoutPriceRow label="Delivery fee" value={money(price.deliveryFee)} /><CheckoutPriceRow label="Service fee" value={money(price.serviceFee)} />{voucher && <CheckoutPriceRow label={`Voucher · ${voucher}`} value={price.discount ? `−${money(price.discount)}` : '—'} savings />}</div><div className="price-total-row"><span>Total</span><strong>{money(price.total)}</strong></div><div className="checkout-eta-card"><span className="eta-sun">✳</span><div><small>ESTIMATED DELIVERY</small><strong>{restaurant.deliveryMinutes[0]}–{restaurant.deliveryMinutes[1]} min</strong><span>Illustrative estimate only</span></div></div><div className="checkout-demo-stamp"><span>DEMO</span><p>This is a frontend demonstration. The order will be saved locally in this browser, and no real payment or delivery occurs.</p></div><Link className="checkout-back-link" to="/cart"><ArrowLeft size={14} /> Edit bag</Link></div></aside>
    </form>
  </div>;
}

function CheckoutPriceRow({ label, value, savings = false }: { label: string; value: string; savings?: boolean }) { return <div className={`price-row ${savings ? 'price-row-savings' : ''}`}><span>{label}</span><strong>{value}</strong></div>; }
