// 'use client';

// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { useRouter } from 'next/navigation';
// import { useCallback } from 'react';
// import { setAuth, clearAuth } from '@/server/auth.server';
// import { AuthService } from '@/services/auth.service';
// import { formatErrorMessage } from '@/utils/helper';
// import Toast from '@/lib/toastify';
// import { QUERY_KEYS } from '@/utils/queries.keys';
// import useAuth from '@/hooks/useAuth';
// import { DEFAULT_AUTH_STATE } from '@/utils/constant';

// export const useLogin = (options = {}) => {
//   const { setAuth: updateAuthState } = useAuth();
//   const router = useRouter();
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: AuthService.login,
//     onSuccess: async (response, variables) => {
//       const { data } = response;
//       const { user, token } = data;

//       if (!token || !user) {
//         Toast.error('Invalid login response');
//         return;
//       }

//       try {
//         const authState = await setAuth({ token, user });
//         updateAuthState(authState);

//         Toast.success(`Welcome back, ${user?.first_name || 'User'}!`);
//         queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cart.detail() });

//         await options.onSuccess?.(response, variables);

//         const redirectTo = options.redirectTo || '/';
//         router.replace(redirectTo);
//       } catch (error) {
//         Toast.error('Login successful but session setup failed', error);
//       }
//     },
//     onError: (error, variables) => {
//       const message = formatErrorMessage(error);
//       Toast.error(message);
//       options.onError?.(error, variables);
//     },
//     ...options,
//   });
// };

// export const useLogout = (options = {}) => {
//   const router = useRouter();
//   const queryClient = useQueryClient();
//   const { auth, setAuth: updateAuthState } = useAuth();


//   const performCleanup = useCallback(async () => {
//     try {
//       await clearAuth();
//       updateAuthState({ ...auth, ...DEFAULT_AUTH_STATE })
//       queryClient.removeQueries({ queryKey: QUERY_KEYS.auth.me() });
//       queryClient.clear();
//     } catch (error) {
//       queryClient.clear();
//     }
//   }, [queryClient, updateAuthState]);

//   return useMutation({
//     mutationFn: AuthService.logout,
//     onSuccess: async (response, variables) => {
//       await performCleanup();
//       Toast.success('Logged out successfully');
//       await options.onSuccess?.(response, variables);
//       router.replace('/');
//     },
//     onError: async (error, variables) => {
//       await performCleanup();
//       const message = formatErrorMessage(error);
//       Toast.error(message);
//       await options.onError?.(error, variables);
//       router.replace('/');
//     },
//     onSettled: () => {
//       router.replace('/');
//     },
//     ...options,
//   });
// };

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { setAuth, clearAuth, getSessionId } from '@/server/auth.server';
import { AuthService } from '@/services/auth.service';
import { formatErrorMessage } from '@/utils/helper';
import Toast from '@/lib/toastify';
import { QUERY_KEYS } from '@/utils/queries.keys';
import useAuth from '@/hooks/useAuth';
import { DEFAULT_AUTH_STATE } from '@/utils/constant';

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

        Toast.success(`Welcome back, ${user?.first_name || 'User'}!`);
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cart.detail() });

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

export const useLogout = (options = {}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setAuth: updateAuthState } = useAuth();

  const performCleanup = useCallback(async () => {
    try {
      await clearAuth();
      const sessionId = await getSessionId();
      updateAuthState({ ...DEFAULT_AUTH_STATE, sessionId });
      queryClient.removeQueries({ queryKey: QUERY_KEYS.auth.me() });
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