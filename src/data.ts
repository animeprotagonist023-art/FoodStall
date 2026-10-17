import type { Address, Restaurant } from './types';

const photo = (id: string, w = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;

export const categories = [
  { name: 'All eats', emoji: '✳', value: 'All' },
  { name: 'Filipino', emoji: '🥘', value: 'Filipino' },
  { name: 'Burgers', emoji: '🍔', value: 'Burgers' },
  { name: 'Pizza', emoji: '🍕', value: 'Pizza' },
  { name: 'Japanese', emoji: '🍣', value: 'Japanese' },
  { name: 'Korean', emoji: '🍜', value: 'Korean' },
  { name: 'Healthy', emoji: '🥗', value: 'Healthy' },
  { name: 'Cafe', emoji: '☕', value: 'Cafe' },
  { name: 'Desserts', emoji: '🍰', value: 'Desserts' },
  { name: 'Chinese', emoji: '🥟', value: 'Chinese' },
];

const classicOptions = {
  label: 'Choose your size',
  options: [
    { id: 'regular', name: 'Regular', price: 0 },
    { id: 'large', name: 'Large', price: 55 },
  ],
};

export const restaurants: Restaurant[] = [
  {
    id: 'kusina-ni-lola', name: 'Kusina ni Lola', cuisine: 'Filipino', tags: ['Comfort food', 'Rice meals'], rating: 4.9, ratingCount: 1240,
    deliveryMinutes: [20, 30], deliveryFee: 29, minOrder: 149, image: photo('photo-1547592180-85f173990554'), cover: photo('photo-1547592180-85f173990554', 1500),
    description: 'Recipes that taste like coming home.', offer: '₱50 off ₱399', featured: true,
    dishes: [
      { id: 'adobo', name: 'Lola’s Chicken Adobo', description: 'Soy-vinegar braised chicken, garlic rice, and a little extra sauce.', price: 189, image: photo('photo-1604908176997-125f25cc6f3d'), popular: true, requiredOptions: classicOptions, extras: [{ id: 'egg', name: 'Sunny-side egg', price: 25 }, { id: 'rice', name: 'Extra garlic rice', price: 35 }] },
      { id: 'sinigang', name: 'Pork Sinigang Bowl', description: 'Tamarind broth, tender pork, and fresh market vegetables.', price: 219, image: photo('photo-1547592180-85f173990554'), extras: [{ id: 'rice', name: 'Extra rice', price: 25 }] },
      { id: 'sisig', name: 'Sizzling Pork Sisig', description: 'Crispy-edged pork, calamansi, onions, and chili.', price: 205, image: photo('photo-1544025162-d76694265947'), popular: true, extras: [{ id: 'egg', name: 'Sunny-side egg', price: 25 }] },
      { id: 'kare-kare', name: 'Kare-Kare', description: 'Slow-cooked beef in silky peanut sauce with bagoong on the side.', price: 249, image: photo('photo-1512621776951-a57141f2eefd') },
    ],
  },
  {
    id: 'bun-me-up', name: 'Bun Me Up', cuisine: 'Burgers', tags: ['Smash burgers', 'Fries'], rating: 4.8, ratingCount: 864,
    deliveryMinutes: [15, 25], deliveryFee: 19, minOrder: 199, image: photo('photo-1568901346375-23c9450c58cd'), cover: photo('photo-1568901346375-23c9450c58cd', 1500),
    description: 'Big flavor, soft buns, zero shortcuts.', offer: 'Free fries over ₱499', featured: true,
    dishes: [
      { id: 'classic-smash', name: 'Classic Smash', description: 'Double smashed beef, American cheese, house sauce, pickles.', price: 249, image: photo('photo-1568901346375-23c9450c58cd'), popular: true, extras: [{ id: 'patty', name: 'Add beef patty', price: 89 }, { id: 'bacon', name: 'Crispy bacon', price: 45 }] },
      { id: 'chicken-crunch', name: 'Chicken Crunch', description: 'Buttermilk fried chicken, slaw, and tangy honey mayo.', price: 219, image: photo('photo-1606755962773-d324e0a13086'), extras: [{ id: 'cheese', name: 'Extra cheese', price: 25 }] },
      { id: 'truffle-fries', name: 'Truffle Parmesan Fries', description: 'Golden fries tossed with parmesan and truffle seasoning.', price: 139, image: photo('photo-1573080496219-bb080dd4f877') },
    ],
  },
  {
    id: 'little-oven', name: 'The Little Oven', cuisine: 'Pizza', tags: ['Wood-fired', 'Pizza'], rating: 4.7, ratingCount: 659,
    deliveryMinutes: [25, 35], deliveryFee: 35, minOrder: 299, image: photo('photo-1579751626657-72bc17010498'), cover: photo('photo-1579751626657-72bc17010498', 1500),
    description: 'Slow dough. Hot oven. Happy table.', offer: '20% off selected pizzas', featured: true,
    dishes: [
      { id: 'margherita', name: 'Classic Margherita', description: 'Tomato, fior di latte, basil, and extra virgin olive oil.', price: 329, image: photo('photo-1579751626657-72bc17010498'), popular: true, requiredOptions: { label: 'Choose your size', options: [{ id: '10-inch', name: '10 inch', price: 0 }, { id: '14-inch', name: '14 inch', price: 160 }] } },
      { id: 'pepperoni', name: 'Pepperoni Party', description: 'Cup-and-char pepperoni, mozzarella, and oregano.', price: 389, image: photo('photo-1628840042765-356cda07504e'), requiredOptions: { label: 'Choose your size', options: [{ id: '10-inch', name: '10 inch', price: 0 }, { id: '14-inch', name: '14 inch', price: 180 }] }, extras: [{ id: 'chili', name: 'Chili honey dip', price: 35 }] },
      { id: 'garlic-knots', name: 'Garlic Knots', description: 'Oven-baked dough knots, garlic butter, and parmesan.', price: 119, image: photo('photo-1619531038896-73c4fceaf36c') },
    ],
  },
  {
    id: 'tokyo-table', name: 'Tokyo Table', cuisine: 'Japanese', tags: ['Japanese', 'Sushi & bowls'], rating: 4.8, ratingCount: 991,
    deliveryMinutes: [25, 35], deliveryFee: 39, minOrder: 249, image: photo('photo-1579871494447-9811cf80d66c'), cover: photo('photo-1579871494447-9811cf80d66c', 1500), description: 'A little Tokyo, right around the corner.', featured: true,
    dishes: [
      { id: 'salmon-bowl', name: 'Aburi Salmon Bowl', description: 'Flame-seared salmon, sushi rice, avocado, and sesame.', price: 329, image: photo('photo-1546069901-ba9599a7e63c'), popular: true, extras: [{ id: 'salmon', name: 'Extra salmon', price: 99 }, { id: 'avocado', name: 'Extra avocado', price: 35 }] },
      { id: 'karaage', name: 'Chicken Karaage', description: 'Japanese fried chicken with lemon mayo.', price: 199, image: photo('photo-1626082927389-6cd097cdc6ec') },
      { id: 'maki', name: 'Crispy Salmon Maki', description: 'Eight pieces, topped with spicy mayo and scallions.', price: 249, image: photo('photo-1579871494447-9811cf80d66c') },
    ],
  },
  {
    id: 'seoul-bowl', name: 'Seoul Bowl', cuisine: 'Korean', tags: ['Korean comfort', 'Rice bowls'], rating: 4.7, ratingCount: 732,
    deliveryMinutes: [20, 30], deliveryFee: 25, minOrder: 199, image: photo('photo-1546069901-ba9599a7e63c'), cover: photo('photo-1546069901-ba9599a7e63c', 1500), description: 'Sweet, spicy, savory—just how we like it.', offer: 'Free iced tea with ₱399',
    dishes: [
      { id: 'bibimbap', name: 'Beef Bibimbap', description: 'Marinated beef, seasonal vegetables, egg, and gochujang.', price: 259, image: photo('photo-1512621776951-a57141f2eefd'), popular: true, extras: [{ id: 'beef', name: 'Extra beef', price: 69 }] },
      { id: 'tteokbokki', name: 'Cheesy Tteokbokki', description: 'Chewy rice cakes in a spicy-sweet sauce with mozzarella.', price: 189, image: photo('photo-1569718212165-3a8278d5f624') },
      { id: 'korean-chicken', name: 'Soy Garlic Chicken', description: 'Crispy chicken glazed in sticky soy-garlic sauce.', price: 279, image: photo('photo-1626082927389-6cd097cdc6ec') },
    ],
  },
  {
    id: 'green-spoon', name: 'Green Spoon', cuisine: 'Healthy', tags: ['Fresh bowls', 'Feel-good'], rating: 4.6, ratingCount: 381,
    deliveryMinutes: [15, 25], deliveryFee: 20, minOrder: 199, image: photo('photo-1512621776951-a57141f2eefd'), cover: photo('photo-1512621776951-a57141f2eefd', 1500), description: 'Colorful food for your everyday energy.',
    dishes: [
      { id: 'grain-bowl', name: 'Roasted Veggie Grain Bowl', description: 'Brown rice, roasted squash, greens, and lemon tahini.', price: 229, image: photo('photo-1512621776951-a57141f2eefd'), popular: true, extras: [{ id: 'chicken', name: 'Grilled chicken', price: 69 }] },
      { id: 'chicken-salad', name: 'Citrus Chicken Salad', description: 'Grilled chicken, crunchy greens, citrus, and toasted seeds.', price: 249, image: photo('photo-1540420773420-3366772f4999') },
      { id: 'overnight-oats', name: 'Mango Overnight Oats', description: 'Creamy oats, Philippine mango, coconut, and chia.', price: 139, image: photo('photo-1517673132405-a56a62b18caf') },
    ],
  },
  {
    id: 'good-day-cafe', name: 'Good Day Café', cuisine: 'Cafe', tags: ['Coffee', 'Brunch'], rating: 4.8, ratingCount: 544,
    deliveryMinutes: [15, 25], deliveryFee: 25, minOrder: 149, image: photo('photo-1495474472287-4d71bcdd2085'), cover: photo('photo-1495474472287-4d71bcdd2085', 1500), description: 'For slow mornings and tiny little breaks.', featured: true,
    dishes: [
      { id: 'iced-latte', name: 'Brown Sugar Iced Latte', description: 'Double espresso, oat milk, and house brown sugar syrup.', price: 155, image: photo('photo-1461023058943-07fcbe16d735'), popular: true, requiredOptions: { label: 'Choose your size', options: [{ id: 'regular', name: 'Regular', price: 0 }, { id: 'large', name: 'Large', price: 35 }] }, extras: [{ id: 'espresso', name: 'Extra espresso shot', price: 35 }] },
      { id: 'croissant', name: 'Butter Croissant', description: 'Flaky, golden, and baked fresh every morning.', price: 95, image: photo('photo-1555507036-ab1f4038808a') },
      { id: 'pancakes', name: 'Cloud Pancakes', description: 'Fluffy pancakes, whipped butter, and maple syrup.', price: 189, image: photo('photo-1528207776546-365bb710ee93') },
    ],
  },
  {
    id: 'sugar-high', name: 'Sugar High', cuisine: 'Desserts', tags: ['Sweet treats', 'Desserts'], rating: 4.9, ratingCount: 433,
    deliveryMinutes: [20, 30], deliveryFee: 29, minOrder: 149, image: photo('photo-1578985545062-69928b1d9587'), cover: photo('photo-1578985545062-69928b1d9587', 1500), description: 'Life is short. Order the extra slice.', offer: 'Buy 2, get 1 treat',
    dishes: [
      { id: 'chocolate-cake', name: 'Midnight Chocolate Cake', description: 'Deep chocolate layers, silky ganache, zero regrets.', price: 179, image: photo('photo-1578985545062-69928b1d9587'), popular: true },
      { id: 'cheesecake', name: 'Basque Cheesecake', description: 'Burnt top, custardy center, vanilla bean.', price: 169, image: photo('photo-1533134242443-d4fd215305ad') },
      { id: 'cookies', name: 'Sea Salt Cookies', description: 'Two gooey chocolate chunk cookies with flaky salt.', price: 99, image: photo('photo-1499636136210-6f4ee915583e') },
    ],
  },
  {
    id: 'dumpling-club', name: 'Dumpling Club', cuisine: 'Chinese', tags: ['Dumplings', 'Noodles'], rating: 4.6, ratingCount: 325,
    deliveryMinutes: [25, 35], deliveryFee: 29, minOrder: 199, image: photo('photo-1563245372-f21724e3856d'), cover: photo('photo-1563245372-f21724e3856d', 1500), description: 'Little parcels of big happiness.',
    dishes: [
      { id: 'pork-dumplings', name: 'Pork & Chive Dumplings', description: 'Eight pan-seared dumplings with black vinegar dip.', price: 189, image: photo('photo-1563245372-f21724e3856d'), popular: true },
      { id: 'chow-mein', name: 'Wok-Tossed Chow Mein', description: 'Egg noodles, crisp vegetables, and savory house sauce.', price: 199, image: photo('photo-1585032226651-759b368d7246') },
      { id: 'bao', name: 'Crispy Pork Bao', description: 'Two fluffy buns with crispy pork belly and pickled cucumber.', price: 159, image: photo('photo-1563245372-f21724e3856d') },
    ],
  },
  {
    id: 'thai-together', name: 'Thai Together', cuisine: 'Thai', tags: ['Thai favorites', 'Noodles'], rating: 4.7, ratingCount: 287,
    deliveryMinutes: [30, 40], deliveryFee: 35, minOrder: 249, image: photo('photo-1559314809-0d155014e29e'), cover: photo('photo-1559314809-0d155014e29e', 1500), description: 'Bright herbs, bold sauces, full-on flavor.',
    dishes: [
      { id: 'pad-thai', name: 'Pad Thai', description: 'Wok-fried rice noodles, egg, tofu, peanuts, and lime.', price: 229, image: photo('photo-1559314809-0d155014e29e'), popular: true, extras: [{ id: 'shrimp', name: 'Add shrimp', price: 75 }] },
      { id: 'green-curry', name: 'Thai Green Curry', description: 'Coconut curry, sweet basil, bamboo shoots, and jasmine rice.', price: 249, image: photo('photo-1603894584373-5ac82b2ae398') },
      { id: 'mango-sticky', name: 'Mango Sticky Rice', description: 'Sweet coconut rice with ripe Philippine mango.', price: 149, image: photo('photo-1601050690597-df0568f70950') },
    ],
  },
  {
    id: 'tita-mays-merienda', name: 'Tita May’s Merienda', cuisine: 'Filipino', tags: ['Filipino snacks', 'Merienda'], rating: 4.8, ratingCount: 412,
    deliveryMinutes: [15, 25], deliveryFee: 15, minOrder: 99, image: photo('photo-1626082927389-6cd097cdc6ec'), cover: photo('photo-1626082927389-6cd097cdc6ec', 1500), description: 'Afternoon snacks, made with extra love.', offer: '₱30 off your first merienda',
    dishes: [
      { id: 'lumpia', name: 'Crispy Lumpiang Shanghai', description: 'Eight crunchy pork spring rolls with sweet chili sauce.', price: 129, image: photo('photo-1626082927389-6cd097cdc6ec'), popular: true },
      { id: 'pancit', name: 'Pancit Canton', description: 'Classic stir-fried noodles, vegetables, and calamansi.', price: 149, image: photo('photo-1585032226651-759b368d7246') },
      { id: 'halo-halo', name: 'Classic Halo-Halo', description: 'Shaved ice, leche flan, ube, sweet beans, and milk.', price: 129, image: photo('photo-1563805042-7684c019e1cb') },
    ],
  },
];

export const initialAddresses: Address[] = [
  { id: 'home', label: 'Home', recipient: 'Alex Santos', phone: '0917 123 4567', street: 'Unit 4B, Sampaguita Residences, 12 Maginhawa St.', city: 'Quezon City, Metro Manila', instructions: 'Please call when you arrive.' },
  { id: 'office', label: 'Work', recipient: 'Alex Santos', phone: '0917 123 4567', street: '8F North Wing, Example Business Center', city: 'Makati City, Metro Manila', instructions: 'Leave at reception, please.' },
];

export const getRestaurant = (id: string) => restaurants.find((restaurant) => restaurant.id === id);
export const getDish = (restaurantId: string, dishId: string) => getRestaurant(restaurantId)?.dishes.find((dish) => dish.id === dishId);
