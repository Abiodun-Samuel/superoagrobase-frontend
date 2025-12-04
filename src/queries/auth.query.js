'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { setAuth, clearAuth, getSessionId } from '@/server/auth.server';
import { formatErrorMessage } from '@/utils/helper';
import Toast from '@/lib/toastify';
import { QUERY_KEYS } from '@/utils/queries.keys';
import { DEFAULT_AUTH_STATE } from '@/utils/constant';
import { AuthService } from '@/services/auth.service';
import useAuth from '@/hooks/useAuth';


export const useLogin = (options = {}) => {
  const { setAuth: updateAuthState } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AuthService.login,
    onSuccess: async (response, variables) => {
      const { data } = response;
      const { user, token } = data;

      if (!token || !user) {
        Toast.error('Invalid login response');
        return;
      }

      try {
        const authState = await setAuth({ token, user });
        updateAuthState(authState);

        const redirectTo = options.redirectTo || '/';
        router.replace(redirectTo);

        Toast.success(`Welcome back, ${user?.first_name || 'User'}!`, { duration: 1000 });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cart.detail() });

        await options.onSuccess?.(response, variables);

      } catch (error) {
        Toast.error('Login successful but session setup failed', error);
      }
    },
    onError: (error, variables) => {
      const message = formatErrorMessage(error);
      Toast.error(message);
      options.onError?.(error, variables);
    },
    ...options,
  });
};

export const useLogout = (options = {}) => {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { setAuth: updateAuthState } = useAuth();

  const performCleanup = useCallback(async () => {
    await clearAuth();
    const sessionId = await getSessionId();
    updateAuthState((prevState) => ({ ...DEFAULT_AUTH_STATE, sessionId: sessionId || prevState.sessionId }));
    queryClient.removeQueries({
      predicate: (query) => {
        const queryKey = query.queryKey;
        const firstKey = queryKey[0];
        const keysToKeep = ['cart']; // To keep
        return !keysToKeep.includes(firstKey);
      }
    });
  }, [queryClient, updateAuthState]);

  return useMutation({
    mutationFn: AuthService.logout,
    onSuccess: async (response, variables) => {

      const protectedRoutes = ['/dashboard', '/checkout'];
      const isOnProtectedRoute = protectedRoutes.some(route => pathname?.startsWith(route));
      if (isOnProtectedRoute) router.replace('/');

      performCleanup();

      Toast.success('Logged out successfully', { duration: 1000 });
      await options.onSuccess?.(response, variables);
    },

    onError: async (error, variables) => {
      await performCleanup();
      const message = formatErrorMessage(error);
      Toast.error(message);
      await options.onError?.(error, variables);
    },
    ...options,
  });
};
