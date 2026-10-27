import React from 'react';
import { Filter, RotateCcw, DollarSign, Clock, Star, Compass } from 'lucide-react';
import { CATEGORIES, DURATION_FILTERS, RATING_FILTERS } from '../../data/packagesData';
import { useBooking } from '../../context/BookingContext';

export const FilterPanel = ({ totalResults = 0 }) => {
  const {
    selectedCategory,
    setSelectedCategory,
    selectedDuration,
    setSelectedDuration,
    maxBudget,
    setMaxBudget,
    minRating,
    setMinRating,
    resetFilters
  } = useBooking();

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: 'var(--radius-md)',
      padding: '1.5rem',
      border: '1px solid var(--color-border-subtle)',
      boxShadow: 'var(--shadow-sm)',
      position: 'sticky',
      top: '90px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '1rem',
        borderBottom: '1px solid var(--color-border-subtle)',
        marginBottom: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={18} color="var(--color-gold-deep)" />
          <h4 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--color-primary-dark)' }}>
            Refine Voyages
          </h4>
        </div>
        <button
          type="button"
          onClick={resetFilters}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '0.78rem',
            color: 'var(--color-gold-deep)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            padding: '0.2rem 0.5rem',
            borderRadius: 'var(--radius-sm)'
          }}
          title="Reset all filters"
        >
          <RotateCcw size={13} />
          <span>Reset</span>
        </button>
      </div>

      {/* 1. Category / Expedition Theme */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Compass size={15} color="var(--color-gold-deep)" />
          <span>Expedition Category</span>
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              style={{
                textAlign: 'left',
                padding: '0.45rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid',
                borderColor: selectedCategory === cat ? 'var(--color-gold-base)' : 'transparent',
                backgroundColor: selectedCategory === cat ? 'var(--color-gold-pale)' : 'transparent',
                color: selectedCategory === cat ? 'var(--color-gold-deep)' : 'var(--color-text-main)',
                fontSize: '0.86rem',
                fontWeight: selectedCategory === cat ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Maximum Budget Slider */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <label className="form-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <DollarSign size={15} color="var(--color-gold-deep)" />
            <span>Maximum Fare</span>
          </label>
          <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-primary-dark)' }}>
            ${maxBudget.toLocaleString()}
          </span>
        </div>
        <input
          type="range"
          min="2000"
          max="5000"
          step="100"
          value={maxBudget}
          onChange={(e) => setMaxBudget(Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--color-gold-base)', cursor: 'pointer' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--color-text-light)', marginTop: '0.2rem' }}>
          <span>$2,000</span>
          <span>$5,000</span>
        </div>
      </div>

      {/* 3. Duration Filters */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Clock size={15} color="var(--color-gold-deep)" />
          <span>Voyage Duration</span>
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {DURATION_FILTERS.map((d) => (
            <label
              key={d.value}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                fontSize: '0.86rem',
                color: 'var(--color-text-main)',
                cursor: 'pointer',
                padding: '0.25rem 0'
              }}
            >
              <input
                type="radio"
                name="duration-filter"
                value={d.value}
                checked={selectedDuration === d.value}
                onChange={() => setSelectedDuration(d.value)}
                style={{ accentColor: 'var(--color-gold-base)', cursor: 'pointer' }}
              />
              <span>{d.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 4. Minimum Guest Rating */}
      <div>
        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Star size={15} color="var(--color-gold-deep)" />
          <span>Guest Rating</span>
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {RATING_FILTERS.map((r) => (
            <label
              key={r.value}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                fontSize: '0.86rem',
                color: 'var(--color-text-main)',
                cursor: 'pointer',
                padding: '0.25rem 0'
              }}
            >
              <input
                type="radio"
                name="rating-filter"
                value={r.value}
                checked={minRating === r.value}
                onChange={() => setMinRating(r.value)}
                style={{ accentColor: 'var(--color-gold-base)', cursor: 'pointer' }}
              />
              <span>{r.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Result count tag */}
      <div style={{
        marginTop: '1.5rem',
        paddingTop: '1rem',
        borderTop: '1px solid var(--color-border-subtle)',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--color-text-muted)'
      }}>
        Showing <strong style={{ color: 'var(--color-primary-dark)' }}>{totalResults}</strong> voyages matching criteria
      </div>
    </div>
  );
};
