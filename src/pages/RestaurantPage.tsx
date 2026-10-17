import { useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Clock3, Heart, MapPin, Plus, Search, ShieldCheck, ShoppingBag, Star, Utensils, X } from 'lucide-react';
import { getRestaurant } from '../data';
import { money } from '../lib';
import { useFoodStall } from '../store';
import type { CartItem } from '../types';
import { DishImage, EmptyState, Modal } from '../components/common';
import DishCustomizer from '../components/DishCustomizer';

export default function RestaurantPage() {
  const { restaurantId = '' } = useParams();
  const restaurant = getRestaurant(restaurantId);
  const { cart, cartItemsCount, favorites, toggleFavorite, addCartItem, showToast, replaceCartItem } = useFoodStall();
  const [selectedDish, setSelectedDish] = useState<string | null>(null);
  const [pendingItem, setPendingItem] = useState<CartItem | null>(null);
  const [menuQuery, setMenuQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Popular');
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const dishes = useMemo(() => restaurant?.dishes.filter((dish) => !menuQuery || `${dish.name} ${dish.description}`.toLowerCase().includes(menuQuery.toLowerCase())) ?? [], [restaurant, menuQuery]);
  if (!restaurant) return <div className="page-shell not-found-page"><EmptyState title="This table is empty." description="We couldn’t find that restaurant. Let’s find you something delicious instead." action="Explore restaurants" to="/search" /></div>;

  const isFavorite = favorites.includes(restaurant.id);
  const cartBelongsHere = cart.length > 0 && cart[0].restaurantId === restaurant.id;
  const popularDishes = dishes.filter((dish) => dish.popular);
  const otherDishes = dishes.filter((dish) => !dish.popular);
  const allItems = [...popularDishes, ...otherDishes];
  const selected = restaurant.dishes.find((dish) => dish.id === selectedDish) ?? null;

  const submitItem = (item: CartItem, oldId?: string) => {
    if (oldId) {
      replaceCartItem(oldId, item);
      setSelectedDish(null);
      return;
    }
    const result = addCartItem(item);
    if (result === 'different-restaurant') {
      setPendingItem(item);
      setSelectedDish(null);
      return;
    }
    setSelectedDish(null);
  };

  const jumpTo = (category: string) => {
    setActiveCategory(category);
    categoryRefs.current[category]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return <div className="restaurant-page page-shell">
    <div className="breadcrumb-row"><Link to="/search"><ArrowLeft size={15} /> All restaurants</Link><span>/</span><span>{restaurant.name}</span></div>
    <section className="restaurant-hero">
      <div className="restaurant-cover"><img src={restaurant.cover} alt={`${restaurant.name} food and restaurant cover`} /><div className="restaurant-cover-scrim" /><span className="cover-label"><Utensils size={13} /> IN THE NEIGHBORHOOD</span></div>
      <div className="restaurant-intro"><div className="restaurant-title-side"><span className="eyebrow">{restaurant.cuisine.toUpperCase()} · {restaurant.tags.join(' · ').toUpperCase()}</span><h1>{restaurant.name}<span className="title-period">.</span></h1><p>{restaurant.description}</p><div className="restaurant-quick-meta"><span className="rating rating-large"><span>★</span> {restaurant.rating.toFixed(1)} <small>({restaurant.ratingCount.toLocaleString()}+ ratings)</small></span><span><Clock3 size={15} /> {restaurant.deliveryMinutes[0]}–{restaurant.deliveryMinutes[1]} min</span><span><MapPin size={15} /> {restaurant.deliveryFee ? `${money(restaurant.deliveryFee)} delivery` : 'Free delivery'}</span></div></div><div className="restaurant-title-actions"><button className={`save-restaurant-button ${isFavorite ? 'saved' : ''}`} onClick={() => toggleFavorite(restaurant.id)}><Heart size={17} fill={isFavorite ? 'currentColor' : 'none'} />{isFavorite ? 'Saved' : 'Save place'}</button>{restaurant.offer && <div className="restaurant-offer-note"><span className="offer-note-icon">✳</span><span><small>A LITTLE PERK</small><strong>{restaurant.offer}</strong></span></div>}</div></div>
    </section>

    <div className="restaurant-menu-layout">
      <section className="menu-main-column">
        <div className="menu-intro-row"><div><span className="eyebrow">MADE FRESH, MADE FOR YOU</span><h2>Let’s get <em>to the good stuff.</em></h2></div><div className="menu-search"><Search size={16} /><input aria-label="Search menu items" placeholder="Find a dish" value={menuQuery} onChange={(event) => setMenuQuery(event.target.value)} />{menuQuery && <button className="plain-icon" onClick={() => setMenuQuery('')} aria-label="Clear menu search"><X size={14} /></button>}</div></div>
        <nav className="menu-category-nav" aria-label="Menu categories"><button className={activeCategory === 'Popular' ? 'active' : ''} onClick={() => jumpTo('Popular')}>Crowd pleasers</button><button className={activeCategory === 'Menu' ? 'active' : ''} onClick={() => jumpTo('Menu')}>The full menu</button></nav>

        {popularDishes.length > 0 && <div className="menu-section" ref={(element) => { categoryRefs.current.Popular = element; }}><div className="menu-section-heading"><div><span className="eyebrow">THE PEOPLE HAVE SPOKEN</span><h3>Crowd pleasers <span>✳</span></h3></div><span className="menu-count">{popularDishes.length} dishes</span></div><div className="dish-list">{popularDishes.map((dish) => <DishRow key={dish.id} dish={dish} onAdd={() => setSelectedDish(dish.id)} />)}</div></div>}
        <div className="menu-section full-menu-section" ref={(element) => { categoryRefs.current.Menu = element; }}><div className="menu-section-heading"><div><span className="eyebrow">GOOD THINGS, ALL AROUND</span><h3>{popularDishes.length ? 'More to love' : 'Our menu'} <span>↘</span></h3></div><span className="menu-count">{otherDishes.length} dishes</span></div>{otherDishes.length ? <div className="dish-list">{otherDishes.map((dish) => <DishRow key={dish.id} dish={dish} onAdd={() => setSelectedDish(dish.id)} />)}</div> : <p className="menu-no-match">{menuQuery ? 'No dishes match that search.' : 'That’s the menu for now.'}</p>}</div>
        {!allItems.length && <EmptyState icon={<Search size={22} />} title="No dishes match that." description="Try another search, or clear it to see the full menu." action="Clear search" onAction={() => setMenuQuery('')} />}
        <div className="restaurant-food-safety"><ShieldCheck size={18} /><span><strong>Good to know</strong><small>All dishes and prices are illustrative demo content. Please check ingredients and allergens before ordering in real life.</small></span></div>
      </section>

      <aside className="restaurant-cart-column"><div className="sticky-cart-card"><div className="sticky-cart-heading"><span className="bag-icon-circle"><ShoppingBag size={18} /></span><div><h3>Your bag</h3><p>{cartBelongsHere ? `${cartItemsCount} delicious ${cartItemsCount === 1 ? 'item' : 'items'}` : 'A little something?'}</p></div></div>{cartBelongsHere ? <><div className="sticky-cart-items">{cart.map((item) => <div key={item.id} className="sticky-cart-item"><div><strong>{item.quantity}× {item.name}</strong><small>{item.options.join(', ')}</small></div><span>{money((item.basePrice + item.optionCost) * item.quantity)}</span></div>)}</div><div className="sticky-cart-total"><span>Food subtotal</span><strong>{money(cart.reduce((sum, item) => sum + (item.basePrice + item.optionCost) * item.quantity, 0))}</strong></div><Link to="/cart" className="button button-primary sticky-cart-cta">Review bag <ArrowRight size={16} /></Link></> : <div className="sticky-cart-empty"><div className="empty-bag-doodle"><ShoppingBag size={25} /></div><strong>It’s a little empty in here.</strong><p>Add something you love and we’ll keep it safe.</p><button onClick={() => setSelectedDish(restaurant.dishes[0]?.id ?? null)} className="text-link">Pick a favorite <ArrowRight size={15} /></button></div>}<div className="cart-demo-note"><Check size={14} /> Simulated checkout · No real payment</div></div></aside>
    </div>

    {selected && <DishCustomizer restaurant={restaurant} dish={selected} onClose={() => setSelectedDish(null)} onSubmit={submitItem} />}
    {pendingItem && <Modal title="A new craving, a new bag?" onClose={() => setPendingItem(null)}><div className="switch-cart-content"><div className="switch-cart-illustration"><ShoppingBag size={27} /></div><p>Your bag has items from another restaurant. Start a fresh bag with <strong>{restaurant.name}</strong>? Your current bag will be cleared.</p><div className="switch-cart-actions"><button className="button button-secondary" onClick={() => { setPendingItem(null); showToast('Your current bag is unchanged', 'info'); }}>Keep current bag</button><button className="button button-primary" onClick={() => { addCartItem(pendingItem, true); setPendingItem(null); }}>Start a new bag <ArrowRight size={15} /></button></div></div></Modal>}
  </div>;
}

function DishRow({ dish, onAdd }: { dish: import('../types').Dish; onAdd: () => void }) {
  return <article className="dish-row"><div className="dish-row-copy"><div className="dish-row-tags">{dish.popular && <span className="popular-dish-tag"><Star size={10} fill="currentColor" /> CROWD FAVE</span>}</div><h4>{dish.name}</h4><p>{dish.description}</p><strong className="dish-row-price">{money(dish.price)}</strong></div><div className="dish-row-action"><DishImage src={dish.image} alt={dish.name} className="dish-row-image" /><button className="dish-add-button" onClick={onAdd} aria-label={`Customize ${dish.name}`}><Plus size={17} /></button><small>{dish.requiredOptions || dish.extras?.length ? 'Customize' : 'Add'}</small></div></article>;
}
