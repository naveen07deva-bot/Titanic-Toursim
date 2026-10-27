import React, { useRef, useEffect } from 'react';
import { Search, MapPin, Calendar, Users, Target } from 'lucide-react';
import { Button } from '../common/Button';
import { useBooking } from '../../context/BookingContext';

export const SearchBar = ({ autoFocusOnMount = false, onSearchSubmit }) => {
  const {
    searchTerm,
    setSearchTerm,
    travelDates,
    setTravelDates,
    travelers,
    setTravelers
  } = useBooking();

  // useRef hook to reference and control destination search input element
  const searchInputRef = useRef(null);

  // Demonstrate DOM element referencing & auto focus via useRef
  useEffect(() => {
    if (autoFocusOnMount && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [autoFocusOnMount]);

  const handleFocusClick = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
      // Visual feedback demonstration of DOM manipulation via ref
      searchInputRef.current.style.transition = 'box-shadow 0.3s ease';
      searchInputRef.current.style.boxShadow = '0 0 0 4px rgba(197, 160, 89, 0.35)';
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.style.boxShadow = '';
        }
      }, 1000);
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setTravelDates((prev) => ({ ...prev, [name]: value }));
  };

  const handleTravelersChange = (e) => {
    const { name, value } = e.target;
    setTravelers((prev) => ({ ...prev, [name]: parseInt(value, 10) || 1 }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit();
    }
  };

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: 'var(--radius-md)',
      padding: '1.25rem 1.5rem',
      boxShadow: 'var(--shadow-lg)',
      border: '1px solid var(--color-gold-border)',
      position: 'relative'
    }}>
      <form onSubmit={handleSubmit} style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr)) 120px',
        gap: '1.25rem',
        alignItems: 'flex-end'
      }} className="search-bar-grid">

        {/* 1. Destination Field with useRef */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <label htmlFor="destination-search" className="form-label" style={{ margin: 0 }}>
              Destination / Voyage
            </label>
            {/* Direct Demonstration of useRef DOM reference triggering focus */}
            <button
              type="button"
              onClick={handleFocusClick}
              title="Click to trigger search input focus via useRef DOM hook"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-gold-deep)',
                fontSize: '0.72rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.2rem'
              }}
            >
              <Target size={12} />
              <span>focus (useRef)</span>
            </button>
          </div>
          <div className="form-input-wrapper">
            <div className="form-input-icon">
              <MapPin size={18} />
            </div>
            <input
              ref={searchInputRef}
              id="destination-search"
              type="text"
              placeholder="e.g. Southampton, Swiss Alps, Kyoto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input has-icon"
            />
          </div>
        </div>

        {/* 2. Departure Date */}
        <div>
          <label htmlFor="search-departure" className="form-label">
            Departure Date
          </label>
          <div className="form-input-wrapper">
            <div className="form-input-icon">
              <Calendar size={18} />
            </div>
            <input
              id="search-departure"
              name="departure"
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={travelDates.departure || ''}
              onChange={handleDateChange}
              className="form-input has-icon"
            />
          </div>
        </div>

        {/* 3. Guests / Travelers */}
        <div>
          <label htmlFor="search-adults" className="form-label">
            Travelers
          </label>
          <div className="form-input-wrapper">
            <div className="form-input-icon">
              <Users size={18} />
            </div>
            <select
              id="search-adults"
              name="adults"
              value={travelers.adults || 2}
              onChange={handleTravelersChange}
              className="form-input has-icon"
              style={{ cursor: 'pointer', appearance: 'auto' }}
            >
              <option value={1}>1 First Class Voyager</option>
              <option value={2}>2 First Class Voyagers (Couple)</option>
              <option value={3}>3 Guests (Private Suite)</option>
              <option value={4}>4 Guests (Family Suite)</option>
              <option value={6}>6 Guests (Royal Delegation)</option>
              <option value={8}>8 Guests (Grand Charter)</option>
            </select>
          </div>
        </div>

        {/* 4. Search Submit Action */}
        <div>
          <Button
            type="submit"
            variant="primary"
            icon={<Search size={16} />}
            style={{ width: '100%', height: '44px' }}
          >
            Find
          </Button>
        </div>
      </form>
    </div>
  );
};
