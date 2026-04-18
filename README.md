# Jewelry Product Listing Application

A full-stack product listing application for engagement rings with real-time gold price integration.

## Live Demo

- **Frontend:** https://jewelry-app-tau.vercel.app
- **Backend API:** https://jewelry-app-production-42d1.up.railway.app

- **Backend:** Node.js + Express
- **Frontend:** React

## Getting Started

### 1. Install dependencies

\```bash
# Backend
cd backend
npm install

# Frontend (separate terminal)
cd frontend
npm install
\```

### 2. Set up environment variables

Create a `.env` file inside the `backend/` folder:

\```
GOLDAPI_KEY=your_key_here
\```

Get a free API key from [goldapi.io](https://www.goldapi.io).

### 3. Run the apps

**Backend** (runs on port 3001):
\```bash
cd backend
npm start
\```

**Frontend** (runs on port 3000):
\```bash
cd frontend
npm start
\```

Open [http://localhost:3000](http://localhost:3000)

---

## API Endpoints

### `GET /api/products`

Returns all products with calculated prices.

**Query Parameters (all optional):**

| Param | Type | Description |
|-------|------|-------------|
| `minPrice` | number | Minimum price in USD |
| `maxPrice` | number | Maximum price in USD |
| `minPopularity` | number | Min popularity score (0–1) |
| `maxPopularity` | number | Max popularity score (0–1) |

**Example:**
\```
GET /api/products?minPrice=500&maxPrice=2000&minPopularity=0.7
\```

**Response:**
\```json
{
  "success": true,
  "goldPricePerGram": 155.27,
  "count": 8,
  "products": [
    {
      "name": "Engagement Ring 1",
      "popularityScore": 0.85,
      "weight": 2.1,
      "images": { "yellow": "...", "rose": "...", "white": "..." },
      "price": 603.21,
      "starRating": 4.3,
      "goldPricePerGram": 155.27
    }
  ]
}
\```

### `GET /api/gold-price`

Returns the current gold price per gram in USD.

---

## Price Formula

\```
Price = (popularityScore + 1) × weight × goldPricePerGram
\```

Gold price is fetched in real-time from [goldapi.io](https://www.goldapi.io) using the `price_gram_24k` field. Results are cached for 5 minutes. Falls back to a hardcoded estimate if the API is unavailable.

---

## Frontend Features

- **Carousel** — left/right arrows, touch swipe, and mouse drag support
- **Color picker** — switches product image between Yellow, White, and Rose Gold
- **Star rating** — popularity score converted to out of 5 (1 decimal place)
- **Star filter** — filter by min/max popularity using an interactive drag-to-select star picker
- **Price filter** — filter by min/max price in USD
- **Responsive** — adapts from 1 to 4 columns based on screen width
- **Local fonts** — Avenir (titles) and Montserrat (body)

---

## Deployment

- **Backend** deployed on [Railway](https://railway.app) — Root Directory: `backend`, Start Command: `node server.js`
- **Frontend** deployed on [Vercel](https://vercel.com) — Root Directory: `frontend`

Set `REACT_APP_API_URL` environment variable in Vercel to your Railway backend URL:
\```
REACT_APP_API_URL=https://jewelry-app-production-427e.up.railway.app
\```
