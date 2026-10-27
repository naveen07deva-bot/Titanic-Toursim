import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Compass, ShoppingBag, User, LogOut, BookOpen, Menu, X, Shield, ChevronDown, Terminal } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';
import { Button } from '../common/Button';

export const Header = ({ onOpenLabGuide }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartItems } = useBooking();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setProfileDropdown(false);
    navigate('/');
  };

  const navLinkStyle = ({ isActive }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.9rem',
    fontWeight: isActive ? '600' : '400',
    color: isActive ? 'var(--color-gold-deep)' : 'var(--color-primary-navy)',
    borderBottom: isActive ? '2px solid var(--color-gold-base)' : '2px solid transparent',
    padding: '0.4rem 0.2rem',
    transition: 'all 0.2s ease',
    textDecoration: 'none'
  });

  return (
    <>
      {/* Top Luxury Announcement Bar */}
      <div className="lab-ribbon">
        <div className="luxury-container lab-ribbon-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className="lab-ribbon-badge">1912 HERITAGE FLEET</span>
            {isAuthenticated ? (
              <span
                onClick={() => {
                  if (typeof window !== 'undefined' && window.logCurrentJwt) {
                    window.logCurrentJwt();
                  }
                }}
                style={{
                  fontSize: '0.74rem',
                  backgroundColor: 'rgba(63, 110, 89, 0.35)',
                  border: '1px solid #3f6e59',
                  color: '#a3e2c3',
                  padding: '0.15rem 0.5rem',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer'
                }}
                title="Click to print active JWT token & claims to browser console"
              >
                🔒 JWT Bearer Active (Click to inspect)
              </span>
            ) : (
              <span style={{ fontSize: '0.74rem', backgroundColor: 'rgba(217, 119, 6, 0.25)', border: '1px solid #d97706', color: '#fcd34d', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)' }}>
                🔑 Guest Session (Sign in for JWT)
              </span>
            )}
            <span style={{ fontSize: '0.78rem', color: '#c4d1df' }}>
              Complimentary White-Glove Stateroom Butler on all 2026 Transatlantic & Alpine Expeditions.
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  if (window.logCurrentJwt) window.logCurrentJwt();
                  if (window.logAllActions) window.logAllActions();
                }
              }}
              style={{
                background: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid #0284c7',
                color: '#7dd3fc',
                borderRadius: 'var(--radius-full)',
                padding: '0.2rem 0.65rem',
                fontSize: '0.74rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
              title="Print all site actions and active JWT token to Browser DevTools Console (F12)"
            >
              <Terminal size={13} />
              <span>Console: Actions & JWT</span>
            </button>

            <button
              onClick={onOpenLabGuide}
              style={{
                background: 'rgba(197, 160, 89, 0.15)',
                border: '1px solid var(--color-gold-border)',
                color: 'var(--color-gold-light)',
                borderRadius: 'var(--radius-full)',
                padding: '0.2rem 0.65rem',
                fontSize: '0.74rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <BookOpen size={13} />
              <span>Lab Experiments 1–4 Guide</span>
            </button>
            <span style={{ fontSize: '0.75rem', color: '#97a8bc' }}>Concierge: +1 (800) TITANIC</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--color-border-subtle)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div className="luxury-container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '76px'
        }}>
          {/* Logo & Regal Crest */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #162433 0%, #0f1a24 100%)',
              border: '1px solid var(--color-gold-base)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(15,26,36,0.15)'
            }}>
              <Compass size={24} color="#dfc28b" />
            </div>
            <div>
              <div style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.45rem',
                fontWeight: 600,
                color: 'var(--color-primary-dark)',
                letterSpacing: '0.04em',
                lineHeight: 1.1
              }}>
                TITANIC TOURISM
              </div>
              <div style={{
                fontSize: '0.66rem',
                textTransform: 'uppercase',
                letterSpacing: '0.22em',
                color: 'var(--color-gold-deep)',
                fontWeight: 600
              }}>
                Luxury Voyages & Expeditions
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem'
          }} className="desktop-nav">
            <NavLink to="/" style={navLinkStyle}>
              Home
            </NavLink>
            <NavLink to="/packages" style={navLinkStyle}>
              Voyage Packages
            </NavLink>
            <NavLink to="/booking/dates" style={navLinkStyle}>
              Book Journey
            </NavLink>
            {isAuthenticated && (
              <NavLink to="/bookings" style={navLinkStyle}>
                My Bookings
              </NavLink>
            )}
          </nav>

          {/* Right Header Actions: Cart & Auth */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Cart Button */}
            <Link
              to="/cart"
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border-subtle)',
                backgroundColor: 'var(--color-bg-canvas)',
                color: 'var(--color-primary-navy)',
                transition: 'all 0.2s ease'
              }}
              title="View Booking Cart"
            >
              <ShoppingBag size={20} />
              {cartItems.length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  backgroundColor: 'var(--color-gold-base)',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 'bold',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                }}>
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* Auth Button or User Profile Dropdown */}
            {isAuthenticated ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setProfileDropdown(!profileDropdown)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.45rem 0.9rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-gold-border)',
                    backgroundColor: 'var(--color-gold-pale)',
                    color: 'var(--color-primary-dark)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'var(--color-gold-base)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}>
                    {user?.name?.charAt(0) || 'T'}
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>
                    {user?.name}
                  </span>
                  <ChevronDown size={14} color="var(--color-gold-deep)" />
                </button>

                {profileDropdown && (
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 8px)',
                    width: '240px',
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    boxShadow: 'var(--shadow-lg)',
                    padding: '0.75rem 0',
                    zIndex: 100
                  }}>
                    <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid var(--color-border-subtle)' }}>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Signed in as</p>
                      <p style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-primary-dark)' }}>{user?.email}</p>
                      <span className="eyebrow-tag" style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem', marginTop: '0.3rem' }}>
                        {user?.membershipTier || 'First Class Voyager'}
                      </span>
                    </div>

                    <Link
                      to="/bookings"
                      onClick={() => setProfileDropdown(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.65rem 1rem',
                        fontSize: '0.88rem',
                        color: 'var(--color-text-main)',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-muted)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <BookOpen size={16} color="var(--color-gold-deep)" />
                      <span>My Confirmed Bookings</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.65rem 1rem',
                        fontSize: '0.88rem',
                        color: 'var(--color-danger)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-danger-bg)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <LogOut size={16} />
                      <span>Disembark & Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button
                variant="primary"
                size="sm"
                icon={<User size={15} />}
                onClick={() => navigate('/login')}
              >
                Traveler Login
              </Button>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-btn"
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-primary-dark)',
                padding: '0.5rem'
              }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div style={{
            backgroundColor: '#ffffff',
            borderTop: '1px solid var(--color-border-subtle)',
            padding: '1rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <NavLink to="/" onClick={() => setMobileMenuOpen(false)} style={navLinkStyle}>
              Home
            </NavLink>
            <NavLink to="/packages" onClick={() => setMobileMenuOpen(false)} style={navLinkStyle}>
              Voyage Packages
            </NavLink>
            <NavLink to="/booking/dates" onClick={() => setMobileMenuOpen(false)} style={navLinkStyle}>
              Book Journey
            </NavLink>
            <NavLink to="/cart" onClick={() => setMobileMenuOpen(false)} style={navLinkStyle}>
              Cart ({cartItems.length})
            </NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to="/bookings" onClick={() => setMobileMenuOpen(false)} style={navLinkStyle}>
                  My Bookings
                </NavLink>
                <button
                  onClick={handleLogout}
                  style={{
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    color: 'var(--color-danger)',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    padding: '0.4rem 0'
                  }}
                >
                  Log Out
                </button>
              </>
            ) : (
              <Button variant="primary" size="sm" onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}>
                Traveler Login
              </Button>
            )}
          </div>
        )}
      </header>
    </>
  );
};
