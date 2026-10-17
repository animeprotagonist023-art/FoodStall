import { ArrowDownRight, ArrowRight, BadgePercent, ChevronRight, Clock3, Flame, Search, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { categories, restaurants } from '../data';
import { RestaurantCard, SectionTitle } from '../components/common';

const cuisineColors: Record<string, string> = { 'All eats': 'category-all', Filipino: 'category-filipino', Burgers: 'category-burger', Pizza: 'category-pizza', Japanese: 'category-japanese', Korean: 'category-korean', Healthy: 'category-healthy', Cafe: 'category-cafe', Desserts: 'category-dessert', Chinese: 'category-chinese' };

export default function HomePage() {
  const navigate = useNavigate();
  const featured = restaurants.filter((restaurant) => restaurant.featured).slice(0, 4);
  const quickest = [...restaurants].sort((a, b) => a.deliveryMinutes[0] - b.deliveryMinutes[0]).slice(0, 4);
  const budgetFriendly = [...restaurants].sort((a, b) => a.deliveryFee - b.deliveryFee).slice(0, 4);
  return <div className="home-page page-shell">
    <section className="hero-section">
      <div className="hero-copy">
        <div className="hero-kicker"><span className="hero-kicker-dot" /> THE NEIGHBORHOOD FOOD CLUB</div>
        <h1>Find your next<br /><em>happy meal.</em></h1>
        <p className="hero-description">Big cravings, little treats, all your local favorites. Find a new go-to or get that thing you can’t stop thinking about.</p>
        <form className="hero-search" onSubmit={(event) => { event.preventDefault(); const form = event.currentTarget; const input = form.elements.namedItem('q') as HTMLInputElement; navigate(`/search?q=${encodeURIComponent(input.value.trim())}`); }} role="search">
          <Search size={19} /><input name="q" aria-label="Search food or restaurants" placeholder="Dish, restaurant, or cuisine..." /><button type="submit">Find food <ArrowRight size={16} /></button>
        </form>
        <div className="hero-social-proof"><span className="mini-avatars"><b>A</b><b>M</b><b>J</b></span><span><strong>Good food, good mood.</strong><small>Made for your everyday cravings.</small></span></div>
      </div>
      <div className="hero-art" aria-label="A colorful table of fresh food">
        <div className="hero-art-backdrop" />
        <div className="hero-image-main"><img src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=90" alt="A colorful, freshly prepared rice bowl" /></div>
        <div className="hero-image-side"><img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=85" alt="A juicy burger with fresh toppings" /></div>
        <div className="hero-stamp"><Sparkles size={17} /><span>Made with<br />a little love</span></div>
        <div className="hero-delivery-note"><span className="delivery-note-icon"><Clock3 size={17} /></span><span><strong>Good things are close</strong><small>Discover your neighborhood</small></span><ArrowDownRight size={16} /></div>
        <span className="hero-art-scribble" aria-hidden="true">yum!</span>
      </div>
      <span className="hero-page-index"><strong>01</strong> / YOUR NEXT FAVORITE</span>
    </section>

    <section className="category-section">
      <div className="category-header"><div><span className="eyebrow">WHAT ARE WE FEELING?</span><h2>A little bit of <em>everything.</em></h2></div><span className="section-aside-note">Good food, no overthinking.</span></div>
      <div className="category-scroller" aria-label="Browse food categories">
        {categories.map((category) => <button key={category.value} className={`category-tile ${cuisineColors[category.name] ?? ''}`} onClick={() => navigate(category.value === 'All' ? '/search' : `/search?cuisine=${encodeURIComponent(category.value)}`)}><span className="category-art">{category.value === 'All' ? <Sparkles size={23} /> : category.emoji}</span><span>{category.name}</span><ChevronRight size={13} className="category-arrow" /></button>)}
      </div>
    </section>

    <section className="feature-promo">
      <div className="feature-promo-copy"><span className="promo-chip"><BadgePercent size={14} /> A LITTLE PERK</span><h2>Good things taste<br />better <em>with a deal.</em></h2><p>Take 10% off your food subtotal on orders of ₱299 or more. A little treat from us to you.</p><button className="button button-dark" onClick={() => navigate('/offers')}>See your offers <ArrowRight size={16} /></button></div>
      <div className="feature-promo-art"><div className="promo-sun" /><img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=85" alt="Freshly baked pizza topped with herbs" loading="lazy" /><span className="promo-percent">10<small>% OFF</small></span><span className="promo-sparkle sparkle-one">✳</span><span className="promo-sparkle sparkle-two">✳</span></div>
      <div className="promo-legal">USE CODE <strong>SALO10</strong> · UP TO ₱80 OFF <span>Demo voucher</span></div>
    </section>

    <section className="restaurant-section">
      <SectionTitle kicker="THE NEIGHBORHOOD FAVORITES" title="The usual suspects." description="Little local legends you’ll want on speed dial." action="All restaurants" to="/search" />
      <div className="restaurant-grid">{featured.map((restaurant) => <RestaurantCard key={restaurant.id} restaurant={restaurant} />)}</div>
    </section>

    <section className="discovery-band">
      <div className="discovery-band-copy"><span className="eyebrow"><Flame size={13} /> NEED IT NOW</span><h2>Hungry <em>right now?</em></h2><p>Zero patience, maximum flavor. These spots are quick on the draw.</p><button className="text-link" onClick={() => navigate('/search?sort=fastest')}>Find a quick bite <ArrowRight size={16} /></button></div>
      <div className="quick-picks">{quickest.slice(0, 3).map((restaurant, i) => <button key={restaurant.id} className="quick-pick" onClick={() => navigate(`/restaurant/${restaurant.id}`)}><span className="quick-pick-number">0{i + 1}</span><img src={restaurant.image} alt="" loading="lazy" /><span className="quick-pick-copy"><strong>{restaurant.name}</strong><small>{restaurant.cuisine} · {restaurant.deliveryMinutes[0]}–{restaurant.deliveryMinutes[1]} min</small></span><ArrowRight size={16} /></button>)}</div>
    </section>

    <section className="restaurant-section budget-section">
      <SectionTitle kicker="MORE JOY, LESS SPEND" title="Good food on a good budget." description="Keep the cravings happy and the wallet comfy." action="Browse all" to="/search?sort=delivery" />
      <div className="restaurant-grid">{budgetFriendly.map((restaurant) => <RestaurantCard key={restaurant.id} restaurant={restaurant} />)}</div>
    </section>

    <section className="closing-cta"><div className="closing-cta-mark"><UtensilsIcon /></div><div><span className="eyebrow">YOUR NEXT FAVORITE IS OUT THERE</span><h2>Come hungry.<br /><em>Leave happy.</em></h2></div><button className="button button-primary" onClick={() => navigate('/search')}>Explore the menu <ArrowRight size={16} /></button><span className="closing-doodle" aria-hidden="true">✳</span></section>
  </div>;
}

function UtensilsIcon() { return <span className="utensils-illustration">♨</span>; }
