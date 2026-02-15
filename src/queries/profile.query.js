// hooks/useUserProfile.js
'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import Toast from '@/lib/toastify';
import { formatErrorMessage } from '@/utils/helper';
import { invalidationPatterns, QUERY_KEYS } from '@/utils/queries.keys';
import { userProfileService } from '@/services/profile.service';
import useAuth from '@/hooks/useAuth';
import { getAuth, setAuth } from '@/server/auth.server';

// ============================================
// BASE MUTATION HOOK
// ============================================

const useProfileMutation = (mutationFn, { successMessage, errorMessage }) => {
    const queryClient = useQueryClient();
    const { setAuth: updateAuthState } = useAuth();

    const handleSuccess = useCallback(async (response) => {
        // Update auth state
        const auth = await getAuth();
        const authState = await setAuth({ ...auth, user: response.data });
        updateAuthState(authState);

        // Invalidate queries
        invalidationPatterns.userProfile(queryClient);

        // Show success message
        Toast.success(response.message || successMessage);
    }, [updateAuthState, queryClient, successMessage]);

    const handleError = useCallback((error) => {
        const message = formatErrorMessage(error);
        Toast.error(message || errorMessage);
    }, [errorMessage]);

    return useMutation({
        mutationFn,
        onSuccess: handleSuccess,
        onError: handleError,
    });
};

// ============================================
// QUERIES
// ============================================

export const useUserProfile = (options = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.userProfile.detail(),
        queryFn: async () => {
            const { data } = await userProfileService.getProfile();
            return data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        ...options,
    });
};

// ============================================
// MUTATIONS
// ============================================

export const useUpdateBasicInfo = () => {
    return useProfileMutation(
        userProfileService.updateBasicInfo,
        {
            successMessage: 'Basic information updated successfully',
            errorMessage: 'Failed to update basic information',
        }
    );
};

export const useUpdateAvatar = () => {
    return useProfileMutation(
        userProfileService.updateAvatar,
        {
            successMessage: 'Avatar updated successfully',
            errorMessage: 'Failed to update avatar',
        }
    );
};

export const useUpdatePersonalDetails = () => {
    return useProfileMutation(
        userProfileService.updatePersonalDetails,
        {
            successMessage: 'Personal details updated successfully',
            errorMessage: 'Failed to update personal details',
        }
    );
};

export const useUpdateAddress = () => {
    return useProfileMutation(
        userProfileService.updateAddress,
        {
            successMessage: 'Address updated successfully',
            errorMessage: 'Failed to update address',
        }
    );
};

export const useUpdatePreferences = () => {
    return useProfileMutation(
        userProfileService.updatePreferences,
        {
            successMessage: 'Preferences updated successfully',
            errorMessage: 'Failed to update preferences',
        }
    );
};