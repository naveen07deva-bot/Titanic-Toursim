import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { BookingLayout } from './components/layout/BookingLayout';

// Pages
import { Home } from './pages/Home';
import { PackageListPage } from './pages/PackageListPage';
import { PackageDetailPage } from './pages/PackageDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { LoginPage } from './pages/LoginPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { BookingConfirmationPage } from './pages/BookingConfirmationPage';

// Nested Booking Steps
import { DatesStep } from './pages/booking-steps/DatesStep';
import { TravelersStep } from './pages/booking-steps/TravelersStep';
import { SummaryStep } from './pages/booking-steps/SummaryStep';
import { PaymentStep } from './pages/booking-steps/PaymentStep';

// Lab Guide Modal
import { ExperimentGuideModal } from './components/lab/ExperimentGuideModal';
import { ActionConsoleWidget } from './components/common/ActionConsoleWidget';

export function App() {
  const [labGuideOpen, setLabGuideOpen] = useState(false);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <BookingProvider>
          <BrowserRouter>
            <div className="app-container">
              {/* Global Navigation Header with Lab Guide trigger */}
              <Header onOpenLabGuide={() => setLabGuideOpen(true)} />

              {/* Main Routing Content */}
              <main className="main-content">
                <Routes>
                  {/* Experiment 3a: Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/packages" element={<PackageListPage />} />
                  
                  {/* Dynamic Route for individual package details with useParams (Experiment 3c, 3d) */}
                  <Route path="/package/:id" element={<PackageDetailPage />} />

                  {/* Booking Cart (Experiment 2, 3) */}
                  <Route path="/cart" element={<CartPage />} />

                  {/* Authentication (Experiment 4a) */}
                  <Route path="/login" element={<LoginPage />} />

                  {/* Protected Routes (Experiment 4c, 4d, 4e) */}
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <CheckoutPage />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/bookings"
                    element={
                      <ProtectedRoute>
                        <MyBookingsPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Direct /payment protected route (Experiment 4c) */}
                  <Route
                    path="/payment"
                    element={
                      <ProtectedRoute>
                        <Navigate to="/booking/payment" replace />
                      </ProtectedRoute>
                    }
                  />

                  {/* Nested Routing for Booking Process with Outlet (Experiment 3e, 3f) */}
                  <Route
                    path="/booking"
                    element={
                      <ProtectedRoute>
                        <BookingLayout />
                      </ProtectedRoute>
                    }
                  >
                    {/* Default redirect to Step 1 */}
                    <Route index element={<Navigate to="/booking/dates" replace />} />
                    <Route path="dates" element={<DatesStep />} />
                    <Route path="travelers" element={<TravelersStep />} />
                    <Route path="summary" element={<SummaryStep />} />
                    <Route path="payment" element={<PaymentStep />} />
                  </Route>

                  {/* Booking Confirmation Voucher */}
                  <Route
                    path="/booking/confirmation"
                    element={
                      <ProtectedRoute>
                        <BookingConfirmationPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>

              {/* Global Footer */}
              <Footer />

              {/* Comprehensive Lab Experiments Modal Guide */}
              <ExperimentGuideModal
                isOpen={labGuideOpen}
                onClose={() => setLabGuideOpen(false)}
              />

              {/* Floating Live Action & JWT Console Widget */}
              <ActionConsoleWidget />
            </div>
          </BrowserRouter>
        </BookingProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
