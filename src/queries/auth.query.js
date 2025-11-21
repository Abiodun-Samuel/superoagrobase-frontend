'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { setAuth, clearAuth, getAuth } from '@/lib/auth';
import { AuthService } from '@/services/auth.service';
import { formatErrorMessage } from '@/utils/helper';
import Toast from '@/lib/toastify';
import { QUERY_KEYS } from '@/utils/queryKeys';
import useAuth from '@/hooks/useAuth';

// ============================================================================
// HOOK: useMe - Fetch and manage authenticated user
// ============================================================================

export const useMe = (options = {}) => {
  const { setAuth: updateAuthState } = useAuth();
  return useQuery({
    queryKey: QUERY_KEYS.AUTH.USEME,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 0,

    queryFn: async () => {
      const { isAuthenticated, token } = await getAuth();

      if (!isAuthenticated || !token) {
        await clearAuth();
        updateAuthState(null)
        throw new Error('Session expired');
      }

      const response = await AuthService.getMe();
      const user = response?.data?.user;

      const authState = await setAuth({ token, user });
      updateAuthState(authState);
      return user
    },
    enabled: options.isAuthenticated,
    ...options,
  });
};

// ============================================================================
// HOOK: useLogin - Handle user authentication
// ============================================================================

export const useLogin = (options = {}) => {
  const router = useRouter();
  const { setAuth: updateAuthState } = useAuth();
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

        Toast.success(`Welcome back, ${user?.first_name || 'User'}!`);
        await options.onSuccess?.(response, variables);

        const redirectTo = options.redirectTo || '/';
        router.replace(redirectTo);
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

// ============================================================================
// HOOK: useLogout - Handle user logout
// ============================================================================

export const useLogout = (options = {}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setAuth: updateAuthState } = useAuth();


  const performCleanup = useCallback(async () => {
    try {
      await clearAuth();
      updateAuthState(null)
      queryClient.removeQueries({ queryKey: QUERY_KEYS.AUTH.USEME });
      queryClient.clear();
    } catch (error) {
      queryClient.clear();
    }
  }, [queryClient, updateAuthState]);

  return useMutation({
    mutationFn: AuthService.logout,
    onSuccess: async (response, variables) => {
      await performCleanup();
      Toast.success('Logged out successfully');
      await options.onSuccess?.(response, variables);
      router.replace('/');
    },
    onError: async (error, variables) => {
      await performCleanup();
      const message = formatErrorMessage(error);
      Toast.error(message);
      await options.onError?.(error, variables);
      router.replace('/');
    },
    onSettled: () => {
      router.replace('/');
    },
    ...options,
  });
};