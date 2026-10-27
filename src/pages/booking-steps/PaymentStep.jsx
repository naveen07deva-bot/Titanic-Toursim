import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Lock, ShieldCheck, ArrowLeft, CheckCircle2, Building, Smartphone } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { BookingSummary } from '../../components/booking/BookingSummary';

export const PaymentStep = () => {
  const navigate = useNavigate();
  const {
    selectedPackage,
    calculationSummary,
    confirmBooking,
    travelerDetails
  } = useBooking();

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const [cardData, setCardData] = useState({
    cardholderName: `${travelerDetails.title || 'Lord'} ${travelerDetails.firstName || 'Arthur'} ${travelerDetails.lastName || 'Sterling'}`,
    cardNumber: '4532 8920 1912 8841',
    expiry: '12/28',
    cvv: '892',
    upiId: 'traveler@titanicbank'
  });

  const [errors, setErrors] = useState({});

  const validateCard = () => {
    const errs = {};
    if (paymentMethod === 'card') {
      if (!cardData.cardholderName.trim()) {
        errs.cardholderName = 'Cardholder name is required';
      }
      const rawCard = cardData.cardNumber.replace(/\s+/g, '');
      if (!rawCard) {
        errs.cardNumber = 'Card number is required';
      } else if (!/^\d{16}$/.test(rawCard)) {
        errs.cardNumber = 'Please enter a valid 16-digit card number';
      }

      if (!cardData.expiry.trim()) {
        errs.expiry = 'Expiration date is required (MM/YY)';
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardData.expiry.trim())) {
        errs.expiry = 'Format must be MM/YY (e.g. 12/28)';
      }

      if (!cardData.cvv.trim()) {
        errs.cvv = 'CVV security code required';
      } else if (!/^\d{3,4}$/.test(cardData.cvv.trim())) {
        errs.cvv = 'CVV must be 3 or 4 digits';
      }
    } else if (paymentMethod === 'upi') {
      if (!cardData.upiId.trim() || !cardData.upiId.includes('@')) {
        errs.upiId = 'Please enter a valid UPI ID (e.g. name@bank)';
      }
    }
    return errs;
  };

  const handleCardNumberChange = (e) => {
    // Format card number with spaces every 4 digits
    let val = e.target.value.replace(/\D/g, '').substring(0, 16);
    let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardData((prev) => ({ ...prev, cardNumber: formatted }));
    if (errors.cardNumber) setErrors((prev) => ({ ...prev, cardNumber: '' }));
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (val.length >= 2) {
      val = val.substring(0, 2) + '/' + val.substring(2);
    }
    setCardData((prev) => ({ ...prev, expiry: val }));
    if (errors.expiry) setErrors((prev) => ({ ...prev, expiry: '' }));
  };

  const handleSubmitPayment = (e) => {
    e.preventDefault();
    const errs = validateCard();
    setErrors(errs);

    if (Object.keys(errs).length > 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      // Execute booking confirmation in context
      const bookingRecord = confirmBooking({
        method: paymentMethod === 'card' ? 'Titanium Royal Black Card' : 'Privilege Banking Transfer',
        cardholder: cardData.cardholderName
      });

      setIsProcessing(false);
      // Navigate programmatically to Booking Confirmation
      navigate('/booking/confirmation', { state: { booking: bookingRecord } });
    }, 1200);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }} className="booking-grid">
      {/* Left Column: Payment Form */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border-subtle)',
        padding: '2rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ marginBottom: '1.75rem' }}>
          <span className="eyebrow-tag" style={{ marginBottom: '0.5rem' }}>
            Step 4 of 4 • Secure Authorization
          </span>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--color-primary-dark)', margin: '0.2rem 0' }}>
            Payment & Royal Guarantee
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--color-text-muted)' }}>
            Encrypted with 256-Bit Maritime Protocol. No charge will be levied until departure clearance is verified.
          </p>
        </div>

        {/* Payment Method Selector */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.75rem',
          marginBottom: '1.75rem'
        }}>
          {[
            { id: 'card', label: 'Credit / Black Card', icon: CreditCard },
            { id: 'wire', label: 'Royal Bank Wire', icon: Building },
            { id: 'upi', label: 'Digital / UPI', icon: Smartphone }
          ].map((m) => {
            const Icon = m.icon;
            const isSelected = paymentMethod === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setPaymentMethod(m.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.85rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid',
                  borderColor: isSelected ? 'var(--color-gold-base)' : 'var(--color-border-subtle)',
                  backgroundColor: isSelected ? 'var(--color-gold-pale)' : '#faf8f5',
                  color: isSelected ? 'var(--color-gold-deep)' : 'var(--color-primary-navy)',
                  cursor: 'pointer',
                  fontWeight: isSelected ? 600 : 400,
                  fontSize: '0.82rem',
                  transition: 'all 0.15s'
                }}
              >
                <Icon size={20} />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>

        {paymentMethod === 'card' && (
          <form onSubmit={handleSubmitPayment}>
            {/* Card Preview Visual */}
            <div style={{
              background: 'linear-gradient(135deg, #0f1a24 0%, #1f3044 100%)',
              color: '#ffffff',
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              border: '1px solid var(--color-gold-base)',
              boxShadow: '0 8px 24px rgba(15, 26, 36, 0.25)',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
                <span style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-gold-light)', fontWeight: 600 }}>
                  Titanic Royal Privileges
                </span>
                <span style={{ fontSize: '0.8rem', color: '#a6b4c3' }}>First Class Stateroom</span>
              </div>

              <div style={{
                fontFamily: 'monospace',
                fontSize: '1.25rem',
                letterSpacing: '0.18em',
                marginBottom: '1.25rem',
                color: '#ffffff'
              }}>
                {cardData.cardNumber || '•••• •••• •••• ••••'}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#8899aa', display: 'block' }}>
                    Cardholder
                  </span>
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-gold-pale)' }}>
                    {cardData.cardholderName || 'LORD ARTHUR STERLING'}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#8899aa', display: 'block' }}>
                    Expires
                  </span>
                  <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                    {cardData.expiry || 'MM/YY'}
                  </span>
                </div>
              </div>
            </div>

            <Input
              label="Cardholder Full Name"
              name="cardholderName"
              value={cardData.cardholderName}
              onChange={(e) => setCardData({ ...cardData, cardholderName: e.target.value })}
              error={errors.cardholderName}
              required
            />

            <Input
              label="16-Digit Card Number"
              name="cardNumber"
              value={cardData.cardNumber}
              onChange={handleCardNumberChange}
              error={errors.cardNumber}
              placeholder="4532 8920 1912 8841"
              required
              icon={<CreditCard size={18} />}
            />

            <div className="grid-2">
              <Input
                label="Expiration Date (MM/YY)"
                name="expiry"
                value={cardData.expiry}
                onChange={handleExpiryChange}
                error={errors.expiry}
                placeholder="12/28"
                required
              />

              <Input
                label="Security CVV Code"
                name="cvv"
                type="password"
                maxLength={4}
                value={cardData.cvv}
                onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '') })}
                error={errors.cvv}
                placeholder="•••"
                required
                icon={<Lock size={16} />}
              />
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              fontSize: '0.78rem',
              color: 'var(--color-text-muted)',
              marginBottom: '1.5rem',
              backgroundColor: 'var(--color-bg-canvas)',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)'
            }}>
              <Lock size={15} color="var(--color-gold-deep)" />
              <span>TLS 1.3 Certified Payment Gateway with PCI-DSS Level 1 Compliance.</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button
                variant="outline"
                icon={<ArrowLeft size={16} />}
                onClick={() => navigate('/booking/summary')}
              >
                Back to Summary
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isProcessing}
                icon={<ShieldCheck size={18} />}
              >
                Confirm Voyage & Authorize ${calculationSummary.finalTotal.toLocaleString()}
              </Button>
            </div>
          </form>
        )}

        {paymentMethod === 'wire' && (
          <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg-canvas)', borderRadius: 'var(--radius-sm)' }}>
            <h4 style={{ fontSize: '1.05rem', color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>
              Royal White Star Custody Escrow
            </h4>
            <p style={{ fontSize: '0.86rem', color: 'var(--color-text-muted)', marginBottom: '1rem', lineHeight: 1.6 }}>
              Bank: Bank of England Private Wealth Services<br />
              Account Name: TITANIC TOURISM Private Charters Ltd<br />
              IBAN: GB82 BOFS 2004 1599 3019 12<br />
              SWIFT/BIC: BOFSGB2L
            </p>
            <Button
              variant="primary"
              onClick={handleSubmitPayment}
              loading={isProcessing}
            >
              Confirm Wire Reservation
            </Button>
          </div>
        )}

        {paymentMethod === 'upi' && (
          <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg-canvas)', borderRadius: 'var(--radius-sm)' }}>
            <Input
              label="Virtual Payment Address / UPI ID"
              name="upiId"
              value={cardData.upiId}
              onChange={(e) => setCardData({ ...cardData, upiId: e.target.value })}
              error={errors.upiId}
              placeholder="e.g. traveler@okhdfcbank"
              required
            />
            <Button
              variant="primary"
              onClick={handleSubmitPayment}
              loading={isProcessing}
            >
              Verify & Pay with UPI
            </Button>
          </div>
        )}
      </div>

      {/* Right Column: Pricing Breakdown */}
      <div>
        <BookingSummary showProceed={false} />
      </div>
    </div>
  );
};
