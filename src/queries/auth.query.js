'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
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

        // Check if email is verified
        if (!user.email_verified_at && !options.skipEmailVerification) {
          Toast.info('Please verify your email address to continue', { duration: 3000 });
          router.replace(`/auth/verify-email?email=${encodeURIComponent(user.email)}`);
          await options.onSuccess?.(response, variables);
          return;
        }

        const redirect = options.redirect || '/';
        router.replace(redirect);

        Toast.success(`Welcome back, ${user?.first_name || 'User'}!`, { duration: 1000 });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cart.details() });

        await options.onSuccess?.(response, variables);

      } catch (error) {
        Toast.error('Login successful but session setup failed');
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

export const useRegister = (options = {}) => {
  const { setAuth: updateAuthState } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AuthService.register,
    onSuccess: async (response, variables) => {
      const { data } = response;
      const { user, token } = data;

      if (!token || !user) {
        Toast.error('Invalid registration response');
        return;
      }

      try {
        const authState = await setAuth({ token, user });
        updateAuthState(authState);

        // Check if email is verified
        if (!user.email_verified_at && !options.skipEmailVerification) {
          Toast.success(response?.message || 'Registration successful!', { duration: 1000 });
          Toast.info('Please verify your email address to continue', { duration: 3000 });
          router.replace(`/auth/verify-email?email=${encodeURIComponent(user.email)}`);
          await options.onSuccess?.(response, variables);
          return;
        }

        const redirect = options.redirect || '/';
        router.replace(redirect);

        Toast.success(response?.message || 'Registration successful!', { duration: 1000 });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cart.details() });

        await options.onSuccess?.(response, variables);

      } catch (error) {
        Toast.error('Registration successful but session setup failed');
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
    router.replace('/');
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
  }, [queryClient, updateAuthState, router]);

  return useMutation({
    mutationFn: AuthService.logout,
    onSuccess: async (response, variables) => {
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

export const useForgotPassword = (options = {}) => {
  return useMutation({
    mutationFn: AuthService.sendResetLink,
    onSuccess: (response, variables) => {
      const message = response?.message || 'Password reset link sent to your email!';
      Toast.success(message);
      options.onSuccess?.(response, variables);
    },
    onError: (error, variables) => {
      const message = formatErrorMessage(error);
      Toast.error(message);
      options.onError?.(error, variables);
    },
    ...options,
  });
};

export const useResetPassword = (options = {}) => {
  const router = useRouter();

  return useMutation({
    mutationFn: AuthService.resetPassword,
    onSuccess: (response, variables) => {
      const message = response?.message || 'Password reset successful!';
      Toast.success(message);

      const delay = options.redirectDelay ?? 2000;
      setTimeout(() => {
        router.push('/auth/login');
      }, delay);

      options.onSuccess?.(response, variables);
    },
    onError: (error, variables) => {
      const message = formatErrorMessage(error);
      Toast.error(message);
      options.onError?.(error, variables);
    },
    ...options,
  });
};

export const useVerifyEmail = (options = {}) => {
  return useMutation({
    mutationFn: AuthService.verifyEmail,
    onSuccess: (response, variables) => {
      const message = response?.message || 'Email verified successfully!';
      Toast.success(message);
      options.onSuccess?.(response, variables);
    },
    onError: (error, variables) => {
      const message = formatErrorMessage(error);
      Toast.error(message);
      options.onError?.(error, variables);
    },
    ...options,
  });
};

export const useResendVerification = (options = {}) => {
  return useMutation({
    mutationFn: AuthService.resendVerification,
    onSuccess: (response, variables) => {
      const message = response?.message || 'Verification email sent successfully!';
      Toast.success(message);
      options.onSuccess?.(response, variables);
    },
    onError: (error, variables) => {
      const message = formatErrorMessage(error);
      Toast.error(message);
      options.onError?.(error, variables);
    },
    ...options,
  });
};

// export const useChangePassword = (options = {}) => {
//   return useMutation({
//     mutationFn: AuthService.changePassword,
//     onSuccess: (response, variables) => {
//       const message = response?.message || 'Password changed successfully!';
//       Toast.success(message);
//       options.onSuccess?.(response, variables);
//     },
//     onError: (error, variables) => {
//       const message = formatErrorMessage(error);
//       Toast.error(message);
//       options.onError?.(error, variables);
//     },
//     ...options,
//   });
// };

// export const useUpdateProfile = (options = {}) => {
//   const queryClient = useQueryClient();
//   const { setAuth: updateAuthState } = useAuth();

//   return useMutation({
//     mutationFn: AuthService.updateProfile,
//     onSuccess: (response, variables) => {
//       const message = response?.message || 'Profile updated successfully!';
//       Toast.success(message);

//       // Update auth state with new user data if provided
//       if (response?.data?.user) {
//         updateAuthState((prevState) => ({
//           ...prevState,
//           user: response.data.user,
//         }));
//       }

//       // Invalidate user queries
//       queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.me() });

//       options.onSuccess?.(response, variables);
//     },
//     onError: (error, variables) => {
//       const message = formatErrorMessage(error);
//       Toast.error(message);
//       options.onError?.(error, variables);
//     },
//     ...options,
//   });
// };

export const useVerifyToken = (params, options = {}) => {
  return useQuery({
    queryKey: ['auth', 'verify-token', params?.email, params?.token, params?.type],
    queryFn: async () => {
      if (!params?.email || !params?.token || !params?.type) {
        throw new Error('Missing required parameters');
      }
      const response = await AuthService.verifyToken(params);
      return response.data;
    },
    enabled: !!(params?.email && params?.token && params?.type),
    retry: false,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    ...options,
  });
};