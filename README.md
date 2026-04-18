# Jewelry Product Listing App

A full-stack product listing app for engagement rings with real-time gold price integration.

## Tech Stack

- **Backend**: Node.js + Express
- **Frontend**: React

## Getting Started

### 1. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend (separate terminal)
cd frontend
npm install
```

### 2. Run the apps

**Backend** (runs on port 3001):
```bash
cd backend
npm start
```

**Frontend** (runs on port 3000):
```bash
cd frontend
npm start
```

Open [http://localhost:3000](http://localhost:3000)

---

## API Endpoints

### `GET /api/products`
Returns all products with calculated prices.

**Query Parameters (all optional — Bonus filtering feature):**
| Param | Type | Description |
|-------|------|-------------|
| `minPrice` | number | Minimum price in USD |
| `maxPrice` | number | Maximum price in USD |
| `minPopularity` | number | Min popularity score (0–1) |
| `maxPopularity` | number | Max popularity score (0–1) |

**Example:**
```
GET /api/products?minPrice=500&maxPrice=2000&minPopularity=0.7
```

**Response:**
```json
{
  "success": true,
  "goldPricePerGram": 97.50,
  "count": 8,
  "products": [
    {
      "name": "Engagement Ring 1",
      "popularityScore": 0.85,
      "weight": 2.1,
      "images": { "yellow": "...", "rose": "...", "white": "..." },
      "price": 384.81,
      "starRating": 4.3,
      "goldPricePerGram": 97.50
    }
  ]
}
```

### `GET /api/gold-price`
Returns the current gold price per gram in USD.

---

## Price Formula

```
Price = (popularityScore + 1) × weight × goldPricePerGram
```

Gold price is fetched from [metals.live](https://api.metals.live) with a 5-minute cache.
Falls back to [frankfurter.app](https://api.frankfurter.app) then a hardcoded estimate.

---

## Frontend Features

- **Carousel** with left/right arrows and touch/mouse swipe support
- **Color picker** — switches product image between Yellow, White, and Rose Gold
- **Star rating** — popularity score converted to out of 5 (1 decimal)
- **Filter panel** — filter by price range and popularity score (bonus)
- **Responsive** — adapts from 1 to 4 columns based on screen width

---

## Deployment

**Backend**: Deploy to Railway, Render, or Heroku.

**Frontend**: Deploy to Vercel or Netlify.
Set `REACT_APP_API_URL` environment variable to your deployed backend URL:
```
REACT_APP_API_URL=https://your-backend.railway.app
```
