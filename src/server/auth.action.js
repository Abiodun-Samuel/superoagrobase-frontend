'use server';

import { cookies } from 'next/headers';
import { cache } from 'react';
import { sessionConfig } from '@/utils/session.config';
import { AUTH_COOKIE, RoleEnum } from '@/utils/constant';
import { getPrimaryRole } from '@/utils/helper';

export async function setAuth(data) {
  try {
    const { token, user } = data;

    if (!token || !user) {
      throw new Error('Invalid auth data: token and user are required');
    }

    const { roles, ...userdetails } = user;

    const authPayload = {
      token,
      user: userdetails,
      roles: roles || [],
      role: RoleEnum[getPrimaryRole(roles)],
      isAuthenticated: true
    };

    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE, JSON.stringify(authPayload), sessionConfig);

    return {
      token,
      user: userdetails,
      roles: roles || [],
      role: RoleEnum[getPrimaryRole(roles)],
      isAuthenticated: true
    };
  } catch (error) {
    return error;
  }
}

export const getAuth = cache(async () => {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get(AUTH_COOKIE);

    if (!authCookie) {
      return {
        token: null,
        user: null,
        isAuthenticated: false,
        role: null,
        roles: []
      };
    }

    const auth = JSON.parse(authCookie.value);

    if (!auth.token || !auth.user) {
      await clearAuth();
      return {
        token: null,
        user: null,
        isAuthenticated: false,
        role: null,
        roles: []
      };
    }

    return {
      token: auth.token,
      user: auth.user,
      isAuthenticated: true,
      role: auth.role,
      roles: auth.roles
    };
  } catch (error) {
    return {
      token: null,
      user: null,
      isAuthenticated: false,
      role: null,
      roles: []
    };
  }
});

export async function clearAuth() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_COOKIE);
  } catch (error) {
    throw error;
  }
}