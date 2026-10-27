import React from 'react';
import { User, Mail, Phone, FileText, CheckCircle2 } from 'lucide-react';

export const TravelerCard = ({ traveler, index = 1, onEdit }) => {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--color-border-subtle)',
      padding: '1.25rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '1rem',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-gold-pale)',
          border: '1px solid var(--color-gold-border)',
          color: 'var(--color-gold-deep)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 600
        }}>
          {index}
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h4 style={{ fontSize: '1.05rem', margin: 0, color: 'var(--color-primary-dark)' }}>
              {traveler.title} {traveler.firstName} {traveler.lastName || 'Guest'}
            </h4>
            <span className="eyebrow-tag" style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>
              Confirmed Guest
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.35rem', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
            {traveler.email && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Mail size={13} color="var(--color-gold-deep)" />
                {traveler.email}
              </span>
            )}
            {traveler.phone && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Phone size={13} color="var(--color-gold-deep)" />
                {traveler.phone}
              </span>
            )}
            {traveler.passportNumber && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <FileText size={13} color="var(--color-gold-deep)" />
                Passport: {traveler.passportNumber}
              </span>
            )}
          </div>
        </div>
      </div>

      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          style={{
            background: 'none',
            border: '1px solid var(--color-border-medium)',
            padding: '0.35rem 0.8rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.8rem',
            cursor: 'pointer',
            color: 'var(--color-primary-navy)'
          }}
        >
          Edit Details
        </button>
      )}
    </div>
  );
};
