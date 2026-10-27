import React from 'react';
import { Compass } from 'lucide-react';

export const Loading = ({ message = 'Preparing your voyage details...', fullScreen = false }) => {
  const content = (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1.5rem',
      textAlign: 'center'
    }}>
      <div style={{
        position: 'relative',
        width: '64px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.25rem'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: '2px solid var(--color-gold-pale)',
          borderTopColor: 'var(--color-gold-base)',
          animation: 'spin 1.2s linear infinite'
        }} />
        <Compass size={28} color="var(--color-gold-deep)" />
      </div>
      <p style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '1.15rem',
        color: 'var(--color-primary-dark)',
        letterSpacing: '0.02em',
        marginBottom: '0.35rem'
      }}>
        {message}
      </p>
      <span style={{
        fontSize: '0.8rem',
        color: 'var(--color-text-light)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase'
      }}>
        TITANIC TOURISM Concierge
      </span>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  if (fullScreen) {
    return (
      <div style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {content}
      </div>
    );
  }

  return content;
};
