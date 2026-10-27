import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight, Calendar, Users, ShieldCheck, Compass, RotateCcw } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { Button } from '../common/Button';

/**
 * BookingCart Component
 * Experiment 1a & Experiment 2c Reusable Component
 * Renders the traveler's cart folio, items, price calculation, and checkout actions
 */
export const BookingCart = ({ onProceedToBooking }) => {
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    clearCart,
    cartSummary,
    selectPackage,
    packages
  } = useBooking();

  const handleCheckoutItem = (item) => {
    const originalPkg = packages.find((p) => p.id === item.packageId) || item;
    selectPackage(originalPkg);
    if (onProceedToBooking) {
      onProceedToBooking(item);
    } else {
      navigate('/booking/dates');
    }
  };

  return (
    <div className="booking-cart-component">
      {/* Title & Clear Action */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div>
          <span className="eyebrow-tag" style={{ marginBottom: '0.5rem' }}>
            Reservation Folio
          </span>
          <h2 style={{ fontSize: '2rem', color: 'var(--color-primary-dark)', margin: 0 }}>
            Your Booking Cart
          </h2>
        </div>

        {cartItems.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            icon={<RotateCcw size={14} />}
            onClick={clearCart}
          >
            Clear Entire Cart
          </Button>
        )}
      </div>

      {/* Conditional Rendering requirement 2h: "Your booking cart is empty" */}
      {cartItems.length === 0 ? (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-md)',
          border: '1px dashed var(--color-gold-border)',
          padding: '4.5rem 2rem',
          textAlign: 'center',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-gold-pale)',
            color: 'var(--color-gold-deep)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto'
          }}>
            <ShoppingBag size={30} />
          </div>

          <h3 style={{ fontSize: '1.6rem', color: 'var(--color-primary-dark)', marginBottom: '0.6rem' }}>
            Your booking cart is empty
          </h3>

          <p style={{
            color: 'var(--color-text-muted)',
            fontSize: '0.94rem',
            maxWidth: '460px',
            margin: '0 auto 2rem auto',
            lineHeight: 1.6
          }}>
            No luxury voyages or expeditions have been added to your reservation folio yet. Explore our royal departures to find your next great adventure.
          </p>

          <Button
            variant="primary"
            size="lg"
            icon={<Compass size={18} />}
            onClick={() => navigate('/packages')}
          >
            Discover Curated Voyages
          </Button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.8fr', gap: '2rem' }} className="cart-grid">
          {/* Cart Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {cartItems.map((item) => (
              <div
                key={item.cartItemId || item.packageId}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border-subtle)',
                  padding: '1.5rem',
                  display: 'flex',
                  gap: '1.5rem',
                  boxShadow: 'var(--shadow-sm)',
                  flexWrap: 'wrap'
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: '130px', height: '110px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                />

                <div style={{ flex: 1, minWidth: '220px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span className="eyebrow-tag" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem', marginBottom: '0.35rem' }}>
                        {item.category}
                      </span>
                      <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary-dark)', margin: '0.2rem 0' }}>
                        <Link to={`/package/${item.packageId}`} style={{ color: 'inherit' }}>
                          {item.name}
                        </Link>
                      </h3>
                      <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                        {item.destination}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.cartItemId || item.packageId)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-text-light)',
                        cursor: 'pointer',
                        padding: '0.4rem',
                        borderRadius: 'var(--radius-sm)'
                      }}
                      title="Remove from Cart"
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-danger)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-light)'}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.82rem', color: 'var(--color-text-muted)', margin: '0.5rem 0' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Calendar size={14} color="var(--color-gold-deep)" />
                      {item.dates?.departure || 'Date TBD'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Users size={14} color="var(--color-gold-deep)" />
                      {item.travelersCount || 2} Voyagers
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '1rem',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--color-border-subtle)'
                  }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>Package Total</span>
                      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', fontWeight: 600, color: 'var(--color-primary-dark)' }}>
                        ${(item.packageCost || item.price * (item.travelersCount || 1)).toLocaleString()}
                      </div>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      icon={<ArrowRight size={14} />}
                      onClick={() => handleCheckoutItem(item)}
                    >
                      Book This Package
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary Card */}
          <div>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-gold-border)',
              padding: '2rem',
              boxShadow: 'var(--shadow-sm)',
              position: 'sticky',
              top: '95px'
            }}>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary-dark)', marginBottom: '1.25rem', fontFamily: 'var(--font-serif)' }}>
                Reservation Folio Total
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--color-border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Packages Selected</span>
                  <strong>{cartSummary.totalItems}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Subtotal</span>
                  <span>${cartSummary.subtotal.toLocaleString()}</span>
                </div>
                {cartSummary.discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-success)' }}>
                    <span>Early Bird Privilege Discount (10%)</span>
                    <span>-${cartSummary.discount.toLocaleString()}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Luxury Maritime Port Fees (5%)</span>
                  <span>+${cartSummary.taxes.toLocaleString()}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', margin: '1.5rem 0' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Estimated Grand Total</span>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                  ${cartSummary.grandTotal.toLocaleString()}
                </span>
              </div>

              <Button
                variant="primary"
                size="lg"
                style={{ width: '100%', marginBottom: '1rem' }}
                onClick={() => {
                  if (cartItems.length > 0) {
                    handleCheckoutItem(cartItems[0]);
                  }
                }}
              >
                Proceed with First Voyage
              </Button>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.76rem',
                color: 'var(--color-text-muted)'
              }}>
                <ShieldCheck size={16} color="var(--color-gold-deep)" />
                <span>All reservations protected by Titanic White Star Charter Escrow.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
