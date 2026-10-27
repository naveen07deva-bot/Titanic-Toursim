import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Clock, MapPin, Check, ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '../common/Button';
import { useBooking } from '../../context/BookingContext';

export const PackageCard = ({ pkg }) => {
  const navigate = useNavigate();
  const { selectPackage, addToCart } = useBooking();

  const handleBookNow = (e) => {
    e.preventDefault();
    selectPackage(pkg);
    navigate('/booking/dates');
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(pkg);
  };

  return (
    <div className="luxury-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Package Image & Badges */}
      <div style={{ position: 'relative', width: '100%', height: '240px', overflow: 'hidden' }}>
        <img
          src={pkg.image}
          alt={pkg.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          loading="lazy"
        />

        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap'
        }}>
          {pkg.badge && (
            <span style={{
              backgroundColor: 'rgba(15, 26, 36, 0.85)',
              color: 'var(--color-gold-light)',
              border: '1px solid var(--color-gold-border)',
              padding: '0.25rem 0.65rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.72rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
              backdropFilter: 'blur(4px)'
            }}>
              {pkg.badge}
            </span>
          )}
          <span style={{
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            color: 'var(--color-primary-navy)',
            padding: '0.25rem 0.65rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.72rem',
            fontWeight: 600,
            backdropFilter: 'blur(4px)'
          }}>
            {pkg.category}
          </span>
        </div>

        {/* Rating pill */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-full)',
          padding: '0.25rem 0.6rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem',
          fontSize: '0.78rem',
          fontWeight: 600,
          color: 'var(--color-primary-dark)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <Star size={14} fill="#c5a059" color="#c5a059" />
          <span>{pkg.rating}</span>
          <span style={{ color: 'var(--color-text-light)', fontWeight: 400 }}>({pkg.reviewsCount})</span>
        </div>
      </div>

      {/* Package Content */}
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-gold-deep)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 500 }}>
          <MapPin size={15} />
          <span>{pkg.destination}</span>
        </div>

        <h3 style={{
          fontSize: '1.25rem',
          lineHeight: 1.3,
          marginBottom: '0.75rem',
          color: 'var(--color-primary-dark)'
        }}>
          <Link
            to={`/package/${pkg.id}`}
            style={{ color: 'inherit', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-gold-deep)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}
          >
            {pkg.name}
          </Link>
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-muted)', fontSize: '0.82rem', marginBottom: '1rem' }}>
          <Clock size={15} />
          <span>{pkg.durationText}</span>
        </div>

        <p style={{
          fontSize: '0.86rem',
          color: 'var(--color-text-muted)',
          lineHeight: 1.6,
          marginBottom: '1.25rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {pkg.overview}
        </p>

        {/* Highlights */}
        <div style={{ marginBottom: '1.5rem', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '0.9rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
            <Check size={14} color="var(--color-success)" />
            <span>{pkg.inclusions[0]}</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Check size={14} color="var(--color-success)" />
            <span>{pkg.inclusions[1]}</span>
          </div>
        </div>

        {/* Price & Actions (pinned to bottom) */}
        <div style={{
          marginTop: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid var(--color-border-subtle)',
          paddingTop: '1.1rem'
        }}>
          <div>
            <span style={{ fontSize: '0.74rem', color: 'var(--color-text-light)', display: 'block' }}>
              From / Guest
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
              <span style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.45rem',
                fontWeight: 600,
                color: 'var(--color-primary-dark)'
              }}>
                ${pkg.price.toLocaleString()}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>USD</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handleAddToCart}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border-medium)',
                backgroundColor: 'var(--color-bg-canvas)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--color-primary-navy)',
                transition: 'all 0.2s'
              }}
              title="Add to Booking Cart"
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-gold-base)';
                e.currentTarget.style.backgroundColor = 'var(--color-gold-pale)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border-medium)';
                e.currentTarget.style.backgroundColor = 'var(--color-bg-canvas)';
              }}
            >
              <ShoppingBag size={17} />
            </button>

            <Button
              variant="primary"
              size="sm"
              icon={<ArrowRight size={15} />}
              onClick={handleBookNow}
            >
              Book
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
