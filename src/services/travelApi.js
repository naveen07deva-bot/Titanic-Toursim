import { apiClient } from './apiClient.js';

/**
 * Travel REST API Service (Experiment 1 & Experiment 3)
 * Implements CRUD operations, filtering, availability checks, and error handling via Axios
 */
export const travelApi = {
  // Experiment 1a, 1b & Experiment 3a: GET /packages with filters
  getPackages: async (filters = {}) => {
    try {
      const response = await apiClient.get('/packages', {
        params: {
          search: filters.search || undefined,
          category: filters.category || undefined,
          duration: filters.duration || undefined,
          maxBudget: filters.maxBudget || undefined,
          minRating: filters.minRating || undefined
        }
      });
      return response.data;
    } catch (error) {
      console.error('API Error in getPackages:', error.response?.data?.message || error.message);
      throw error;
    }
  },

  // Experiment 1c & 3a: GET individual package details dynamically
  getPackageById: async (id) => {
    try {
      const response = await apiClient.get(`/packages/${id}`);
      return response.data;
    } catch (error) {
      console.error(`API Error fetching package ${id}:`, error.response?.data?.message || error.message);
      throw error;
    }
  },

  // Experiment 1d: Retrieve availability and travel information using API requests
  checkAvailability: async (id, departureDate) => {
    try {
      const response = await apiClient.get(`/packages/${id}/availability`, {
        params: { departureDate }
      });
      return response.data;
    } catch (error) {
      console.error(`API Error checking availability for package ${id}:`, error);
      throw error;
    }
  },

  // Experiment 3b: Add a travel package or booking using POST
  createBooking: async (bookingData) => {
    try {
      const response = await apiClient.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      console.error('API Error creating booking (POST):', error.response?.data?.message || error.message);
      throw error;
    }
  },

  // Experiment 3e: Retrieve booking history using GET
  getBookings: async () => {
    try {
      const response = await apiClient.get('/bookings');
      return response.data;
    } catch (error) {
      console.error('API Error retrieving bookings (GET):', error.response?.data?.message || error.message);
      throw error;
    }
  },

  // Experiment 3c: Update booking details using PUT/PATCH
  updateBooking: async (bookingId, updates) => {
    try {
      const response = await apiClient.put(`/bookings/${bookingId}`, updates);
      return response.data;
    } catch (error) {
      console.error(`API Error updating booking ${bookingId} (PUT):`, error.response?.data?.message || error.message);
      throw error;
    }
  },

  // Experiment 3d: Cancel a booking using DELETE
  cancelBooking: async (bookingId) => {
    try {
      const response = await apiClient.delete(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error(`API Error cancelling booking ${bookingId} (DELETE):`, error.response?.data?.message || error.message);
      throw error;
    }
  },

  // Experiment 3b: Add a new custom travel package using POST
  addPackage: async (packageData) => {
    try {
      const response = await apiClient.post('/packages', packageData);
      return response.data;
    } catch (error) {
      console.error('API Error adding package (POST):', error);
      throw error;
    }
  }
};
