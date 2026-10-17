import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Header, Footer, Toast, EmptyState } from './components/common';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import RestaurantPage from './pages/RestaurantPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import { FavoritesPage, OffersPage, ProfilePage, AddressesPage, HelpPage } from './pages/AccountPages';
import { OrdersPage, OrderTrackingPage } from './pages/OrdersPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'auto' }); }, [pathname]);
  return null;
}

function NotFoundPage() {
  return <div className="page-shell not-found-page"><EmptyState icon={<Search size={25} />} title="Oops, wrong table." description="We couldn't find that page. Let’s get you back to the good stuff." action="Back to the home menu" to="/" /></div>;
}

export default function App() {
  return <><ScrollToTop /><Header /><main className="main-content"><Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/search" element={<SearchPage />} />
    <Route path="/restaurant/:restaurantId" element={<RestaurantPage />} />
    <Route path="/cart" element={<CartPage />} />
    <Route path="/checkout" element={<CheckoutPage />} />
    <Route path="/order/:orderId" element={<OrderTrackingPage />} />
    <Route path="/orders" element={<OrdersPage />} />
    <Route path="/favorites" element={<FavoritesPage />} />
    <Route path="/offers" element={<OffersPage />} />
    <Route path="/profile" element={<ProfilePage />} />
    <Route path="/addresses" element={<AddressesPage />} />
    <Route path="/help" element={<HelpPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes></main><Footer /><Toast /></>;
}
