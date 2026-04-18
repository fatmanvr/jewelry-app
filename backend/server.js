require("dotenv").config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const products = require('./products.json');

const app = express();
app.use(cors());
app.use(express.json());

let cachedGoldPrice = null;
let lastFetchTime = null;
const CACHE_DURATION = 5 * 60 * 1000;

async function getGoldPrice() {
  const now = Date.now();
  if (cachedGoldPrice && lastFetchTime && (now - lastFetchTime) < CACHE_DURATION) {
    return cachedGoldPrice;
  }

  const GOLDAPI_KEY = process.env.GOLDAPI_KEY;

  if (GOLDAPI_KEY) {
    try {
      const response = await axios.get('https://www.goldapi.io/api/XAU/USD', {
        headers: { 'x-access-token': GOLDAPI_KEY }
      });
      const pricePerGram = response.data.price_gram_24k;
      cachedGoldPrice = pricePerGram;
      lastFetchTime = now;
      console.log(`Gold price fetched from goldapi.io: $${pricePerGram.toFixed(2)}/g`);
      return cachedGoldPrice;
    } catch (err) {
      console.log('goldapi.io failed:', err.message);
    }
  } else {
    console.log('No GOLDAPI_KEY found, using fallback price.');
  }

  cachedGoldPrice = 97.5;
  lastFetchTime = now;
  return cachedGoldPrice;
}

function calculatePrice(product, goldPrice) {
  return (product.popularityScore + 1) * product.weight * goldPrice;
}

function popularityToStars(score) {
  return Math.round(score * 5 * 10) / 10;
}

app.get('/api/products', async (req, res) => {
  try {
    const goldPrice = await getGoldPrice();
    let result = products.map(p => ({
      ...p,
      price: parseFloat(calculatePrice(p, goldPrice).toFixed(2)),
      starRating: popularityToStars(p.popularityScore),
      goldPricePerGram: parseFloat(goldPrice.toFixed(2))
    }));
    const { minPrice, maxPrice, minPopularity, maxPopularity } = req.query;
    if (minPrice) result = result.filter(p => p.price >= parseFloat(minPrice));
    if (maxPrice) result = result.filter(p => p.price <= parseFloat(maxPrice));
    if (minPopularity) result = result.filter(p => p.popularityScore >= parseFloat(minPopularity));
    if (maxPopularity) result = result.filter(p => p.popularityScore <= parseFloat(maxPopularity));
    res.json({ success: true, goldPricePerGram: parseFloat(goldPrice.toFixed(2)), count: result.length, products: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/gold-price', async (req, res) => {
  try {
    const price = await getGoldPrice();
    res.json({ success: true, pricePerGram: parseFloat(price.toFixed(2)), currency: 'USD' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Jewelry API running on port ${PORT}`);
});
