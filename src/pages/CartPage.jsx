import React from 'react';
import { BookingCart } from '../components/booking/BookingCart';

export const CartPage = () => {
  return (
    <div style={{ backgroundColor: 'var(--color-bg-canvas)', minHeight: '85vh', padding: '3rem 0 5rem 0' }} className="animate-fade-in">
      <div className="luxury-container">
        <BookingCart />
      </div>
    </div>
  );
};
