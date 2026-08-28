# KingDom Server

Express REST API for KingDom Of Secrets. Game data lives in **MySQL**; events, rates, and war schedules live in **MongoDB**.

## Technologies

- **Express 5** (ES modules)
- **mysql2** connection pool
- **Mongoose** / MongoDB
- **jsonwebtoken** for sessions
- **Nodemailer** + **Mailgen** for activation mail
- **express-rate-limit** on `/auth` (30 requests / 15 minutes)
- **express-fileupload** + static `/uploads`
- **cors**, **dotenv**, **uuid**

## Scripts

```bash
cp .env.example .env
npm install
npm run dev     # nodemon, default port 3000
npm start       # node server.js
```

Listens on `0.0.0.0` so LAN clients can connect. CORS allows `http://localhost:5173` and the production domains.

## Environment

See [`.env.example`](./.env.example). Required names:

`SQL_HOST`, `SQL_PORT`, `SQL_USER`, `SQL_PASSWORD`, `SQL_DATABASE`, `MONGO_URI`, `PORT`, `JWT_SECRET`, `EMAIL`, `PASS`, `BASE_URL`, `TURNSTILE_SECRET_KEY`

Do not commit `.env`.

## API Surface

| Mount | Purpose |
|---|---|
| `/auth` | Login, register, activation, password, current user, admin check |
| `/player` | Ranks, King, royals, VIP, characters, shop history, balances |
| `/char` | Daily gifts, mail, beta gifts, gacha, missions |
| `/shop` | Catalog, categories, buy, admin CRUD |
| `/war` | Occupation, timings, last war, history |
| `/rate` | EXP / drop / gold rates |
| `/event` | Event CMS + image upload |
| `/uploads` | Static uploaded files |

Protected routes expect `Authorization: Bearer <jwt>`. Login and register verify a Cloudflare Turnstile token.

## MySQL tables (game DB)

`account`, `characterrecord`, `webshop`, `webshoprecord`, `asda2itemtemlate`, `itemsimglist`, `asda2donationitem`, `dailygift`, `dailygiftitem`, `betagifts`, `beta`, `viplevels`, `royalroles`, `battlepassmissions`, `battlepassdatarecord`, `warresults`, `guild`, `battlegroundresultrecord`, `battlegroundcharacterresultrecord`
