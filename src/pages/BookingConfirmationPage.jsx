import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Compass, Printer, Calendar, Users, MapPin, Award, ArrowRight, ShieldCheck } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { Button } from '../components/common/Button';

export const BookingConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookings, selectedPackage, travelDates, travelers, travelerDetails, calculationSummary } = useBooking();

  // Retrieve confirmed booking from route state or fallback to latest in context
  const booking = location.state?.booking || bookings[0] || {
    bookingId: 'TITANIC-892104',
    createdAt: new Date().toISOString(),
    package: selectedPackage,
    travelDates,
    travelers,
    travelerDetails,
    pricing: calculationSummary,
    payment: {
      method: 'Titanium Royal Black Card',
      transactionRef: 'TXN-73928192'
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ backgroundColor: 'var(--color-bg-canvas)', minHeight: '85vh', padding: '3.5rem 0 5rem 0' }} className="animate-fade-in">
      <div className="luxury-container" style={{ maxWidth: '820px' }}>
        {/* Success Banner */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-success-bg)',
            color: 'var(--color-success)',
            border: '2px solid rgba(63, 110, 89, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <CheckCircle2 size={36} />
          </div>

          <span className="eyebrow-tag" style={{ color: 'var(--color-success)', borderColor: 'rgba(63,110,89,0.3)', backgroundColor: 'var(--color-success-bg)', marginBottom: '0.5rem' }}>
            Reservation Officially Confirmed
          </span>

          <h1 style={{ fontSize: '2.4rem', color: 'var(--color-primary-dark)', margin: '0.35rem 0' }}>
            Bon Voyage! Your Expedition is Secured
          </h1>

          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.96rem', maxWidth: '560px', margin: '0 auto' }}>
            A formal confirmation and boarding folio have been dispatched to <strong>{booking.travelerDetails?.email || 'your email'}</strong>.
          </p>
        </div>

        {/* Boarding Pass / Royal Ticket Voucher */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '2px solid var(--color-gold-border)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          marginBottom: '2.5rem'
        }}>
          {/* Top Royal Header */}
          <div style={{
            background: 'linear-gradient(135deg, #0f1a24 0%, #162433 100%)',
            color: '#ffffff',
            padding: '1.75rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            borderBottom: '2px solid var(--color-gold-base)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--color-gold-base) 0%, var(--color-gold-deep) 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Compass size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.4rem', color: '#ffffff', margin: 0, fontFamily: 'var(--font-serif)' }}>
                  TITANIC TOURISM
                </h3>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-gold-light)', textTransform: 'uppercase', letterSpacing: '0.18em' }}>
                  Official Boarding Voucher & Manifest
                </span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.72rem', color: '#97a8bc', textTransform: 'uppercase', display: 'block' }}>
                Confirmation Reference
              </span>
              <strong style={{ fontSize: '1.25rem', color: 'var(--color-gold-light)', fontFamily: 'monospace', letterSpacing: '0.08em' }}>
                {booking.bookingId}
              </strong>
            </div>
          </div>

          {/* Ticket Body */}
          <div style={{ padding: '2rem' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
              paddingBottom: '1.75rem',
              borderBottom: '1px dashed var(--color-gold-border)',
              marginBottom: '1.75rem'
            }}>
              <div>
                <span style={{ fontSize: '0.74rem', color: 'var(--color-text-light)', textTransform: 'uppercase', display: 'block' }}>
                  Voyage / Expedition
                </span>
                <strong style={{ fontSize: '1.1rem', color: 'var(--color-primary-dark)' }}>
                  {booking.package?.name || 'Transatlantic Royal Odyssey'}
                </strong>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-gold-deep)', margin: '0.2rem 0 0 0' }}>
                  {booking.package?.destination}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '0.74rem', color: 'var(--color-text-light)', textTransform: 'uppercase', display: 'block' }}>
                  Lead Passenger Name
                </span>
                <strong style={{ fontSize: '1.05rem', color: 'var(--color-primary-dark)' }}>
                  {booking.travelerDetails?.title} {booking.travelerDetails?.firstName} {booking.travelerDetails?.lastName}
                </strong>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', margin: '0.2rem 0 0 0' }}>
                  Passport: {booking.travelerDetails?.passportNumber || 'Verified on Departure'}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '0.74rem', color: 'var(--color-text-light)', textTransform: 'uppercase', display: 'block' }}>
                  Departure & Return Dates
                </span>
                <strong style={{ fontSize: '0.96rem', color: 'var(--color-primary-dark)' }}>
                  {booking.travelDates?.departure || 'Pending'} — {booking.travelDates?.returnDate || 'Pending'}
                </strong>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', margin: '0.2rem 0 0 0' }}>
                  {booking.tripDurationDays || 7} Days / {booking.totalTravelersCount || 2} Voyagers
                </p>
              </div>

              <div>
                <span style={{ fontSize: '0.74rem', color: 'var(--color-text-light)', textTransform: 'uppercase', display: 'block' }}>
                  Settlement & Status
                </span>
                <strong style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', color: 'var(--color-primary-dark)' }}>
                  ${(booking.pricing?.finalTotal || 3450).toLocaleString()} USD
                </strong>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-success)', margin: '0.2rem 0 0 0', fontWeight: 600 }}>
                  ✓ Paid via {booking.payment?.method || 'Card'}
                </p>
              </div>
            </div>

            {/* Special Instructions */}
            <div style={{
              backgroundColor: 'var(--color-bg-canvas)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.25rem',
              display: 'flex',
              gap: '1rem',
              alignItems: 'flex-start'
            }}>
              <ShieldCheck size={24} color="var(--color-gold-deep)" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
              <div>
                <strong style={{ fontSize: '0.92rem', color: 'var(--color-primary-dark)', display: 'block', marginBottom: '0.25rem' }}>
                  White-Glove Embarkation Protocol
                </strong>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: 1.6, margin: 0 }}>
                  Please present this voucher alongside your passport during priority VIP check-in at Oceanic Terminal Pier 59 or Southampton Royal Docks. Your private stateroom butler will meet you at the gangway.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Actions */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Button
            variant="primary"
            icon={<Printer size={16} />}
            onClick={handlePrint}
          >
            Print Boarding Pass
          </Button>

          <Button
            variant="outline"
            icon={<Award size={16} />}
            onClick={() => navigate('/bookings')}
          >
            View in My Bookings
          </Button>

          <Button
            variant="ghost"
            onClick={() => navigate('/')}
          >
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
};
