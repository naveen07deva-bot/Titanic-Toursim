import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, Compass, ShieldCheck, CheckCircle2, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  // Intended destination prior to redirect
  const from = location.state?.from?.pathname || '/packages';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: true
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Required & format validation for email
    if (!formData.email.trim()) {
      errs.email = 'Traveler email or membership identifier is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email format (e.g. lord@titanic.com)';
    }

    // Required & length validation for password
    if (!formData.password) {
      errs.password = 'Security password is required';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters in length';
    }

    return errs;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);

    if (Object.keys(errs).length > 0) return;

    setIsSubmitting(true);
    try {
      await login(formData.email, formData.password, formData.rememberMe);
      setIsSubmitting(false);
      // Redirect after login to intended route (Experiment 4e)
      navigate(from, { replace: true });
    } catch (err) {
      setIsSubmitting(false);
      setErrors({ auth: 'Authentication failed. Please verify credentials.' });
    }
  };

  // Demo Traveler One-Click Credentials Helper
  const handleUseDemoAccount = () => {
    setFormData({
      email: 'lord.sterling@titanic.com',
      password: 'RoyalVoyager1912!',
      rememberMe: true
    });
    setErrors({});
  };

  return (
    <div style={{
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1.5rem',
      backgroundColor: 'var(--color-bg-canvas)'
    }} className="animate-fade-in">
      <div style={{
        maxWidth: '460px',
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border-subtle)',
        padding: '2.5rem',
        boxShadow: 'var(--shadow-md)'
      }}>
        {/* Crest */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #162433 0%, #0f1a24 100%)',
            border: '1px solid var(--color-gold-base)',
            color: '#dfc28b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto',
            boxShadow: '0 4px 14px rgba(15,26,36,0.15)'
          }}>
            <Compass size={28} />
          </div>

          <span className="eyebrow-tag" style={{ marginBottom: '0.4rem' }}>
            First Class Member Portal
          </span>

          <h1 style={{ fontSize: '1.8rem', color: 'var(--color-primary-dark)', margin: '0.2rem 0' }}>
            Traveler Sign In
          </h1>

          <p style={{ fontSize: '0.86rem', color: 'var(--color-text-muted)' }}>
            Access protected reservations, suite manifests, and priority concierge.
          </p>
        </div>

        {location.state?.from && (
          <div style={{
            backgroundColor: 'var(--color-gold-pale)',
            border: '1px solid var(--color-gold-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.75rem 1rem',
            marginBottom: '1.25rem',
            fontSize: '0.8rem',
            color: 'var(--color-gold-deep)'
          }}>
            🔒 Sign in required to access <strong>{location.state.from.pathname}</strong>. You will be redirected immediately upon authentication.
          </div>
        )}

        {/* 1-Click Demo Helper Button */}
        <div style={{
          backgroundColor: 'var(--color-bg-canvas)',
          border: '1px dashed var(--color-gold-border)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.85rem 1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem'
        }}>
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-primary-dark)', display: 'block' }}>
              Evaluation Credentials
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
              lord.sterling@titanic.com / RoyalVoyager1912!
            </span>
          </div>
          <button
            type="button"
            onClick={handleUseDemoAccount}
            style={{
              background: 'var(--color-gold-base)',
              color: '#ffffff',
              border: 'none',
              padding: '0.35rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.74rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            ⚡ Auto Fill
          </button>
        </div>

        {/* Controlled Form (Experiment 4a) */}
        <form onSubmit={handleSubmit}>
          {errors.auth && (
            <div className="form-error-msg" style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>
              ⚠️ {errors.auth}
            </div>
          )}

          <Input
            label="Traveler Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="lord.sterling@titanic.com"
            required
            icon={<Mail size={16} />}
          />

          <Input
            label="Master Key Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="••••••••••••"
            required
            icon={<Lock size={16} />}
          />

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            fontSize: '0.82rem'
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-main)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                style={{ accentColor: 'var(--color-gold-base)' }}
              />
              <span>Remember credentials</span>
            </label>

            <span style={{ color: 'var(--color-gold-deep)', cursor: 'pointer' }}>
              Lost Key?
            </span>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            style={{ width: '100%', marginBottom: '1.25rem' }}
            loading={isSubmitting}
            icon={<LogIn size={18} />}
          >
            Sign In to First Class Portal
          </Button>

          <div style={{
            textAlign: 'center',
            fontSize: '0.82rem',
            color: 'var(--color-text-muted)'
          }}>
            New guest?{' '}
            <button
              type="button"
              onClick={handleUseDemoAccount}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-gold-deep)',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Sign in with Demo Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
