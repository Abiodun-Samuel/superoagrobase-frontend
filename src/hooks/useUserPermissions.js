import { useMemo } from 'react';
import useAuth from '@/hooks/useAuth';

/**
 * Returns permission flags for user management actions.
 *
 * Rules:
 *  1. Only "super_admin" can delete, assign roles, or update status.
 *  2. A user cannot perform any of those actions on themselves.
 *
 * @param {Object} targetUser - The user being acted upon (must have an `id` field).
 * @returns {{
 *   canDelete: boolean,
 *   canAssignRole: boolean,
 *   canUpdateStatus: boolean,
 *   isSelf: boolean,
 *   isSuperAdmin: boolean,
 * }}
 */
const useUserPermissions = (targetUser) => {
    const { user: currentUser, role } = useAuth();

    return useMemo(() => {
        const isSuperAdmin = role === 'super_admin';
        const isSelf = !!targetUser && !!currentUser && targetUser.id === currentUser.id;

        const hasPermission = isSuperAdmin && !isSelf;

        return {
            canDelete: hasPermission,
            canAssignRole: hasPermission,
            canUpdateStatus: hasPermission,
            isSelf,
            isSuperAdmin,
        };
    }, [targetUser, currentUser, role]);
};

export default useUserPermissions;