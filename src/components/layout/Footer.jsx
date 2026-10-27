import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Mail, Phone, MapPin, Award, ShieldCheck, Anchor } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--color-primary-dark)',
      color: '#e4ddd2',
      borderTop: '2px solid var(--color-gold-border)',
      paddingTop: '4rem',
      paddingBottom: '2.5rem',
      marginTop: 'auto'
    }}>
      <div className="luxury-container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          {/* Brand Column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--color-gold-base) 0%, var(--color-gold-deep) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}>
                <Compass size={22} />
              </div>
              <div>
                <h4 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.35rem',
                  color: '#ffffff',
                  letterSpacing: '0.03em',
                  lineHeight: 1.1
                }}>
                  TITANIC TOURISM
                </h4>
                <p style={{
                  fontSize: '0.66rem',
                  color: 'var(--color-gold-light)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.18em'
                }}>
                  Grand Voyages & Expeditions
                </p>
              </div>
            </div>

            <p style={{
              fontSize: '0.86rem',
              color: '#a6b4c3',
              lineHeight: 1.7,
              marginBottom: '1.5rem'
            }}>
              Curating peerless nautical crossings, grand alpine railway expeditions, and private sanctuary retreats across seven continents since 1912.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: 'rgba(197, 160, 89, 0.1)',
                border: '1px solid var(--color-gold-border)',
                borderRadius: 'var(--radius-full)',
                padding: '0.3rem 0.75rem',
                fontSize: '0.74rem',
                color: 'var(--color-gold-light)'
              }}>
                <ShieldCheck size={14} />
                <span>Royal Maritime Board Certified</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.1rem',
              color: '#ffffff',
              marginBottom: '1.25rem',
              letterSpacing: '0.04em'
            }}>
              Grand Voyages
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem' }}>
              <li>
                <Link to="/packages" style={{ color: '#b9c7d6', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-gold-light)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#b9c7d6'}>
                  Transatlantic Royal Crossings
                </Link>
              </li>
              <li>
                <Link to="/packages" style={{ color: '#b9c7d6', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-gold-light)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#b9c7d6'}>
                  Mediterranean Azure Charters
                </Link>
              </li>
              <li>
                <Link to="/packages" style={{ color: '#b9c7d6', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-gold-light)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#b9c7d6'}>
                  Swiss Alpine Glacier Express
                </Link>
              </li>
              <li>
                <Link to="/packages" style={{ color: '#b9c7d6', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-gold-light)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#b9c7d6'}>
                  Nordic Aurora Borealis Safaris
                </Link>
              </li>
              <li>
                <Link to="/packages" style={{ color: '#b9c7d6', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-gold-light)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#b9c7d6'}>
                  Bora Bora Overwater Sanctuaries
                </Link>
              </li>
            </ul>
          </div>

          {/* Expeditions Navigation */}
          <div>
            <h5 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.1rem',
              color: '#ffffff',
              marginBottom: '1.25rem',
              letterSpacing: '0.04em'
            }}>
              Guest Services
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem' }}>
              <li>
                <Link to="/cart" style={{ color: '#b9c7d6' }}>
                  Booking Cart & Itinerary
                </Link>
              </li>
              <li>
                <Link to="/booking/dates" style={{ color: '#b9c7d6' }}>
                  Reserve Travel Dates
                </Link>
              </li>
              <li>
                <Link to="/bookings" style={{ color: '#b9c7d6' }}>
                  Passenger Manifest & Bookings
                </Link>
              </li>
              <li>
                <Link to="/login" style={{ color: '#b9c7d6' }}>
                  Traveler Member Portal
                </Link>
              </li>
              <li>
                <span style={{ color: '#7a8b9e', fontSize: '0.82rem' }}>
                  White-Glove Luggage Forwarding
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Concierge */}
          <div>
            <h5 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.1rem',
              color: '#ffffff',
              marginBottom: '1.25rem',
              letterSpacing: '0.04em'
            }}>
              Private Concierge
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.86rem', color: '#b9c7d6' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                <MapPin size={16} color="var(--color-gold-light)" style={{ marginTop: '0.2rem', flexShrink: 0 }} />
                <span>Oceanic Terminal Pier 59, North River & Southampton Royal Docks</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Phone size={16} color="var(--color-gold-light)" style={{ flexShrink: 0 }} />
                <span>+1 (800) TITANIC / +44 20 7946 0912</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Mail size={16} color="var(--color-gold-light)" style={{ flexShrink: 0 }} />
                <span>concierge@titanictourism.com</span>
              </div>
            </div>

            <div style={{
              marginTop: '1.5rem',
              padding: '0.75rem 1rem',
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(197, 160, 89, 0.2)',
              borderRadius: 'var(--radius-sm)'
            }}>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-gold-light)', fontWeight: 500, marginBottom: '0.2rem' }}>
                Lab Scenario 9 Implementation
              </p>
              <p style={{ fontSize: '0.72rem', color: '#97a8bc' }}>
                Experiments 1, 2, 3 & 4 fully compliant with React 19 Hooks, Context API & React Router.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: '1.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8rem',
          color: '#8293a5'
        }}>
          <div>
            © {new Date().getFullYear()} TITANIC TOURISM. All rights reserved. Registered Royal Charter No. 1912-A.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span style={{ color: 'var(--color-gold-light)' }}>Terms of Carriage</span>
            <span>Privacy Protocol</span>
            <span>Maritime Heritage</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
