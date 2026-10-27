import React, { useState } from 'react';
import { User, Mail, Phone, FileText, HeartHandshake, CheckCircle } from 'lucide-react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

export const TravelerForm = ({
  initialValues = {},
  onSubmit,
  submitLabel = 'Save Traveler Information',
  isSubmitting = false
}) => {
  const [formData, setFormData] = useState({
    title: initialValues.title || 'Lord',
    firstName: initialValues.firstName || '',
    lastName: initialValues.lastName || '',
    email: initialValues.email || '',
    phone: initialValues.phone || '',
    passportNumber: initialValues.passportNumber || '',
    emergencyContact: initialValues.emergencyContact || '',
    specialRequests: initialValues.specialRequests || ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = (dataToValidate = formData) => {
    const errs = {};

    // 1. First Name validation
    if (!dataToValidate.firstName.trim()) {
      errs.firstName = 'First name is required';
    } else if (dataToValidate.firstName.trim().length < 2) {
      errs.firstName = 'Name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s'-]+$/.test(dataToValidate.firstName)) {
      errs.firstName = 'Only alphabetical characters permitted';
    }

    // 2. Last Name validation
    if (!dataToValidate.lastName.trim()) {
      errs.lastName = 'Last name is required';
    } else if (dataToValidate.lastName.trim().length < 2) {
      errs.lastName = 'Last name must be at least 2 characters';
    }

    // 3. Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!dataToValidate.email.trim()) {
      errs.email = 'Email address is required for voyage manifest';
    } else if (!emailRegex.test(dataToValidate.email)) {
      errs.email = 'Please provide a valid email format (e.g. lord@titanic.com)';
    }

    // 4. Phone validation (10 or more digits)
    const phoneClean = dataToValidate.phone.replace(/[\s\-()]/g, '');
    if (!dataToValidate.phone.trim()) {
      errs.phone = 'Contact telephone is required';
    } else if (phoneClean.length < 10) {
      errs.phone = 'Telephone must contain at least 10 digits';
    }

    // 5. Passport validation
    if (!dataToValidate.passportNumber.trim()) {
      errs.passportNumber = 'Passport or Maritime ID is required for international clearance';
    } else if (dataToValidate.passportNumber.trim().length < 6) {
      errs.passportNumber = 'Must be at least 6 alphanumeric characters';
    }

    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);

    // Validate on the fly if field has been touched
    if (touched[name]) {
      const errs = validate(updated);
      setErrors(errs);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const errs = validate();
    setErrors(errs);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      passportNumber: true
    });

    const errs = validate();
    setErrors(errs);

    if (Object.keys(errs).length === 0) {
      if (onSubmit) {
        onSubmit(formData);
      }
    }
  };

  const handleFillDemo = () => {
    const demoData = {
      title: 'Lord',
      firstName: 'Arthur',
      lastName: 'Peake-Sterling',
      email: 'arthur.sterling@mayfair.co.uk',
      phone: '+44 7911 123456',
      passportNumber: 'GBR9482019A',
      emergencyContact: 'Lady Eleanor Sterling (+44 7911 654321)',
      specialRequests: 'Upper Promenade Verandah table for evening dinners; vintage champagne upon arrival in stateroom.'
    };
    setFormData(demoData);
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} style={{
      backgroundColor: '#ffffff',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--color-border-subtle)',
      padding: '2rem',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-dark)', margin: 0 }}>
            Lead Passenger Manifest Details
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
            Official maritime boarding and customs documentation.
          </p>
        </div>

        <button
          type="button"
          onClick={handleFillDemo}
          style={{
            background: 'var(--color-gold-pale)',
            border: '1px solid var(--color-gold-border)',
            color: 'var(--color-gold-deep)',
            padding: '0.35rem 0.75rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.78rem',
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          ⚡ Auto-Fill Demo Passenger Info
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '120px 1fr 1fr',
        gap: '1rem'
      }} className="name-grid">
        {/* Title */}
        <div className="form-group">
          <label className="form-label">Honorific</label>
          <select
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="form-input"
            style={{ cursor: 'pointer', appearance: 'auto' }}
          >
            <option value="Lord">Lord</option>
            <option value="Lady">Lady</option>
            <option value="Sir">Sir</option>
            <option value="Dame">Dame</option>
            <option value="Dr.">Dr.</option>
            <option value="Mr.">Mr.</option>
            <option value="Mrs.">Mrs.</option>
            <option value="Ms.">Ms.</option>
          </select>
        </div>

        {/* First Name */}
        <Input
          label="First / Given Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.firstName ? errors.firstName : ''}
          placeholder="e.g. Arthur"
          required
          icon={<User size={16} />}
        />

        {/* Last Name */}
        <Input
          label="Family / Surname"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.lastName ? errors.lastName : ''}
          placeholder="e.g. Peake-Sterling"
          required
          icon={<User size={16} />}
        />
      </div>

      <div className="grid-2">
        {/* Email */}
        <Input
          label="Email Address for Boarding Pass & Itinerary"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.email ? errors.email : ''}
          placeholder="e.g. traveler@titanictourism.com"
          required
          icon={<Mail size={16} />}
        />

        {/* Phone */}
        <Input
          label="Telephone / Mobile (with country code)"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.phone ? errors.phone : ''}
          placeholder="e.g. +1 555-019-2834"
          required
          icon={<Phone size={16} />}
        />
      </div>

      <div className="grid-2">
        {/* Passport / National ID */}
        <Input
          label="Passport / Maritime ID Number"
          name="passportNumber"
          value={formData.passportNumber}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.passportNumber ? errors.passportNumber : ''}
          placeholder="e.g. GBR8392194B"
          required
          icon={<FileText size={16} />}
          helperText="Required for international port authority clearances"
        />

        {/* Emergency Contact */}
        <Input
          label="Emergency Contact (Name & Phone)"
          name="emergencyContact"
          value={formData.emergencyContact}
          onChange={handleChange}
          placeholder="e.g. Lady Eleanor (+44 7911 654321)"
          icon={<HeartHandshake size={16} />}
          helperText="24/7 shoreside emergency coordinator"
        />
      </div>

      {/* Special Requests */}
      <div className="form-group">
        <label className="form-label">
          Bespoke Dietary or Stateroom Requests (Optional)
        </label>
        <textarea
          name="specialRequests"
          rows={3}
          value={formData.specialRequests}
          onChange={handleChange}
          placeholder="e.g. Champagne bucket in suite, gluten-free dining preference, quiet deck preference..."
          className="form-input"
          style={{ resize: 'vertical' }}
        />
      </div>

      <div style={{
        marginTop: '1.5rem',
        paddingTop: '1.25rem',
        borderTop: '1px solid var(--color-border-subtle)',
        display: 'flex',
        justifyContent: 'flex-end'
      }}>
        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          icon={<CheckCircle size={16} />}
          size="lg"
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};
