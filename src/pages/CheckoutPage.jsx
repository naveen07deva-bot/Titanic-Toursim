import React from 'react';
import { Checkout } from '../components/booking/Checkout';

export const CheckoutPage = () => {
  return (
    <div style={{ backgroundColor: 'var(--color-bg-canvas)', minHeight: '85vh', padding: '3rem 0 5rem 0' }} className="animate-fade-in">
      <div className="luxury-container">
        <Checkout />
      </div>
    </div>
  );
};
