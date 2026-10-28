import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Code, ShieldAlert, Compass, Server, Database, Key, RefreshCw, Activity, Layers } from 'lucide-react';
import { Button } from '../common/Button';
import { authApi } from '../../services/authApi';
import { actionLogs } from '../../store/middleware/actionMonitorMiddleware';
import { useBookingStore } from '../../store/useBookingStore';

export const ExperimentGuideModal = ({ isOpen, onClose }) => {
  const [triggerError, setTriggerError] = useState(false);
  const [recentLogs, setRecentLogs] = useState([]);
  const token = authApi.getToken();
  const user = authApi.getCurrentUser();
  const packageCache = useBookingStore((s) => s.packageCache);

  useEffect(() => {
    if (isOpen) {
      setRecentLogs([...actionLogs.slice(0, 5)]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  if (triggerError) {
    // Intentional crash to demonstrate ErrorBoundary component
    throw new Error('Demonstration Error: ErrorBoundary successfully caught an unexpected rendering error in TITANIC TOURISM application.');
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 26, 36, 0.75)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '1.5rem'
    }} className="animate-fade-in">
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-gold-border)',
        maxWidth: '920px',
        width: '100%',
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-lg)',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          backgroundColor: 'var(--color-primary-dark)',
          color: '#ffffff',
          padding: '1.5rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '2px solid var(--color-gold-border)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="eyebrow-tag" style={{ backgroundColor: 'rgba(197, 160, 89, 0.2)', color: 'var(--color-gold-light)' }}>
                Scenario 9 Comprehensive Lab Implementation
              </span>
            </div>
            <h2 style={{ fontSize: '1.45rem', color: '#ffffff', margin: '0.3rem 0 0 0', fontFamily: 'var(--font-serif)' }}>
              TITANIC TOURISM Lab Experiments 1–4 Guide
            </h2>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              padding: '0.4rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Close Guide"
          >
            <X size={22} />
          </button>
        </div>

        {/* Live System Telemetry Strip */}
        <div style={{
          backgroundColor: '#162433',
          borderBottom: '1px solid var(--color-gold-border)',
          padding: '0.75rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.78rem',
          color: '#c4d2e2'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Key size={14} color="var(--color-gold-light)" />
            <span>Auth Token (Exp 4): </span>
            <strong style={{ color: token ? '#a3e2c3' : '#f8a8a4', fontFamily: 'monospace' }}>
              {token ? `Bearer ${token.substring(0, 18)}...` : 'No Token (Unauthenticated)'}
            </strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database size={14} color="var(--color-gold-light)" />
            <span>Cache Status (Exp 2e): </span>
            <strong style={{ color: packageCache?.data ? '#a3e2c3' : 'var(--color-gold-light)' }}>
              {packageCache?.data ? `Cached (${packageCache.data.length} packages fresh)` : 'Cold / Not Cached'}
            </strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={14} color="var(--color-gold-light)" />
            <span>Middleware Logs: </span>
            <strong>{actionLogs.length} actions logged</strong>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Experiment 1 */}
          <div style={{
            backgroundColor: 'var(--color-bg-canvas)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem 1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ backgroundColor: 'var(--color-gold-base)', color: '#ffffff', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.74rem' }}>
                EXPERIMENT 1
              </span>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary-dark)', margin: 0 }}>
                Travel Booking Application with REST API Integration (Axios / Fetch)
              </h3>
            </div>
            <ul style={{ fontSize: '0.86rem', color: 'var(--color-text-muted)', lineHeight: 1.6, paddingLeft: '1.25rem' }}>
              <li><strong>a) REST API Fetch:</strong> Packages fetched from <code>GET /api/v1/packages</code> using configured Axios instance with async/await.</li>
              <li><strong>b) Multi-Criteria Filters:</strong> Destination query param, budget slider ($2k-$5k), duration filters (short, medium, long), and rating filters.</li>
              <li><strong>c) Dynamic Package Details:</strong> <code>GET /api/v1/packages/:id</code> dynamically loads itinerary, inclusions, and stateroom rates.</li>
              <li><strong>d) Real-Time Availability API:</strong> <code>GET /api/v1/packages/:id/availability</code> returns active cabin count and next sailing date.</li>
              <li><strong>e) Async / Await Operations:</strong> Clean asynchronous promise resolution with try/catch.</li>
              <li><strong>f) Loading & Error States:</strong> Spinner animations and error alert cards displayed across all API endpoints.</li>
            </ul>
          </div>

          {/* Experiment 2 */}
          <div style={{
            backgroundColor: 'var(--color-bg-canvas)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem 1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ backgroundColor: 'var(--color-primary-deep)', color: 'var(--color-gold-light)', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.74rem' }}>
                EXPERIMENT 2
              </span>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary-dark)', margin: 0 }}>
                Travel Booking State Management (Zustand & Redux Toolkit)
              </h3>
            </div>
            <ul style={{ fontSize: '0.86rem', color: 'var(--color-text-muted)', lineHeight: 1.6, paddingLeft: '1.25rem' }}>
              <li><strong>a) Global Booking Store:</strong> Centralized store via Zustand (<code>useBookingStore</code>) and Redux Toolkit (<code>bookingSlice</code>).</li>
              <li><strong>b) Comprehensive State:</strong> Manages selected package, departure/return dates, traveler counts, and booking cart folio.</li>
              <li><strong>c) Booking Operations:</strong> <code>addToCart</code>, <code>removeFromCart</code>, <code>updateCartItem</code>, <code>clearCart</code>, and booking CRUD.</li>
              <li><strong>d) Action Monitoring Middleware:</strong> <code>actionMonitorMiddleware</code> and <code>reduxActionMonitorMiddleware</code> track execution duration, timestamps, and state diffs.</li>
              <li><strong>e) Caching Layer:</strong> In-memory and local cache with 5-minute TTL prevents duplicate network roundtrips.</li>
              <li><strong>f) Financial Calculations:</strong> Computes base package cost, group/privilege discounts (10%), luxury port taxes (5%), and final invoice amount.</li>
            </ul>
          </div>

          {/* Experiment 3 */}
          <div style={{
            backgroundColor: 'var(--color-bg-canvas)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem 1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ backgroundColor: 'var(--color-gold-deep)', color: '#ffffff', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.74rem' }}>
                EXPERIMENT 3
              </span>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary-dark)', margin: 0 }}>
                Travel Package and Booking CRUD Operations (REST API)
              </h3>
            </div>
            <ul style={{ fontSize: '0.86rem', color: 'var(--color-text-muted)', lineHeight: 1.6, paddingLeft: '1.25rem' }}>
              <li><strong>a) GET /packages:</strong> Retrieves catalog of signature ocean, alpine, and tropical expeditions.</li>
              <li><strong>b) POST /bookings:</strong> Creates new confirmed voyage reservation record with auto-generated booking ref.</li>
              <li><strong>c) PUT /bookings/:id:</strong> Updates booking dates and guest party allocation dynamically on My Bookings page.</li>
              <li><strong>d) DELETE /bookings/:id:</strong> Cancels an existing booking reservation via HTTP DELETE.</li>
              <li><strong>e) GET /bookings:</strong> Retrieves historical and active booking records from database.</li>
              <li><strong>f) Loading & API Errors:</strong> Visual status messages for all REST operations.</li>
            </ul>
          </div>

          {/* Experiment 4 */}
          <div style={{
            backgroundColor: 'var(--color-bg-canvas)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem 1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ backgroundColor: 'var(--color-info)', color: '#ffffff', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.74rem' }}>
                EXPERIMENT 4
              </span>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary-dark)', margin: 0 }}>
                Travel Booking Authentication & Token Management
              </h3>
            </div>
            <ul style={{ fontSize: '0.86rem', color: 'var(--color-text-muted)', lineHeight: 1.6, paddingLeft: '1.25rem' }}>
              <li><strong>a) Traveler Login API:</strong> Authenticates against <code>POST /api/v1/auth/login</code> with email & password.</li>
              <li><strong>b) Token Storage:</strong> Stores signed JWT token in <code>localStorage</code> (<code>titanic_auth_token</code>).</li>
              <li><strong>c) Axios Request Interceptor:</strong> Automatically attaches <code>Authorization: Bearer &lt;token&gt;</code> to all protected calls.</li>
              <li><strong>d) Protected Routes & Operations:</strong> Restricts <code>/booking/*</code>, <code>/checkout</code>, <code>/bookings</code>, and <code>/payment</code>; rejects 401 unauthenticated API calls.</li>
              <li><strong>e) Logout & Token Removal:</strong> <code>authApi.logout()</code> destroys stored token and purges auth session state.</li>
              <li><strong>f) Invalid & Expired Token Handling:</strong> Axios response interceptor intercepts 401s, immediately purges invalidated tokens, notifies AuthContext, and redirects to login.</li>
            </ul>

            {/* Test Interactive Controls */}
            <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>

                <button
                  type="button"
                  onClick={() => {
                    authApi.setSimulatedExpiredToken();
                    alert('Simulated expired token injected into localStorage. Any protected API call will now return 401 and trigger automatic token revocation (Exp 4f).');
                  }}
                  style={{
                    backgroundColor: 'rgba(217, 119, 6, 0.1)',
                    border: '1px solid #d97706',
                    color: '#b45309',
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.76rem',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  ⏳ Test Expired Token Revocation (Exp 4f)
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-danger)', fontWeight: 500 }}>
                  Live ErrorBoundary Test:
                </span>
                <button
                  type="button"
                  onClick={() => setTriggerError(true)}
                  style={{
                    backgroundColor: 'var(--color-danger-bg)',
                    border: '1px solid var(--color-danger)',
                    color: 'var(--color-danger)',
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.76rem',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  ⚠️ Trigger Test Error
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '1rem 2rem',
          backgroundColor: '#faf8f5',
          borderTop: '1px solid var(--color-border-subtle)',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <Button variant="primary" onClick={onClose}>
            Close Guide
          </Button>
        </div>
      </div>
    </div>
  );
};
