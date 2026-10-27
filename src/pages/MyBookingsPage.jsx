import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar, Users, MapPin, CheckCircle2, ShieldCheck, Printer,
  Compass, ArrowRight, Clock, Award, Trash2, Edit3, RefreshCw, X, AlertTriangle
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Loading } from '../components/common/Loading';

export const MyBookingsPage = () => {
  const {
    bookings,
    fetchBookings,
    updateBooking,
    cancelBooking,
    bookingsLoading,
    bookingsError
  } = useBooking();
  const { user } = useAuth();
  const navigate = useNavigate();

  // State for editing a booking (PUT/PATCH: Experiment 3c)
  const [editingBooking, setEditingBooking] = useState(null);
  const [editDates, setEditDates] = useState({ departure: '', returnDate: '' });
  const [editTravelers, setEditTravelers] = useState(2);
  const [updatingId, setUpdatingId] = useState(null);

  // State for cancelling a booking (DELETE: Experiment 3d)
  const [cancellingId, setCancellingId] = useState(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  const handleStartEdit = (b) => {
    setEditingBooking(b);
    setEditDates({
      departure: b.travelDates?.departure || '',
      returnDate: b.travelDates?.returnDate || ''
    });
    setEditTravelers(b.travelers?.adults || 2);
  };

  const handleSaveEdit = async () => {
    if (!editingBooking) return;
    setUpdatingId(editingBooking.id || editingBooking.bookingId);
    try {
      await updateBooking(editingBooking.id || editingBooking.bookingId, {
        travelDates: editDates,
        travelers: { adults: Number(editTravelers), children: 0 }
      });
      setActionSuccessMsg(`Booking ${editingBooking.bookingId} updated successfully via PUT request.`);
      setEditingBooking(null);
      setTimeout(() => setActionSuccessMsg(''), 4000);
    } catch (err) {
      alert('Failed to update booking: ' + (err.message || 'Error'));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCancelBooking = async (b) => {
    const confirmed = window.confirm(`Are you sure you wish to cancel voyage reservation ${b.bookingId}? This will execute an authenticated DELETE request.`);
    if (!confirmed) return;

    setCancellingId(b.id || b.bookingId);
    try {
      await cancelBooking(b.id || b.bookingId);
      setActionSuccessMsg(`Voyage ${b.bookingId} cancelled successfully via DELETE request.`);
      setTimeout(() => setActionSuccessMsg(''), 4000);
    } catch (err) {
      alert('Failed to cancel booking: ' + (err.message || 'Error'));
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--color-bg-canvas)', minHeight: '85vh', padding: '3rem 0 5rem 0' }} className="animate-fade-in">
      <div className="luxury-container">
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div>
            <span className="eyebrow-tag" style={{ marginBottom: '0.5rem' }}>
              Passenger Folio • REST API CRUD
            </span>
            <h1 style={{ fontSize: '2.2rem', color: 'var(--color-primary-dark)', margin: 0 }}>
              Confirmed Travel Bookings
            </h1>
            <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
              Welcome back, <strong>{user?.name || 'Lord Sterling'}</strong>. Active bookings and historical voyage manifests.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Button
              variant="outline"
              size="sm"
              icon={<RefreshCw size={14} />}
              onClick={() => fetchBookings()}
            >
              Sync via API (GET)
            </Button>
            <Button
              variant="outline-gold"
              size="sm"
              icon={<Compass size={14} />}
              onClick={() => navigate('/packages')}
            >
              Chart Another Voyage
            </Button>
          </div>
        </div>

        {/* Action success alert */}
        {actionSuccessMsg && (
          <div style={{
            backgroundColor: 'var(--color-success-bg)',
            border: '1px solid var(--color-success)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.75rem 1.25rem',
            marginBottom: '1.5rem',
            fontSize: '0.88rem',
            color: 'var(--color-success)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <CheckCircle2 size={18} />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {/* Loading & Error States (Experiment 3f) */}
        {bookingsLoading && <Loading message="Retrieving booking records from REST API..." />}

        {bookingsError && (
          <div style={{
            backgroundColor: 'var(--color-danger-bg)',
            border: '1px solid var(--color-danger)',
            borderRadius: 'var(--radius-sm)',
            padding: '1rem',
            marginBottom: '1.5rem',
            color: 'var(--color-danger)',
            fontSize: '0.88rem'
          }}>
            ⚠️ {bookingsError}
          </div>
        )}

        {/* Bookings List or Empty State */}
        {!bookingsLoading && bookings.length === 0 ? (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed var(--color-gold-border)',
            padding: '4rem 2rem',
            textAlign: 'center',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-gold-pale)',
              color: 'var(--color-gold-deep)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto'
            }}>
              <Award size={28} />
            </div>

            <h3 style={{ fontSize: '1.5rem', color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>
              No Confirmed Expeditions on Record
            </h3>

            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', maxWidth: '440px', margin: '0 auto 1.75rem auto', lineHeight: 1.6 }}>
              You have not confirmed any voyages with TITANIC TOURISM under this member account yet. Explore our handcrafted fleet departures to make your first reservation.
            </p>

            <Button variant="primary" size="lg" onClick={() => navigate('/packages')}>
              Explore Handcrafted Itineraries
            </Button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {bookings.map((b) => {
              const isEditingThis = editingBooking && (editingBooking.id === b.id || editingBooking.bookingId === b.bookingId);

              return (
                <div
                  key={b.id || b.bookingId}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-gold-border)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-md)'
                  }}
                >
                  {/* Header ribbon of booking */}
                  <div style={{
                    backgroundColor: 'var(--color-primary-dark)',
                    color: '#ffffff',
                    padding: '1.25rem 1.75rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    borderBottom: '2px solid var(--color-gold-border)'
                  }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-gold-light)', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 600 }}>
                        Confirmed Royal Reservation (REST API Model)
                      </span>
                      <h3 style={{ fontSize: '1.3rem', color: '#ffffff', margin: '0.2rem 0', fontFamily: 'var(--font-serif)' }}>
                        Booking Reference: {b.bookingId}
                      </h3>
                      <span style={{ fontSize: '0.78rem', color: '#9fb1c5' }}>
                        Reserved on {new Date(b.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                      <div style={{
                        backgroundColor: 'rgba(63, 110, 89, 0.25)',
                        border: '1px solid #3f6e59',
                        color: '#a3e2c3',
                        padding: '0.35rem 0.85rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}>
                        <CheckCircle2 size={15} />
                        <span>{b.payment?.status || 'Confirmed & Paid'}</span>
                      </div>

                      {/* Edit Booking Button (PUT/PATCH: Experiment 3c) */}
                      <button
                        onClick={() => handleStartEdit(b)}
                        style={{
                          background: 'rgba(197, 160, 89, 0.2)',
                          border: '1px solid var(--color-gold-border)',
                          color: 'var(--color-gold-light)',
                          padding: '0.4rem 0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem'
                        }}
                        title="Update dates or guests via PUT request"
                      >
                        <Edit3 size={13} />
                        <span>Modify (PUT)</span>
                      </button>

                      {/* Cancel Booking Button (DELETE: Experiment 3d) */}
                      <button
                        onClick={() => handleCancelBooking(b)}
                        disabled={cancellingId === (b.id || b.bookingId)}
                        style={{
                          background: 'rgba(156, 65, 59, 0.25)',
                          border: '1px solid rgba(156, 65, 59, 0.5)',
                          color: '#f8a8a4',
                          padding: '0.4rem 0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem'
                        }}
                        title="Cancel reservation via DELETE request"
                      >
                        <Trash2 size={13} />
                        <span>Cancel (DELETE)</span>
                      </button>

                      <button
                        onClick={() => window.print()}
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          color: '#ffffff',
                          padding: '0.4rem 0.8rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem'
                        }}
                      >
                        <Printer size={14} />
                        <span>Voucher</span>
                      </button>
                    </div>
                  </div>

                  {/* Inline Edit Form for PUT (Experiment 3c) */}
                  {isEditingThis && (
                    <div style={{
                      backgroundColor: 'var(--color-gold-pale)',
                      borderBottom: '1px solid var(--color-gold-border)',
                      padding: '1.25rem 1.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <div>
                          <label style={{ fontSize: '0.74rem', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>
                            New Departure:
                          </label>
                          <input
                            type="date"
                            value={editDates.departure}
                            onChange={(e) => setEditDates({ ...editDates, departure: e.target.value })}
                            className="form-input"
                            style={{ padding: '0.35rem 0.6rem', fontSize: '0.82rem' }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '0.74rem', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>
                            New Return Date:
                          </label>
                          <input
                            type="date"
                            value={editDates.returnDate}
                            onChange={(e) => setEditDates({ ...editDates, returnDate: e.target.value })}
                            className="form-input"
                            style={{ padding: '0.35rem 0.6rem', fontSize: '0.82rem' }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '0.74rem', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>
                            Guests:
                          </label>
                          <select
                            value={editTravelers}
                            onChange={(e) => setEditTravelers(e.target.value)}
                            className="form-input"
                            style={{ padding: '0.35rem 0.6rem', fontSize: '0.82rem', appearance: 'auto' }}
                          >
                            <option value={1}>1 Voyager</option>
                            <option value={2}>2 Voyagers</option>
                            <option value={3}>3 Voyagers</option>
                            <option value={4}>4 Voyagers</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Button
                          variant="primary"
                          size="sm"
                          loading={updatingId === (b.id || b.bookingId)}
                          onClick={handleSaveEdit}
                        >
                          Execute PUT /bookings/{b.bookingId}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingBooking(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Main Booking Details */}
                  <div style={{ padding: '1.75rem', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }} className="booking-card-grid">
                    {/* Left: Package info & schedule */}
                    <div>
                      <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '1.5rem' }}>
                        {b.package?.image && (
                          <img
                            src={b.package.image}
                            alt={b.package.name}
                            style={{ width: '120px', height: '100px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                          />
                        )}
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-gold-deep)', fontSize: '0.8rem', fontWeight: 600 }}>
                            <MapPin size={14} />
                            <span>{b.package?.destination}</span>
                          </div>
                          <h4 style={{ fontSize: '1.25rem', color: 'var(--color-primary-dark)', margin: '0.2rem 0' }}>
                            {b.package?.name}
                          </h4>
                          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <Clock size={14} color="var(--color-gold-deep)" />
                              {b.tripDurationDays || b.package?.durationDays} Days Duration
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <Users size={14} color="var(--color-gold-deep)" />
                              {b.totalTravelersCount || 2} Registered Voyagers
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Schedule dates */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '1rem',
                        backgroundColor: 'var(--color-bg-canvas)',
                        padding: '1rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.85rem'
                      }}>
                        <div>
                          <span style={{ color: 'var(--color-text-light)', display: 'block', fontSize: '0.74rem' }}>Departure</span>
                          <strong style={{ color: 'var(--color-primary-dark)' }}>{b.travelDates?.departure || 'Confirmed'}</strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--color-text-light)', display: 'block', fontSize: '0.74rem' }}>Return / Arrival</span>
                          <strong style={{ color: 'var(--color-primary-dark)' }}>{b.travelDates?.returnDate || 'Confirmed'}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Right: Passenger info & payment summary */}
                    <div style={{ borderLeft: '1px solid var(--color-border-subtle)', paddingLeft: '2rem' }}>
                      <div style={{ marginBottom: '1.25rem' }}>
                        <span style={{ fontSize: '0.74rem', color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>
                          Lead Passenger
                        </span>
                        <strong style={{ fontSize: '0.96rem', color: 'var(--color-primary-dark)' }}>
                          {b.travelerDetails?.title} {b.travelerDetails?.firstName} {b.travelerDetails?.lastName}
                        </strong>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                          {b.travelerDetails?.email} • {b.travelerDetails?.phone}
                        </div>
                        {b.travelerDetails?.passportNumber && (
                          <div style={{ fontSize: '0.76rem', color: 'var(--color-gold-deep)', marginTop: '0.2rem' }}>
                            Passport: {b.travelerDetails.passportNumber}
                          </div>
                        )}
                      </div>

                      <div style={{
                        backgroundColor: 'var(--color-gold-pale)',
                        padding: '1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-gold-border)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem' }}>
                          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Total Amount Paid</span>
                          <strong style={{ fontSize: '1.35rem', fontFamily: 'var(--font-serif)', color: 'var(--color-primary-dark)' }}>
                            ${(b.pricing?.finalTotal || b.package?.price * 2).toLocaleString()}
                          </strong>
                        </div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-gold-deep)', display: 'block' }}>
                          Payment Ref: {b.payment?.transactionRef || 'TXN-CONFIRMED'} via {b.payment?.method || 'Card'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
