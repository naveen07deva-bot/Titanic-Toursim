import { PACKAGES_DATA } from '../data/packagesData.js';

// In-memory fallback and persistent database initialized from localStorage
const memoryStore = new Map();

const getDb = (key, fallback) => {
  try {
    if (typeof localStorage !== 'undefined') {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : fallback;
    }
    return memoryStore.has(key) ? memoryStore.get(key) : fallback;
  } catch {
    return fallback;
  }
};

const setDb = (key, value) => {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
    memoryStore.set(key, value);
  } catch (e) {
    console.error('Failed to write to mock database', e);
  }
};

const DB_PACKAGES_KEY = 'titanic_db_packages';
const DB_BOOKINGS_KEY = 'titanic_db_bookings';
const DB_USERS_KEY = 'titanic_db_users';

export const seedUsers = [
  {
    id: 'USR-1912',
    name: 'Lord Arthur Peake-Sterling',
    title: 'Lord',
    firstName: 'Arthur',
    lastName: 'Peake-Sterling',
    email: 'lord.sterling@titanic.com',
    password: 'RoyalVoyager1912!',
    phone: '+44 20 7946 0912',
    passportNumber: 'GBR891024B',
    membershipTier: 'First Class Royal Voyager',
    emergencyContact: 'Lady Eleanor Sterling (+44 7911 654321)',
    specialRequests: 'Upper Promenade Verandah table for evening dinners; vintage champagne upon arrival in stateroom.',
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString()
  },
  {
    id: 'USR-1913',
    name: 'Lady Eleanor Sterling',
    title: 'Lady',
    firstName: 'Eleanor',
    lastName: 'Sterling',
    email: 'lady.eleanor@titanic.com',
    password: 'RoyalVoyager1912!',
    phone: '+44 20 7946 0913',
    passportNumber: 'GBR891025C',
    membershipTier: 'Imperial Suite Voyager',
    emergencyContact: 'Lord Arthur Sterling (+44 7911 123456)',
    specialRequests: 'Afternoon high tea service in suite daily.',
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString()
  }
];

const seedBookings = [
  {
    id: 'BK-1912-8491',
    bookingId: 'TITANIC-191201',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    package: PACKAGES_DATA[0],
    travelDates: { departure: '2026-06-15', returnDate: '2026-06-23' },
    travelers: { adults: 2, children: 0 },
    totalTravelersCount: 2,
    tripDurationDays: 8,
    pricing: {
      baseRate: 3450,
      packageCost: 6900,
      discount: 690,
      taxes: 310,
      finalTotal: 6520
    },
    travelerDetails: {
      title: 'Lord',
      firstName: 'Arthur',
      lastName: 'Peake-Sterling',
      email: 'lord.sterling@titanictourism.com',
      phone: '+44 20 7946 0912',
      passportNumber: 'GBR891024B'
    },
    payment: {
      method: 'Titanium Royal Black Card',
      status: 'Confirmed & Paid',
      transactionRef: 'TXN-90214819'
    }
  }
];

// Initialize storage
if (typeof localStorage !== 'undefined') {
  if (!localStorage.getItem(DB_PACKAGES_KEY)) {
    setDb(DB_PACKAGES_KEY, PACKAGES_DATA);
  }
  if (!localStorage.getItem(DB_BOOKINGS_KEY)) {
    setDb(DB_BOOKINGS_KEY, seedBookings);
  }
  if (!localStorage.getItem(DB_USERS_KEY)) {
    setDb(DB_USERS_KEY, seedUsers);
  }
} else {
  setDb(DB_PACKAGES_KEY, PACKAGES_DATA);
  setDb(DB_BOOKINGS_KEY, seedBookings);
  setDb(DB_USERS_KEY, seedUsers);
}

/**
 * Custom Axios Adapter: Simulates full REST API server
 * Handles:
 * GET /api/v1/packages (with search, category, budget, duration, rating query params)
 * GET /api/v1/packages/:id
 * GET /api/v1/packages/:id/availability
 * POST /api/v1/packages
 * POST /api/v1/auth/login
 * GET /api/v1/bookings (Protected by Bearer Token)
 * POST /api/v1/bookings (Protected by Bearer Token)
 * PUT /api/v1/bookings/:id (Protected by Bearer Token)
 * DELETE /api/v1/bookings/:id (Protected by Bearer Token)
 */
export const mockRestApiAdapter = async (config) => {
  // Simulate realistic network latency (150ms - 300ms)
  await new Promise((res) => setTimeout(res, 200));

  const method = (config.method || 'get').toLowerCase();
  const url = config.url || '';
  const authHeader = config.headers?.Authorization || config.headers?.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

  // Helper to verify authorization token (Experiment 4c, 4d, 4f)
  const verifyToken = () => {
    if (!token || token.length < 10) {
      const err = new Error('Request failed with status code 401');
      err.response = {
        status: 401,
        statusText: 'Unauthorized',
        data: { message: 'Authentication token missing or invalid. Please sign in.' },
        config
      };
      throw err;
    }

    // Explicit check for simulated invalid or expired tokens (Experiment 4f)
    if (token === 'invalid_token' || token.includes('expired')) {
      const err = new Error('Request failed with status code 401');
      err.response = {
        status: 401,
        statusText: 'Unauthorized',
        data: { message: 'Authentication token has expired or is invalid. Please sign in again.' },
        config
      };
      throw err;
    }

    try {
      const parts = token.split('.');
      if (parts.length >= 2) {
        const base64Str = parts[1];
        const jsonStr = typeof atob !== 'undefined'
          ? atob(base64Str)
          : Buffer.from(base64Str, 'base64').toString('utf8');
        const payload = JSON.parse(jsonStr);
        if (payload.exp && Date.now() > payload.exp) {
          const err = new Error('Request failed with status code 401');
          err.response = {
            status: 401,
            statusText: 'Unauthorized',
            data: { message: 'Authentication token has expired. Please sign in again.' },
            config
          };
          throw err;
        }
      }
    } catch (e) {
      if (e.response?.status === 401) throw e;
    }
  };

  // 1a. GET /auth/users - Retrieve registered users for switching / auto-fill
  if (method === 'get' && url.includes('/auth/users')) {
    const users = getDb(DB_USERS_KEY, seedUsers);
    const safeUsers = users.map(({ password: _, ...rest }) => rest);
    return {
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      config,
      data: {
        success: true,
        users: safeUsers
      }
    };
  }

  // 1b. POST /auth/register - Register brand new traveler & store login information
  if (method === 'post' && url.includes('/auth/register')) {
    const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    const { email, password, name, phone, title, membershipTier, passportNumber, emergencyContact, specialRequests } = body || {};

    if (!email || !password) {
      const err = new Error('Email and password are required');
      err.response = {
        status: 400,
        statusText: 'Bad Request',
        data: { message: 'Email and password are required for registration' },
        config
      };
      throw err;
    }

    const cleanEmail = email.trim().toLowerCase();
    const users = getDb(DB_USERS_KEY, seedUsers);
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      const err = new Error('User already exists');
      err.response = {
        status: 409,
        statusText: 'Conflict',
        data: { message: 'An account with this email address is already registered. Please sign in.' },
        config
      };
      throw err;
    }

    const nameParts = (name || '').trim().split(' ');
    const firstName = nameParts[0] || 'Traveler';
    const lastName = nameParts.slice(1).join(' ') || 'Member';

    const newUser = {
      id: 'USR-' + Math.floor(1000 + Math.random() * 9000),
      name: (name || `${title || 'Lord'} ${firstName} ${lastName}`).trim(),
      title: title || 'Lord',
      firstName,
      lastName,
      email: cleanEmail,
      password,
      phone: phone || '+44 20 7946 0912',
      passportNumber: passportNumber || ('GBR' + Math.floor(100000 + Math.random() * 900000) + 'X'),
      membershipTier: membershipTier || 'First Class Royal Voyager',
      emergencyContact: emergencyContact || '',
      specialRequests: specialRequests || '',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    setDb(DB_USERS_KEY, users);

    // Generate JWT simulation token
    const tokenPayload = btoa(JSON.stringify({ email: cleanEmail, iat: Date.now() }));
    const jwtToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${tokenPayload}.titanic_secret_sig`;

    const { password: _, ...safeUser } = newUser;

    return {
      status: 201,
      statusText: 'Created',
      headers: { 'content-type': 'application/json' },
      config,
      data: {
        success: true,
        message: 'Traveler registration successful. Session active.',
        token: jwtToken,
        user: safeUser
      }
    };
  }

  // 1c. POST /auth/login - Authenticate or automatically store new user & establish session
  if (method === 'post' && url.includes('/auth/login')) {
    const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    const { email, password } = body || {};

    if (!email || !password) {
      const err = new Error('Request failed with status code 400');
      err.response = {
        status: 400,
        statusText: 'Bad Request',
        data: { message: 'Email and password are required' },
        config
      };
      throw err;
    }

    const cleanEmail = email.trim().toLowerCase();
    const users = getDb(DB_USERS_KEY, seedUsers);
    let matchedUser = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (matchedUser) {
      // If user exists, check credentials
      if (matchedUser.password && matchedUser.password !== password) {
        const err = new Error('Request failed with status code 401');
        err.response = {
          status: 401,
          statusText: 'Unauthorized',
          data: { message: 'Invalid password. Please check your credentials.' },
          config
        };
        throw err;
      }
    } else {
      // Store the login information of new user and use it!
      const namePart = cleanEmail.split('@')[0];
      const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      matchedUser = {
        id: 'USR-' + Math.floor(1000 + Math.random() * 9000),
        name: formattedName,
        title: 'Lord',
        firstName: formattedName,
        lastName: 'Voyager',
        email: cleanEmail,
        password,
        phone: '+44 20 7946 0912',
        passportNumber: 'GBR' + Math.floor(100000 + Math.random() * 900000) + 'X',
        membershipTier: 'First Class Royal Voyager',
        emergencyContact: '',
        specialRequests: '',
        createdAt: new Date().toISOString()
      };
      users.push(matchedUser);
      setDb(DB_USERS_KEY, users);
    }

    // Generate JWT simulation token
    const tokenPayload = btoa(JSON.stringify({ email: cleanEmail, iat: Date.now() }));
    const jwtToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${tokenPayload}.titanic_secret_sig`;

    const { password: _, ...safeUser } = matchedUser;

    return {
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      config,
      data: {
        success: true,
        message: 'Authentication successful',
        token: jwtToken,
        user: safeUser
      }
    };
  }

  // 2. GET /packages/:id/availability
  if (method === 'get' && url.match(/\/packages\/([^/]+)\/availability/)) {
    const match = url.match(/\/packages\/([^/]+)\/availability/);
    const pkgId = match[1];
    const packages = getDb(DB_PACKAGES_KEY, PACKAGES_DATA);
    const pkg = packages.find((p) => String(p.id) === String(pkgId));

    if (!pkg) {
      const err = new Error('Package not found');
      err.response = { status: 404, statusText: 'Not Found', data: { message: 'Voyage package not found' }, config };
      throw err;
    }

    return {
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      config,
      data: {
        packageId: pkg.id,
        packageName: pkg.name,
        availableCabins: Math.floor(3 + Math.random() * 8),
        status: 'Guaranteed Departure',
        nextSailing: '2026-06-15',
        stateroomTypes: ['Imperial Suite', 'Promenade Verandah', 'Oceanview Deluxe'],
        checkedAt: new Date().toISOString()
      }
    };
  }

  // 3. GET /packages/:id (Dynamic package details)
  if (method === 'get' && url.match(/\/packages\/([^/?]+)(\?|$)/)) {
    const match = url.match(/\/packages\/([^/?]+)(\?|$)/);
    const pkgId = match[1];

    if (pkgId !== 'packages') {
      const packages = getDb(DB_PACKAGES_KEY, PACKAGES_DATA);
      const pkg = packages.find((p) => String(p.id) === String(pkgId));

      if (!pkg) {
        const err = new Error('Package not found');
        err.response = { status: 404, statusText: 'Not Found', data: { message: `Package with ID ${pkgId} not found` }, config };
        throw err;
      }

      return {
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
        config,
        data: pkg
      };
    }
  }

  // 4. GET /packages (with filters)
  if (method === 'get' && url.includes('/packages')) {
    let packages = getDb(DB_PACKAGES_KEY, PACKAGES_DATA);
    const params = config.params || {};

    // Destination / Keyword Search
    if (params.search) {
      const q = params.search.toLowerCase();
      packages = packages.filter((p) => p.name.toLowerCase().includes(q) || p.destination.toLowerCase().includes(q));
    }

    // Category filter
    if (params.category && params.category !== 'All Voyages') {
      packages = packages.filter((p) => p.category === params.category);
    }

    // Duration filter
    if (params.duration) {
      if (params.duration === 'short') packages = packages.filter((p) => p.durationDays >= 3 && p.durationDays <= 5);
      else if (params.duration === 'medium') packages = packages.filter((p) => p.durationDays >= 6 && p.durationDays <= 7);
      else if (params.duration === 'long') packages = packages.filter((p) => p.durationDays >= 8);
    }

    // Budget ceiling filter
    if (params.maxBudget) {
      const budget = Number(params.maxBudget);
      packages = packages.filter((p) => p.price <= budget);
    }

    // Rating filter
    if (params.minRating) {
      const rating = Number(params.minRating);
      packages = packages.filter((p) => p.rating >= rating);
    }

    return {
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      config,
      data: packages
    };
  }

  // 5. POST /packages (Create package)
  if (method === 'post' && url.includes('/packages')) {
    verifyToken();
    const newPkg = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    const packages = getDb(DB_PACKAGES_KEY, PACKAGES_DATA);
    const created = {
      ...newPkg,
      id: String(newPkg.id || Date.now()),
      rating: newPkg.rating || 4.9,
      reviewsCount: 1
    };
    packages.push(created);
    setDb(DB_PACKAGES_KEY, packages);

    return {
      status: 201,
      statusText: 'Created',
      headers: { 'content-type': 'application/json' },
      config,
      data: created
    };
  }

  // 6. GET /bookings (Protected: Booking History)
  if (method === 'get' && url.includes('/bookings')) {
    verifyToken();
    const bookings = getDb(DB_BOOKINGS_KEY, []);

    return {
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      config,
      data: bookings
    };
  }

  // 7. POST /bookings (Protected: Create Booking)
  if (method === 'post' && url.includes('/bookings')) {
    verifyToken();
    const bookingPayload = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    const bookings = getDb(DB_BOOKINGS_KEY, []);

    const newBooking = {
      id: 'BK-' + Date.now(),
      bookingId: 'TITANIC-' + Math.floor(100000 + Math.random() * 900000),
      createdAt: new Date().toISOString(),
      ...bookingPayload,
      payment: {
        method: bookingPayload.payment?.method || 'Titanium Royal Black Card',
        status: 'Confirmed & Paid',
        transactionRef: 'TXN-' + Math.floor(10000000 + Math.random() * 90000000)
      }
    };

    const updated = [newBooking, ...bookings];
    setDb(DB_BOOKINGS_KEY, updated);

    return {
      status: 201,
      statusText: 'Created',
      headers: { 'content-type': 'application/json' },
      config,
      data: newBooking
    };
  }

  // 8. PUT or PATCH /bookings/:id (Protected: Update Booking Details)
  if ((method === 'put' || method === 'patch') && url.match(/\/bookings\/([^/?]+)/)) {
    verifyToken();
    const match = url.match(/\/bookings\/([^/?]+)/);
    const bookingId = match[1];
    const updateData = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    const bookings = getDb(DB_BOOKINGS_KEY, []);

    const index = bookings.findIndex((b) => b.id === bookingId || b.bookingId === bookingId);
    if (index === -1) {
      const err = new Error('Booking not found');
      err.response = { status: 404, statusText: 'Not Found', data: { message: 'Booking reference not found' }, config };
      throw err;
    }

    bookings[index] = {
      ...bookings[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    setDb(DB_BOOKINGS_KEY, bookings);

    return {
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      config,
      data: bookings[index]
    };
  }

  // 9. DELETE /bookings/:id (Protected: Cancel Booking)
  if (method === 'delete' && url.match(/\/bookings\/([^/?]+)/)) {
    verifyToken();
    const match = url.match(/\/bookings\/([^/?]+)/);
    const bookingId = match[1];
    let bookings = getDb(DB_BOOKINGS_KEY, []);

    const target = bookings.find((b) => b.id === bookingId || b.bookingId === bookingId);
    if (!target) {
      const err = new Error('Booking not found');
      err.response = { status: 404, statusText: 'Not Found', data: { message: 'Booking reference not found' }, config };
      throw err;
    }

    bookings = bookings.filter((b) => b.id !== bookingId && b.bookingId !== bookingId);
    setDb(DB_BOOKINGS_KEY, bookings);

    return {
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      config,
      data: {
        success: true,
        message: `Booking ${bookingId} has been successfully cancelled`,
        cancelledBookingId: bookingId
      }
    };
  }

  // Default Fallback
  return {
    status: 200,
    statusText: 'OK',
    headers: { 'content-type': 'application/json' },
    config,
    data: { message: 'Endpoint matched default' }
  };
};
