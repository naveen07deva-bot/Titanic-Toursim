import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck, MapPin, Calendar, Users, Award, Clock } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { BookingSummary } from '../../components/booking/BookingSummary';
import { TravelerCard } from '../../components/booking/TravelerCard';
import { Button } from '../../components/common/Button';

export const SummaryStep = () => {
  const navigate = useNavigate();
  const {
    selectedPackage,
    travelDates,
    travelers,
    totalTravelersCount,
    tripDurationDays,
    travelerDetails
  } = useBooking();

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }} className="booking-grid">
      {/* Left Column: Full Review Manifest */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border-subtle)',
          padding: '2rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <span className="eyebrow-tag" style={{ marginBottom: '0.5rem' }}>
              Step 3 of 4 • Final Review
            </span>
            <h2 style={{ fontSize: '1.55rem', color: 'var(--color-primary-dark)', margin: '0.2rem 0' }}>
              Booking Manifest & Itinerary Summary
            </h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--color-text-muted)' }}>
              Please review all voyage details, passenger manifest information, and included privileges.
            </p>
          </div>

          {/* Selected Package Detail Card */}
          {selectedPackage && (
            <div style={{
              display: 'flex',
              gap: '1.25rem',
              backgroundColor: 'var(--color-bg-canvas)',
              border: '1px solid var(--color-gold-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.25rem',
              marginBottom: '1.5rem'
            }}>
              <img
                src={selectedPackage.image}
                alt={selectedPackage.name}
                style={{ width: '130px', height: '110px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-gold-deep)', fontSize: '0.8rem', fontWeight: 600 }}>
                  <MapPin size={14} />
                  <span>{selectedPackage.destination}</span>
                </div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-dark)', margin: '0.25rem 0' }}>
                  {selectedPackage.name}
                </h3>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={14} color="var(--color-gold-deep)" />
                    {selectedPackage.durationText}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Award size={14} color="var(--color-gold-deep)" />
                    {selectedPackage.category}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Lead Passenger Manifest */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1.05rem', color: 'var(--color-primary-dark)', marginBottom: '0.75rem' }}>
              Lead Passenger Information
            </h4>
            <TravelerCard
              traveler={travelerDetails}
              index={1}
              onEdit={() => navigate('/booking/travelers')}
            />
          </div>

          {/* Guaranteed Voyage Inclusions */}
          <div style={{ marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '1.05rem', color: 'var(--color-primary-dark)', marginBottom: '0.75rem' }}>
              Complimentary Royal Inclusions
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.65rem' }}>
              {selectedPackage?.inclusions.slice(0, 4).map((inc, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--color-text-main)' }}>
                  <CheckCircle2 size={16} color="var(--color-success)" style={{ flexShrink: 0 }} />
                  <span>{inc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Back and Forward Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            variant="outline"
            icon={<ArrowLeft size={16} />}
            onClick={() => navigate('/booking/travelers')}
          >
            Back to Passenger Details
          </Button>

          <Button
            variant="primary"
            size="lg"
            icon={<ArrowRight size={16} />}
            onClick={() => navigate('/booking/payment')}
          >
            Proceed to Payment & Authorization
          </Button>
        </div>
      </div>

      {/* Right Column: Pricing Breakdown */}
      <div>
        <BookingSummary
          showProceed={true}
          proceedLabel="Proceed to Payment"
          onProceed={() => navigate('/booking/payment')}
        />
      </div>
    </div>
  );
};
