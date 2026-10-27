import React, { useState, useMemo } from 'react';
import { useBooking } from '../context/BookingContext';
import { SearchBar } from '../components/package/SearchBar';
import { FilterPanel } from '../components/package/FilterPanel';
import { PackageList } from '../components/package/PackageList';
import { ArrowUpDown, SlidersHorizontal } from 'lucide-react';

export const PackageListPage = () => {
  const {
    filteredPackages,
    loading,
    error,
    resetFilters,
    searchTerm,
    selectedCategory
  } = useBooking();

  const [sortBy, setSortBy] = useState('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // useMemo to efficiently calculate sorted packages
  const sortedPackages = useMemo(() => {
    const list = [...filteredPackages];
    if (sortBy === 'price-low') {
      return list.sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-high') {
      return list.sort((a, b) => b.price - a.price);
    }
    if (sortBy === 'rating') {
      return list.sort((a, b) => b.rating - a.rating);
    }
    if (sortBy === 'duration') {
      return list.sort((a, b) => b.durationDays - a.durationDays);
    }
    // Default featured / order
    return list;
  }, [filteredPackages, sortBy]);

  return (
    <div style={{ backgroundColor: 'var(--color-bg-canvas)', minHeight: '85vh', padding: '2.5rem 0 4rem 0' }} className="animate-fade-in">
      <div className="luxury-container">
        {/* Page Header */}
        <div style={{ marginBottom: '2rem' }}>
          <span className="eyebrow-tag" style={{ marginBottom: '0.5rem' }}>
            Curated Expeditions
          </span>
          <h1 style={{ fontSize: '2.4rem', color: 'var(--color-primary-dark)', marginBottom: '0.4rem' }}>
            Voyage Packages & Expeditions
          </h1>
          <p style={{ fontSize: '0.94rem', color: 'var(--color-text-muted)', maxWidth: '640px' }}>
            Explore transatlantic luxury liners, secluded Mediterranean archipelagos, and snow-draped alpine summits.
          </p>
        </div>

        {/* Destination Search Bar with useRef Focus */}
        <div style={{ marginBottom: '2.5rem' }}>
          <SearchBar autoFocusOnMount={false} />
        </div>

        {/* Filter & Listing Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem' }} className="packages-grid-layout">
          {/* Left Sidebar Filter Panel */}
          <div className="filter-sidebar">
            <FilterPanel totalResults={sortedPackages.length} />
          </div>

          {/* Right Main Content */}
          <div>
            {/* Sorting & Results Bar */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-subtle)',
              padding: '0.85rem 1.25rem',
              marginBottom: '1.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <span style={{ fontSize: '0.86rem', color: 'var(--color-text-muted)' }}>
                Showing <strong style={{ color: 'var(--color-primary-dark)' }}>{sortedPackages.length}</strong> available voyage{sortedPackages.length === 1 ? '' : 's'}
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <ArrowUpDown size={15} color="var(--color-gold-deep)" />
                <label htmlFor="sort-select" style={{ fontSize: '0.84rem', color: 'var(--color-text-main)', fontWeight: 500 }}>
                  Sort By:
                </label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="form-input"
                  style={{
                    padding: '0.4rem 0.8rem',
                    fontSize: '0.84rem',
                    width: 'auto',
                    cursor: 'pointer',
                    appearance: 'auto'
                  }}
                >
                  <option value="featured">Featured Voyages</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Guest Rating (Highest)</option>
                  <option value="duration">Voyage Duration</option>
                </select>
              </div>
            </div>

            {/* Package Cards List */}
            <PackageList
              packages={sortedPackages}
              loading={loading}
              error={error}
              onResetFilters={resetFilters}
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
