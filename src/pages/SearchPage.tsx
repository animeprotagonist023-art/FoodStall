import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowDownWideNarrow, ArrowRight, Check, Search, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import { categories, restaurants } from '../data';
import { EmptyState, RestaurantCard } from '../components/common';

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') ?? '');
  const [cuisine, setCuisine] = useState(params.get('cuisine') ?? 'All');
  const [sort, setSort] = useState(params.get('sort') ?? 'recommended');
  const [offersOnly, setOffersOnly] = useState(false);
  const [fastOnly, setFastOnly] = useState(false);
  const [topRated, setTopRated] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [budgetOnly, setBudgetOnly] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try { const stored = localStorage.getItem('foodstall-recent-searches-v1'); const parsed = stored ? JSON.parse(stored) as unknown : []; return Array.isArray(parsed) ? parsed.filter((term): term is string => typeof term === 'string').slice(0, 5) : []; } catch { return []; }
  });

  useEffect(() => {
    setQuery(params.get('q') ?? '');
    setCuisine(params.get('cuisine') ?? 'All');
    setSort(params.get('sort') ?? 'recommended');
  }, [params]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const result = restaurants.filter((restaurant) => {
      const matchesQuery = !normalizedQuery || [restaurant.name, restaurant.cuisine, ...restaurant.tags, ...restaurant.dishes.map((dish) => `${dish.name} ${dish.description}`)].join(' ').toLowerCase().includes(normalizedQuery);
      const matchesCuisine = cuisine === 'All' || restaurant.cuisine === cuisine;
      const matchesOffer = !offersOnly || Boolean(restaurant.offer);
      const matchesFast = !fastOnly || restaurant.deliveryMinutes[1] <= 30;
      const matchesRating = !topRated || restaurant.rating >= 4.8;
      const matchesBudget = !budgetOnly || restaurant.minOrder <= 199;
      return matchesQuery && matchesCuisine && matchesOffer && matchesFast && matchesRating && matchesBudget;
    });
    const sorted = [...result];
    if (sort === 'fastest') sorted.sort((a, b) => a.deliveryMinutes[0] - b.deliveryMinutes[0]);
    else if (sort === 'rating') sorted.sort((a, b) => b.rating - a.rating);
    else if (sort === 'delivery') sorted.sort((a, b) => a.deliveryFee - b.deliveryFee);
    else if (sort === 'price') sorted.sort((a, b) => a.minOrder - b.minOrder);
    else sorted.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || b.rating - a.rating);
    return sorted;
  }, [query, cuisine, sort, offersOnly, fastOnly, topRated, budgetOnly]);

  const updateUrl = (nextQuery: string, nextCuisine: string, nextSort: string) => setParams({ ...(nextQuery ? { q: nextQuery } : {}), ...(nextCuisine !== 'All' ? { cuisine: nextCuisine } : {}), ...(nextSort !== 'recommended' ? { sort: nextSort } : {}) });
  const recordRecentSearch = (term: string) => {
    const normalized = term.trim(); if (!normalized) return;
    setRecentSearches((current) => { const next = [normalized, ...current.filter((item) => item.toLowerCase() !== normalized.toLowerCase())].slice(0, 5); try { localStorage.setItem('foodstall-recent-searches-v1', JSON.stringify(next)); } catch { /* Recent search history is optional. */ } return next; });
  };
  const submit = (event: FormEvent) => { event.preventDefault(); setSuggestionsOpen(false); recordRecentSearch(query); updateUrl(query.trim(), cuisine, sort); };
  const chooseSuggestion = (term: string) => { setQuery(term); setSuggestionsOpen(false); recordRecentSearch(term); updateUrl(term, cuisine, sort); };
  const suggestionTerms = useMemo(() => {
    const allTerms = Array.from(new Set([...restaurants.map((restaurant) => restaurant.name), ...restaurants.map((restaurant) => restaurant.cuisine), ...restaurants.flatMap((restaurant) => restaurant.dishes.map((dish) => dish.name))]));
    const normalized = query.trim().toLowerCase();
    if (normalized) return allTerms.filter((term) => term.toLowerCase().includes(normalized)).slice(0, 5);
    const popular = ['Chicken adobo', 'Burgers', 'Iced latte', 'Sushi', 'Pizza'];
    return [...recentSearches, ...popular.filter((term) => !recentSearches.some((recent) => recent.toLowerCase() === term.toLowerCase()))].slice(0, 5);
  }, [query, recentSearches]);
  const activeFilterCount = [offersOnly, fastOnly, topRated, budgetOnly].filter(Boolean).length + (cuisine !== 'All' ? 1 : 0);
  const clearFilters = (searchQuery = query) => { setCuisine('All'); setOffersOnly(false); setFastOnly(false); setTopRated(false); setBudgetOnly(false); setSort('recommended'); updateUrl(searchQuery, 'All', 'recommended'); };

  return <div className="page-shell search-page">
    <div className="page-heading-block"><div><span className="eyebrow">THE FOODSTALLYARD</span><h1>What sounds <em>good?</em></h1><p>Find that familiar favorite or follow a craving somewhere new.</p></div><span className="page-heading-side-note"><Sparkles size={15} /> A little something for every mood.</span></div>
    <form className="search-page-form" onSubmit={submit} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setSuggestionsOpen(false); }} role="search"><Search size={20} /><input value={query} onFocus={() => setSuggestionsOpen(true)} onChange={(event) => { setQuery(event.target.value); setSuggestionsOpen(true); }} placeholder="Try ‘adobo’, ‘burger’, or ‘coffee’" aria-label="Search by dish, restaurant, or cuisine" /><button type="submit" className="button button-primary">Search <ArrowRight size={15} /></button>{query && <button type="button" aria-label="Clear search" className="plain-icon search-clear" onClick={() => { setQuery(''); setSuggestionsOpen(true); updateUrl('', cuisine, sort); }}><X size={17} /></button>}{suggestionsOpen && <div className="search-suggestions"><div className="search-suggestions-heading"><span>{query ? 'SUGGESTED MATCHES' : recentSearches.length ? 'RECENT & POPULAR' : 'POPULAR SEARCHES'}</span>{!query && recentSearches.length > 0 && <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => { setRecentSearches([]); try { localStorage.removeItem('foodstall-recent-searches-v1'); } catch { /* Optional local storage. */ } }}>Clear recent</button>}</div>{suggestionTerms.length ? suggestionTerms.map((term) => <button type="button" key={term} className="search-suggestion-item" onMouseDown={(event) => event.preventDefault()} onClick={() => chooseSuggestion(term)}><span><Search size={14} />{term}</span><ArrowRight size={14} /></button>) : <p className="search-suggestion-empty">No direct suggestion. Press Search to explore matching menu details.</p>}</div>}</form>

    <div className="search-toolbar"><div className="search-toolbar-title"><span className="eyebrow">BROWSE BY CRAVING</span><p>Pick a lane. Or don’t.</p></div><div className="search-category-chips">{categories.map((category) => <button className={`filter-chip ${cuisine === category.value ? 'active' : ''}`} key={category.value} onClick={() => { setCuisine(category.value); updateUrl(query, category.value, sort); }}>{category.name}</button>)}</div></div>

    <div className="results-toolbar"><div><h2>{query ? <>Results for <em>“{query}”</em></> : cuisine !== 'All' ? <>{cuisine} <em>favorites</em></> : <>A menu of <em>possibilities.</em></>}</h2><p>{filtered.length} places worth a look{activeFilterCount > 0 ? ' · Filters applied' : ''}</p></div><div className="results-controls"><button className={`filter-toggle ${activeFilterCount ? 'filter-toggle-active' : ''}`} onClick={() => setShowFilters((value) => !value)}><SlidersHorizontal size={16} /> Filters {activeFilterCount > 0 && <b>{activeFilterCount}</b>}</button><label className="sort-control"><ArrowDownWideNarrow size={16} /><span className="sr-only">Sort restaurants</span><select value={sort} onChange={(event) => { setSort(event.target.value); updateUrl(query, cuisine, event.target.value); }}><option value="recommended">Recommended</option><option value="fastest">Fastest delivery</option><option value="rating">Top rated</option><option value="delivery">Lowest delivery fee</option><option value="price">Lowest minimum order</option></select></label></div></div>

    {showFilters && <div className="filter-panel"><div className="filter-panel-top"><div><strong>Fine-tune the cravings.</strong><p>Just the stuff you feel like today.</p></div><button className="plain-icon" onClick={() => setShowFilters(false)} aria-label="Close filters"><X size={18} /></button></div><div className="filter-panel-options"><label className="filter-check"><input type="checkbox" checked={offersOnly} onChange={(event) => setOffersOnly(event.target.checked)} /><span className="check-box">{offersOnly && <Check size={12} />}</span><span><strong>Offers available</strong><small>Something extra for your order</small></span></label><label className="filter-check"><input type="checkbox" checked={fastOnly} onChange={(event) => setFastOnly(event.target.checked)} /><span className="check-box">{fastOnly && <Check size={12} />}</span><span><strong>Quick delivery</strong><small>30 minutes or less (estimate)</small></span></label><label className="filter-check"><input type="checkbox" checked={topRated} onChange={(event) => setTopRated(event.target.checked)} /><span className="check-box">{topRated && <Check size={12} />}</span><span><strong>Top rated</strong><small>4.8 stars and up</small></span></label><label className="filter-check"><input type="checkbox" checked={budgetOnly} onChange={(event) => setBudgetOnly(event.target.checked)} /><span className="check-box">{budgetOnly && <Check size={12} />}</span><span><strong>Budget friendly</strong><small>₱199 minimum order or less</small></span></label></div><div className="filter-panel-actions"><button className="text-link" onClick={() => clearFilters()}>Reset all</button><button className="button button-dark" onClick={() => setShowFilters(false)}>Show {filtered.length} places <ArrowRight size={15} /></button></div></div>}

    {activeFilterCount > 0 && <div className="active-filter-row"><span>Active filters</span>{cuisine !== 'All' && <button onClick={() => { setCuisine('All'); updateUrl(query, 'All', sort); }}>{cuisine} <X size={12} /></button>}{offersOnly && <button onClick={() => setOffersOnly(false)}>Offers <X size={12} /></button>}{fastOnly && <button onClick={() => setFastOnly(false)}>Quick delivery <X size={12} /></button>}{topRated && <button onClick={() => setTopRated(false)}>Top rated <X size={12} /></button>}{budgetOnly && <button onClick={() => setBudgetOnly(false)}>Budget friendly <X size={12} /></button>}<button className="clear-filter-link" onClick={() => clearFilters()}>Clear all</button></div>}
    {filtered.length ? <div className="restaurant-grid search-results-grid">{filtered.map((restaurant) => <RestaurantCard restaurant={restaurant} key={restaurant.id} />)}</div> : <EmptyState icon={<Search size={24} />} title="No bites found. Yet." description="Try a different dish, loosen your filters, or explore a new cuisine. Your next favorite is out there." action="Clear all filters" onAction={() => { setQuery(''); setSuggestionsOpen(false); clearFilters(''); }} />}
    <div className="search-bottom-note"><span>✳</span>All restaurants, ratings, menus, and delivery estimates are sample demo data. <Link to="/help">How FoodStall works <ArrowRight size={14} /></Link></div>
  </div>;
}
