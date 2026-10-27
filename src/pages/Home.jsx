import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Compass, Anchor, Award, Shield, ArrowRight, Star, Heart, CheckCircle2, Sparkles, Clock, MapPin } from 'lucide-react';
import { SearchBar } from '../components/package/SearchBar';
import { PackageCard } from '../components/package/PackageCard';
import { Button } from '../components/common/Button';
import { useBooking } from '../context/BookingContext';

export const Home = () => {
  const navigate = useNavigate();
  const { packages, selectPackage } = useBooking();

  // Highlight featured packages
  const featuredPackages = packages.filter((p) => p.featured).slice(0, 3);

  const handleSearchSubmit = () => {
    navigate('/packages');
  };

  return (
    <div className="home-page animate-fade-in">
      {/* 1. Hero Section */}
      <section style={{
        position: 'relative',
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(rgba(15, 26, 36, 0.72), rgba(15, 26, 36, 0.82)), url('https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=1920&q=80') center/cover no-repeat`,
        color: '#ffffff',
        padding: '5rem 1.5rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '980px', width: '100%', margin: '0 auto', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <span className="eyebrow-tag" style={{
              backgroundColor: 'rgba(197, 160, 89, 0.18)',
              color: 'var(--color-gold-light)',
              borderColor: 'var(--color-gold-border)'
            }}>
              <Sparkles size={13} />
              Heritage Voyages Reborn Since 1912
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)',
            fontWeight: 500,
            lineHeight: 1.15,
            color: '#ffffff',
            marginBottom: '1.25rem',
            letterSpacing: '-0.01em',
            textShadow: '0 4px 20px rgba(0,0,0,0.5)'
          }}>
            Timeless Luxury.<br />
            Extraordinary Oceanic Expeditions.
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
            color: '#d6dfeb',
            maxWidth: '680px',
            margin: '0 auto 2.5rem auto',
            lineHeight: 1.6,
            fontWeight: 300
          }}>
            Experience grand transatlantic crossings, private alpine chalets, and azure Mediterranean sanctuaries with the world's most distinguished travel concierge.
          </p>

          {/* SearchBar with useRef destination auto-focus */}
          <div style={{ maxWidth: '920px', margin: '0 auto', textAlign: 'left' }}>
            <SearchBar onSearchSubmit={handleSearchSubmit} autoFocusOnMount={false} />
          </div>

          {/* Luxury Highlights Strip */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '2.5rem',
            marginTop: '3.5rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            fontSize: '0.86rem',
            color: '#c2d0e0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Award size={18} color="var(--color-gold-light)" />
              <span>Conde Nast Top Luxury Tour Operator</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Shield size={18} color="var(--color-gold-light)" />
              <span>100% Royal Bond Protection</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Star size={18} color="var(--color-gold-light)" fill="var(--color-gold-light)" />
              <span>4.94/5 Average Guest Distinction</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Signature Voyages Showcase */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--color-bg-canvas)' }}>
        <div className="luxury-container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '1.5rem',
            marginBottom: '3rem'
          }}>
            <div>
              <span className="eyebrow-tag" style={{ marginBottom: '0.6rem' }}>
                Handcrafted Itineraries
              </span>
              <h2 style={{ fontSize: '2.3rem', color: 'var(--color-primary-dark)', margin: 0 }}>
                Signature TITANIC TOURISM Voyages
              </h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.96rem', marginTop: '0.4rem', maxWidth: '580px' }}>
                Each expedition is an orchestration of historical grace, masterclass gastronomy, and unforgettable horizons.
              </p>
            </div>

            <Button
              variant="outline-gold"
              icon={<ArrowRight size={16} />}
              onClick={() => navigate('/packages')}
            >
              Explore All 8 Expeditions
            </Button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem'
          }}>
            {featuredPackages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. The Titanic Experience Pillars */}
      <section style={{
        padding: '5rem 0',
        backgroundColor: '#ffffff',
        borderTop: '1px solid var(--color-border-subtle)',
        borderBottom: '1px solid var(--color-border-subtle)'
      }}>
        <div className="luxury-container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem auto' }}>
            <span className="eyebrow-tag" style={{ marginBottom: '0.6rem' }}>
              The Gold Standard
            </span>
            <h2 style={{ fontSize: '2.2rem', color: 'var(--color-primary-dark)', marginBottom: '0.75rem' }}>
              Why Discerning Travelers Choose TITANIC TOURISM
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.94rem', lineHeight: 1.6 }}>
              Crafted for those who consider travel not merely a destination, but a sublime art of living.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            <div style={{
              padding: '2rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-bg-canvas)',
              border: '1px solid var(--color-border-subtle)',
              textAlign: 'center'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-gold-pale)',
                border: '1px solid var(--color-gold-border)',
                color: 'var(--color-gold-deep)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto'
              }}>
                <Compass size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--color-primary-dark)' }}>
                Bespoke Route Navigation
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                Private shore landings, exclusive port berths, and hidden fjord anchorages inaccessible to conventional commercial vessels.
              </p>
            </div>

            <div style={{
              padding: '2rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-bg-canvas)',
              border: '1px solid var(--color-border-subtle)',
              textAlign: 'center'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-gold-pale)',
                border: '1px solid var(--color-gold-border)',
                color: 'var(--color-gold-deep)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto'
              }}>
                <Award size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--color-primary-dark)' }}>
                White-Glove Butler Service
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                Every suite is tended by dedicated British Guild-certified butlers delivering personalized packing, formal dining, and 24/7 care.
              </p>
            </div>

            <div style={{
              padding: '2rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-bg-canvas)',
              border: '1px solid var(--color-border-subtle)',
              textAlign: 'center'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-gold-pale)',
                border: '1px solid var(--color-gold-border)',
                color: 'var(--color-gold-deep)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto'
              }}>
                <Shield size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--color-primary-dark)' }}>
                Guaranteed Luxury Privacy
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                Strict capacity caps ensuring an intimate passenger-to-crew ratio of nearly 1:1 for supreme serenity on every nautical mile.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Grand Call To Action */}
      <section style={{
        padding: '5rem 1.5rem',
        background: 'linear-gradient(135deg, #0f1a24 0%, #162433 50%, #1f3044 100%)',
        color: '#ffffff',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <span className="eyebrow-tag" style={{
            backgroundColor: 'rgba(197, 160, 89, 0.15)',
            color: 'var(--color-gold-light)',
            borderColor: 'var(--color-gold-border)',
            marginBottom: '1rem'
          }}>
            Your Journey Awaits
          </span>

          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 2.8rem)',
            color: '#ffffff',
            marginBottom: '1rem'
          }}>
            Embark Upon the Voyage of a Lifetime
          </h2>

          <p style={{
            color: '#c4d2e2',
            fontSize: '1rem',
            lineHeight: 1.7,
            marginBottom: '2rem'
          }}>
            Discover our complete fleet of eight hand-crafted global itineraries. Reserve with complete confidence under the TITANIC TOURISM Royal Charter Guarantee.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Button
              variant="gold"
              size="lg"
              icon={<Compass size={18} />}
              onClick={() => navigate('/packages')}
            >
              Browse All Voyages
            </Button>
            <Button
              variant="outline"
              size="lg"
              style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)' }}
              onClick={() => navigate('/booking/dates')}
            >
              Direct Booking Desk
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
