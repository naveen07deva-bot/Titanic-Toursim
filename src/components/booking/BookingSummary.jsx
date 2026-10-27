import React, { useState } from 'react';
import { Calendar, Users, Clock, ShieldCheck, Tag, Check, Award } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { Button } from '../common/Button';

export const BookingSummary = ({
  onProceed,
  proceedLabel = 'Proceed to Traveler Details',
  proceedDisabled = false,
  isProceeding = false,
  showProceed = true
}) => {
  const {
    selectedPackage,
    travelDates,
    travelers,
    totalTravelersCount,
    tripDurationDays,
    calculationSummary,
    discountCode,
    setDiscountCode,
    isPromoApplied,
    setIsPromoApplied
  } = useBooking();

  const [promoInput, setPromoInput] = useState(discountCode || 'VOYAGE10');
  const [promoMsg, setPromoMsg] = useState(isPromoApplied ? 'VOYAGE10 applied: 10% Royal Privilege Discount' : '');

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoInput.trim().toUpperCase() === 'VOYAGE10' || promoInput.trim().toUpperCase() === 'TITANIC2026') {
      setIsPromoApplied(true);
      setDiscountCode(promoInput.trim().toUpperCase());
      setPromoMsg('Privilege discount applied successfully!');
    } else {
      setIsPromoApplied(false);
      setPromoMsg('Invalid promotional privilege code');
    }
  };

  if (!selectedPackage) {
    return (
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border-subtle)',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <p style={{ color: 'var(--color-text-muted)' }}>Please select a travel package to view the fare breakdown.</p>
      </div>
    );
  }

  const {
    baseRate,
    packageCost,
    discount,
    taxes,
    finalTotal,
    discountPercent
  } = calculationSummary;

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--color-border-subtle)',
      boxShadow: 'var(--shadow-sm)',
      overflow: 'hidden'
    }}>
      {/* Top Header Card */}
      <div style={{
        backgroundColor: 'var(--color-primary-dark)',
        color: '#ffffff',
        padding: '1.5rem',
        borderBottom: '2px solid var(--color-gold-border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-gold-light)', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>
          <Award size={14} />
          <span>Voyage Manifest Summary</span>
        </div>
        <h3 style={{ fontSize: '1.35rem', color: '#ffffff', margin: '0.35rem 0 0.5rem 0', fontFamily: 'var(--font-serif)' }}>
          {selectedPackage.name}
        </h3>
        <p style={{ fontSize: '0.84rem', color: '#a6b4c3' }}>
          {selectedPackage.destination}
        </p>
      </div>

      <div style={{ padding: '1.5rem' }}>
        {/* Selected Dates & Traveler Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.75rem',
          paddingBottom: '1.25rem',
          borderBottom: '1px solid var(--color-border-subtle)',
          marginBottom: '1.25rem',
          fontSize: '0.84rem'
        }}>
          <div>
            <span style={{ color: 'var(--color-text-light)', display: 'block', fontSize: '0.74rem' }}>
              Departure Date
            </span>
            <strong style={{ color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
              <Calendar size={14} color="var(--color-gold-deep)" />
              {travelDates.departure || 'Pending selection'}
            </strong>
          </div>

          <div>
            <span style={{ color: 'var(--color-text-light)', display: 'block', fontSize: '0.74rem' }}>
              Return Date
            </span>
            <strong style={{ color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
              <Calendar size={14} color="var(--color-gold-deep)" />
              {travelDates.returnDate || 'Pending selection'}
            </strong>
          </div>

          <div>
            <span style={{ color: 'var(--color-text-light)', display: 'block', fontSize: '0.74rem' }}>
              Calculated Duration
            </span>
            <strong style={{ color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
              <Clock size={14} color="var(--color-gold-deep)" />
              {tripDurationDays} Days / {Math.max(1, tripDurationDays - 1)} Nights
            </strong>
          </div>

          <div>
            <span style={{ color: 'var(--color-text-light)', display: 'block', fontSize: '0.74rem' }}>
              Travelers Count
            </span>
            <strong style={{ color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
              <Users size={14} color="var(--color-gold-deep)" />
              {totalTravelersCount} Guests ({travelers.adults || 1}A, {travelers.children || 0}C)
            </strong>
          </div>
        </div>

        {/* Promo code box */}
        <form onSubmit={handleApplyPromo} style={{ marginBottom: '1.25rem' }}>
          <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-primary-navy)', display: 'block', marginBottom: '0.35rem' }}>
            Privilege / Promotion Code
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <div className="form-input-wrapper" style={{ flex: 1 }}>
              <div className="form-input-icon">
                <Tag size={15} />
              </div>
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="e.g. VOYAGE10"
                className="form-input has-icon"
                style={{ textTransform: 'uppercase', fontSize: '0.86rem' }}
              />
            </div>
            <Button type="submit" variant="outline-gold" size="sm">
              Apply
            </Button>
          </div>
          {promoMsg && (
            <p style={{
              fontSize: '0.75rem',
              color: isPromoApplied ? 'var(--color-success)' : 'var(--color-danger)',
              marginTop: '0.35rem'
            }}>
              {promoMsg}
            </p>
          )}
        </form>

        {/* Itemized Price Calculation Breakdown (useMemo calculations) */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem',
          fontSize: '0.88rem',
          paddingBottom: '1.25rem',
          borderBottom: '1px solid var(--color-border-subtle)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-main)' }}>
            <span>Base Fare Rate ({totalTravelersCount} guests)</span>
            <span style={{ fontWeight: 500 }}>${packageCost.toLocaleString()}</span>
          </div>

          {discount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-success)' }}>
              <span>Voyager Privilege ({discountPercent}% off)</span>
              <span style={{ fontWeight: 500 }}>-${discount.toLocaleString()}</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-main)' }}>
            <span>Maritime Conservation & Port Taxes (5%)</span>
            <span style={{ fontWeight: 500 }}>+${taxes.toLocaleString()}</span>
          </div>
        </div>

        {/* Grand Total */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          paddingTop: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div>
            <span style={{ fontSize: '0.76rem', color: 'var(--color-text-light)', display: 'block' }}>
              Final Booking Total (USD)
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-gold-deep)', fontWeight: 600 }}>
              All Inclusions & Luxury Taxes Covered
            </span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.75rem',
              fontWeight: 700,
              color: 'var(--color-primary-dark)'
            }}>
              ${finalTotal.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Security badge */}
        <div style={{
          backgroundColor: 'var(--color-gold-pale)',
          border: '1px solid var(--color-gold-border)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.65rem 0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.75rem',
          color: 'var(--color-primary-navy)',
          marginBottom: '1.5rem'
        }}>
          <ShieldCheck size={18} color="var(--color-gold-deep)" style={{ flexShrink: 0 }} />
          <span>Protected by Titanic Royal Maritime Guarantee with complimentary 100% cancellation up to 30 days before departure.</span>
        </div>

        {/* Next step CTA */}
        {showProceed && (
          <Button
            variant="primary"
            style={{ width: '100%' }}
            size="lg"
            disabled={proceedDisabled}
            loading={isProceeding}
            onClick={onProceed}
          >
            {proceedLabel}
          </Button>
        )}
      </div>
    </div>
  );
};
