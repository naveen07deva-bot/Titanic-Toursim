/**
 * Action & JWT Console Logger for TITANIC TOURISM
 * 
 * Provides visible, real-time console logging using browser default font:
 * 1. Webpage User Interactions (Button clicks, navigation, inputs, form submits)
 * 2. JWT Authentication & Sessions (Tokens, decoded claims, traveler identity, localStorage sync)
 * 3. Store Actions (Zustand booking state mutations, package selection, cart operations)
 * 4. Redux Actions (Dispatched actions, payloads, state snapshots)
 * 5. REST API Requests & Responses (Axios HTTP calls, Bearer token headers, responses)
 */

// Storage keys
export const TOKEN_STORAGE_KEY = 'titanic_auth_token';
export const USER_STORAGE_KEY = 'titanic_auth_user';
export const USER_LOGINS_KEY = 'titanic_user_logins';
export const SAVED_ACCOUNTS_KEY = 'titanic_saved_logins';

// In-memory action telemetry log buffer
export const globalActionLogs = [];
const MAX_LOGS = 100;

/**
 * Safely decodes base64 string across browser and Node environments
 */
function safeBase64Decode(str) {
  if (!str) return null;
  try {
    const clean = str.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = typeof atob !== 'undefined'
      ? atob(clean)
      : (typeof Buffer !== 'undefined' ? Buffer.from(clean, 'base64').toString('utf8') : clean);
    return JSON.parse(decoded);
  } catch {
    return str;
  }
}

/**
 * Decodes standard or simulated 3-part JWT token (Header.Payload.Signature)
 */
export function decodeJwt(token) {
  if (!token || typeof token !== 'string') return null;

  try {
    const parts = token.split('.');
    const header = safeBase64Decode(parts[0]) || { alg: 'HS256', typ: 'JWT' };
    const payload = safeBase64Decode(parts[1]) || {};
    const signature = parts[2] || '';

    const issuedAt = payload.iat ? new Date(payload.iat).toLocaleString() : null;
    const expiresAt = payload.exp ? new Date(payload.exp).toLocaleString() : null;
    const isExpired = payload.exp ? Date.now() > payload.exp : false;

    return {
      raw: token,
      header,
      payload,
      signature,
      issuedAt,
      expiresAt,
      isExpired,
      userEmail: payload.email || null
    };
  } catch (err) {
    return {
      raw: token,
      error: err.message,
      header: null,
      payload: null
    };
  }
}

/**
 * Internal helper to record action to global memory and dispatch event
 */
function recordActionLog(entry) {
  const id = 'LOG-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
  const logItem = {
    id,
    ...entry
  };

  globalActionLogs.unshift(logItem);
  if (globalActionLogs.length > MAX_LOGS) {
    globalActionLogs.pop();
  }

  // Update window inspection helpers in browser
  if (typeof window !== 'undefined') {
    window.__TITANIC_ACTIONS__ = globalActionLogs;
    const currentToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    window.__TITANIC_JWT__ = currentToken ? decodeJwt(currentToken) : null;

    try {
      window.dispatchEvent(
        new CustomEvent('titanic_action_logged', { detail: logItem })
      );
    } catch {
      // Ignore if event dispatch fails in restricted context
    }
  }

  return logItem;
}

/**
 * Logs Webpage Actions visibly in the console using default font
 */
export function logWebpageAction(actionType, description, details = null) {
  const timestamp = new Date().toLocaleTimeString();

  if (typeof console !== 'undefined') {
    if (details) {
      console.log(`[WEBPAGE ACTION: ${actionType}] (${timestamp}) ${description}`, details);
    } else {
      console.log(`[WEBPAGE ACTION: ${actionType}] (${timestamp}) ${description}`);
    }
  }

  return recordActionLog({
    category: 'WEBPAGE_ACTION',
    name: `${actionType}: ${description}`,
    timestamp,
    details
  });
}

/**
 * Logs JWT Authentication & Session Events visibly in console using default font
 */
export function logJwtAuth(eventType, data = {}) {
  const token = data.token || (typeof localStorage !== 'undefined' ? localStorage.getItem(TOKEN_STORAGE_KEY) : null);
  const decoded = token ? decodeJwt(token) : null;
  const user = data.user || (typeof localStorage !== 'undefined' ? JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || 'null') : null);
  const timestamp = new Date().toLocaleTimeString();

  if (typeof console !== 'undefined') {
    console.log(`==================== [JWT & SESSION: ${eventType}] (${timestamp}) ====================`);
    console.log('Session Status:', token ? 'AUTHENTICATED' : 'GUEST (Unauthenticated)');
    console.log('Active Traveler:', user ? `${user.name || user.email} (${user.email}) | Tier: ${user.membershipTier || 'First Class'}` : 'Guest User');

    if (token) {
      console.log('Raw JWT Token (Bearer):\n' + token);
      console.log('Decoded JWT Header:', decoded?.header);
      console.log('Decoded JWT Payload (Claims):', decoded?.payload);
      if (decoded?.expiresAt) {
        console.log('Token Expiration:', decoded.expiresAt + (decoded.isExpired ? ' (EXPIRED)' : ' (VALID)'));
      }
    } else {
      console.log('JWT Token: None (Guest Session)');
    }

    if (data.context) {
      console.log('Context / Note:', data.context);
    }

    if (typeof localStorage !== 'undefined') {
      const savedCount = JSON.parse(localStorage.getItem(USER_LOGINS_KEY) || '[]').length;
      console.log(`Stored User Logins in localStorage["${USER_LOGINS_KEY}"]: ${savedCount} account(s)`);
    }

    console.log('================================================================================');
  }

  return recordActionLog({
    category: 'JWT',
    name: eventType,
    timestamp,
    token,
    decoded,
    user,
    data
  });
}

/**
 * Logs Zustand Store Actions visibly in console using default font
 */
export function logStoreAction(actionName, details = {}) {
  const timestamp = new Date().toLocaleTimeString();
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem(TOKEN_STORAGE_KEY) : null;
  const duration = details.durationMs || '0.00';

  if (typeof console !== 'undefined') {
    const summary = details.payload !== undefined ? details.payload : (details.nextStateSummary || '');
    console.log(`[STORE ACTION] ${actionName} (${duration}ms at ${timestamp})`, summary);
    if (details.prevStateSummary && details.nextStateSummary) {
      console.log('  State Transition:', {
        from: details.prevStateSummary,
        to: details.nextStateSummary,
        authSession: token ? 'Active JWT' : 'Guest'
      });
    }
  }

  return recordActionLog({
    category: 'STORE',
    name: actionName,
    timestamp,
    durationMs: duration,
    token,
    details
  });
}

/**
 * Logs Redux Toolkit Dispatched Actions visibly in console using default font
 */
export function logReduxAction(action, state, durationMs = '0.00') {
  const timestamp = new Date().toLocaleTimeString();
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem(TOKEN_STORAGE_KEY) : null;

  if (typeof console !== 'undefined') {
    console.log(`[REDUX ACTION] ${action.type} (${durationMs}ms at ${timestamp})`, {
      payload: action.payload,
      session: token ? 'JWT Active' : 'Guest'
    });
  }

  return recordActionLog({
    category: 'REDUX',
    name: action.type,
    timestamp,
    durationMs,
    payload: action.payload,
    token
  });
}

/**
 * Logs Outgoing REST API Requests visibly in console using default font
 */
export function logApiRequest(config) {
  const timestamp = new Date().toLocaleTimeString();
  const method = (config.method || 'GET').toUpperCase();
  const url = config.url || '';
  const authHeader = config.headers?.Authorization || config.headers?.authorization;
  const hasToken = !!authHeader;
  const rawToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
  const decoded = rawToken ? decodeJwt(rawToken) : null;

  if (typeof console !== 'undefined') {
    console.log(`[REST API REQUEST] ${method} ${url} (${timestamp})`, {
      authorization: authHeader ? `Bearer ${rawToken ? rawToken.slice(0, 30) + '...' : ''}` : 'Public (None)',
      claims: decoded?.payload || null,
      params: config.params || null,
      body: config.data ? (typeof config.data === 'string' ? JSON.parse(config.data || '{}') : config.data) : null
    });
  }

  return recordActionLog({
    category: 'API_REQUEST',
    name: `${method} ${url}`,
    timestamp,
    hasToken,
    token: rawToken,
    url,
    method
  });
}

/**
 * Logs Incoming REST API Responses visibly in console using default font
 */
export function logApiResponse(response) {
  const timestamp = new Date().toLocaleTimeString();
  const status = response.status;
  const url = response.config?.url || '';
  const method = (response.config?.method || 'GET').toUpperCase();

  if (typeof console !== 'undefined') {
    console.log(`[REST API RESPONSE] ${status} ${method} ${url} (${timestamp})`, response.data);
  }

  return recordActionLog({
    category: 'API_RESPONSE',
    name: `${status} ${method} ${url}`,
    timestamp,
    status,
    url
  });
}

/**
 * Setup Global DOM Action Logger
 * Listens for user clicks, button taps, inputs, and form submits across the webpage
 * and logs every visible interaction directly to the browser console using default font.
 */
export function setupGlobalDomActionLogger() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  if (window.__TITANIC_DOM_LOGGER_INITIALIZED__) return;
  window.__TITANIC_DOM_LOGGER_INITIALIZED__ = true;

  // Click listener for buttons, links, and interactive elements
  document.addEventListener('click', (e) => {
    const target = e.target.closest('button, a, input[type="submit"], input[type="button"], [role="button"]');
    if (!target) return;

    const label = (
      target.innerText ||
      target.getAttribute('aria-label') ||
      target.title ||
      target.value ||
      target.name ||
      target.className ||
      'Interactive Element'
    ).trim().replace(/\s+/g, ' ');

    const page = window.location.pathname;
    logWebpageAction('CLICK', `User clicked "${label.slice(0, 50)}" on page ${page}`, {
      tag: target.tagName,
      page
    });
  }, true);

  // Form submit listener
  document.addEventListener('submit', (e) => {
    const form = e.target;
    const formName = form.name || form.id || form.getAttribute('aria-label') || 'Form';
    logWebpageAction('FORM_SUBMIT', `Submitted ${formName} on ${window.location.pathname}`);
  }, true);
}

/**
 * Prints the master welcome console banner on startup using default font
 */
export function printConsoleWelcomeBanner() {
  if (typeof window === 'undefined' || typeof console === 'undefined') return;

  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  const user = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || 'null');
  const decoded = token ? decodeJwt(token) : null;
  const savedLogins = JSON.parse(localStorage.getItem(USER_LOGINS_KEY) || '[]');

  console.log('========================================================================');
  console.log('🚢 TITANIC TOURISM - ACTION & JWT CONSOLE MONITOR ACTIVE');
  console.log('------------------------------------------------------------------------');
  console.log('All webpage actions, clicks, booking mutations, REST API calls, and JWT');
  console.log('session events are logged visibly below in real-time with default font.');
  console.log('');
  console.log('Current Session Status:', token ? '🟢 AUTHENTICATED' : '⚪ GUEST SESSION');
  if (token) {
    console.log('Active Traveler Profile:', user);
    console.log('Active JWT Bearer Token:\n' + token);
    console.log('Decoded JWT Header:', decoded?.header);
    console.log('Decoded JWT Claims (Payload):', decoded?.payload);
    console.log('Token Expiration:', decoded?.expiresAt || 'Active Session');
  } else {
    console.log('No active JWT in localStorage. Browse as Guest or Sign in to authenticate.');
  }
  console.log(`Stored User Logins in localStorage["${USER_LOGINS_KEY}"]: ${savedLogins.length} record(s)`);
  console.log('------------------------------------------------------------------------');
  console.log('DevTools Console Helpers:');
  console.log('  * window.logCurrentJwt()     - Print current JWT token & claims');
  console.log('  * window.logCurrentSession() - Print active session details & profile');
  console.log('  * window.logSavedLogins()    - Print all user logins stored in localStorage');
  console.log('  * window.logAllActions()     - Print table of all captured actions');
  console.log('========================================================================');
}

// Global browser window setup
if (typeof window !== 'undefined') {
  window.logCurrentJwt = () => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) {
      console.log('[JWT] No token currently saved in localStorage (Guest session).');
      return null;
    }
    const decoded = decodeJwt(token);
    console.log('========== [ACTIVE JWT TOKEN & CLAIMS] ==========');
    console.log('Raw Token:\n' + token);
    console.log('Decoded Header:', decoded.header);
    console.log('Decoded Claims (Payload):', decoded.payload);
    console.log('Issued At:', decoded.issuedAt);
    console.log('Expires At:', decoded.expiresAt);
    console.log('=================================================');
    return decoded;
  };

  window.logCurrentSession = () => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    const user = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || 'null');
    const decoded = token ? decodeJwt(token) : null;
    console.log('========== [ACTIVE TRAVELER SESSION] ==========');
    console.log('Status:', token ? 'Authenticated' : 'Guest');
    console.log('Traveler User:', user);
    console.log('JWT Token:', token || 'None');
    console.log('Claims:', decoded?.payload || null);
    console.log('===============================================');
    return { token, user, decoded };
  };

  window.logSavedLogins = () => {
    const logins = JSON.parse(localStorage.getItem(USER_LOGINS_KEY) || '[]');
    console.log(`========== [STORED USER LOGINS IN LOCALSTORAGE (${logins.length})] ==========`);
    console.table(logins.map((l) => ({
      Name: l.name,
      Email: l.email,
      Tier: l.membershipTier,
      SavedAt: l.formattedTime || l.savedAt
    })));
    return logins;
  };

  window.logAllActions = () => {
    console.table(globalActionLogs.map((l) => ({
      Time: l.timestamp,
      Category: l.category,
      Name: l.name,
      Duration: l.durationMs || '-'
    })));
    return globalActionLogs;
  };

  const initialToken = localStorage.getItem(TOKEN_STORAGE_KEY);
  window.__TITANIC_ACTIONS__ = globalActionLogs;
  window.__TITANIC_JWT__ = initialToken ? decodeJwt(initialToken) : null;
}


