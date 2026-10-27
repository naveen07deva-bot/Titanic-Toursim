import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ArrowLeft, ArrowRight, Plus, Minus, UserCheck } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { TravelerForm } from '../../components/booking/TravelerForm';
import { BookingSummary } from '../../components/booking/BookingSummary';
import { Button } from '../../components/common/Button';

export const TravelersStep = () => {
  const navigate = useNavigate();
  const {
    travelers,
    setTravelers,
    travelerDetails,
    setTravelerDetails
  } = useBooking();

  const handleAdultsChange = (delta) => {
    setTravelers((prev) => ({
      ...prev,
      adults: Math.max(1, Math.min(8, (prev.adults || 1) + delta))
    }));
  };

  const handleChildrenChange = (delta) => {
    setTravelers((prev) => ({
      ...prev,
      children: Math.max(0, Math.min(6, (prev.children || 0) + delta))
    }));
  };

  const handleFormSubmit = (data) => {
    setTravelerDetails(data);
    // Navigate programmatically to Summary Step
    navigate('/booking/summary');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }} className="booking-grid">
      {/* Left Column: Guest Count Selector + Traveler Form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Guest Count Card */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border-subtle)',
          padding: '1.5rem 2rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <span className="eyebrow-tag" style={{ marginBottom: '0.5rem' }}>
              Step 2 of 4 • Guest Registry
            </span>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary-dark)', margin: 0 }}>
              Number of Travelers
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              Specify the party size for your private suite allocations.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* Adults */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem',
              backgroundColor: 'var(--color-bg-canvas)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border-subtle)'
            }}>
              <div>
                <strong style={{ fontSize: '0.92rem', color: 'var(--color-primary-dark)', display: 'block' }}>
                  Adults (12+ yrs)
                </strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>
                  Standard Suite Fare
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <button
                  type="button"
                  onClick={() => handleAdultsChange(-1)}
                  disabled={travelers.adults <= 1}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '1px solid var(--color-border-medium)',
                    backgroundColor: '#ffffff',
                    cursor: travelers.adults <= 1 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Minus size={14} />
                </button>
                <span style={{ fontSize: '1rem', fontWeight: 600, minWidth: '20px', textAlign: 'center' }}>
                  {travelers.adults}
                </span>
                <button
                  type="button"
                  onClick={() => handleAdultsChange(1)}
                  disabled={travelers.adults >= 8}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '1px solid var(--color-border-medium)',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Children */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem',
              backgroundColor: 'var(--color-bg-canvas)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border-subtle)'
            }}>
              <div>
                <strong style={{ fontSize: '0.92rem', color: 'var(--color-primary-dark)', display: 'block' }}>
                  Children (2-11 yrs)
                </strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-gold-deep)' }}>
                  30% Privilege Concession
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <button
                  type="button"
                  onClick={() => handleChildrenChange(-1)}
                  disabled={travelers.children <= 0}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '1px solid var(--color-border-medium)',
                    backgroundColor: '#ffffff',
                    cursor: travelers.children <= 0 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Minus size={14} />
                </button>
                <span style={{ fontSize: '1rem', fontWeight: 600, minWidth: '20px', textAlign: 'center' }}>
                  {travelers.children}
                </span>
                <button
                  type="button"
                  onClick={() => handleChildrenChange(1)}
                  disabled={travelers.children >= 6}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '1px solid var(--color-border-medium)',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lead Passenger Manifest Form */}
        <TravelerForm
          initialValues={travelerDetails}
          onSubmit={handleFormSubmit}
          submitLabel="Save & Continue to Summary"
        />

        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Button
            variant="outline"
            icon={<ArrowLeft size={16} />}
            onClick={() => navigate('/booking/dates')}
          >
            Back to Travel Dates
          </Button>
        </div>
      </div>

      {/* Right Column: Pricing Summary */}
      <div>
        <BookingSummary showProceed={false} />
      </div>
    </div>
  );
};
