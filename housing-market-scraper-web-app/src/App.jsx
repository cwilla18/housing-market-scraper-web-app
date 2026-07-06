import React, { useState } from 'react';
import './App.css'

// Import housing data
import ITEMS_DATA from './assets/HousingData/data.json'

export default function FilteredList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgency, setSelectedAgency] = useState('All');

  const filteredItems = ITEMS_DATA.filter((item) => {
    const matchesSearch = item.address
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesCategory = 
      selectedAgency === 'All' || item.agency === selectedAgency;

    return matchesSearch && matchesCategory;
  });

  const UniqueAgencies = () => {
    const agencies = [...new Set(ITEMS_DATA.map(item => item.agency))];

    return (
      <select value={selectedAgency} onChange={(e) => setSelectedAgency(e.target.value)} style={{ padding: '8px', fontSize: '16px' }} >
        <option key="All" value="All">All Agencies</option>
        {agencies.map(agency => (
          <option key={agency} value={agency}>{agency}</option>
        ))}
      </select>
    );
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2> 
        House Search
      </h2>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input type="text" placeholder="Search items..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ padding: '8px', fontSize: '16px' }} />

        <UniqueAgencies />

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <article key={item.id} style={{ padding: '12px', border: '1px solid #eee', borderRadius: 8, display: 'flex', gap: 12, alignItems: 'flex-start', background: '#fff' }}>
              <img
                src={item.image_url}
                alt={item.address}
                style={{ width: 160, height: 110, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }}
              />

              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: '16px' }}>{item.address}</h3>

                <div style={{ marginTop: 8, display: 'flex', gap: 12, flexWrap: 'wrap', color: '#333' }}>
                  <small><strong>Price:</strong> {item.price}</small>
                  <small><strong>Old price:</strong> {item.old_price}</small>
                  <small><strong>Agency:</strong> {item.agency}</small>
                  <small><strong>Date:</strong> {item.date_time}</small>
                  <small><strong>Active:</strong> {item.active ? 'Yes' : 'No'}</small>
                </div>

                <p style={{ marginTop: 10, marginBottom: 4 }}>
                  <a href={item.house_url} target="_blank" rel="noreferrer">View listing</a>
                </p>

                <p style={{ margin: 0, fontSize: 12, color: '#666' }}>
                  <span><strong>ID:</strong> {item.id}</span>
                  {' — '}
                  <span style={{ wordBreak: 'break-word' }}>{item.house_url}</span>
                </p>
              </div>
            </article>
          ))
        ) : (
          <p>No results found matching your criteria.</p>
        )}
      </div>
    </div>
  );
}