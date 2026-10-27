import React, { useState, useEffect } from 'react';
import { Terminal, Key, Activity, Layers, ShieldCheck, Copy, Check, ChevronUp, ChevronDown, Trash2, ExternalLink, X, RefreshCw } from 'lucide-react';
import { globalActionLogs, decodeJwt, TOKEN_STORAGE_KEY } from '../../utils/actionLogger';
import { useAuth } from '../../context/AuthContext';

export const ActionConsoleWidget = () => {
  const { isAuthenticated, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('actions'); // 'actions' | 'jwt'
  const [logs, setLogs] = useState([]);
  const [copied, setCopied] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  const token = typeof localStorage !== 'undefined' ? localStorage.getItem(TOKEN_STORAGE_KEY) : null;
  const decodedToken = token ? decodeJwt(token) : null;

  useEffect(() => {
    // Initial sync
    setLogs([...globalActionLogs]);

    const handleUpdate = () => {
      setLogs([...globalActionLogs]);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('titanic_action_logged', handleUpdate);
      window.addEventListener('titanic_store_action', handleUpdate);
      window.addEventListener('titanic_redux_action', handleUpdate);
      window.addEventListener('titanic_api_request', handleUpdate);
      window.addEventListener('titanic_api_response', handleUpdate);

      return () => {
        window.removeEventListener('titanic_action_logged', handleUpdate);
        window.removeEventListener('titanic_store_action', handleUpdate);
        window.removeEventListener('titanic_redux_action', handleUpdate);
        window.removeEventListener('titanic_api_request', handleUpdate);
        window.removeEventListener('titanic_api_response', handleUpdate);
      };
    }
  }, []);

  const handleCopyToken = () => {
    if (!token) return;
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDumpToDevTools = () => {
    if (typeof window !== 'undefined') {
      if (window.logAllActions) window.logAllActions();
      if (window.logCurrentJwt) window.logCurrentJwt();
    }
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'JWT':
        return '#0d9488';
      case 'STORE':
        return '#2563eb';
      case 'REDUX':
        return '#8b5cf6';
      case 'API_REQUEST':
        return '#0284c7';
      case 'API_RESPONSE':
        return '#16a34a';
      default:
        return '#d97706';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '18px',
      right: '20px',
      zIndex: 9999,
      fontFamily: 'var(--font-sans)'
    }}>
      {/* Floating Minimized Pill */}
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            backgroundColor: '#0f1a24',
            color: '#ffffff',
            border: '1px solid var(--color-gold-border)',
            padding: '0.55rem 1rem',
            borderRadius: 'var(--radius-full)',
            boxShadow: '0 8px 24px rgba(15, 26, 36, 0.4)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontSize: '0.8rem'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 28px rgba(15, 26, 36, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(15, 26, 36, 0.4)';
          }}
          title="Open Action & JWT Console Monitor"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Terminal size={15} color="var(--color-gold-light)" />
            <span style={{ fontWeight: 600, color: '#f8fafc' }}>Console</span>
            <span style={{
              backgroundColor: 'var(--color-gold-base)',
              color: '#ffffff',
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '0.1rem 0.45rem',
              borderRadius: 'var(--radius-full)'
            }}>
              {logs.length}
            </span>
          </div>

          <div style={{ width: '1px', height: '14px', backgroundColor: 'rgba(255,255,255,0.2)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Key size={13} color={token ? '#34d399' : '#f87171'} />
            <span style={{ fontSize: '0.74rem', color: token ? '#a7f3d0' : '#fca5a5' }}>
              {token ? 'JWT Active' : 'No JWT'}
            </span>
          </div>
          <ChevronUp size={14} color="#94a3b8" />
        </button>
      ) : (
        /* Expanded Console Drawer */
        <div style={{
          width: '540px',
          maxWidth: '92vw',
          height: '520px',
          maxHeight: '82vh',
          backgroundColor: '#0f1a24',
          border: '1px solid var(--color-gold-border)',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          {/* Header Bar */}
          <div style={{
            backgroundColor: '#162433',
            borderBottom: '1px solid rgba(197, 160, 89, 0.3)',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Terminal size={16} color="var(--color-gold-light)" />
              <strong style={{ fontSize: '0.88rem', color: '#ffffff', letterSpacing: '0.02em' }}>
                TITANIC Action & JWT Console Monitor
              </strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={handleDumpToDevTools}
                style={{
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid #0284c7',
                  color: '#7dd3fc',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.2rem 0.55rem',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
                title="Logs entire action history & decoded JWT directly to Browser DevTools Console (F12)"
              >
                <ExternalLink size={12} />
                <span>Dump to F12</span>
              </button>

              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '0.2rem',
                  display: 'flex'
                }}
                title="Minimize Monitor"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Nav Tabs */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            backgroundColor: '#131e2b'
          }}>
            <button
              onClick={() => setActiveTab('actions')}
              style={{
                flex: 1,
                padding: '0.55rem 0.75rem',
                backgroundColor: activeTab === 'actions' ? 'rgba(197, 160, 89, 0.15)' : 'transparent',
                border: 'none',
                borderBottom: activeTab === 'actions' ? '2px solid var(--color-gold-base)' : '2px solid transparent',
                color: activeTab === 'actions' ? 'var(--color-gold-light)' : '#94a3b8',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem'
              }}
            >
              <Activity size={14} />
              <span>Live Dispatched Actions ({logs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('jwt')}
              style={{
                flex: 1,
                padding: '0.55rem 0.75rem',
                backgroundColor: activeTab === 'jwt' ? 'rgba(13, 148, 136, 0.15)' : 'transparent',
                border: 'none',
                borderBottom: activeTab === 'jwt' ? '2px solid #0d9488' : '2px solid transparent',
                color: activeTab === 'jwt' ? '#2dd4bf' : '#94a3b8',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem'
              }}
            >
              <Key size={14} />
              <span>JWT Bearer Inspector {token ? '✓' : '✗'}</span>
            </button>
          </div>

          {/* Tab Content: Actions List */}
          {activeTab === 'actions' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', padding: '0 0.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Real-time Stream (Store • Redux • REST API • JWT)</span>
                <span>Visible in Browser DevTools Console (F12)</span>
              </div>

              {logs.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#64748b', padding: '2rem 1rem', fontSize: '0.82rem' }}>
                  No actions recorded yet. Interact with the application to see state mutations and API calls.
                </div>
              ) : (
                logs.map((item) => {
                  const isSelected = selectedLog?.id === item.id;
                  const catColor = getCategoryColor(item.category);

                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedLog(isSelected ? null : item)}
                      style={{
                        backgroundColor: isSelected ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)',
                        border: '1px solid',
                        borderColor: isSelected ? catColor : 'rgba(255,255,255,0.06)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.5rem 0.75rem',
                        cursor: 'pointer',
                        transition: 'background 0.15s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{
                            backgroundColor: catColor,
                            color: '#ffffff',
                            fontSize: '0.66rem',
                            fontWeight: 700,
                            padding: '0.1rem 0.4rem',
                            borderRadius: '3px'
                          }}>
                            {item.category}
                          </span>
                          <span style={{ color: '#f1f5f9', fontSize: '0.8rem', fontWeight: 600 }}>
                            {item.name}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'monospace' }}>
                          {item.durationMs ? `${item.durationMs}ms • ` : ''}{item.timestamp}
                        </span>
                      </div>

                      {/* Token indicator */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', color: '#94a3b8' }}>
                        <span>JWT: </span>
                        <span style={{ color: item.token ? '#34d399' : '#f87171' }}>
                          {item.token ? 'Attached / Active (Bearer)' : 'None (Guest)'}
                        </span>
                      </div>

                      {/* Expanded Log Details */}
                      {isSelected && (
                        <div style={{
                          marginTop: '0.5rem',
                          paddingTop: '0.5rem',
                          borderTop: '1px dashed rgba(255,255,255,0.1)',
                          fontSize: '0.72rem',
                          color: '#cbd5e1'
                        }}>
                          <pre style={{
                            backgroundColor: '#070d13',
                            padding: '0.5rem',
                            borderRadius: '4px',
                            overflowX: 'auto',
                            fontFamily: 'monospace',
                            margin: 0
                          }}>
                            {JSON.stringify(item.details || item.data || item.payload || item, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Tab Content: JWT Inspector */}
          {activeTab === 'jwt' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {token ? (
                <>
                  {/* Status Banner */}
                  <div style={{
                    backgroundColor: 'rgba(13, 148, 136, 0.15)',
                    border: '1px solid #0d9488',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <ShieldCheck size={18} color="#2dd4bf" />
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f0fdfa' }}>
                          Valid JWT Bearer Token Active
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#99f6e4' }}>
                          Subject: {decodedToken?.userEmail || user?.email || 'Authenticated Traveler'}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleCopyToken}
                      style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: '#ffffff',
                        padding: '0.25rem 0.6rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.72rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                    >
                      {copied ? <Check size={12} color="#34d399" /> : <Copy size={12} />}
                      <span>{copied ? 'Copied' : 'Copy Token'}</span>
                    </button>
                  </div>

                  {/* Raw Token */}
                  <div>
                    <label style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>
                      Raw Encoded JWT Token (Stored in localStorage['titanic_auth_token']):
                    </label>
                    <div style={{
                      backgroundColor: '#070d13',
                      border: '1px solid rgba(255,255,255,0.08)',
                      padding: '0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      fontFamily: 'monospace',
                      color: '#38bdf8',
                      wordBreak: 'break-all',
                      lineHeight: 1.4
                    }}>
                      {token}
                    </div>
                  </div>

                  {/* Decoded Header */}
                  <div>
                    <label style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>
                      Decoded JWT Header:
                    </label>
                    <pre style={{
                      backgroundColor: '#070d13',
                      border: '1px solid rgba(255,255,255,0.08)',
                      padding: '0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      fontFamily: 'monospace',
                      color: '#f59e0b',
                      margin: 0
                    }}>
                      {JSON.stringify(decodedToken?.header, null, 2)}
                    </pre>
                  </div>

                  {/* Decoded Payload */}
                  <div>
                    <label style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>
                      Decoded JWT Claims (Payload):
                    </label>
                    <pre style={{
                      backgroundColor: '#070d13',
                      border: '1px solid rgba(255,255,255,0.08)',
                      padding: '0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      fontFamily: 'monospace',
                      color: '#a3e635',
                      margin: 0
                    }}>
                      {JSON.stringify(decodedToken?.payload, null, 2)}
                    </pre>
                  </div>
                </>
              ) : (
                /* Unauthenticated View */
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <Key size={32} color="#f87171" style={{ margin: '0 auto 0.75rem auto' }} />
                  <h4 style={{ color: '#f8fafc', fontSize: '1rem', marginBottom: '0.4rem' }}>
                    No Active JWT Token
                  </h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.78rem', maxWidth: '340px', margin: '0 auto 1.25rem auto', lineHeight: 1.5 }}>
                    Sign in to obtain a cryptographically signed JWT bearer token. It will automatically attach to all protected API calls.
                  </p>
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined') window.location.href = '/login';
                    }}
                    style={{
                      backgroundColor: 'var(--color-gold-base)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.45rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Go to Traveler Login
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Footer Bar */}
          <div style={{
            backgroundColor: '#162433',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            padding: '0.5rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.72rem',
            color: '#94a3b8'
          }}>
            <span>Open Browser DevTools: <kbd style={{ background: '#334155', padding: '1px 4px', borderRadius: '3px', color: '#f8fafc' }}>F12</kbd> &gt; Console</span>
            <button
              onClick={() => {
                globalActionLogs.length = 0;
                setLogs([]);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
              title="Clear Action History"
            >
              <Trash2 size={12} />
              <span>Clear</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
