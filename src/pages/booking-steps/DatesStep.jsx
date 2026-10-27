import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { DatePicker } from '../../components/common/DatePicker';
import { Button } from '../../components/common/Button';
import { BookingSummary } from '../../components/booking/BookingSummary';

export const DatesStep = () => {
  const navigate = useNavigate();
  const {
    selectedPackage,
    travelDates,
    setTravelDates,
    tripDurationDays
  } = useBooking();

  const [errors, setErrors] = useState({});

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setTravelDates((prev) => {
      const updated = { ...prev, [name]: value };

      // If user selected departure and duration is known, auto-calculate return date
      if (name === 'departure' && value && selectedPackage?.durationDays) {
        const depDate = new Date(value);
        depDate.setDate(depDate.getDate() + selectedPackage.durationDays);
        updated.returnDate = depDate.toISOString().split('T')[0];
      }

      return updated;
    });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleProceed = () => {
    const errs = {};
    if (!travelDates.departure) {
      errs.departure = 'Please select a departure date to continue';
    }
    if (!travelDates.returnDate) {
      errs.returnDate = 'Please select a return date';
    } else if (travelDates.departure && new Date(travelDates.returnDate) <= new Date(travelDates.departure)) {
      errs.returnDate = 'Return date must be after departure date';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    // Programmatic routing via useNavigate
    navigate('/booking/travelers');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }} className="booking-grid">
      {/* Left Form: Date Selection */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border-subtle)',
        padding: '2rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ marginBottom: '1.75rem' }}>
          <span className="eyebrow-tag" style={{ marginBottom: '0.6rem' }}>
            Step 1 of 4 • Voyage Schedule
          </span>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--color-primary-dark)', marginBottom: '0.4rem' }}>
            Select Your Travel Dates
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
            Choose your preferred embarkation and disembarkation windows for {selectedPackage?.name || 'your expedition'}.
          </p>
        </div>

        {/* Warning if no travel dates selected (Requirement 2h: "Please select travel dates") */}
        {(!travelDates.departure || !travelDates.returnDate) && (
          <div style={{
            backgroundColor: 'var(--color-gold-pale)',
            border: '1px solid var(--color-gold-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.85rem 1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            color: 'var(--color-gold-deep)',
            fontSize: '0.85rem'
          }}>
            <AlertCircle size={18} />
            <span>Please select travel dates to lock in your suite pricing and availability.</span>
          </div>
        )}

        <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
          <DatePicker
            label="Embarkation / Departure Date"
            name="departure"
            value={travelDates.departure}
            onChange={handleDateChange}
            error={errors.departure}
            required
            helperText="Check-in and luggage clearance commence 3 hours prior"
          />

          <DatePicker
            label="Disembarkation / Return Date"
            name="returnDate"
            value={travelDates.returnDate}
            minDate={travelDates.departure || undefined}
            onChange={handleDateChange}
            error={errors.returnDate}
            required
            helperText="Calculated automatically based on voyage duration"
          />
        </div>

        {/* Duration Insight Box (Calculated via useMemo) */}
        <div style={{
          backgroundColor: 'var(--color-bg-canvas)',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: 'var(--radius-sm)',
          padding: '1.25rem',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <Clock size={18} color="var(--color-gold-deep)" />
            <strong style={{ fontSize: '0.92rem', color: 'var(--color-primary-dark)' }}>
              Total Trip Duration: {tripDurationDays} Days / {Math.max(1, tripDurationDays - 1)} Nights
            </strong>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
            Includes all port days, private shore excursions, and formal evening galas. Suite concierge will confirm your boarding passes 48 hours prior to embarkation.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="primary"
            size="lg"
            icon={<ArrowRight size={16} />}
            onClick={handleProceed}
          >
            Continue to Traveler Details
          </Button>
        </div>
      </div>

      {/* Right: Booking Summary component */}
      <div>
        <BookingSummary
          showProceed={false}
        />
      </div>
    </div>
  );
};
