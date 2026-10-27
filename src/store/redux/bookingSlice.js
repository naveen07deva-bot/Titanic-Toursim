import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { travelApi } from '../../services/travelApi.js';

// Async Thunks using Axios REST API (Experiment 1, 3)
export const fetchPackagesThunk = createAsyncThunk(
  'booking/fetchPackages',
  async (filters, { rejectWithValue }) => {
    try {
      return await travelApi.getPackages(filters);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchBookingsThunk = createAsyncThunk(
  'booking/fetchBookings',
  async (_, { rejectWithValue }) => {
    try {
      return await travelApi.getBookings();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createBookingThunk = createAsyncThunk(
  'booking/createBooking',
  async (bookingPayload, { rejectWithValue }) => {
    try {
      return await travelApi.createBooking(bookingPayload);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const cancelBookingThunk = createAsyncThunk(
  'booking/cancelBooking',
  async (bookingId, { rejectWithValue }) => {
    try {
      await travelApi.cancelBooking(bookingId);
      return bookingId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const initialState = {
  packages: [],
  packageCache: { data: null, timestamp: 0 },
  selectedPackage: null,
  travelDates: { departure: '', returnDate: '' },
  travelers: { adults: 2, children: 0 },
  cartItems: [],
  bookings: [],
  loading: false,
  error: null,
  isPromoApplied: true
};

export const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    selectPackage: (state, action) => {
      state.selectedPackage = action.payload;
    },
    setTravelDates: (state, action) => {
      state.travelDates = { ...state.travelDates, ...action.payload };
    },
    setTravelers: (state, action) => {
      state.travelers = { ...state.travelers, ...action.payload };
    },
    addToCart: (state, action) => {
      const pkg = action.payload;
      const count = Number(state.travelers.adults || 1) + Number(state.travelers.children || 0);
      state.cartItems.unshift({
        cartItemId: 'CART-' + Date.now(),
        packageId: pkg.id,
        name: pkg.name,
        destination: pkg.destination,
        price: pkg.price,
        travelersCount: count,
        packageCost: pkg.price * count,
        image: pkg.image
      });
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.cartItemId !== action.payload && item.packageId !== action.payload
      );
    },
    clearCart: (state) => {
      state.cartItems = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch packages
      .addCase(fetchPackagesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPackagesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.packages = action.payload;
        state.packageCache = { data: action.payload, timestamp: Date.now() };
      })
      .addCase(fetchPackagesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch bookings
      .addCase(fetchBookingsThunk.fulfilled, (state, action) => {
        state.bookings = action.payload;
      })
      // Create booking
      .addCase(createBookingThunk.fulfilled, (state, action) => {
        state.bookings.unshift(action.payload);
      })
      // Cancel booking
      .addCase(cancelBookingThunk.fulfilled, (state, action) => {
        state.bookings = state.bookings.filter(
          (b) => b.id !== action.payload && b.bookingId !== action.payload
        );
      });
  }
});

export const { selectPackage, setTravelDates, setTravelers, addToCart, removeFromCart, clearCart } =
  bookingSlice.actions;

export default bookingSlice.reducer;
