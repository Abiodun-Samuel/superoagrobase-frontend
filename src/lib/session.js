'use server';

import { sessionConfig } from '@/utils/config';
import { RoleEnum, TOKEN } from '@/utils/constant';
import { getPrimaryRole } from '@/utils/helper';
import { cookies } from 'next/headers';


export async function setSession(data) {
  const { token, user } = data;

  const roles = user?.roles ?? [];
  const primaryRole = getPrimaryRole(roles);

  const sessionPayload = {
    token,
    roles,
    role: primaryRole,
  };

  const store = await cookies();
  store.set(TOKEN, JSON.stringify(sessionPayload), sessionConfig);
}

export async function getSession() {
  const store = await cookies();
  const sessionCookie = store.get(TOKEN);

  if (!sessionCookie) return {};

  try {
    const session = JSON.parse(sessionCookie.value);

    return {
      token: session.token,
      role: session.role,
      roles: session.roles,
      roleName: RoleEnum[session.role],
    };

  } catch (error) {
    return {};
  }
}

export async function clearSession() {
  const store = await cookies();
  store.delete(TOKEN, sessionConfig);
}