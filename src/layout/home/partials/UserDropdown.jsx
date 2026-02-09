'use client'

import { useMemo } from 'react';
import Link from 'next/link';
import { LayoutDashboard, LogOut, Package } from 'lucide-react';

import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import RoleBadge from '@/components/ui/RoleBadge';
import { useLogout } from '@/queries/auth.query';
import { isActivePath } from '@/utils/helper';
import { isAdmin, isVendor } from '@/utils/role';

const UserDropdown = ({ isAuthenticated, user, userMenu, pathname, roles, role, onClose }) => {
    const { mutateAsync: logout, isPending: isLoggingOut } = useLogout();

    const menuItems = useMemo(() => {
        if (!isAuthenticated) return userMenu.guest;

        const roleBasedItems = [];

        // Add Dashboard for admin/super_admin
        if (isAdmin(roles)) {
            roleBasedItems.push({
                id: 'dashboard',
                label: 'Dashboard',
                path: '/dashboard',
                icon: LayoutDashboard
            });
        }

        // Add My Products for vendors
        if (isVendor(roles)) {
            roleBasedItems.push({
                id: 'my-products',
                label: 'My Products',
                path: '/account/products',
                icon: Package
            });
        }

        return [...roleBasedItems, ...userMenu.authenticated];
    }, [isAuthenticated, roles, userMenu]);

    const handleLogout = async () => {
        try {
            await logout();
            onClose?.();
        } catch (error) { }
    };

    return (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 pt-2 z-[10000]">
            <DropdownHeader
                isAuthenticated={isAuthenticated}
                user={user}
                role={role}
            />

            <DropdownMenuItems
                menuItems={menuItems}
                pathname={pathname}
                onClose={onClose}
            />

            {isAuthenticated && (
                <DropdownFooter
                    onLogout={handleLogout}
                    isLoggingOut={isLoggingOut}
                />
            )}
        </div>
    );
};

const DropdownHeader = ({ isAuthenticated, user, role }) => (
    <div className="px-4 py-3">
        {isAuthenticated ? (
            <div className="flex items-center gap-3">
                <Avatar
                    src={user?.avatar}
                    initials={user?.initials}
                    size="md"
                />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold mb-1 text-gray-800 dark:text-gray-100">
                        {user?.full_name}
                    </p>
                    <RoleBadge role={role} size="xs" />
                </div>
            </div>
        ) : (
            <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Welcome to SuperoAgrobase
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Login to access all features
                </p>
            </div>
        )}
    </div>
);

const DropdownMenuItems = ({ menuItems, pathname, onClose }) => (
    <nav className="border-t border-gray-100 dark:border-gray-700 my-1 py-1">
        {menuItems.map((item) => (
            <MenuItem
                key={item.id}
                item={item}
                pathname={pathname}
                onClose={onClose}
            />
        ))}
    </nav>
);

const MenuItem = ({ item, pathname, onClose }) => {
    const Icon = item.icon;
    const isActive = isActivePath(pathname, item.path);

    return (
        <Link
            href={item.path}
            onClick={onClose}
            className={`
                flex items-center gap-3 px-4 py-3 
                transition-all duration-200 
                ${isActive
                    ? 'bg-gray-100 dark:bg-gray-700 text-green-600 dark:text-green-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-green-600 dark:hover:text-green-400'
                }
            `}
        >
            <Icon
                size={18}
                className={isActive ? 'text-green-600 dark:text-green-400' : ''}
            />
            <span className="text-sm font-medium">{item.label}</span>
        </Link>
    );
};

const DropdownFooter = ({ onLogout, isLoggingOut }) => (
    <div className="px-4 border-t border-gray-100 dark:border-gray-700 py-3">
        <Button
            onClick={onLogout}
            loading={isLoggingOut}
            color="red"
            startIcon={<LogOut size={18} />}
            className="w-full"
        >
            Logout
        </Button>
    </div>
);

export default UserDropdown;