import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, Compass, UserPlus, CheckCircle2, UserCheck, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/authApi';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { logWebpageAction } from '../utils/actionLogger';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();

  // Intended destination prior to redirect
  const from = location.state?.from?.pathname || '/packages';

  // Mode: 'login' | 'register'
  const [mode, setMode] = useState('login');

  // Stored logins from localStorage
  const [storedLogins, setStoredLogins] = useState([]);

  useEffect(() => {
    const list = authApi.getUserLogins();
    setStoredLogins(list);
  }, []);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    title: 'Lord',
    membershipTier: 'First Class Royal Voyager',
    rememberMe: true
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      errs.email = 'Traveler email is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email format (e.g. lord@titanic.com)';
    }

    if (!formData.password) {
      errs.password = 'Security password is required';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters in length';
    }

    if (mode === 'register' && !formData.name.trim()) {
      errs.name = 'Full traveler name is required';
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
      if (mode === 'login') {
        logWebpageAction('LOGIN_SUBMIT', `Submitting traveler login for: ${formData.email}`, {
          email: formData.email,
          remember: formData.rememberMe
        });

        await login(formData.email, formData.password, formData.rememberMe);

        logWebpageAction('LOGIN_SUCCESS', `Successfully authenticated and stored session for: ${formData.email}`);
      } else {
        logWebpageAction('REGISTER_SUBMIT', `Submitting new traveler registration for: ${formData.name} (${formData.email})`, {
          name: formData.name,
          email: formData.email,
          tier: formData.membershipTier
        });

        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          title: formData.title,
          phone: formData.phone || '+44 20 7946 0912',
          membershipTier: formData.membershipTier
        });

        logWebpageAction('REGISTER_SUCCESS', `New user registered and stored in localStorage for: ${formData.name}`);
      }

      setIsSubmitting(false);
      // Redirect after login to intended route
      navigate(from, { replace: true });
    } catch (err) {
      setIsSubmitting(false);
      setErrors({ auth: err.message || 'Authentication failed. Please verify credentials.' });
      logWebpageAction('AUTH_ERROR', `Authentication failed: ${err.message}`);
    }
  };

  // Demo Traveler One-Click Credentials Helper
  const handleUseDemoAccount = () => {
    logWebpageAction('CREDENTIALS_AUTOFILL', 'Auto-filled evaluation demo credentials (lord.sterling@titanic.com)');
    setFormData({
      email: 'lord.sterling@titanic.com',
      password: 'RoyalVoyager1912!',
      name: 'Lord Arthur Sterling',
      phone: '+44 20 7946 0912',
      title: 'Lord',
      membershipTier: 'First Class Royal Voyager',
      rememberMe: true
    });
    setErrors({});
  };

  // 1-Click login using a stored account from localStorage
  const handleSelectStoredLogin = (account) => {
    logWebpageAction('STORED_LOGIN_SELECT', `Selected stored account from localStorage: ${account.name} (${account.email})`);
    setFormData((prev) => ({
      ...prev,
      email: account.email,
      name: account.name || prev.name,
      password: 'RoyalVoyager1912!',
      rememberMe: true
    }));
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
        maxWidth: '490px',
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border-subtle)',
        padding: '2.5rem',
        boxShadow: 'var(--shadow-md)'
      }}>
        {/* Crest */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
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

          <h1 style={{ fontSize: '1.75rem', color: 'var(--color-primary-dark)', margin: '0.2rem 0' }}>
            {mode === 'login' ? 'Traveler Sign In' : 'Register New Traveler'}
          </h1>

          <p style={{ fontSize: '0.86rem', color: 'var(--color-text-muted)' }}>
            {mode === 'login'
              ? 'Access protected reservations, booking manifest, and priority concierge.'
              : 'Create your account to store credentials and book luxury voyages.'}
          </p>
        </div>

        {/* Mode Toggle (Sign In vs Register) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.5rem',
          backgroundColor: 'var(--color-bg-canvas)',
          padding: '0.3rem',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '1.5rem',
          border: '1px solid var(--color-border-subtle)'
        }}>
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrors({});
              logWebpageAction('TAB_CHANGE', 'Switched to Traveler Sign In mode');
            }}
            style={{
              padding: '0.5rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: mode === 'login' ? '#ffffff' : 'transparent',
              color: mode === 'login' ? 'var(--color-primary-dark)' : 'var(--color-text-muted)',
              fontWeight: mode === 'login' ? 600 : 400,
              fontSize: '0.84rem',
              cursor: 'pointer',
              boxShadow: mode === 'login' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrors({});
              logWebpageAction('TAB_CHANGE', 'Switched to Register New Traveler mode');
            }}
            style={{
              padding: '0.5rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: mode === 'register' ? '#ffffff' : 'transparent',
              color: mode === 'register' ? 'var(--color-primary-dark)' : 'var(--color-text-muted)',
              fontWeight: mode === 'register' ? 600 : 400,
              fontSize: '0.84rem',
              cursor: 'pointer',
              boxShadow: mode === 'register' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            Register Account
          </button>
        </div>

        {/* Stored Logins in localStorage Card */}
        {storedLogins.length > 0 && mode === 'login' && (
          <div style={{
            backgroundColor: '#faf8f5',
            border: '1px solid var(--color-gold-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.85rem 1rem',
            marginBottom: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <UserCheck size={14} color="var(--color-gold-base)" />
                Stored Logins in localStorage ({storedLogins.length})
              </span>
              <span style={{ fontSize: '0.68rem', color: 'var(--color-gold-deep)' }}>
                1-Click Select
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '110px', overflowY: 'auto' }}>
              {storedLogins.slice(0, 3).map((acc) => (
                <div
                  key={acc.email}
                  onClick={() => handleSelectStoredLogin(acc)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.35rem 0.6rem',
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.74rem',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s ease'
                  }}
                  title="Click to use this stored login"
                >
                  <div>
                    <strong style={{ color: 'var(--color-primary-dark)' }}>{acc.name}</strong>
                    <span style={{ color: 'var(--color-text-muted)', marginLeft: '0.4rem' }}>{acc.email}</span>
                  </div>
                  <span style={{ color: 'var(--color-gold-deep)', fontWeight: 600 }}>Use</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 1-Click Evaluation Credentials Helper */}
        <div style={{
          backgroundColor: 'var(--color-bg-canvas)',
          border: '1px dashed var(--color-gold-border)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.75rem 1rem',
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

        {/* Controlled Form */}
        <form onSubmit={handleSubmit}>
          {errors.auth && (
            <div className="form-error-msg" style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>
              ⚠️ {errors.auth}
            </div>
          )}

          {mode === 'register' && (
            <Input
              label="Full Traveler Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Lord Arthur Sterling"
              required
            />
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
            label="Security Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="••••••••••••"
            required
            icon={<Lock size={16} />}
          />

          {mode === 'register' && (
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 500, color: 'var(--color-text-main)', marginBottom: '0.35rem' }}>
                Membership Stateroom Tier
              </label>
              <select
                name="membershipTier"
                value={formData.membershipTier}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border-medium)',
                  backgroundColor: '#ffffff',
                  fontSize: '0.88rem'
                }}
              >
                <option value="First Class Royal Voyager">First Class Royal Voyager</option>
                <option value="Imperial Suite Voyager">Imperial Suite Voyager</option>
                <option value="Oceanic Grand Traveler">Oceanic Grand Traveler</option>
              </select>
            </div>
          )}

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
              <span>Remember login in localStorage</span>
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            style={{ width: '100%', marginBottom: '1.25rem' }}
            loading={isSubmitting}
            icon={mode === 'login' ? <LogIn size={18} /> : <UserPlus size={18} />}
          >
            {mode === 'login' ? 'Sign In to First Class Portal' : 'Register & Save Login'}
          </Button>

          <div style={{
            textAlign: 'center',
            fontSize: '0.82rem',
            color: 'var(--color-text-muted)'
          }}>
            {mode === 'login' ? (
              <>
                Need a new account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-gold-deep)',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Create one now
                </button>
              </>
            ) : (
              <>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-gold-deep)',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Back to Sign In
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

