// 'use server';

// import { cookies } from 'next/headers';
// import { cache } from 'react';
// import { AUTH_COOKIE, ROLE_ENUM, SESSION_COOKIE, COOKIE_MAX_AGE, COOKIE_CONFIG, DEFAULT_AUTH_STATE } from '@/utils/constant';
// import { generateUUID, getPrimaryRole } from '@/utils/helper';


// export async function setAuth(data) {
//   try {
//     const { token, user } = data;

//     if (!token || !user) {
//       return null;
//     }

//     const { roles = [], ...userDetails } = user;
//     const sessionId = await ensureSessionId();

//     const authPayload = {
//       token,
//       user: userDetails,
//       roles,
//       role: ROLE_ENUM[getPrimaryRole(roles)],
//       isAuthenticated: true,
//       sessionId
//     };

//     const cookieStore = await cookies();
//     const maxAge = COOKIE_MAX_AGE?.TOKEN
//     cookieStore.set(AUTH_COOKIE, JSON.stringify(authPayload), { ...COOKIE_CONFIG, maxAge });

//     return authPayload;
//   } catch (error) {
//     return null;
//   }
// }

// export const getAuth = cache(async () => {
//   try {
//     const cookieStore = await cookies();
//     const authCookie = cookieStore.get(AUTH_COOKIE);
//     const sessionId = await ensureSessionId();

//     if (!authCookie) {
//       return { ...DEFAULT_AUTH_STATE, sessionId };
//     }

//     const auth = JSON.parse(authCookie.value);

//     if (!auth.token || !auth.user) {
//       await clearAuth();
//       return { ...DEFAULT_AUTH_STATE, sessionId };
//     }

//     return {
//       token: auth.token,
//       user: auth.user,
//       isAuthenticated: true,
//       role: auth.role,
//       roles: auth.roles || [],
//       sessionId
//     };
//   } catch (error) {
//     const sessionId = await ensureSessionId();
//     return { ...DEFAULT_AUTH_STATE, sessionId };
//   }
// });


// export async function clearAuth() {
//   try {
//     const cookieStore = await cookies();
//     cookieStore.delete(AUTH_COOKIE);
//     return true;
//   } catch (error) {
//     return false;
//   }
// }

// export const getSessionId = cache(async () => {
//   try {
//     const cookieStore = await cookies();
//     const sessionCookie = cookieStore.get(SESSION_COOKIE);

//     if (sessionCookie?.value) {
//       return sessionCookie.value;
//     }

//     const sessionId = generateUUID();
//     const maxAge = COOKIE_MAX_AGE?.SESSION
//     cookieStore.set(SESSION_COOKIE, sessionId, { ...COOKIE_CONFIG, maxAge });

//     return sessionId;
//   } catch (error) {
//     return generateUUID();
//   }
// });

// export async function setSessionId(sessionId) {
//   try {
//     if (!sessionId) {
//       return null;
//     }

//     const cookieStore = await cookies();
//     const maxAge = COOKIE_MAX_AGE?.SESSION

//     cookieStore.set(SESSION_COOKIE, sessionId, { ...COOKIE_CONFIG, maxAge });

//     return sessionId;
//   } catch (error) {
//     return null;
//   }
// }

// async function ensureSessionId() {
//   return await getSessionId();
// }
'use server';

import { cookies } from 'next/headers';
import { cache } from 'react';
import { AUTH_COOKIE, ROLE_ENUM, SESSION_COOKIE, COOKIE_MAX_AGE, COOKIE_CONFIG, DEFAULT_AUTH_STATE } from '@/utils/constant';
import { generateUUID, getPrimaryRole } from '@/utils/helper';

export async function setAuth(data) {
  try {
    const { token, user } = data;

    if (!token || !user) {
      return null;
    }

    const { roles = [], ...userDetails } = user;
    const sessionId = await ensureSessionId();

    const authPayload = {
      token,
      user: userDetails,
      roles,
      role: ROLE_ENUM[getPrimaryRole(roles)],
      isAuthenticated: true,
      sessionId
    };

    const cookieStore = await cookies();
    const maxAge = COOKIE_MAX_AGE?.TOKEN;
    cookieStore.set(AUTH_COOKIE, JSON.stringify(authPayload), { ...COOKIE_CONFIG, maxAge });

    return authPayload;
  } catch (error) {
    return null;
  }
}

export const getAuth = cache(async () => {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get(AUTH_COOKIE);
    const sessionId = await ensureSessionId();

    if (!authCookie) {
      return { ...DEFAULT_AUTH_STATE, sessionId };
    }

    const auth = JSON.parse(authCookie.value);

    if (!auth.token || !auth.user) {
      await clearAuth();
      return { ...DEFAULT_AUTH_STATE, sessionId };
    }

    return {
      token: auth.token,
      user: auth.user,
      isAuthenticated: true,
      role: auth.role,
      roles: auth.roles || [],
      sessionId
    };
  } catch (error) {
    const sessionId = await ensureSessionId();
    return { ...DEFAULT_AUTH_STATE, sessionId };
  }
});

export async function clearAuth() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_COOKIE);
    return true;
  } catch (error) {
    return false;
  }
}

export const getSessionId = cache(async () => {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE);

    if (sessionCookie?.value) {
      return sessionCookie.value;
    }

    const sessionId = generateUUID();
    const maxAge = COOKIE_MAX_AGE?.SESSION;
    cookieStore.set(SESSION_COOKIE, sessionId, { ...COOKIE_CONFIG, maxAge });

    return sessionId;
  } catch (error) {
    return generateUUID();
  }
});

export async function setSessionId(sessionId) {
  try {
    if (!sessionId) {
      return null;
    }

    const cookieStore = await cookies();
    const maxAge = COOKIE_MAX_AGE?.SESSION;

    cookieStore.set(SESSION_COOKIE, sessionId, { ...COOKIE_CONFIG, maxAge });

    return sessionId;
  } catch (error) {
    return null;
  }
}

async function ensureSessionId() {
  return await getSessionId();
}