import { logStoreAction } from '../../utils/actionLogger.js';

/**
 * Action Monitoring Middleware (Experiment 2d)
 * Monitors, timestamps, logs, and tracks performance for all booking store operations
 */
export const actionLogs = [];

function inferActionName(prevState, nextState, args) {
  // If an explicit action name was passed as third or second arg
  if (typeof args[2] === 'string') return args[2];
  if (typeof args[1] === 'string') return args[1];

  if (!prevState || !nextState) return 'STORE_UPDATE';

  if (prevState.selectedPackage !== nextState.selectedPackage) {
    return nextState.selectedPackage
      ? `SELECT_PACKAGE: ${nextState.selectedPackage.name}`
      : 'DESELECT_PACKAGE';
  }

  if (prevState.cartItems !== nextState.cartItems) {
    if (nextState.cartItems.length > (prevState.cartItems?.length || 0)) {
      const added = nextState.cartItems[0];
      return `ADD_TO_CART: ${added?.name || 'Package'} ($${added?.price?.toLocaleString() || 0})`;
    }
    if (nextState.cartItems.length < (prevState.cartItems?.length || 0)) {
      return nextState.cartItems.length === 0 ? 'CLEAR_CART' : 'REMOVE_FROM_CART';
    }
    return 'UPDATE_CART_ITEM';
  }

  if (prevState.travelDates !== nextState.travelDates) {
    return `SET_TRAVEL_DATES: Departure ${nextState.travelDates?.departure || 'N/A'} -> Return ${nextState.travelDates?.returnDate || 'N/A'}`;
  }

  if (prevState.travelers !== nextState.travelers) {
    return `SET_TRAVELERS: ${nextState.travelers?.adults || 0} Adults, ${nextState.travelers?.children || 0} Children`;
  }

  if (prevState.travelerDetails !== nextState.travelerDetails) {
    return `SET_TRAVELER_DETAILS: ${nextState.travelerDetails?.title || ''} ${nextState.travelerDetails?.firstName || ''} ${nextState.travelerDetails?.lastName || ''}`;
  }

  if (prevState.bookings !== nextState.bookings) {
    if ((nextState.bookings?.length || 0) > (prevState.bookings?.length || 0)) {
      return `CREATE_BOOKING: Ref ${nextState.bookings[0]?.bookingId || 'New'}`;
    }
    if ((nextState.bookings?.length || 0) < (prevState.bookings?.length || 0)) {
      return 'CANCEL_BOOKING (DELETE)';
    }
    return 'UPDATE_BOOKING (PUT)';
  }

  if (prevState.isPromoApplied !== nextState.isPromoApplied) {
    return nextState.isPromoApplied ? 'APPLY_PROMO_CODE (VOYAGE10 - 10% Discount)' : 'REMOVE_PROMO_CODE';
  }

  if (prevState.filters !== nextState.filters) {
    return `SET_FILTERS: Category=${nextState.filters?.category || 'All'}, Budget=$${nextState.filters?.maxBudget || 'Max'}`;
  }

  if (prevState.packages !== nextState.packages) {
    return `FETCH_PACKAGES_LOADED: ${nextState.packages?.length || 0} Luxury Voyages`;
  }

  if (prevState.availabilityData !== nextState.availabilityData) {
    return `CHECK_AVAILABILITY: ${nextState.availabilityData?.availableCabins || 0} Staterooms Guaranteed`;
  }

  if (prevState.loading !== nextState.loading) {
    return nextState.loading ? 'LOADING_STATE_STARTED' : 'LOADING_STATE_FINISHED';
  }

  return 'STORE_STATE_MUTATION';
}

export const actionMonitorMiddleware = (config) => (set, get, api) => {
  if (typeof window !== 'undefined') {
    window.__TITANIC_STORE__ = api;
  }

  return config(
    (...args) => {
      const prevState = get();
      const startTime = performance.now();

      // Execute state change
      set(...args);

      const nextState = get();
      const duration = (performance.now() - startTime).toFixed(2);
      const actionName = inferActionName(prevState, nextState, args);

      // Determine action metadata from caller or state change diff
      const logEntry = {
        id: 'ACT-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        timestamp: new Date().toLocaleTimeString(),
        durationMs: duration,
        actionName,
        prevStateSummary: {
          cartCount: prevState?.cartItems?.length || 0,
          selectedPackage: prevState?.selectedPackage?.name || 'None',
          bookingsCount: prevState?.bookings?.length || 0
        },
        nextStateSummary: {
          cartCount: nextState?.cartItems?.length || 0,
          selectedPackage: nextState?.selectedPackage?.name || 'None',
          bookingsCount: nextState?.bookings?.length || 0
        }
      };

      actionLogs.unshift(logEntry);
      if (actionLogs.length > 50) actionLogs.pop();

      // Console visibility for actions and active JWT (Experiment 2d)
      logStoreAction(actionName, {
        durationMs: duration,
        prevStateSummary: logEntry.prevStateSummary,
        nextStateSummary: logEntry.nextStateSummary,
        payload: args[0]
      });

      // Broadcast event to UI monitor bar
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('titanic_store_action', {
            detail: logEntry
          })
        );
      }
    },
    get,
    api
  );
};
