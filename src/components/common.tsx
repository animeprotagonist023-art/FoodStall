import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ArrowRight, Check, ChevronDown, CircleHelp, Clock3, Heart, MapPin, Menu, Search, ShoppingBag, Sparkles, UserRound, Utensils, X } from 'lucide-react';
import type { Restaurant } from '../types';
import { useFoodStall } from '../store';
import { imageFallback, money } from '../lib';

export function Brand({ compact = false }: { compact?: boolean }) {
  return <Link to="/" className={`brand ${compact ? 'brand-compact' : ''}`} aria-label="FoodStall home">
    <span className="brand-symbol"><Utensils size={18} strokeWidth={2.5} /></span>
    <span className="brand-word">Food<span>Stall</span><small>GOOD FOOD, GOOD MOOD.</small></span>
  </Link>;
}

export function Header() {
  const { cartItemsCount } = useFoodStall();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [locationOpen, setLocationOpen] = useState(false);
  const [location, setLocation] = useState('Quezon City');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setMobileMenuOpen(false);
  };
  return <>
    <header className="site-header">
      <div className="header-inner page-shell">
        <Brand />
        <button className="location-select" onClick={() => setLocationOpen((value) => !value)} aria-expanded={locationOpen}>
          <span className="location-pin"><MapPin size={17} /></span>
          <span className="location-copy"><small>Deliver to</small><strong>{location}</strong></span>
          <ChevronDown size={15} />
        </button>
        <form className="header-search" onSubmit={submitSearch} role="search">
          <Search size={17} />
          <input aria-label="Search restaurants or dishes" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Craving something?" />
          <kbd>↵</kbd>
        </form>
        <nav className="desktop-nav" aria-label="Main navigation">
          <NavLink to="/" end>Discover</NavLink>
          <NavLink to="/offers">Offers</NavLink>
          <NavLink to="/orders">Orders</NavLink>
        </nav>
        <div className="header-actions">
          <Link to="/favorites" className="icon-button header-favorite" aria-label="Favorites"><Heart size={19} /></Link>
          <Link to="/cart" className="cart-button" aria-label={`Shopping bag, ${cartItemsCount} items`}>
            <ShoppingBag size={18} /><span className="cart-button-label">Your bag</span>
            <span className="cart-count">{cartItemsCount}</span>
          </Link>
          <button className="icon-button mobile-menu-trigger" aria-label="Open menu" onClick={() => setMobileMenuOpen((value) => !value)}><Menu size={21} /></button>
        </div>
      </div>
      {locationOpen && <div className="location-popover">
        <div className="popover-title"><div><strong>Your delivery area</strong><p>Choose where the good stuff goes.</p></div><button className="plain-icon" onClick={() => setLocationOpen(false)} aria-label="Close location selector"><X size={17} /></button></div>
        {['Quezon City', 'Makati City', 'Manila', 'Pasig City', 'Taguig City'].map((place) => <button className={`location-option ${location === place ? 'selected' : ''}`} key={place} onClick={() => { setLocation(place); setLocationOpen(false); }}><MapPin size={16} /><span>{place}</span>{location === place && <Check size={16} />}</button>)}
        <p className="tiny-note">Demo location selector. Availability is illustrative.</p>
      </div>}
      {mobileMenuOpen && <div className="mobile-menu page-shell"><Link onClick={() => setMobileMenuOpen(false)} to="/offers">Offers and vouchers <ArrowRight size={16} /></Link><Link onClick={() => setMobileMenuOpen(false)} to="/orders">Your orders <ArrowRight size={16} /></Link><Link onClick={() => setMobileMenuOpen(false)} to="/profile">Profile <ArrowRight size={16} /></Link><Link onClick={() => setMobileMenuOpen(false)} to="/help">Help center <CircleHelp size={16} /></Link></div>}
    </header>
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      <NavLink to="/" end><span className="bottom-nav-icon"><Utensils size={19} /></span><span>Home</span></NavLink>
      <NavLink to="/search"><span className="bottom-nav-icon"><Search size={19} /></span><span>Search</span></NavLink>
      <NavLink to="/orders"><span className="bottom-nav-icon"><Clock3 size={19} /></span><span>Orders</span></NavLink>
      <NavLink to="/favorites"><span className="bottom-nav-icon"><Heart size={19} /></span><span>Saved</span></NavLink>
      <NavLink to="/profile"><span className="bottom-nav-icon"><UserRound size={19} /></span><span>Profile</span></NavLink>
    </nav>
  </>;
}

export function Toast() {
  const { toast } = useFoodStall();
  if (!toast) return null;
  return <div key={toast.id} className={`toast toast-${toast.kind}`} role="status" aria-live="polite"><span className="toast-icon">{toast.kind === 'error' ? <CircleHelp size={17} /> : <Check size={17} />}</span>{toast.message}</div>;
}

export function Modal({ title, children, onClose, className = '' }: { title: string; children: ReactNode; onClose: () => void; className?: string }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);
  useEffect(() => {
    const oldOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { onCloseRef.current(); return; }
      if (event.key === 'Tab' && dialogRef.current) {
        const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')].filter((element) => element.offsetParent !== null);
        if (!focusable.length) { event.preventDefault(); dialogRef.current.focus(); return; }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    dialogRef.current?.focus();
    return () => { document.body.style.overflow = oldOverflow; window.removeEventListener('keydown', onKeyDown); previousFocus?.focus(); };
  }, []);
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div className={`modal-panel ${className}`} ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal-heading"><div><span className="eyebrow">FOODSTALL</span><h2>{title}</h2></div><button className="plain-icon close-modal" onClick={onClose} aria-label="Close dialog"><X size={21} /></button></div>
      {children}
    </div>
  </div>;
}

export function SectionTitle({ kicker, title, description, action, to }: { kicker?: string; title: string; description?: string; action?: string; to?: string }) {
  return <div className="section-title-row"><div>{kicker && <span className="eyebrow">{kicker}</span>}<h2>{title}</h2>{description && <p>{description}</p>}</div>{action && to && <Link to={to} className="text-link">{action}<ArrowRight size={16} /></Link>}</div>;
}

export function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const { favorites, toggleFavorite } = useFoodStall();
  const saved = favorites.includes(restaurant.id);
  return <article className="restaurant-card">
    <div className="restaurant-card-image-wrap">
      <Link to={`/restaurant/${restaurant.id}`} className="restaurant-image-link" aria-label={`View ${restaurant.name}`}>
        <img src={restaurant.image} alt={`${restaurant.name} cuisine`} loading="lazy" onError={(event) => { const image = event.currentTarget; if (image.src !== imageFallback) image.src = imageFallback; else image.style.visibility = 'hidden'; }} />
      </Link>
      {restaurant.offer && <span className="offer-ribbon">{restaurant.offer}</span>}
      <button className={`favorite-button ${saved ? 'is-favorite' : ''}`} onClick={() => toggleFavorite(restaurant.id)} aria-label={saved ? `Remove ${restaurant.name} from favorites` : `Save ${restaurant.name} to favorites`} aria-pressed={saved}><Heart size={18} fill={saved ? 'currentColor' : 'none'} /></button>
      <span className="delivery-time"><Clock3 size={13} /> {restaurant.deliveryMinutes[0]}–{restaurant.deliveryMinutes[1]} min</span>
    </div>
    <div className="restaurant-card-content">
      <div className="restaurant-card-title-line"><Link to={`/restaurant/${restaurant.id}`}><h3>{restaurant.name}</h3></Link><span className="rating"><span>★</span> {restaurant.rating.toFixed(1)}</span></div>
      <p>{restaurant.cuisine} <span className="dot-separator">·</span> {restaurant.tags.slice(0, 1).join('')}</p>
      <div className="restaurant-card-meta"><span>{restaurant.deliveryFee === 0 ? 'Free delivery' : `${money(restaurant.deliveryFee)} delivery`}</span><span className="meta-dot" /><span>{money(restaurant.minOrder)} min.</span></div>
    </div>
  </article>;
}

export function DishImage({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  return failed ? <div className={`dish-placeholder ${className}`} aria-label={alt}><Utensils size={24} /><span>Freshly made</span></div> : <img className={`${className} ${loaded ? 'image-loaded' : 'image-loading'}`} src={src} alt={alt} loading="lazy" onLoad={() => setLoaded(true)} onError={() => setFailed(true)} />;
}

export function EmptyState({ icon, title, description, action, to, onAction }: { icon?: ReactNode; title: string; description: string; action?: string; to?: string; onAction?: () => void }) {
  return <div className="empty-state"><span className="empty-state-icon">{icon ?? <Sparkles size={24} />}</span><h2>{title}</h2><p>{description}</p>{action && (to ? <Link className="button button-primary" to={to}>{action}<ArrowRight size={16} /></Link> : <button className="button button-primary" onClick={onAction}>{action}<ArrowRight size={16} /></button>)}</div>;
}

export function QuantityControl({ quantity, onChange, label = 'Quantity' }: { quantity: number; onChange: (quantity: number) => void; label?: string }) {
  return <div className="quantity-control" aria-label={label}><button onClick={() => onChange(quantity - 1)} aria-label="Decrease quantity" disabled={quantity <= 1}><span>−</span></button><span aria-live="polite">{quantity}</span><button onClick={() => onChange(quantity + 1)} aria-label="Increase quantity"><span>+</span></button></div>;
}

export function Footer() {
  return <footer className="site-footer"><div className="page-shell footer-inner"><div><Brand compact /><p>Good food, good mood. Made for the everyday cravings.</p></div><div className="footer-links"><Link to="/offers">Offers</Link><Link to="/orders">Your orders</Link><Link to="/addresses">Saved addresses</Link><Link to="/help">Help center</Link></div><small>© 2026 FoodStall · A demo ordering experience</small></div></footer>;
}
