import { test, describe, before, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

// Mock browser localStorage for Node test runner environment
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (key) => store.get(key) || null,
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear()
  };
}

if (typeof globalThis.btoa === 'undefined') {
  globalThis.btoa = (str) => Buffer.from(str, 'binary').toString('base64');
}

import { travelApi } from '../services/travelApi.js';
import { authApi } from '../services/authApi.js';
import { useBookingStore } from '../store/useBookingStore.js';
import { TOKEN_STORAGE_KEY } from '../services/apiClient.js';
import { reduxStore } from '../store/redux/store.js';
import { selectPackage, addToCart, clearCart } from '../store/redux/bookingSlice.js';

describe('Scenario 9: TITANIC TOURISM - All 4 Experiments Test Suite', () => {

  beforeEach(() => {
    localStorage.clear();
  });

  // =========================================================================
  // EXPERIMENT 1: REST API Integration (Axios, Fetch, Async Data)
  // =========================================================================
  describe('Experiment 1: REST API Integration with Axios & async/await', () => {
    test('1a) Fetch travel packages from REST API via GET /packages', async () => {
      const packages = await travelApi.getPackages();
      assert.ok(Array.isArray(packages), 'Packages must be an array');
      assert.ok(packages.length >= 8, 'Must return at least 8 luxury packages');
      assert.equal(packages[0].id, '101');
    });

    test('1b) Destination, budget, duration, and rating filters', async () => {
      // Destination search
      const searched = await travelApi.getPackages({ search: 'Transatlantic' });
      assert.ok(searched.length > 0);
      assert.ok(searched[0].name.includes('Transatlantic'));

      // Budget filter
      const budgetFiltered = await travelApi.getPackages({ maxBudget: 3000 });
      assert.ok(budgetFiltered.every((p) => p.price <= 3000));

      // Duration filter
      const durationFiltered = await travelApi.getPackages({ duration: 'short' });
      assert.ok(durationFiltered.every((p) => p.durationDays >= 3 && p.durationDays <= 5));

      // Rating filter
      const ratingFiltered = await travelApi.getPackages({ minRating: 4.9 });
      assert.ok(ratingFiltered.every((p) => p.rating >= 4.9));
    });

    test('1c) Fetch individual package details dynamically via GET /packages/:id', async () => {
      const pkg = await travelApi.getPackageById('101');
      assert.equal(pkg.id, '101');
      assert.equal(pkg.name, 'Transatlantic Royal Odyssey');
      assert.ok(Array.isArray(pkg.itinerary));
      assert.ok(Array.isArray(pkg.inclusions));
      assert.ok(Array.isArray(pkg.exclusions));
    });

    test('1d) Retrieve availability and travel information using API requests', async () => {
      const availability = await travelApi.checkAvailability('101', '2026-06-15');
      assert.equal(availability.packageId, '101');
      assert.ok(availability.availableCabins > 0);
      assert.equal(availability.status, 'Guaranteed Departure');
      assert.ok(Array.isArray(availability.stateroomTypes));
    });

    test('1e & 1f) Handle async operations with async/await and error states (404 Not Found)', async () => {
      await assert.rejects(
        async () => {
          await travelApi.getPackageById('non-existent-999');
        },
        (err) => {
          return err.response?.status === 404;
        }
      );
    });
  });

  // =========================================================================
  // EXPERIMENT 2: State Management (Zustand, Redux Toolkit, Middleware, Caching)
  // =========================================================================
  describe('Experiment 2: State Management (Zustand & Redux Toolkit)', () => {
    test('2a & 2b) Global store manages selected package, dates, travelers, and cart', () => {
      const store = useBookingStore.getState();
      const mockPkg = { id: '101', name: 'Transatlantic Royal Odyssey', price: 3450, durationDays: 8 };

      store.selectPackage(mockPkg);
      store.setTravelDates({ departure: '2026-06-15', returnDate: '2026-06-23' });
      store.setTravelers({ adults: 2, children: 1 });

      const updated = useBookingStore.getState();
      assert.equal(updated.selectedPackage.id, '101');
      assert.equal(updated.travelDates.departure, '2026-06-15');
      assert.equal(updated.travelers.adults, 2);
      assert.equal(updated.travelers.children, 1);
    });

    test('2c) Implement add, remove, update, and clear booking cart operations', () => {
      const store = useBookingStore.getState();
      store.clearCart();
      const mockPkg = { id: '102', name: 'Mediterranean Azure', price: 2890, durationDays: 7 };

      // Add to cart
      store.addToCart(mockPkg);
      let state = useBookingStore.getState();
      assert.equal(state.cartItems.length, 1);
      assert.equal(state.cartItems[0].packageId, '102');

      // Update cart item
      const cartItemId = state.cartItems[0].cartItemId;
      store.updateCartItem(cartItemId, { travelersCount: 4 });
      state = useBookingStore.getState();
      assert.equal(state.cartItems[0].travelersCount, 4);

      // Remove from cart
      store.removeFromCart(cartItemId);
      state = useBookingStore.getState();
      assert.equal(state.cartItems.length, 0);
    });

    test('2e & 2f) Caching package information and financial calculations', () => {
      const store = useBookingStore.getState();
      const mockPkg = { id: '101', name: 'Transatlantic Royal Odyssey', price: 3000, durationDays: 8 };

      store.selectPackage(mockPkg);
      store.setTravelers({ adults: 2, children: 0 });
      store.setIsPromoApplied(true);

      const calc = store.getCalculations();
      // packageCost: 2 * 3000 = 6000
      assert.equal(calc.packageCost, 6000);
      // discount 10%: 600
      assert.equal(calc.discount, 600);
      // taxable: 5400, 5% tax = 270
      assert.equal(calc.taxes, 270);
      // final: 5400 + 270 = 5670
      assert.equal(calc.finalTotal, 5670);
    });

    test('2-Redux) Redux Toolkit store with actions and middleware', () => {
      const mockPkg = { id: '103', name: 'Swiss Alpine Glacier', price: 3200 };
      reduxStore.dispatch(selectPackage(mockPkg));
      reduxStore.dispatch(addToCart(mockPkg));

      const reduxState = reduxStore.getState().booking;
      assert.equal(reduxState.selectedPackage.id, '103');
      assert.equal(reduxState.cartItems.length, 1);

      reduxStore.dispatch(clearCart());
      assert.equal(reduxStore.getState().booking.cartItems.length, 0);
    });
  });

  // =========================================================================
  // EXPERIMENT 3: REST API CRUD Operations (GET, POST, PUT, DELETE)
  // =========================================================================
  describe('Experiment 3: REST API CRUD Operations on Bookings', () => {
    test('3a-e) Full CRUD Lifecycle: GET -> POST -> GET -> PUT -> DELETE', async () => {
      // 1. Authenticate to obtain token for protected CRUD
      const auth = await authApi.login('lord.sterling@titanictourism.com', 'RoyalVoyager1912!');
      assert.ok(auth.token, 'Must receive JWT token');

      // 2. GET initial bookings
      const initialBookings = await travelApi.getBookings();
      assert.ok(Array.isArray(initialBookings));

      // 3. POST: Add new booking
      const newBookingPayload = {
        package: { id: '101', name: 'Transatlantic Royal Odyssey', price: 3450 },
        travelDates: { departure: '2026-08-01', returnDate: '2026-08-09' },
        travelers: { adults: 2, children: 0 },
        travelerDetails: { firstName: 'Arthur', lastName: 'Sterling', email: 'lord.sterling@titanictourism.com' }
      };
      const createdBooking = await travelApi.createBooking(newBookingPayload);
      assert.ok(createdBooking.id, 'Created booking must have ID');
      assert.ok(createdBooking.bookingId.startsWith('TITANIC-'));

      // 4. GET: Verify created booking appears in history
      const updatedList = await travelApi.getBookings();
      assert.ok(updatedList.some((b) => b.bookingId === createdBooking.bookingId));

      // 5. PUT/PATCH: Update booking details
      const updateResult = await travelApi.updateBooking(createdBooking.id, {
        travelDates: { departure: '2026-09-01', returnDate: '2026-09-09' }
      });
      assert.equal(updateResult.travelDates.departure, '2026-09-01');

      // 6. DELETE: Cancel the booking
      const deleteResult = await travelApi.cancelBooking(createdBooking.id);
      assert.equal(deleteResult.success, true);

      // Verify removed from bookings history
      const afterDeleteList = await travelApi.getBookings();
      assert.ok(!afterDeleteList.some((b) => b.id === createdBooking.id));
    });

    test('3f) Handle loading and API errors gracefully on invalid booking ID', async () => {
      await authApi.login('traveler@titanictourism.com', 'Secret1912!');
      await assert.rejects(
        async () => {
          await travelApi.updateBooking('non-existent-booking-id', { travelers: { adults: 3 } });
        },
        (err) => {
          return err.response?.status === 404;
        }
      );
    });
  });

  // =========================================================================
  // EXPERIMENT 4: Authentication & Token Management (JWT / Bearer Token)
  // =========================================================================
  describe('Experiment 4: Authentication & Token Management', () => {
    test('4a & 4b) Traveler login returns token and persists in storage', async () => {
      const loginResponse = await authApi.login('traveler@titanictourism.com', 'Secret1912!');
      assert.ok(loginResponse.token);
      assert.equal(authApi.getToken(), loginResponse.token);
      assert.equal(localStorage.getItem(TOKEN_STORAGE_KEY), loginResponse.token);
      assert.equal(authApi.isAuthenticated(), true);
    });

    test('4c & 4d) Protected API endpoints reject requests without token with 401', async () => {
      authApi.logout();
      assert.equal(authApi.isAuthenticated(), false);

      // Attempting protected call without token should reject with 401
      await assert.rejects(
        async () => {
          await travelApi.getBookings();
        },
        (err) => {
          return err.response?.status === 401;
        }
      );
    });

    test('4e) Logout and token removal', async () => {
      await authApi.login('traveler@titanictourism.com', 'Secret1912!');
      assert.ok(authApi.getToken());

      authApi.logout();
      assert.equal(authApi.getToken(), null);
      assert.equal(localStorage.getItem(TOKEN_STORAGE_KEY), null);
      assert.equal(authApi.isAuthenticated(), false);
    });

    test('4f) Handle invalid and expired tokens with 401 response and storage purge', async () => {
      // Set simulated expired token
      authApi.setSimulatedExpiredToken();
      assert.ok(authApi.getToken());

      // Attempting protected call with expired token rejects with 401
      await assert.rejects(
        async () => {
          await travelApi.getBookings();
        },
        (err) => {
          return err.response?.status === 401;
        }
      );

      // Interceptor must have purged the expired token from localStorage
      assert.equal(localStorage.getItem(TOKEN_STORAGE_KEY), null);
      assert.equal(authApi.isAuthenticated(), false);
    });
  });
});
