import React from 'react';
import { ShieldAlert, RefreshCw, Home } from 'lucide-react';
import { Button } from './Button';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('TITANIC TOURISM ErrorBoundary caught an exception:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1rem',
          backgroundColor: 'var(--color-bg-canvas)'
        }}>
          <div style={{
            maxWidth: '560px',
            width: '100%',
            background: '#ffffff',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border-subtle)',
            padding: '2.5rem',
            textAlign: 'center',
            boxShadow: 'var(--shadow-md)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--color-danger-bg)',
              color: 'var(--color-danger)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto'
            }}>
              <ShieldAlert size={32} />
            </div>

            <span className="eyebrow-tag" style={{ marginBottom: '1rem', color: 'var(--color-danger)', borderColor: 'rgba(156,65,59,0.2)' }}>
              Voyage Advisory
            </span>

            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem', color: 'var(--color-primary-dark)' }}>
              An Unexpected Interruption Occurred
            </h2>

            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '1.75rem' }}>
              We encountered a minor disturbance while loading your voyage details. Our chief navigators have been alerted. You may reload the expedition or return safely to the harbor.
            </p>

            {this.state.error && (
              <details style={{
                textAlign: 'left',
                backgroundColor: 'var(--color-bg-muted)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '1.5rem',
                fontSize: '0.8rem',
                color: 'var(--color-text-muted)'
              }}>
                <summary style={{ cursor: 'pointer', fontWeight: 500, color: 'var(--color-primary-dark)' }}>
                  Technical Diagnostic Details
                </summary>
                <pre style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontFamily: 'monospace' }}>
                  {this.state.error.toString()}
                </pre>
              </details>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Button variant="primary" icon={<RefreshCw size={16} />} onClick={this.handleReload}>
                Reload Application
              </Button>
              <Button variant="outline" icon={<Home size={16} />} onClick={this.handleReset}>
                Return to Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
