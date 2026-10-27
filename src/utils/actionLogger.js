/**
 * Action & JWT Console Logger for TITANIC TOURISM
 * 
 * Provides rich, color-coded, professional console logging for:
 * 1. JWT Authentication Lifecycle (Login, Token Storage, Header/Payload Decoding, Expiration, Logout)
 * 2. Zustand Store Actions (Select Package, Add to Cart, Update Dates/Travelers, CRUD)
 * 3. Redux Toolkit Dispatches (Actions, Payloads, State Diffs, Middleware Timing)
 * 4. REST API CRUD Operations (Axios Requests, JWT Bearer Headers, Responses, 401 Expirations)
 * 5. Interactive DevTools Console Helpers (window.__TITANIC_JWT__, window.__TITANIC_ACTIONS__)
 */

// Storage keys
export const TOKEN_STORAGE_KEY = 'titanic_auth_token';
export const USER_STORAGE_KEY = 'titanic_auth_user';

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
 * Logs JWT Authentication Events (Login, Logout, Token Attachment, Expiration)
 */
export function logJwtAuth(eventType, data = {}) {
  const token = data.token || (typeof localStorage !== 'undefined' ? localStorage.getItem(TOKEN_STORAGE_KEY) : null);
  const decoded = token ? decodeJwt(token) : null;
  const user = data.user || (typeof localStorage !== 'undefined' ? JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || 'null') : null);
  const timestamp = new Date().toLocaleTimeString();

  if (typeof console !== 'undefined') {
    const isBrowser = typeof window !== 'undefined';
    if (isBrowser) {
      const badgeStyle = 'background: #0d9488; color: #ffffff; padding: 3px 8px; border-radius: 3px; font-weight: bold; font-size: 11px;';
      const eventStyle = 'color: #0d9488; font-weight: bold; font-size: 11px;';
      const timeStyle = 'color: #64748b; font-size: 10px;';

      console.groupCollapsed(`%c[JWT AUTH]%c ${eventType} %c(${timestamp})`, badgeStyle, eventStyle, timeStyle);
      console.log('%cEvent Type:%c ' + eventType, 'font-weight: bold; color: #0d9488;', '');
      console.log('%cTimestamp:%c ' + timestamp, 'color: #64748b;', '');

      if (token) {
        console.log('%cRaw JWT Token (Bearer):%c\n' + token, 'color: #d97706; font-weight: bold;', 'color: #2563eb; word-break: break-all;');
        console.log('%cDecoded JWT Header:%c', 'color: #d97706; font-weight: bold;', '', decoded?.header);
        console.log('%cDecoded JWT Payload (Claims):%c', 'color: #d97706; font-weight: bold;', '', decoded?.payload);
        if (decoded?.expiresAt) {
          console.log('%cToken Expiration:%c ' + decoded.expiresAt + (decoded.isExpired ? ' (EXPIRED)' : ' (VALID)'), 'color: #d97706;', '');
        }
      } else {
        console.log('%cToken Status:%c No active token (Purged / Unauthenticated)', 'color: #ef4444; font-weight: bold;', '');
      }

      if (user) {
        console.log('%cAuthenticated Traveler Identity:%c', 'color: #16a34a; font-weight: bold;', '', user);
      }

      if (data.context) {
        console.log('%cContext / Details:%c', 'color: #64748b;', '', data.context);
      }

      console.log('%cStorage Location:%c localStorage["' + TOKEN_STORAGE_KEY + '"]', 'color: #64748b; font-style: italic;', '');
      console.groupEnd();
    } else {
      console.log(`[JWT AUTH] ${eventType} at ${timestamp}`, {
        tokenSnippet: token ? `${token.substring(0, 20)}...` : null,
        user: user?.email || null
      });
    }
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
 * Logs Zustand Store Actions (Select Package, Add to Cart, Dates, Travelers, Bookings)
 */
export function logStoreAction(actionName, details = {}) {
  const timestamp = new Date().toLocaleTimeString();
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem(TOKEN_STORAGE_KEY) : null;
  const decoded = token ? decodeJwt(token) : null;
  const duration = details.durationMs || '0.00';

  if (typeof console !== 'undefined') {
    const isBrowser = typeof window !== 'undefined';
    if (isBrowser) {
      const badgeStyle = 'background: #1e40af; color: #ffffff; padding: 3px 8px; border-radius: 3px; font-weight: bold; font-size: 11px;';
      const actionStyle = 'color: #1e40af; font-weight: bold; font-size: 11px;';
      const timeStyle = 'color: #64748b; font-size: 10px;';

      console.groupCollapsed(`%c[STORE ACTION]%c ${actionName} %c(${duration}ms at ${timestamp})`, badgeStyle, actionStyle, timeStyle);
      console.log('%cAction Name:%c ' + actionName, 'font-weight: bold; color: #1e40af;', '');

      if (details.payload !== undefined) {
        console.log('%cAction Payload / Input:%c', 'font-weight: bold;', '', details.payload);
      }

      if (details.prevStateSummary || details.nextStateSummary) {
        console.log('%cState Transition:%c', 'font-weight: bold; color: #4b5563;', '', {
          previousState: details.prevStateSummary,
          nextState: details.nextStateSummary
        });
      }

      // Link to active JWT status
      const authStatus = token ? `Authenticated (Token Active)` : 'Guest (No Token)';
      console.log('%cAssociated JWT Status:%c ' + authStatus, 'font-weight: bold; color: #0d9488;', '');
      if (token) {
        console.log('%cJWT Bearer Token:%c ' + token, 'color: #d97706;', 'color: #2563eb;');
        console.log('%cJWT Claims (Payload):%c', 'color: #d97706;', '', decoded?.payload);
      }

      console.groupEnd();
    } else {
      console.log(`[STORE ACTION] ${actionName} (${duration}ms)`);
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
 * Logs Redux Toolkit Dispatched Actions (Experiment 2)
 */
export function logReduxAction(action, state, durationMs = '0.00') {
  const timestamp = new Date().toLocaleTimeString();
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem(TOKEN_STORAGE_KEY) : null;
  const decoded = token ? decodeJwt(token) : null;

  if (typeof console !== 'undefined') {
    const isBrowser = typeof window !== 'undefined';
    if (isBrowser) {
      const badgeStyle = 'background: #7c3aed; color: #ffffff; padding: 3px 8px; border-radius: 3px; font-weight: bold; font-size: 11px;';
      const actionStyle = 'color: #7c3aed; font-weight: bold; font-size: 11px;';
      const timeStyle = 'color: #64748b; font-size: 10px;';

      console.groupCollapsed(`%c[REDUX ACTION]%c ${action.type} %c(${durationMs}ms at ${timestamp})`, badgeStyle, actionStyle, timeStyle);
      console.log('%cDispatched Redux Action:%c', 'font-weight: bold; color: #7c3aed;', '', action);
      console.log('%cAction Payload:%c', 'font-weight: bold;', '', action.payload);
      console.log('%cBooking Reducer State Snapshot:%c', 'font-weight: bold; color: #4b5563;', '', state);
      console.log('%cActive JWT Session:%c ' + (token ? `Bearer ${token}` : 'No Active Token'), 'font-weight: bold; color: #0d9488;', '');
      if (token) {
        console.log('%cDecoded JWT Claims:%c', 'color: #d97706;', '', decoded?.payload);
      }
      console.groupEnd();
    }
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
 * Logs Outgoing REST API Requests (Experiment 1, 3, 4)
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
    const isBrowser = typeof window !== 'undefined';
    if (isBrowser) {
      const badgeStyle = 'background: #0284c7; color: #ffffff; padding: 3px 8px; border-radius: 3px; font-weight: bold; font-size: 11px;';
      const reqStyle = 'color: #0284c7; font-weight: bold; font-size: 11px;';
      const timeStyle = 'color: #64748b; font-size: 10px;';

      console.groupCollapsed(`%c[REST API REQUEST]%c ${method} ${url} %c(${timestamp})`, badgeStyle, reqStyle, timeStyle);
      console.log('%cMethod & URL:%c ' + method + ' ' + url, 'font-weight: bold;', '');
      console.log('%cAuthorization Header (JWT):%c ' + (authHeader || 'None (Public Request)'), 'font-weight: bold; color: #0d9488;', '');

      if (rawToken) {
        console.log('%cAttached JWT Token:%c ' + rawToken, 'color: #d97706;', 'color: #2563eb;');
        console.log('%cDecoded JWT Identity:%c', 'color: #d97706;', '', decoded?.payload);
      }

      if (config.params && Object.keys(config.params).length > 0) {
        console.log('%cQuery Parameters (Filters):%c', 'font-weight: bold;', '', config.params);
      }

      if (config.data) {
        const bodyData = typeof config.data === 'string' ? JSON.parse(config.data || '{}') : config.data;
        console.log('%cRequest Body (Payload):%c', 'font-weight: bold;', '', bodyData);
      }
      console.groupEnd();
    }
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
 * Logs Incoming REST API Responses
 */
export function logApiResponse(response) {
  const timestamp = new Date().toLocaleTimeString();
  const status = response.status;
  const url = response.config?.url || '';
  const method = (response.config?.method || 'GET').toUpperCase();

  if (typeof console !== 'undefined') {
    const isBrowser = typeof window !== 'undefined';
    if (isBrowser) {
      const badgeStyle = 'background: #16a34a; color: #ffffff; padding: 3px 8px; border-radius: 3px; font-weight: bold; font-size: 11px;';
      const resStyle = 'color: #16a34a; font-weight: bold; font-size: 11px;';
      const timeStyle = 'color: #64748b; font-size: 10px;';

      console.groupCollapsed(`%c[REST API RESPONSE]%c ${status} ${method} ${url} %c(${timestamp})`, badgeStyle, resStyle, timeStyle);
      console.log('%cHTTP Status:%c ' + status + ' (' + response.statusText + ')', 'font-weight: bold; color: #16a34a;', '');
      console.log('%cResponse Data Body:%c', 'font-weight: bold;', '', response.data);
      console.groupEnd();
    }
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
 * Prints the master welcome console banner on startup
 */
export function printConsoleWelcomeBanner() {
  if (typeof window === 'undefined' || typeof console === 'undefined') return;

  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  const user = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || 'null');
  const decoded = token ? decodeJwt(token) : null;

  console.log(
    '%c 🚢 TITANIC TOURISM %c REAL-TIME ACTION & JWT CONSOLE MONITOR %c ACTIVE ',
    'background: #162433; color: #dfc28b; padding: 6px 12px; font-family: serif; font-size: 14px; font-weight: bold; border-radius: 4px 0 0 4px; border: 1px solid #c5a059;',
    'background: #0f1a24; color: #ffffff; padding: 6px 12px; font-size: 12px; font-weight: bold; border-top: 1px solid #c5a059; border-bottom: 1px solid #c5a059;',
    'background: #0d9488; color: #ffffff; padding: 6px 12px; font-size: 12px; font-weight: bold; border-radius: 0 4px 4px 0; border: 1px solid #c5a059; border-left: none;'
  );

  console.log(
    '%c[CONSOLE MONITOR] Every user action, store mutation, Redux dispatch, and JWT lifecycle event is logged below in real-time:\n' +
    '  • 🔑 [JWT AUTH]      Login, token storage, claims decoding, expiration, logout\n' +
    '  • ⚡ [STORE ACTION]  Zustand booking folio, package selection, dates, travelers, CRUD\n' +
    '  • 📦 [REDUX ACTION]  Redux Toolkit dispatches, payload inspection, state snapshots\n' +
    '  • 🌐 [REST API]      Axios HTTP requests (GET, POST, PUT, DELETE) with Bearer token headers\n\n' +
    '💡 DevTools Console Commands Available:\n' +
    '  ▶ window.__TITANIC_JWT__        — View active JWT Bearer token & decoded claims\n' +
    '  ▶ window.__TITANIC_ACTIONS__    — View full chronological array of action logs\n' +
    '  ▶ window.logCurrentJwt()        — Pretty-print current JWT in console\n' +
    '  ▶ window.logAllActions()        — Display console.table of recent actions',
    'color: #64748b; font-size: 11px; line-height: 1.6;'
  );

  if (token) {
    console.groupCollapsed('%c[INITIAL STATE] Active JWT Bearer Session Detected', 'color: #0d9488; font-weight: bold;');
    console.log('JWT Token:', token);
    console.log('Decoded Payload:', decoded?.payload);
    console.log('User Profile:', user);
    console.groupEnd();
  } else {
    console.log('%c[INITIAL STATE] Guest Session (No JWT in localStorage). Sign in or click "Auto Fill" on login to generate token.', 'color: #d97706; font-style: italic;');
  }
}

// Global browser window setup
if (typeof window !== 'undefined') {
  window.logCurrentJwt = () => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) {
      console.warn('[JWT] No token currently saved in localStorage.');
      return null;
    }
    const decoded = decodeJwt(token);
    console.group('%c[JWT INSPECTION] Current Active Token', 'background: #0d9488; color: white; padding: 3px 8px; font-weight: bold;');
    console.log('Raw Token:\n' + token);
    console.log('Decoded Header:', decoded.header);
    console.log('Decoded Claims (Payload):', decoded.payload);
    console.log('Issued At:', decoded.issuedAt);
    console.log('Expires At:', decoded.expiresAt);
    console.groupEnd();
    return decoded;
  };

  window.logAllActions = () => {
    console.table(globalActionLogs.map((l) => ({
      Time: l.timestamp,
      Category: l.category,
      Name: l.name,
      Duration: l.durationMs || '-',
      HasJWT: !!l.token
    })));
    return globalActionLogs;
  };

  const initialToken = localStorage.getItem(TOKEN_STORAGE_KEY);
  window.__TITANIC_ACTIONS__ = globalActionLogs;
  window.__TITANIC_JWT__ = initialToken ? decodeJwt(initialToken) : null;
}
