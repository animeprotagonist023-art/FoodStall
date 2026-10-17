import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ChevronRight, Clock3, MapPin, PackageCheck, RefreshCw, ShoppingBag, Sparkles } from 'lucide-react';
import type { Order, OrderStatus } from '../types';
import { useFoodStall } from '../store';
import { money } from '../lib';
import { DishImage, EmptyState } from '../components/common';

const steps: { status: OrderStatus; title: string; description: string }[] = [
  { status: 'placed', title: 'Order placed', description: 'Your demo order has been received.' },
  { status: 'confirmed', title: 'Restaurant confirmed', description: 'The restaurant has acknowledged the order in this simulation.' },
  { status: 'preparing', title: 'Preparing your food', description: 'Your meal is being prepared in this illustrative flow.' },
  { status: 'picked-up', title: 'Courier pickup', description: 'A mock pickup stage, not a real courier dispatch.' },
  { status: 'on-the-way', title: 'On the way', description: 'This is a demo status, not live location data.' },
  { status: 'delivered', title: 'Delivered', description: 'The order journey is complete in the demo.' },
];
const statusLabels: Record<OrderStatus, string> = { placed: 'Order placed', confirmed: 'Confirmed', preparing: 'Preparing', 'picked-up': 'Courier pickup', 'on-the-way': 'On the way', delivered: 'Delivered' };
const statusIndex = (status: OrderStatus) => steps.findIndex((step) => step.status === status);

export function OrdersPage() {
  const { orders, reorder } = useFoodStall();
  const navigate = useNavigate();
  const [tab, setTab] = useState('all');
  const shownOrders = tab === 'all' ? orders : orders.filter((order) => tab === 'active' ? order.status !== 'delivered' : order.status === 'delivered');
  const sorted = [...shownOrders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return <div className="page-shell orders-page"><div className="page-heading-block"><div><span className="eyebrow">YOUR FOODSTORY</span><h1>The good stuff, <em>on record.</em></h1><p>Your past orders and a handy way to fall in love with them again.</p></div><div className="orders-heading-decoration"><PackageCheck size={27} /><span>{orders.length.toString().padStart(2, '0')}<small>ORDERS</small></span></div></div>
    <div className="order-tabs"><button onClick={() => setTab('all')} className={tab === 'all' ? 'active' : ''}>All orders <span>{orders.length}</span></button><button onClick={() => setTab('active')} className={tab === 'active' ? 'active' : ''}>In progress <span>{orders.filter((order) => order.status !== 'delivered').length}</span></button><button onClick={() => setTab('delivered')} className={tab === 'delivered' ? 'active' : ''}>Completed <span>{orders.filter((order) => order.status === 'delivered').length}</span></button></div>
    {sorted.length ? <div className="orders-list">{sorted.map((order) => <OrderCard key={order.id} order={order} onTrack={() => navigate(`/order/${order.id}`)} onReorder={() => { reorder(order); navigate('/cart'); }} />)}</div> : <EmptyState icon={<ShoppingBag size={25} />} title={tab === 'all' ? 'Your first good order is waiting.' : 'Nothing on this list. Yet.'} description={tab === 'all' ? 'When you place a simulated order, it’ll show up here so you can track the demo and reorder in a click.' : 'There are no orders in this category right now. Keep exploring and check back later.'} action="Find your first favorite" to="/search" />}
    <div className="order-demo-note"><Sparkles size={16} /><span>Order history is saved in this browser only. All order stages are simulated and do not represent live restaurant or courier activity.</span></div>
  </div>;
}

function OrderCard({ order, onTrack, onReorder }: { order: Order; onTrack: () => void; onReorder: () => void }) {
  const date = new Date(order.createdAt);
  return <article className="order-card"><div className="order-card-top"><div className="order-card-restaurant"><img src={order.restaurantImage} alt="" /><div><span className="eyebrow">{date.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</span><h3>{order.restaurantName}</h3><p>{order.items.reduce((sum, item) => sum + item.quantity, 0)} items <span>·</span> {money(order.total)}</p></div></div><span className={`order-status status-${order.status}`}><i />{statusLabels[order.status]}</span></div><div className="order-card-items">{order.items.slice(0, 3).map((item) => <span key={item.id}>{item.quantity}× {item.name}</span>)}{order.items.length > 3 && <span>+{order.items.length - 3} more</span>}</div><div className="order-card-bottom"><span><Clock3 size={14} /> {order.eta} <small>· demo estimate</small></span><div><button className="button button-secondary small-button" onClick={onReorder}><RefreshCw size={14} /> Reorder</button><button className="button button-primary small-button" onClick={onTrack}>View order <ArrowRight size={14} /></button></div></div></article>;
}

export function OrderTrackingPage() {
  const { orderId = '' } = useParams();
  const [params] = useSearchParams();
  const { orders, updateOrderStatus, reorder, showToast } = useFoodStall();
  const navigate = useNavigate();
  const order = orders.find((item) => item.id === orderId);
  const isNew = params.get('new') === '1';
  if (!order) return <div className="page-shell"><EmptyState icon={<PackageCheck size={25} />} title="We can’t find that order." description="It may have been cleared from this browser, or the link is no longer valid." action="Browse restaurants" to="/search" /></div>;

  const current = statusIndex(order.status);
  const nextStatus = steps[current + 1]?.status;
  const advance = () => { if (nextStatus) { updateOrderStatus(order.id, nextStatus); showToast(`Demo status updated: ${statusLabels[nextStatus]}`, 'info'); } };
  return <div className={`page-shell order-tracking-page ${isNew ? 'new-order-page' : ''}`}>
    <div className="breadcrumb-row"><Link to="/orders"><ArrowLeft size={15} /> Order history</Link><span>/</span><span>Order details</span></div>
    {isNew && <div className="order-success-banner"><span className="success-check"><Check size={21} /></span><div><strong>Your demo order is in!</strong><p>That’s it — your FoodStall order has been created locally. No payment was taken.</p></div><span className="confetti-mark">✳</span></div>}
    <div className="tracking-heading"><div><span className="eyebrow">ORDER REF · {order.id}</span><h1>Good things are <em>in motion.</em></h1><p>Here’s the journey your order would take. For this demo, you control the status.</p></div><span className="tracking-demo-tag"><span /> SIMULATION ONLY</span></div>
    <div className="tracking-layout"><section className="tracking-main-column"><div className="tracking-status-card"><div className="tracking-status-top"><div className="tracking-status-icon"><PackageCheck size={22} /></div><div><span className="eyebrow">CURRENT DEMO STATUS</span><h2>{statusLabels[order.status]}<span>.</span></h2><p>{steps[current]?.description}</p></div><span className={`order-status status-${order.status}`}><i />{statusLabels[order.status]}</span></div><div className="tracking-timeline">{steps.map((step, index) => { const complete = index < current; const currentStep = index === current; return <div className={`timeline-step ${complete ? 'complete' : ''} ${currentStep ? 'current' : ''}`} key={step.status}><div className="timeline-marker">{complete ? <Check size={13} /> : <span>{String(index + 1).padStart(2, '0')}</span>}</div><div className="timeline-copy"><div><strong>{step.title}</strong>{currentStep && <span className="timeline-now">NOW</span>}</div><p>{step.description}</p></div>{index < steps.length - 1 && <span className="timeline-connector" />}</div>; })}</div><div className="advance-demo-status"><div><strong>Demo controls</strong><p>Advance one stage at a time to preview the order timeline.</p></div><button className="button button-dark" disabled={!nextStatus} onClick={advance}>{nextStatus ? <>Advance to {statusLabels[nextStatus]} <ArrowRight size={15} /></> : <>Journey complete <Check size={15} /></>}</button></div><p className="tracking-warning"><CircleHelpMini /> This timeline is manually controlled demonstration data. It is not live tracking, there is no courier location, and no one is delivering this order.</p></div>
      <div className="tracking-address-card"><div className="tracking-card-icon"><MapPin size={19} /></div><div><span className="eyebrow">DELIVERING TO</span><h3>{order.address.label || 'Saved address'}</h3><p><strong>{order.address.recipient}</strong> · {order.address.phone}</p><p>{order.address.street}, {order.address.city}</p>{order.address.instructions && <small>Note: {order.address.instructions}</small>}</div></div>
    </section><aside className="tracking-summary-column"><div className="tracking-summary-card"><span className="eyebrow">WHAT’S IN THE BAG</span><div className="tracking-restaurant-heading"><img src={order.restaurantImage} alt="" /><div><strong>{order.restaurantName}</strong><small>{new Date(order.createdAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</small></div></div><div className="tracking-items-list">{order.items.map((item) => <div key={item.id} className="tracking-item"><DishImage src={item.image} alt={item.name} className="tracking-item-image" /><span className="tracking-item-qty">{item.quantity}×</span><div><strong>{item.name}</strong><small>{item.options.join(' · ')}</small></div><span>{money((item.basePrice + item.optionCost) * item.quantity)}</span></div>)}</div><div className="price-breakdown"><TrackPriceRow label="Subtotal" value={money(order.subtotal)} /><TrackPriceRow label="Delivery fee" value={money(order.deliveryFee)} /><TrackPriceRow label="Service fee" value={money(order.serviceFee)} />{order.discount > 0 && <TrackPriceRow label="Discount" value={`−${money(order.discount)}`} />}</div><div className="price-total-row"><span>Order total</span><strong>{money(order.total)}</strong></div><div className="tracking-payment"><span>Payment method</span><strong>{order.payment}</strong></div><button className="button button-primary tracking-reorder-button" onClick={() => { reorder(order); navigate('/cart'); }}>Order this again <RefreshCw size={15} /></button><Link className="back-to-orders-link" to="/orders">All orders <ChevronRight size={15} /></Link></div></aside></div>
  </div>;
}

function TrackPriceRow({ label, value }: { label: string; value: string }) { return <div className="price-row"><span>{label}</span><strong>{value}</strong></div>; }
function CircleHelpMini() { return <span className="small-info-mark">i</span>; }
