# KingDom Client

React frontend for the KingDom Of Secrets website.

## Technologies

- **React 19** + **Vite 7**
- **React Router DOM 7**
- **Tailwind CSS 4** (`@tailwindcss/vite`)
- **Axios** for API calls
- **Mantine** UI
- **Keen Slider** (mission carousel)
- **Lucide React** icons
- **@marsidev/react-turnstile** (Cloudflare captcha)
- **react-hot-toast** + custom toast context

## Scripts

```bash
npm install
npm run dev       # Vite on http://localhost:5173
npm run build     # production bundle in dist/
npm run preview   # preview the production build
npm run lint
```

API base URL is `http://localhost:3000` (no `/api` prefix in local mode).

## Pages & Features

| Route | Feature |
|---|---|
| `/` | Home: hero, town/wars card, rates, hot items, top 10, King |
| `/auth` | Login & register with Turnstile |
| `/activate-account/:token` | Email activation |
| `/gamedetails` | Client download (MEGA, MediaFire, TransferNow, Google Drive) + social |
| `/shopitem` | Web shop with category filters |
| `/events`, `/events/:id` | Events and news |
| `/war` | War participants and history by town |
| `/royals` | Royal rank leaderboards |
| `/profile` | Account, characters, VIP, password |
| `/profile/details` | Daily login, gacha, mail, missions entry |
| `/myItems` | Purchase history |
| `/myMail` | Character mail and beta gifts |
| `/myMissions` | Battle pass missions |
| `/vipInfo` | VIP levels and bonuses |
| `/recharge` | Points packages (UI) |
| `/support` | Support form (placeholder) |
| `/admin` | Admin dashboard |
| `/admin/items` | Shop catalog CRUD |
| `/admin/events` | Event CMS |
| `/admin/players` | Player balances |
| `/admin/rates-wars` | Rates and war times |

Auth state is stored in `localStorage` via `userContext` and sent as `Authorization: Bearer <token>`.
