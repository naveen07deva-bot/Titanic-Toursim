import React from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { Calendar, Users, FileCheck, CreditCard, ChevronRight, AlertCircle, Compass } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { Button } from '../common/Button';

export const BookingLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedPackage } = useBooking();

  const steps = [
    { path: '/booking/dates', label: 'Travel Dates', icon: Calendar, stepNum: 1 },
    { path: '/booking/travelers', label: 'Traveler Details', icon: Users, stepNum: 2 },
    { path: '/booking/summary', label: 'Booking Summary', icon: FileCheck, stepNum: 3 },
    { path: '/booking/payment', label: 'Payment & Confirm', icon: CreditCard, stepNum: 4 }
  ];

  // Determine current step index
  const currentStepIndex = steps.findIndex((s) => location.pathname.startsWith(s.path));

  return (
    <div style={{ backgroundColor: 'var(--color-bg-canvas)', minHeight: '85vh', padding: '2.5rem 0 4rem 0' }}>
      <div className="luxury-container">
        {/* Top Breadcrumb & Selected Package Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>
              <Link to="/packages" style={{ color: 'var(--color-gold-deep)' }}>Voyage Packages</Link>
              <ChevronRight size={14} />
              <span>{selectedPackage ? selectedPackage.name : 'Expedition Reservation'}</span>
              <ChevronRight size={14} />
              <span style={{ color: 'var(--color-primary-dark)', fontWeight: 600 }}>Booking Process</span>
            </div>
            <h1 style={{ fontSize: '2rem', color: 'var(--color-primary-dark)' }}>
              Reserve Your Titanic Voyage
            </h1>
          </div>

          {selectedPackage && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              backgroundColor: '#ffffff',
              padding: '0.6rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-gold-border)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <img
                src={selectedPackage.image}
                alt={selectedPackage.name}
                style={{ width: '42px', height: '42px', borderRadius: '4px', objectFit: 'cover' }}
              />
              <div>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary-dark)', margin: 0 }}>
                  {selectedPackage.name}
                </p>
                <p style={{ fontSize: '0.74rem', color: 'var(--color-gold-deep)', margin: 0 }}>
                  ${selectedPackage.price.toLocaleString()} / guest • {selectedPackage.durationText}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Missing package guard warning */}
        {!selectedPackage && (
          <div style={{
            backgroundColor: 'var(--color-gold-pale)',
            border: '1px solid var(--color-gold-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem 1.5rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <AlertCircle size={22} color="var(--color-gold-deep)" />
              <div>
                <strong style={{ fontSize: '0.92rem', color: 'var(--color-primary-dark)' }}>
                  Please add a package to continue
                </strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>
                  Select an extraordinary destination package from our fleet before finalizing travel dates.
                </p>
              </div>
            </div>
            <Button variant="primary" size="sm" onClick={() => navigate('/packages')}>
              Select a Package
            </Button>
          </div>
        )}

        {/* Nested Booking Step Navigation (React Router Nested Routing) */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border-subtle)',
          padding: '1.25rem',
          marginBottom: '2.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0.5rem'
          }} className="steps-container">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = idx === currentStepIndex;
              const isPassed = idx < currentStepIndex;

              return (
                <button
                  key={step.path}
                  type="button"
                  onClick={() => navigate(step.path)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid',
                    borderColor: isActive ? 'var(--color-gold-base)' : isPassed ? 'var(--color-gold-border)' : 'transparent',
                    backgroundColor: isActive ? 'var(--color-gold-pale)' : isPassed ? '#faf8f5' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'left'
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isActive ? 'var(--color-gold-base)' : isPassed ? 'var(--color-primary-deep)' : 'var(--color-bg-muted)',
                    color: isActive || isPassed ? '#ffffff' : 'var(--color-text-light)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    flexShrink: 0
                  }}>
                    {isPassed ? '✓' : step.stepNum}
                  </div>

                  <div>
                    <span style={{
                      display: 'block',
                      fontSize: '0.7rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: isActive ? 'var(--color-gold-deep)' : 'var(--color-text-light)'
                    }}>
                      Step 0{step.stepNum}
                    </span>
                    <strong style={{
                      fontSize: '0.88rem',
                      color: isActive ? 'var(--color-primary-dark)' : isPassed ? 'var(--color-text-main)' : 'var(--color-text-muted)'
                    }}>
                      {step.label}
                    </strong>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Outlet Component renders the nested active route */}
        <Outlet />
      </div>
    </div>
  );
};
