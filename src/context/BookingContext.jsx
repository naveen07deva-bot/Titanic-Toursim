import React, { createContext, useContext, useEffect } from 'react';
import { useBookingStore } from '../store/useBookingStore';

import { reduxStore } from '../store/redux/store.js';
import {
  selectPackage as reduxSelectPackage,
  addToCart as reduxAddToCart,
  clearCart as reduxClearCart,
  setTravelDates as reduxSetTravelDates,
  setTravelers as reduxSetTravelers
} from '../store/redux/bookingSlice.js';

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  const store = useBookingStore();

  // Load packages and bookings from REST API on startup (Experiment 1a, 3a)
  useEffect(() => {
    store.fetchPackages();
    store.fetchBookings().catch(() => {});
  }, []);

  // Compute live calculations
  const calculationSummary = store.getCalculations();
  const cartSummary = store.getCartTotals();

  // Unified context value that delegates to Zustand store with REST API backing & Redux dispatches
  const value = {
    // Packages Data & Async State
    packages: store.packages,
    filteredPackages: store.packages,
    loading: store.loading,
    error: store.error,
    packageCache: store.packageCache,
    fetchPackages: store.fetchPackages,

    // Filters
    searchTerm: store.filters.search,
    setSearchTerm: (term) => store.setFilters({ search: term }),
    selectedCategory: store.filters.category,
    setSelectedCategory: (cat) => store.setFilters({ category: cat }),
    selectedDuration: store.filters.duration,
    setSelectedDuration: (dur) => store.setFilters({ duration: dur }),
    maxBudget: store.filters.maxBudget,
    setMaxBudget: (b) => store.setFilters({ maxBudget: b }),
    minRating: store.filters.minRating,
    setMinRating: (r) => store.setFilters({ minRating: r }),
    resetFilters: store.resetFilters,
    getPackageById: (id) => store.packages.find((p) => String(p.id) === String(id)),
    fetchPackageById: store.fetchPackageById,

    // Availability (Experiment 1d)
    checkAvailability: store.checkAvailability,
    availabilityData: store.availabilityData,
    availabilityLoading: store.availabilityLoading,

    // Selected Package (Synced to Zustand & Redux for console visibility)
    selectedPackage: store.selectedPackage,
    setSelectedPackage: (pkg) => {
      store.selectPackage(pkg);
      if (pkg) reduxStore.dispatch(reduxSelectPackage(pkg));
    },
    selectPackage: (pkg) => {
      store.selectPackage(pkg);
      if (pkg) reduxStore.dispatch(reduxSelectPackage(pkg));
    },

    // Dates & Travelers (Synced to Zustand & Redux)
    travelDates: store.travelDates,
    setTravelDates: (dates) => {
      store.setTravelDates(dates);
      if (typeof dates === 'object') reduxStore.dispatch(reduxSetTravelDates(dates));
    },
    updateTravelDates: (dates) => {
      store.setTravelDates(dates);
      if (typeof dates === 'object') reduxStore.dispatch(reduxSetTravelDates(dates));
    },
    travelers: store.travelers,
    setTravelers: (travelers) => {
      store.setTravelers(travelers);
      if (typeof travelers === 'object') reduxStore.dispatch(reduxSetTravelers(travelers));
    },
    updateTravelers: (travelers) => {
      store.setTravelers(travelers);
      if (typeof travelers === 'object') reduxStore.dispatch(reduxSetTravelers(travelers));
    },
    totalTravelersCount: calculationSummary.totalTravelersCount,
    tripDurationDays: calculationSummary.tripDurationDays,

    // Cart (Experiment 2b, 2c - Synced to Zustand & Redux)
    cartItems: store.cartItems,
    addToCart: (pkg, customDates, customTravelers) => {
      store.addToCart(pkg, customDates, customTravelers);
      if (pkg) reduxStore.dispatch(reduxAddToCart(pkg));
    },
    removeFromCart: store.removeFromCart,
    updateCartItem: store.updateCartItem,
    clearCart: () => {
      store.clearCart();
      reduxStore.dispatch(reduxClearCart());
    },

    // Passenger Manifest Details
    travelerDetails: store.travelerDetails,
    setTravelerDetails: store.setTravelerDetails,

    // Promo & Totals (Experiment 2f)
    discountCode: store.discountCode,
    setDiscountCode: store.setDiscountCode,
    isPromoApplied: store.isPromoApplied,
    setIsPromoApplied: store.setIsPromoApplied,
    calculationSummary,
    cartSummary,

    // CRUD Operations with REST API (Experiment 3)
    confirmBooking: store.createBooking,
    createBooking: store.createBooking,
    bookings: store.bookings,
    fetchBookings: store.fetchBookings,
    updateBooking: store.updateBooking,
    cancelBooking: store.cancelBooking,
    bookingsLoading: store.bookingsLoading,
    bookingsError: store.bookingsError
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
