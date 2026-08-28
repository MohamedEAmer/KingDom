# KingDom Of Secrets

Official web platform for **KingDom Of Secrets** (Asda 2 Evolution): player accounts, web shop, wars, royals, missions, and admin tools.

```
KingDom/
├── client/    React + Vite frontend
└── server/    Express API (MySQL + MongoDB)
```

---

## Tech Stack

### Frontend (`client/`)

| Technology | Role |
|---|---|
| **React 19** | UI |
| **Vite 7** | Dev server and production builds |
| **React Router 7** | Client-side routing |
| **Tailwind CSS 4** | Styling |
| **Axios** | HTTP client |
| **Mantine** | UI primitives |
| **Keen Slider** | Carousels (battle pass) |
| **Lucide React** | Icons |
| **Cloudflare Turnstile** | Bot protection on login/register |
| **React Hot Toast** | Notifications |

### Backend (`server/`)

| Technology | Role |
|---|---|
| **Node.js + Express 5** | REST API |
| **MySQL (`mysql2`)** | Game accounts, characters, shop, wars, mail, missions |
| **MongoDB + Mongoose** | Events CMS, EXP/drop/gold rates, war schedules |
| **JSON Web Tokens** | Session auth |
| **Nodemailer + Mailgen** | Account activation emails |
| **express-rate-limit** | Auth brute-force protection |
| **express-fileupload** | Event image uploads |
| **CORS + dotenv** | Origins and configuration |

---

## Website Features

### Players
- Register / login with email activation and Turnstile captcha
- Profile: account info, VIP, points, password change
- Character details: daily attendance, gacha gifts, mail, beta rewards
- Battle pass missions with category filters and progress
- Web shop (browse by category, buy for a character, purchase history)
- VIP progression and bonus table
- Royal ranks (Knight → Duke → Count → Prince → King) and King showcase
- Town war results (Alpen, Silaris, Flamio)
- Events & news, game download and social links
- Top 10 ranks and hot items on the home page

### Admin
- Dashboard stats
- Shop item CRUD
- Events management (images + details)
- Player search and point balance edits
- Rates and war schedule UI

### Platform
- JWT-protected routes
- Rate-limited `/auth` endpoints
- Dual database: live game data in MySQL, CMS/config in MongoDB
- In-game item delivery through the donation/mail queue

---

## Quick Start

**Requirements:** Node.js 18+, MySQL, MongoDB.

```bash
# API
cd server
cp .env.example .env   # fill in your values
npm install
npm run dev            # http://localhost:3000

# Web
cd client
npm install
npm run dev            # http://localhost:5173
```

The client talks to `http://localhost:3000`. CORS allows `http://localhost:5173`.

Full setup notes:

- [Client README](./client/README.md)
- [Server README](./server/README.md)

---

## License

Private project for KingDom Of Secrets.
