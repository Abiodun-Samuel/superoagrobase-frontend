import { memo } from 'react';

const UserListSkeleton = memo(() => {
    return (
        <div className="divide-y divide-gray-200">
            {[...Array(10)].map((_, index) => (
                <div key={index} className="px-6 py-4 flex items-center gap-6 animate-pulse">
                    {/* Avatar */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0" />
                        <div className="flex-1 min-w-0 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-32" />
                            <div className="h-3 bg-gray-200 rounded w-48" />
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="hidden lg:block flex-1 space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-28" />
                        <div className="h-3 bg-gray-200 rounded w-32" />
                    </div>

                    {/* Role */}
                    <div className="hidden md:block">
                        <div className="h-6 bg-gray-200 rounded-full w-20" />
                    </div>

                    {/* Status */}
                    <div className="hidden sm:block">
                        <div className="h-6 bg-gray-200 rounded-full w-16" />
                    </div>

                    {/* Profile */}
                    <div className="hidden xl:block">
                        <div className="h-2 bg-gray-200 rounded-full w-24" />
                    </div>

                    {/* Date */}
                    <div className="hidden lg:block">
                        <div className="h-3 bg-gray-200 rounded w-20" />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full" />
                        <div className="w-8 h-8 bg-gray-200 rounded-full" />
                        <div className="w-8 h-8 bg-gray-200 rounded-full" />
                    </div>
                </div>
            ))}
        </div>
    );
});

UserListSkeleton.displayName = 'UserListSkeleton';

export default UserListSkeleton;