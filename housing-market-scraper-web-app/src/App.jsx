import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

import ITEMS_DATA from './assets/HousingData/data.json';

const DEFAULT_ITEMS_PER_PAGE = 9;

export default function FilteredList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgency, setSelectedAgency] = useState('All');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDiscountedOnly, setShowDiscountedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);
  const [currentPage, setCurrentPage] = useState(1);

  const agencies = useMemo(() => [...new Set(ITEMS_DATA.map((item) => item.agency))], []);

  const filteredItems = useMemo(() => {
    const normalisedQuery = searchQuery.trim().toLowerCase();
    const minPrice = Number(priceMin) || 0;
    const maxPrice = Number(priceMax) || Number.POSITIVE_INFINITY;

    return ITEMS_DATA.filter((item) => {
      const matchesSearch = !normalisedQuery || item.address.toLowerCase().includes(normalisedQuery);
      const matchesAgency = selectedAgency === 'All' || item.agency === selectedAgency;
      const matchesPrice = item.price >= minPrice && item.price <= maxPrice;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' ? item.active : !item.active);
      const matchesDiscount = !showDiscountedOnly || item.old_price > item.price;

      return matchesSearch && matchesAgency && matchesPrice && matchesStatus && matchesDiscount;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'oldest':
          return new Date(a.date_time) - new Date(b.date_time);
        case 'newest':
        default:
          return new Date(b.date_time) - new Date(a.date_time);
      }
    });
  }, [searchQuery, selectedAgency, priceMin, priceMax, statusFilter, showDiscountedOnly, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedAgency, priceMin, priceMax, statusFilter, showDiscountedOnly, sortBy]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, filteredItems.length, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
  const pageItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="app-shell">
      <header className="app-header">
        <p className="eyebrow">Discover homes</p>
        <h2>House Search</h2>
      </header>

      <div className="toolbar">
        <input
          type="text"
          placeholder="Search houses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />

        <select
          value={selectedAgency}
          onChange={(e) => setSelectedAgency(e.target.value)}
          className="filter-select"
        >
          <option value="All">All Agencies</option>
          {agencies.map((agency) => (
            <option key={agency} value={agency}>{agency}</option>
          ))}
        </select>

        <input
          type="number"
          min="0"
          placeholder="Min price"
          value={priceMin}
          onChange={(e) => setPriceMin(e.target.value)}
          className="filter-input"
        />

        <input
          type="number"
          min="0"
          placeholder="Max price"
          value={priceMax}
          onChange={(e) => setPriceMax(e.target.value)}
          className="filter-input"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All status</option>
          <option value="active">Active only</option>
          <option value="inactive">Inactive only</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="filter-select"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={showDiscountedOnly}
            onChange={(e) => setShowDiscountedOnly(e.target.checked)}
          />
          <span>Discounted homes</span>
        </label>
      </div>

      <div className="results-toolbar">
        <p className="results-summary">
          Showing {pageItems.length} of {filteredItems.length} homes
        </p>

        <label className="page-size-control">
          <span>Items per page</span>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="filter-select"
          >
            <option value={6}>6</option>
            <option value={9}>9</option>
            <option value={12}>12</option>
            <option value={18}>24</option>
            <option value={100}> 100</option>
          </select>
        </label>
      </div>

      <div className="results-grid">
        {pageItems.length > 0 ? (
          pageItems.map((item) => (
            <article key={item.id} className="property-card">
              <a href={item.house_url} target="_blank" rel="noreferrer">
              <img className="property-image" src={item.image_url} alt={item.address} />

              <div className="property-content">
                <h3>{item.address}</h3>

                <div className="property-meta">
                  <span><strong>Price:</strong> £{item.price}</span>
                  <span><strong>Old price:</strong> {item.old_price}</span>
                  <span><strong>Agency:</strong> {item.agency}</span>
                  <span><strong>Date Scraped:</strong> {item.date_time}</span>
                  <span><strong>Active:</strong> {item.active ? 'Yes' : 'No'}</span>
                </div>
              </div>
              </a>
            </article>
          ))
        ) : (
          <p className="no-results">No results found matching your criteria.</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button type="button" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={currentPage === 1}>
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              type="button"
              className={page === currentPage ? 'active-page' : ''}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}

          <button type="button" onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}