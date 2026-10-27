import { logReduxAction } from '../../utils/actionLogger.js';

/**
 * Redux Action Monitoring Middleware (Experiment 2d)
 * Intercepts every dispatched Redux action, logs duration, type, and payload
 */
export const reduxActionMonitorMiddleware = (storeAPI) => (next) => (action) => {
  const startTime = performance.now();
  const result = next(action);
  const duration = (performance.now() - startTime).toFixed(2);

  if (typeof action === 'object' && action?.type) {
    const entry = {
      actionType: action.type,
      payload: action.payload,
      durationMs: duration,
      timestamp: new Date().toLocaleTimeString()
    };

    // Console visibility for Redux action (Experiment 2d)
    logReduxAction(action, storeAPI.getState().booking, duration);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('titanic_redux_action', { detail: entry })
      );
    }
  }

  return result;
};
