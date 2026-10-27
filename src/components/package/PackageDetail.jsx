import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MapPin, Clock, Star, Calendar, Users, Check, X, ShieldCheck,
  ArrowRight, ShoppingBag, ChevronRight, Award, Compass, Share2
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { Button } from '../common/Button';

/**
 * PackageDetail Component
 * Experiment 1a & Experiment 2c Reusable Component
 * Renders complete travel package details:
 * Package name, Destination, Duration, Itinerary, Price, Inclusions, Exclusions, Ratings
 */
export const PackageDetail = ({ packageId, onBookNow, onAddToCart }) => {
  const params = useParams();
  const navigate = useNavigate();
  const effectiveId = packageId || params.id;
  const {
    getPackageById,
    selectPackage,
    addToCart,
    travelDates,
    setTravelDates,
    travelers,
    setTravelers,
    checkAvailability,
    availabilityData,
    availabilityLoading
  } = useBooking();

  const [liveAvailability, setLiveAvailability] = useState(null);
  const [checkingApi, setCheckingApi] = useState(false);

  const pkg = getPackageById(effectiveId);
  const [activeTab, setActiveTab] = useState('itinerary');
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [copyNotification, setCopyNotification] = useState(false);

  if (!pkg) {
    return (
      <div style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '480px' }}>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--color-primary-dark)', marginBottom: '0.75rem' }}>
            Voyage Package Not Located
          </h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
            We could not find a charted package matching ID #{effectiveId}. It may have retired from our active fleet itinerary.
          </p>
          <Button variant="primary" onClick={() => navigate('/packages')}>
            Browse All Voyages
          </Button>
        </div>
      </div>
    );
  }

  const handleBookNow = () => {
    selectPackage(pkg);
    if (onBookNow) {
      onBookNow(pkg);
    } else {
      // Programmatic routing via useNavigate to Travel Date Selection (Experiment 3g)
      navigate('/booking/dates');
    }
  };

  const handleAddToCart = () => {
    addToCart(pkg);
    if (onAddToCart) {
      onAddToCart(pkg);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopyNotification(true);
    setTimeout(() => setCopyNotification(false), 2500);
  };

  return (
    <div className="package-detail-component">
      {/* Breadcrumb Navigation (Link) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.84rem',
        color: 'var(--color-text-muted)',
        marginBottom: '1.5rem'
      }}>
        <Link to="/" style={{ color: 'var(--color-gold-deep)' }}>Home</Link>
        <ChevronRight size={14} />
        <Link to="/packages" style={{ color: 'var(--color-gold-deep)' }}>Voyages</Link>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--color-primary-dark)', fontWeight: 600 }}>{pkg.name}</span>
      </div>

      {/* Title & Top Attributes */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span className="eyebrow-tag">Voyage #{pkg.id}</span>
            <span className="eyebrow-tag" style={{ backgroundColor: 'var(--color-bg-card)', color: 'var(--color-primary-navy)' }}>
              {pkg.category}
            </span>
            {pkg.badge && (
              <span className="eyebrow-tag" style={{ backgroundColor: 'var(--color-primary-deep)', color: '#ffffff', borderColor: 'var(--color-gold-base)' }}>
                {pkg.badge}
              </span>
            )}
          </div>

          <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.7rem)', color: 'var(--color-primary-dark)', lineHeight: 1.2, marginBottom: '0.6rem' }}>
            {pkg.name}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-gold-deep)', fontWeight: 500 }}>
              <MapPin size={16} />
              <span>{pkg.destination}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={16} color="var(--color-gold-deep)" />
              <span>{pkg.durationText}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-primary-dark)', fontWeight: 600 }}>
              <Star size={16} fill="#c5a059" color="#c5a059" />
              <span>{pkg.rating}</span>
              <span style={{ color: 'var(--color-text-light)', fontWeight: 400 }}>({pkg.reviewsCount} verified voyager reviews)</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={handleShare}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.6rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border-medium)',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              fontSize: '0.84rem',
              color: 'var(--color-primary-navy)'
            }}
          >
            <Share2 size={15} />
            <span>{copyNotification ? 'Link Copied!' : 'Share Itinerary'}</span>
          </button>
        </div>
      </div>

      {/* Photo Gallery Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '1rem',
        height: '420px',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        marginBottom: '2.5rem'
      }} className="gallery-grid">
        <div style={{ height: '100%', overflow: 'hidden' }}>
          <img
            src={pkg.gallery[selectedPhoto] || pkg.image}
            alt={pkg.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateRows: 'repeat(2, 1fr)', gap: '1rem', height: '100%' }}>
          {pkg.gallery.slice(1, 3).map((photoUrl, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedPhoto(idx + 1)}
              style={{
                height: '100%',
                overflow: 'hidden',
                cursor: 'pointer',
                position: 'relative',
                border: selectedPhoto === idx + 1 ? '2px solid var(--color-gold-base)' : 'none'
              }}
            >
              <img
                src={photoUrl}
                alt={`${pkg.name} view ${idx + 2}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content & Sticky Booking Action Widget */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.8fr', gap: '2.5rem' }} className="package-detail-layout">
        {/* Left Details: Overview, Itinerary, Inclusions/Exclusions */}
        <div>
          {/* Overview Section */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border-subtle)',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h3 style={{ fontSize: '1.35rem', color: 'var(--color-primary-dark)', marginBottom: '0.75rem' }}>
              Expedition Overview
            </h3>
            <p style={{ fontSize: '0.96rem', color: 'var(--color-text-main)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              {pkg.overview}
            </p>

            {/* Tabs for Itinerary vs Inclusions */}
            <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--color-border-subtle)', marginBottom: '1.5rem' }}>
              <button
                type="button"
                onClick={() => setActiveTab('itinerary')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '0.65rem 0.2rem',
                  fontSize: '0.94rem',
                  fontWeight: activeTab === 'itinerary' ? 600 : 400,
                  color: activeTab === 'itinerary' ? 'var(--color-gold-deep)' : 'var(--color-text-muted)',
                  borderBottom: activeTab === 'itinerary' ? '2px solid var(--color-gold-base)' : '2px solid transparent',
                  cursor: 'pointer'
                }}
              >
                Day-by-Day Itinerary ({pkg.itinerary.length} Days)
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('inclusions')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '0.65rem 0.2rem',
                  fontSize: '0.94rem',
                  fontWeight: activeTab === 'inclusions' ? 600 : 400,
                  color: activeTab === 'inclusions' ? 'var(--color-gold-deep)' : 'var(--color-text-muted)',
                  borderBottom: activeTab === 'inclusions' ? '2px solid var(--color-gold-base)' : '2px solid transparent',
                  cursor: 'pointer'
                }}
              >
                Inclusions & Exclusions
              </button>
            </div>

            {/* Tab 1: Day-by-Day Itinerary (Requirement 3d) */}
            {activeTab === 'itinerary' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {pkg.itinerary.map((item) => (
                  <div
                    key={item.day}
                    style={{
                      display: 'flex',
                      gap: '1.25rem',
                      paddingBottom: '1.25rem',
                      borderBottom: '1px solid var(--color-border-subtle)'
                    }}
                  >
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-gold-pale)',
                      border: '1px solid var(--color-gold-border)',
                      color: 'var(--color-gold-deep)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      flexShrink: 0
                    }}>
                      <span>DAY</span>
                      <span>{item.day}</span>
                    </div>

                    <div>
                      <h4 style={{ fontSize: '1.05rem', color: 'var(--color-primary-dark)', marginBottom: '0.35rem' }}>
                        {item.title}
                      </h4>
                      <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                        {item.details}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 2: Inclusions & Exclusions (Requirement 3d) */}
            {activeTab === 'inclusions' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* Inclusions */}
                <div>
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--color-primary-dark)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Check size={18} color="var(--color-success)" />
                    <span>Complimentary Inclusions</span>
                  </h4>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem' }}>
                    {pkg.inclusions.map((inc, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', color: 'var(--color-text-main)' }}>
                        <span style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>✓</span>
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Exclusions */}
                <div>
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--color-primary-dark)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <X size={18} color="var(--color-danger)" />
                    <span>Excluded Discretionaries</span>
                  </h4>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem' }}>
                    {pkg.exclusions.map((exc, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', color: 'var(--color-text-muted)' }}>
                        <span style={{ color: 'var(--color-danger)' }}>✕</span>
                        <span>{exc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sticky Booking Box */}
        <div>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-gold-border)',
            padding: '2rem',
            boxShadow: 'var(--shadow-md)',
            position: 'sticky',
            top: '95px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              paddingBottom: '1.25rem',
              borderBottom: '1px solid var(--color-border-subtle)',
              marginBottom: '1.5rem'
            }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-text-light)' }}>First Class Fare</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 600, color: 'var(--color-primary-dark)' }}>
                    ${pkg.price.toLocaleString()}
                  </span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>/ guest</span>
                </div>
              </div>

              <div style={{
                backgroundColor: 'var(--color-gold-pale)',
                border: '1px solid var(--color-gold-border)',
                padding: '0.25rem 0.6rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.76rem',
                fontWeight: 600,
                color: 'var(--color-gold-deep)'
              }}>
                {pkg.durationText}
              </div>
            </div>

            {/* Quick Date Inputs & API Availability (Experiment 1d) */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label className="form-label" style={{ margin: 0 }}>Voyage Departure Date</label>
                <button
                  type="button"
                  onClick={async () => {
                    setCheckingApi(true);
                    try {
                      const res = await checkAvailability(pkg.id, travelDates.departure || '2026-06-15');
                      setLiveAvailability(res);
                    } catch (e) {
                      console.error(e);
                    } finally {
                      setCheckingApi(false);
                    }
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-gold-deep)',
                    fontSize: '0.74rem',
                    cursor: 'pointer',
                    fontWeight: 600,
                    textDecoration: 'underline'
                  }}
                >
                  {checkingApi ? 'Querying API...' : '⚡ Check Cabin Availability (API)'}
                </button>
              </div>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={travelDates.departure || ''}
                onChange={(e) => setTravelDates({ ...travelDates, departure: e.target.value })}
                className="form-input"
              />
              {liveAvailability && (
                <div style={{
                  marginTop: '0.6rem',
                  padding: '0.65rem 0.85rem',
                  backgroundColor: 'var(--color-gold-pale)',
                  border: '1px solid var(--color-gold-border)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.78rem',
                  color: 'var(--color-primary-dark)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: 'var(--color-gold-deep)' }}>
                    <span>✓ API Status: {liveAvailability.status}</span>
                    <span>{liveAvailability.availableCabins} Cabins Open</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                    Next Sailing: {liveAvailability.nextSailing} • {liveAvailability.stateroomTypes?.join(', ')}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Guest Count */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label className="form-label">Travelers (Party Size)</label>
              <select
                value={travelers.adults || 2}
                onChange={(e) => setTravelers({ ...travelers, adults: parseInt(e.target.value, 10) })}
                className="form-input"
                style={{ appearance: 'auto', cursor: 'pointer' }}
              >
                <option value={1}>1 First Class Voyager</option>
                <option value={2}>2 Voyagers (Double Stateroom)</option>
                <option value={3}>3 Voyagers (Family Suite)</option>
                <option value={4}>4 Voyagers (Imperial Delegation)</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Button
                variant="primary"
                size="lg"
                icon={<ArrowRight size={16} />}
                onClick={handleBookNow}
                style={{ width: '100%' }}
              >
                Book This Journey
              </Button>

              <Button
                variant="outline"
                size="md"
                icon={<ShoppingBag size={16} />}
                onClick={handleAddToCart}
                style={{ width: '100%' }}
              >
                Add to Booking Cart
              </Button>
            </div>

            <div style={{
              backgroundColor: 'var(--color-bg-canvas)',
              padding: '0.85rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.76rem',
              color: 'var(--color-text-muted)',
              lineHeight: 1.5,
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center'
            }}>
              <ShieldCheck size={18} color="var(--color-gold-deep)" style={{ flexShrink: 0 }} />
              <span>Complimentary 24/7 personal travel butler assigned upon confirmation.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
