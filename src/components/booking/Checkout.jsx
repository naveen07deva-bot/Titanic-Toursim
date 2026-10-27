import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { BookingSummary } from './BookingSummary';

/**
 * Checkout Component
 * Experiment 1a & Experiment 2c Reusable Component
 * Renders the review and checkout interface
 */
export const Checkout = ({ onProceed }) => {
  const navigate = useNavigate();
  const { selectedPackage } = useBooking();

  const handleProceed = () => {
    if (onProceed) {
      onProceed();
    } else {
      navigate('/booking/dates');
    }
  };

  return (
    <div className="checkout-component" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <span className="eyebrow-tag" style={{ marginBottom: '0.5rem' }}>
          Express Folio Clearance
        </span>
        <h1 style={{ fontSize: '2.2rem', color: 'var(--color-primary-dark)' }}>
          Checkout & Itinerary Confirmation
        </h1>
      </div>

      <BookingSummary
        showProceed={true}
        proceedLabel="Proceed to Booking Dates & Manifest"
        onProceed={handleProceed}
      />
    </div>
  );
};
