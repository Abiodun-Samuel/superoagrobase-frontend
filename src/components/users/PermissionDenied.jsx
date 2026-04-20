'use client';

import { ShieldX } from 'lucide-react';

/**
 * Renders a styled "permission denied" notice inside a modal.
 *
 * @param {{ isSelf: boolean, isSuperAdmin: boolean }} props
 */
const PermissionDenied = ({ isSelf, isSuperAdmin }) => {
    const message = isSelf
        ? "You cannot perform this action on your own account."
        : !isSuperAdmin
            ? "Only Super Admins are allowed to perform this action."
            : "You do not have permission to perform this action.";

    return (
        <div className="flex flex-col items-center gap-4 py-8 px-4 text-center">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30">
                <ShieldX className="w-7 h-7 text-red-600 dark:text-red-400" />
            </div>
            <div className="space-y-1">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Access Denied
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                    {message}
                </p>
            </div>
        </div>
    );
};

export default PermissionDenied;