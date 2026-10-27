import React from 'react';
import { Award, Code2, Compass } from 'lucide-react';

export const LabBadge = ({ experimentNumber, title, topics = [] }) => {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.6rem',
      backgroundColor: 'var(--color-bg-muted)',
      border: '1px solid var(--color-gold-border)',
      padding: '0.35rem 0.85rem',
      borderRadius: 'var(--radius-full)',
      fontSize: '0.78rem',
      color: 'var(--color-primary-navy)'
    }}>
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        backgroundColor: 'var(--color-gold-base)',
        color: '#ffffff',
        fontSize: '0.68rem',
        fontWeight: 'bold'
      }}>
        {experimentNumber}
      </span>
      <span style={{ fontWeight: 600 }}>{title}</span>
      {topics.length > 0 && (
        <span style={{ color: 'var(--color-gold-deep)', fontSize: '0.72rem' }}>
          • {topics.join(', ')}
        </span>
      )}
    </div>
  );
};
