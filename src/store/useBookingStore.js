import { create } from 'zustand';
import { actionMonitorMiddleware } from './middleware/actionMonitorMiddleware.js';
import { travelApi } from '../services/travelApi.js';

// Caching configuration: 5 minutes TTL (Experiment 2e)
const CACHE_TTL_MS = 5 * 60 * 1000;

export const useBookingStore = create(
  actionMonitorMiddleware((set, get) => ({
    // State (Experiment 2a, 2b)
    packages: [],
    loading: false,
    error: null,
    availabilityLoading: false,
    availabilityData: null,

    // Caching layer (Experiment 2e)
    packageCache: {
      data: null,
      timestamp: 0
    },

    // Selected Package for current booking workflow
    selectedPackage: null,

    // Travel Dates
    travelDates: {
      departure: '',
      returnDate: ''
    },

    // Number of Travelers
    travelers: {
      adults: 2,
      children: 0
    },

    // Booking Cart Items (Folio)
    cartItems: [],

    // Traveler Information Manifest
    travelerDetails: {
      title: 'Lord',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      passportNumber: '',
      specialRequests: '',
      emergencyContact: ''
    },

    // Confirmed Bookings History (CRUD: Experiment 3)
    bookings: [],
    bookingsLoading: false,
    bookingsError: null,

    // Filter criteria (Experiment 1b)
    filters: {
      search: '',
      category: 'All Voyages',
      duration: 'all',
      maxBudget: 5000,
      minRating: 0
    },

    // Promo code
    discountCode: 'VOYAGE10',
    isPromoApplied: true,

    // Actions: Filters
    setFilters: (newFilters) => {
      set((state) => ({
        filters: { ...state.filters, ...newFilters }
      }));
      // Fetch packages with updated filters
      get().fetchPackages({ ...get().filters, ...newFilters });
    },

    resetFilters: () => {
      const reset = {
        search: '',
        category: 'All Voyages',
        duration: 'all',
        maxBudget: 5000,
        minRating: 0
      };
      set({ filters: reset });
      get().fetchPackages(reset);
    },

    // Actions: Async Fetch Packages with REST API & Caching (Experiment 1a, 1e, 2e, 3a)
    fetchPackages: async (overrideFilters = null, forceRefresh = false) => {
      const activeFilters = overrideFilters || get().filters;
      const isDefaultFilter =
        !activeFilters.search &&
        (!activeFilters.category || activeFilters.category === 'All Voyages') &&
        (!activeFilters.duration || activeFilters.duration === 'all') &&
        activeFilters.maxBudget >= 5000 &&
        activeFilters.minRating === 0;

      // Experiment 2e: Check package cache if no custom search filters applied
      const cache = get().packageCache;
      const now = Date.now();
      if (!forceRefresh && isDefaultFilter && cache.data && (now - cache.timestamp < CACHE_TTL_MS)) {
        set({ packages: cache.data, loading: false, error: null });
        return cache.data;
      }

      set({ loading: true, error: null });
      try {
        const data = await travelApi.getPackages(activeFilters);
        set((state) => ({
          packages: data,
          loading: false,
          error: null,
          packageCache: isDefaultFilter ? { data, timestamp: Date.now() } : state.packageCache
        }));
        return data;
      } catch (err) {
        set({
          loading: false,
          error: err.response?.data?.message || 'Failed to fetch travel packages from REST API'
        });
        throw err;
      }
    },

    // Actions: Fetch individual package details dynamically (Experiment 1c, 3a)
    fetchPackageById: async (id) => {
      set({ loading: true, error: null });
      try {
        const pkg = await travelApi.getPackageById(id);
        set({ selectedPackage: pkg, loading: false });
        return pkg;
      } catch (err) {
        set({
          loading: false,
          error: err.response?.data?.message || `Package #${id} not found`
        });
        throw err;
      }
    },

    // Actions: Retrieve availability using API request (Experiment 1d)
    checkAvailability: async (packageId, departureDate) => {
      set({ availabilityLoading: true });
      try {
        const data = await travelApi.checkAvailability(packageId, departureDate);
        set({ availabilityData: data, availabilityLoading: false });
        return data;
      } catch (err) {
        set({ availabilityLoading: false });
        throw err;
      }
    },

    // Actions: Manage Selected Package, Dates, and Travelers (Experiment 2b)
    selectPackage: (pkg) => {
      set({ selectedPackage: pkg });
      if (!get().travelDates.departure) {
        const today = new Date();
        const nextMonth = new Date(today);
        nextMonth.setDate(today.getDate() + 14);
        const returnD = new Date(nextMonth);
        returnD.setDate(nextMonth.getDate() + (pkg.durationDays || 7));

        set({
          travelDates: {
            departure: nextMonth.toISOString().split('T')[0],
            returnDate: returnD.toISOString().split('T')[0]
          }
        });
      }
    },

    setTravelDates: (dates) => {
      set((state) => ({
        travelDates: typeof dates === 'function' ? dates(state.travelDates) : { ...state.travelDates, ...dates }
      }));
    },

    setTravelers: (travelers) => {
      set((state) => ({
        travelers: typeof travelers === 'function' ? travelers(state.travelers) : { ...state.travelers, ...travelers }
      }));
    },

    setTravelerDetails: (details) => {
      set((state) => ({
        travelerDetails: typeof details === 'function' ? details(state.travelerDetails) : { ...state.travelerDetails, ...details }
      }));
    },

    setDiscountCode: (code) => set({ discountCode: code }),
    setIsPromoApplied: (applied) => set({ isPromoApplied: applied }),

    // Actions: Cart Operations (Add, Remove, Update, Clear - Experiment 2c)
    addToCart: (pkg, customDates = null, customTravelers = null) => {
      const dates = customDates || get().travelDates;
      const trav = customTravelers || get().travelers;
      const travelersCount = Number(trav.adults || 1) + Number(trav.children || 0);
      const cost = pkg.price * travelersCount;

      set((state) => {
        const existingIdx = state.cartItems.findIndex((item) => item.packageId === pkg.id);
        if (existingIdx > -1) {
          const updated = [...state.cartItems];
          updated[existingIdx] = {
            ...updated[existingIdx],
            dates,
            travelers: trav,
            travelersCount,
            packageCost: cost
          };
          return { cartItems: updated };
        }

        const newItem = {
          cartItemId: 'CART-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
          packageId: pkg.id,
          name: pkg.name,
          destination: pkg.destination,
          image: pkg.image,
          category: pkg.category,
          price: pkg.price,
          durationDays: pkg.durationDays,
          durationText: pkg.durationText,
          dates,
          travelers: trav,
          travelersCount,
          packageCost: cost,
          addedAt: new Date().toISOString()
        };
        return { cartItems: [newItem, ...state.cartItems] };
      });
    },

    removeFromCart: (cartItemId) => {
      set((state) => ({
        cartItems: state.cartItems.filter(
          (item) => item.cartItemId !== cartItemId && item.packageId !== cartItemId
        )
      }));
    },

    updateCartItem: (cartItemId, updates) => {
      set((state) => ({
        cartItems: state.cartItems.map((item) =>
          item.cartItemId === cartItemId || item.packageId === cartItemId
            ? { ...item, ...updates }
            : item
        )
      }));
    },

    clearCart: () => {
      set({ cartItems: [] });
    },

    // Actions: Bookings CRUD with REST API & Token (Experiment 3, Experiment 4c, 4d)
    fetchBookings: async () => {
      set({ bookingsLoading: true, bookingsError: null });
      try {
        const bookingsList = await travelApi.getBookings();
        set({ bookings: bookingsList, bookingsLoading: false });
        return bookingsList;
      } catch (err) {
        set({
          bookingsLoading: false,
          bookingsError: err.response?.data?.message || 'Failed to load booking history'
        });
        throw err;
      }
    },

    createBooking: async (paymentInfo = {}) => {
      const state = get();
      const calculations = state.getCalculations();

      const bookingPayload = {
        package: state.selectedPackage,
        travelDates: state.travelDates,
        travelers: state.travelers,
        totalTravelersCount: Number(state.travelers.adults || 0) + Number(state.travelers.children || 0),
        tripDurationDays: calculations.tripDurationDays,
        pricing: calculations,
        travelerDetails: state.travelerDetails,
        payment: {
          method: paymentInfo.method || 'Titanium Royal Black Card',
          cardholder: paymentInfo.cardholder
        }
      };

      try {
        const createdBooking = await travelApi.createBooking(bookingPayload);
        set((s) => ({
          bookings: [createdBooking, ...s.bookings]
        }));
        return createdBooking;
      } catch (err) {
        throw err;
      }
    },

    updateBooking: async (bookingId, updates) => {
      try {
        const updatedBooking = await travelApi.updateBooking(bookingId, updates);
        set((s) => ({
          bookings: s.bookings.map((b) => (b.id === bookingId || b.bookingId === bookingId ? updatedBooking : b))
        }));
        return updatedBooking;
      } catch (err) {
        throw err;
      }
    },

    cancelBooking: async (bookingId) => {
      try {
        await travelApi.cancelBooking(bookingId);
        set((s) => ({
          bookings: s.bookings.filter((b) => b.id !== bookingId && b.bookingId !== bookingId)
        }));
        return true;
      } catch (err) {
        throw err;
      }
    },

    // Calculations: Package cost, discount, tax, and final amount (Experiment 2f)
    getCalculations: () => {
      const state = get();
      const pkg = state.selectedPackage;
      const travelers = state.travelers;
      const totalCount = Number(travelers.adults || 1) + Number(travelers.children || 0);

      // Duration calculation
      let tripDurationDays = pkg?.durationDays || 7;
      if (state.travelDates.departure && state.travelDates.returnDate) {
        const start = new Date(state.travelDates.departure);
        const end = new Date(state.travelDates.returnDate);
        const diff = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24));
        if (diff > 0) tripDurationDays = diff;
      }

      if (!pkg) {
        return {
          baseRate: 0,
          packageCost: 0,
          discount: 0,
          taxes: 0,
          finalTotal: 0,
          totalTravelersCount: totalCount,
          tripDurationDays
        };
      }

      const baseRate = pkg.price;
      const adultsCost = (travelers.adults || 1) * baseRate;
      const childrenCost = (travelers.children || 0) * (baseRate * 0.7);
      const packageCost = Math.round(adultsCost + childrenCost);

      const discountPercent = state.isPromoApplied ? 0.10 : (totalCount >= 4 ? 0.08 : 0);
      const discount = Math.round(packageCost * discountPercent);

      const taxable = packageCost - discount;
      const taxes = Math.round(taxable * 0.05);
      const finalTotal = taxable + taxes;

      return {
        baseRate,
        packageCost,
        discount,
        taxes,
        finalTotal,
        discountPercent: Math.round(discountPercent * 100),
        totalTravelersCount: totalCount,
        tripDurationDays
      };
    },

    // Cart Totals Calculation
    getCartTotals: () => {
      const state = get();
      const items = state.cartItems;
      const totalItems = items.length;
      const subtotal = items.reduce(
        (acc, item) => acc + (item.packageCost || item.price * (item.travelersCount || 1)),
        0
      );
      const discount = state.isPromoApplied ? Math.round(subtotal * 0.10) : 0;
      const taxes = Math.round((subtotal - discount) * 0.05);
      const grandTotal = subtotal - discount + taxes;

      return {
        totalItems,
        subtotal,
        discount,
        taxes,
        grandTotal
      };
    }
  }))
);
