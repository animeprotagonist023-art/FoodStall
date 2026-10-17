# FoodStall — Good food, good mood.

FoodStall is a mobile-first food delivery marketplace frontend prototype for the Philippines. It is built with React, TypeScript, Vite, React Router, and plain CSS. All restaurants, prices, ratings, discounts, delivery estimates, profile details, checkout, and tracking are sample demonstration data.

> **Demo-only notice:** no real orders are transmitted, no payment is processed, and no courier is dispatched. Order statuses are manually advanced on the order details screen and are not live tracking.

## Requirements

- Node.js 20 or newer (Node.js 22 recommended)
- npm
- An internet connection for the remote food photography and Google Fonts. The UI includes image fallbacks if a photo fails to load.

## Install and run

From the `foodstall` project directory:

```bash
npm install
npm run dev
```

Vite prints a local URL (usually `http://localhost:5173`). Open it in your browser. To type-check and create a production bundle, run:

```bash
npm run build
```

To preview the production bundle locally:

```bash
npm run preview
```

## Features

- Homepage with a search bar, category shortcuts, promotion, neighborhood favorites, quick-delivery picks, and budget-friendly restaurants.
- Search by restaurant, cuisine, tags, or dish names, with working cuisine, offer, delivery-time, rating, and sort controls.
- Eleven fictional restaurants and thirty-plus dishes, featuring Filipino food, burgers, pizza, Japanese and Korean dishes, healthy bowls, café items, desserts, Chinese dumplings, and Thai food.
- Restaurant menus with dish details, required size options, optional extras, quantity, special instructions, and dynamically updated prices.
- Persistent cart with edit/remove/quantity actions, one-restaurant-per-bag behavior, confirmation before replacing a different restaurant's bag, and centralized price calculations.
- Voucher `SALO10` (10% off the food subtotal at ₱299+, capped at ₱80) and `FREESHIP` (sample delivery-fee discount at ₱199+).
- Checkout with saved addresses, required-field and phone validation, sample payment options, duplicate-submit protection, and a mock order confirmation.
- Order history and order detail timelines. The timeline is explicitly a simulation and must be advanced manually; it is not GPS-based.
- Favorites, offers, editable saved Philippine-style addresses, profile shortcuts, and an interactive FAQ/help form.
- Responsive mobile navigation, accessible modal keyboard handling, toast notifications, image placeholders, and `prefers-reduced-motion` support.
- Cart, favorites, saved addresses, and order history persist in local storage when the browser permits it. Stored data is checked and malformed values are handled with fallbacks.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Homepage / discovery |
| `/search` | Search and filter restaurants and dishes |
| `/restaurant/:restaurantId` | Restaurant details, menu, dish customizer |
| `/cart` | Shopping bag and voucher summary |
| `/checkout` | Simulated checkout |
| `/order/:orderId` | Demo tracking timeline and order summary |
| `/orders` | Order history and reorder |
| `/favorites` | Saved restaurants |
| `/offers` | Voucher descriptions |
| `/profile` | Demo profile shortcuts and summary |
| `/addresses` | Create, edit, and delete saved addresses |
| `/help` | FAQ and local-only demo message form |

## Project structure

```text
foodstall/
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── README.md
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── data.ts                 # Fictional restaurants, dishes, addresses
    ├── types.ts                # Core TypeScript types
    ├── lib.ts                  # Currency and cart/voucher calculations
    ├── store.tsx               # Shared state and localStorage persistence
    ├── styles.css              # Tokens, components, motion, breakpoints
    ├── components/
    │   ├── common.tsx          # Header, footer, cards, dialogs, toasts
    │   └── DishCustomizer.tsx  # Configurable dish dialog/bottom sheet
    └── pages/
        ├── HomePage.tsx
        ├── SearchPage.tsx
        ├── RestaurantPage.tsx
        ├── CartPage.tsx
        ├── CheckoutPage.tsx
        ├── OrdersPage.tsx
        └── AccountPages.tsx
```

## Architecture notes

- `data.ts` is the mock catalogue; UI components do not own the restaurant dataset.
- `types.ts` defines restaurant, dish, cart, address, and order records.
- `lib.ts` owns currency formatting and cart totals, service fee, voucher eligibility, and discount calculations.
- `store.tsx` provides shared state so cart changes, favorites, addresses, and orders stay in sync across routes.
- The app intentionally has no backend, user authentication, external checkout provider, live delivery API, or location/GPS tracking.

## Known limitations

- Restaurant availability and all menu content are fictional, so real ordering is not possible.
- Food photography and Google Fonts are loaded from external hosts. An internet connection is needed for all visual assets; if a dish image fails, the UI falls back to a placeholder.
- Local storage is browser-specific and does not synchronize across devices or browser profiles.
- Order statuses can be advanced manually to demonstrate the timeline. They do not update automatically and do not indicate a real delivery.
- A production deployment would still need real restaurant/catalogue data, server-side order validation, authentication, secure payment integration, delivery integrations, monitoring, and privacy/security review.

## Publish a public demo with GitHub Pages

This project is configured for a GitHub repository named **`FoodStall`** and uses hash-based routes so inner pages continue to work when hosted as a static site. If you choose a different repository name, update `base` in `vite.config.ts` to `/<YOUR-REPOSITORY-NAME>/`.

1. Create a **public** repository on GitHub named `FoodStall`.
2. Upload the contents of this `foodstall` folder into the repository root (not the enclosing folder and not only the ZIP file). Keep the `.github/workflows/deploy.yml` file and its folder structure.
3. In the repository, open **Settings → Pages** and choose **GitHub Actions** as the source.
4. Open the **Actions** tab and wait for **Deploy FoodStall to GitHub Pages** to finish successfully.
5. The live site will be at `https://YOUR-GITHUB-USERNAME.github.io/FoodStall/`. Replace `YOUR-GITHUB-USERNAME` with your GitHub username.

The workflow automatically rebuilds and republishes the site when you push changes to the `main` branch. The first deployment can take a few minutes. This is a demonstration frontend only; it does not submit real orders or process payments.
