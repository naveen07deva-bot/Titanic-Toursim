import { configureStore } from '@reduxjs/toolkit';
import bookingReducer from './bookingSlice.js';
import { reduxActionMonitorMiddleware } from './middleware.js';

export const reduxStore = configureStore({
  reducer: {
    booking: bookingReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(reduxActionMonitorMiddleware)
});

export default reduxStore;
