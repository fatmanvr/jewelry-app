import React, { useState, useEffect } from 'react';
import Carousel from './components/Carousel';
import StarPicker from './components/StarPicker';
import './App.css';

const API_BASE = process.env.REACT_APP_API_URL || '';

function starsToScore(stars) {
  return stars / 5;
}

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    minStars: 0,
    maxStars: 0,
  });
  const [showFilters, setShowFilters] = useState(false);

  const fetchProducts = async (f = filters) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (f.minPrice) params.append('minPrice', f.minPrice);
      if (f.maxPrice) params.append('maxPrice', f.maxPrice);
      if (f.minStars > 0) params.append('minPopularity', starsToScore(f.minStars));
      if (f.maxStars > 0) params.append('maxPopularity', starsToScore(f.maxStars));

      const url = `${API_BASE}/api/products${params.toString() ? '?' + params.toString() : ''}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setProducts(data.products);
    } catch (e) {
      setError('Failed to load products. Please make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []); // eslint-disable-line

  const handleReset = () => {
    const reset = { minPrice: '', maxPrice: '', minStars: 0, maxStars: 0 };
    setFilters(reset);
    fetchProducts(reset);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-title-row">
          <h1 className="page-title">Product List</h1>
          <div className="header-line" />
        </div>
      </header>

      <div className="filter-section">
        <button className="filter-toggle" onClick={() => setShowFilters(v => !v)}>
          {showFilters ? 'Hide Filters ↑' : 'Filter Products ↓'}
        </button>
        {showFilters && (
          <form className="filter-form" onSubmit={e => { e.preventDefault(); fetchProducts(); }}>
            <div className="filter-row">
              <div className="filter-field">
                <label>Min Price ($)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.minPrice}
                  onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))}
                />
              </div>
              <div className="filter-field">
                <label>Max Price ($)</label>
                <input
                  type="number"
                  placeholder="9999"
                  value={filters.maxPrice}
                  onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))}
                />
              </div>
              <div className="filter-field">
                <StarPicker
                  label="Min Popularity"
                  value={filters.minStars}
                  onChange={val => setFilters(f => ({ ...f, minStars: val }))}
                />
              </div>
              <div className="filter-field">
                <StarPicker
                  label="Max Popularity"
                  value={filters.maxStars}
                  onChange={val => setFilters(f => ({ ...f, maxStars: val }))}
                />
              </div>
            </div>
            <div className="filter-actions">
              <button type="submit" className="btn-apply">Apply Filters</button>
              <button type="button" className="btn-reset" onClick={handleReset}>Reset</button>
            </div>
          </form>
        )}
      </div>

      <main className="app-main">
        {loading && (
          <div className="loading-state">
            <div className="spinner" />
            <p>Loading products...</p>
          </div>
        )}
        {error && (
          <div className="error-state">
            <p>{error}</p>
            <button onClick={() => fetchProducts()} className="btn-apply">Retry</button>
          </div>
        )}
        {!loading && !error && products.length === 0 && (
          <p className="empty-state">No products match the current filters.</p>
        )}
        {!loading && !error && products.length > 0 && (
          <Carousel products={products} />
        )}
      </main>
    </div>
  );
}
