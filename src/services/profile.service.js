import $api from "@/lib/axios";

const USER_PROFILE_ENDPOINTS = {
    GET_PROFILE: '/profile',
    UPDATE_BASIC_INFO: '/profile/basic-info',
    UPDATE_PERSONAL_DETAILS: '/profile/personal-details',
    UPDATE_ADDRESS: '/profile/address',
    UPDATE_PREFERENCES: '/profile/preferences',
    UPDATE_AVATAR: '/profile/avatar',
};

export const userProfileService = {
    /**
     * Get user profile
     */
    getProfile: async () => {
        const response = await $api.get(USER_PROFILE_ENDPOINTS.GET_PROFILE);
        return response.data;
    },

    /**
     * Update basic information
     */
    updateBasicInfo: async (data) => {
        const response = await $api.put(USER_PROFILE_ENDPOINTS.UPDATE_BASIC_INFO, data);
        return response.data;
    },

    /**
     * Update personal details
     */
    updatePersonalDetails: async (data) => {
        const response = await $api.put(USER_PROFILE_ENDPOINTS.UPDATE_PERSONAL_DETAILS, data);
        return response.data;
    },

    /**
     * Update address
     */
    updateAddress: async (data) => {
        const response = await $api.put(USER_PROFILE_ENDPOINTS.UPDATE_ADDRESS, data);
        return response.data;
    },

    /**
     * Update preferences
     */
    updatePreferences: async (data) => {
        const response = await $api.put(USER_PROFILE_ENDPOINTS.UPDATE_PREFERENCES, data);
        return response.data;
    },

    /**
     * Update avatar
     */
    updateAvatar: async (avatar) => {
        const response = await $api.post(USER_PROFILE_ENDPOINTS.UPDATE_AVATAR, avatar);
        return response.data;
    },
};