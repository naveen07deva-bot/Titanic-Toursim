import React from 'react';
import { PackageCard } from './PackageCard';
import { Loading } from '../common/Loading';
import { Compass, SearchX, RotateCcw } from 'lucide-react';
import { Button } from '../common/Button';

export const PackageList = ({
  packages = [],
  loading = false,
  error = null,
  onResetFilters,
  searchTerm = '',
  selectedCategory = ''
}) => {
  if (loading) {
    return <Loading message="Charted expeditions are loading..." />;
  }

  if (error) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '3rem 1.5rem',
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-danger-bg)'
      }}>
        <p style={{ color: 'var(--color-danger)', fontSize: '1rem', marginBottom: '1rem' }}>{error}</p>
        <Button variant="outline" onClick={onResetFilters}>Try Again</Button>
      </div>
    );
  }

  // Conditional Rendering requirement h): "No travel packages found" or "No packages available"
  if (packages.length === 0) {
    const isSearchFiltered = searchTerm.trim() !== '' || selectedCategory !== 'All Voyages';

    return (
      <div style={{
        textAlign: 'center',
        padding: '4rem 2rem',
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-md)',
        border: '1px dashed var(--color-gold-border)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-gold-pale)',
          color: 'var(--color-gold-deep)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem auto'
        }}>
          {isSearchFiltered ? <SearchX size={28} /> : <Compass size={28} />}
        </div>

        <h3 style={{ fontSize: '1.4rem', marginBottom: '0.6rem', color: 'var(--color-primary-dark)' }}>
          {isSearchFiltered ? 'No travel packages found' : 'No packages available'}
        </h3>

        <p style={{
          color: 'var(--color-text-muted)',
          fontSize: '0.92rem',
          maxWidth: '460px',
          margin: '0 auto 1.5rem auto',
          lineHeight: 1.6
        }}>
          {isSearchFiltered
            ? `We could not find any charted expeditions matching your selected criteria. Try adjusting your destination keywords, price range, or voyage duration.`
            : 'There are currently no travel packages scheduled for this category. Please check back shortly.'}
        </p>

        {onResetFilters && (
          <Button
            variant="outline-gold"
            icon={<RotateCcw size={15} />}
            onClick={onResetFilters}
          >
            Clear All Search & Filter Criteria
          </Button>
        )}
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '1.75rem'
    }}>
      {packages.map((pkg) => (
        <PackageCard key={pkg.id} pkg={pkg} />
      ))}
    </div>
  );
};
