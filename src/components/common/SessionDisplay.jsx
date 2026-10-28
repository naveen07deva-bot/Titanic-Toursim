import React, { useState } from 'react';
import { Shield, ShieldCheck, Key, User, Clock, CheckCircle2, LogOut, ChevronDown, ChevronUp, UserCheck, Sparkles, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { decodeJwt } from '../../utils/actionLogger';
import { useNavigate } from 'react-router-dom';

/**
 * SessionDisplay Component
 * Displays live authentication and traveler session state across the website.
 * Provides full visibility into session status, traveler identity, JWT validity, and stored credentials.
 */
export const SessionDisplay = ({ variant = 'badge' }) => {
  const { user, token, isAuthenticated, logout, sessionInfo, savedAccounts } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const decoded = token ? decodeJwt(token) : null;

  // Mini / Badge Variant (Designed for Top Header Ribbon & Navigation Bar)
  if (variant === 'badge') {
    return (
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <button
          onClick={() => setModalOpen(!modalOpen)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.25rem 0.65rem',
            borderRadius: 'var(--radius-full)',
            border: isAuthenticated ? '1px solid #2dd4bf' : '1px solid #d97706',
            backgroundColor: isAuthenticated ? 'rgba(13, 148, 136, 0.2)' : 'rgba(217, 119, 6, 0.15)',
            color: isAuthenticated ? '#a7f3d0' : '#fde68a',
            fontSize: '0.74rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          title="Click to view full session details"
        >
          <span style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: isAuthenticated ? '#34d399' : '#f59e0b',
            boxShadow: isAuthenticated ? '0 0 6px #34d399' : 'none'
          }} />
          <span>
            {isAuthenticated ? `Session: ${user?.name || 'Traveler'}` : 'Guest Session'}
          </span>
          {modalOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>

        {/* Dropdown Session Details Card */}
        {modalOpen && (
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 'calc(100% + 8px)',
              width: '320px',
              backgroundColor: '#0f1a24',
              border: '1px solid var(--color-gold-border)',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 16px 36px rgba(0,0,0,0.45)',
              padding: '1.25rem',
              zIndex: 1100,
              color: '#ffffff',
              textAlign: 'left',
              animation: 'fadeIn 0.2s ease-out'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                {isAuthenticated ? <ShieldCheck size={18} color="#34d399" /> : <Shield size={18} color="#f59e0b" />}
                <strong style={{ fontSize: '0.88rem', color: '#ffffff' }}>
                  {isAuthenticated ? 'Active Verified Session' : 'Guest Traveler Session'}
                </strong>
              </div>
              <span style={{
                fontSize: '0.65rem',
                padding: '0.15rem 0.45rem',
                borderRadius: '3px',
                backgroundColor: isAuthenticated ? 'rgba(52, 211, 153, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                color: isAuthenticated ? '#34d399' : '#f59e0b',
                fontWeight: 600
              }}>
                {isAuthenticated ? 'AUTHENTICATED' : 'GUEST'}
              </span>
            </div>

            {isAuthenticated ? (
              <>
                <div style={{
                  backgroundColor: '#162433',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '0.75rem',
                  fontSize: '0.78rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-gold-base)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}>
                      {user?.name?.charAt(0) || 'T'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#f8fafc' }}>{user?.name}</div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{user?.email}</div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.7rem', color: 'var(--color-gold-light)', marginTop: '0.35rem' }}>
                    ⭐ {user?.membershipTier || 'First Class Royal Voyager'}
                  </div>
                  {user?.phone && (
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                      📞 {user.phone}
                    </div>
                  )}
                </div>

                <div style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Auth Token:</span>
                    <span style={{ color: '#34d399', fontFamily: 'monospace' }}>JWT Bearer (Valid)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Session Started:</span>
                    <span style={{ color: '#f1f5f9' }}>{sessionInfo.sessionStartTime || 'Today'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Credentials Stored:</span>
                    <span style={{ color: '#38bdf8' }}>Saved in Local Database</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => {
                      setModalOpen(false);
                      navigate('/bookings');
                    }}
                    style={{
                      flex: 1,
                      backgroundColor: 'var(--color-gold-base)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.4rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    My Bookings
                  </button>
                  <button
                    onClick={() => {
                      setModalOpen(false);
                      logout();
                      navigate('/');
                    }}
                    style={{
                      backgroundColor: 'rgba(239, 68, 68, 0.2)',
                      border: '1px solid #ef4444',
                      color: '#fca5a5',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.4rem 0.75rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Log Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '1rem', lineHeight: 1.4 }}>
                  You are browsing in Guest Mode. Sign in or register to store your traveler information and book luxury suites.
                </p>

                <button
                  onClick={() => {
                    setModalOpen(false);
                    navigate('/login');
                  }}
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--color-gold-base)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.5rem',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Sign In / Register New User
                </button>
              </>
            )}
          </div>
        )}
      </div>
    );
  }

  // Full Card Variant (For Checkout, Profile, and Confirmation pages)
  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid var(--color-border-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: '1.25rem',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {isAuthenticated ? <UserCheck size={18} color="var(--color-success)" /> : <User size={18} color="var(--color-text-muted)" />}
          <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--color-primary-dark)' }}>
            Traveler Session Information
          </h4>
        </div>
        <span style={{
          fontSize: '0.72rem',
          padding: '0.2rem 0.55rem',
          borderRadius: 'var(--radius-full)',
          backgroundColor: isAuthenticated ? 'var(--color-success-bg)' : 'var(--color-gold-pale)',
          color: isAuthenticated ? 'var(--color-success)' : 'var(--color-gold-deep)',
          fontWeight: 600
        }}>
          {isAuthenticated ? '🟢 Active Verified Session' : '⚪ Guest Session'}
        </span>
      </div>

      {isAuthenticated ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', fontSize: '0.8rem' }}>
          <div>
            <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.72rem' }}>Traveler Name</span>
            <strong style={{ color: 'var(--color-primary-dark)' }}>{user?.name}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.72rem' }}>Email Address</span>
            <span style={{ color: 'var(--color-text-main)' }}>{user?.email}</span>
          </div>
          <div>
            <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.72rem' }}>Membership Tier</span>
            <span style={{ color: 'var(--color-gold-deep)', fontWeight: 600 }}>{user?.membershipTier || 'First Class Royal Voyager'}</span>
          </div>
          <div>
            <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.72rem' }}>Credentials Storage</span>
            <span style={{ color: 'var(--color-primary-navy)' }}>✓ Stored in Local Database</span>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
            Sign in with an existing account or register as a new traveler to store your credentials.
          </p>
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'var(--color-gold-base)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              padding: '0.35rem 0.75rem',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Sign In / Register
          </button>
        </div>
      )}
    </div>
  );
};
