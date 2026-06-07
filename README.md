# Link Roaster

Submit any URL and get an AI-generated roast — a witty, sharp critique of the page with a summary, interesting takeaways, questionable claims, and a savage one-liner verdict. Past roasts are publicly visible in the feed.

## Tech Stack

**Backend:** Bun, Express, TypeScript, Prisma (Postgres/Supabase), Mongoose (MongoDB), OpenRouter AI

**Frontend:** React, TypeScript, Vite, CSS Modules

## Project Structure

```
├── client/          — React frontend
│   ├── src/
│   │   ├── api/         — API client
│   │   ├── components/  — UI components (CSS Modules)
│   │   └── assets/      — Images
│   └── .env.example
├── server/          — Express backend
│   ├── src/
│   │   ├── config/      — Scraper, OpenRouter, DB connections
│   │   ├── controller/  — Route handlers
│   │   ├── middleware/   — CORS, rate limiter
│   │   ├── models/      — Prisma helpers, Mongoose models
│   │   └── routes/      — Express routes
│   ├── prisma/
│   └── .env.example
└── .gitignore
```

## Setup

### Prerequisites
- [Bun](https://bun.sh) (for server)
- Node.js 18+ (for client)

### 1. Clone and install

```bash
# Server
cd server
bun install
cp .env.example .env   # fill in your env vars

# Client
cd ../client
npm install
cp .env.example .env   # set VITE_API_BASE_URL
```

### 2. Environment Variables

**Server** (`server/.env`):
| Variable | Description |
|---|---|
| `DATABASE_URL` | Supabase Postgres connection string (pooled) |
| `DIRECT_URL` | Supabase Postgres direct connection (for migrations) |
| `OPEN_ROUTER_KEY` | OpenRouter API key |
| `MONGO_URI` | MongoDB URI for CORS origins |

**Client** (`client/.env`):
| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend URL (e.g. `http://localhost:3000`) |

### 3. Database

```bash
cd server
bunx prisma migrate dev
bun run dev
```

### 4. Run

```bash
# Server (http://localhost:3000)
cd server && bun run dev

# Client (http://localhost:5173)
cd client && npm run dev
```

## Adding Allowed Origins (CORS)

CORS origins are stored in MongoDB. Insert documents with an `origin` field:

```js
db.origins.insertOne({ origin: "http://localhost:5173" })
db.origins.insertOne({ origin: "https://your-deployed-site.com" })
```

## API

### `POST /api/roast`
Submit a URL to be roasted.

```json
{ "url": "https://example.com", "ipHash": "<sha256-hash>" }
```

### `GET /api/roasts`
Returns the 50 most recent roasts.

## Rate Limiting

`POST /api/roast` is limited to 5 requests per hour per IP address.
