import React from 'react';
import { PackageDetail } from '../components/package/PackageDetail';

export const PackageDetailPage = () => {
  return (
    <div style={{ backgroundColor: 'var(--color-bg-canvas)', minHeight: '85vh', padding: '2rem 0 4rem 0' }} className="animate-fade-in">
      <div className="luxury-container">
        <PackageDetail />
      </div>
    </div>
  );
};
