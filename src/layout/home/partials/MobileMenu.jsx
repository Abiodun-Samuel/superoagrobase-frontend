'use client'

import { memo, useCallback } from 'react';
import Link from 'next/link';
import { BriefcaseBusiness, LogOut } from 'lucide-react';

import { isActivePath } from '@/utils/helper';
import { useLogout } from '@/queries/auth.query';

import MobileNavItem from './MobileNavItem';
import Button from '@/components/ui/Button';
import Animation from '@/components/common/Animation';
import RoleBadge from '@/components/ui/RoleBadge';
import Avatar from '@/components/ui/Avatar';
import TextBadge from '@/components/ui/TextBadge';

// Constants
const MENU_CONFIG = {
    headerHeight: '108px',
    animation: 'fade-up',
    zIndex: 'z-50',
};

// Sub-components
const UserInfoCard = memo(({ isAuthenticated, user, role }) => (
    <div className="mb-4 p-4 bg-gray-100 shadow rounded-xl">
        {isAuthenticated ? (
            <div className="flex items-center" style={{ gap: '0.75rem' }}>
                <Avatar src={user?.avatar} initials={user?.initials} size="md" />
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{user?.full_name}</p>
                    <div className="mt-1">
                        <RoleBadge role={role} size="xs" />
                    </div>
                </div>
            </div>
        ) : (
            <div>
                <p className="text-sm font-semibold text-gray-800">Welcome!</p>
                <p className="text-xs text-gray-500 mt-1">Login to access all features</p>
            </div>
        )}
    </div>
));

UserInfoCard.displayName = 'UserInfoCard';

const VendorCTA = memo(() => (
    <div className="py-3 my-2 border-t border-b border-gray-100">
        <TextBadge
            href="/become-a-vendor"
            className="w-full block"
            size="md"
            color="orange"
            startIcon={<BriefcaseBusiness />}
        >
            Become a Vendor
        </TextBadge>
    </div>
));

VendorCTA.displayName = 'VendorCTA';

const NavigationItems = memo(({ items, pathname, onClose }) => {
    if (!items || items.length === 0) return null;

    return (
        <nav className="w-full" role="navigation" aria-label="Main navigation">
            <div className="flex flex-col" style={{ gap: '0.5rem' }}>
                {items.map((item) => (
                    <div key={item.id} className="w-full">
                        <MobileNavItem
                            item={item}
                            pathname={pathname}
                            onClose={onClose}
                        />
                    </div>
                ))}
            </div>
        </nav>
    );
});

NavigationItems.displayName = 'NavigationItems';

const UserMenuItem = memo(({ item, pathname, onClose }) => {
    const Icon = item.icon;
    const isActive = isActivePath(pathname, item.path);

    const baseClasses = 'flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200';
    const stateClasses = isActive
        ? 'bg-gray-100 text-green-600'
        : 'hover:bg-gray-100 hover:text-green-600';

    return (
        <Link
            href={item.path}
            onClick={onClose}
            className={`${baseClasses} ${stateClasses}`}
            aria-current={isActive ? 'page' : undefined}
            style={{ gap: '0.75rem' }}
        >
            <Icon size={20} aria-hidden="true" />
            <span className="font-medium">{item.label}</span>
        </Link>
    );
});

UserMenuItem.displayName = 'UserMenuItem';

const UserMenu = memo(({ isAuthenticated, userMenu, pathname, onClose }) => {
    const menuItems = isAuthenticated ? userMenu.authenticated : userMenu.guest;

    if (!menuItems || menuItems.length === 0) return null;

    return (
        <div className="border-t border-gray-100 pt-4 mt-4">
            <div className="flex flex-col" style={{ gap: '0.5rem' }}>
                {menuItems.map((item) => (
                    <UserMenuItem
                        key={item.id}
                        item={item}
                        pathname={pathname}
                        onClose={onClose}
                    />
                ))}
            </div>
        </div>
    );
});

UserMenu.displayName = 'UserMenu';

const LogoutSection = memo(({ onLogout, isPending }) => (
    <div className="border-t border-gray-100 pt-4 pb-2 mt-4">
        <Button
            className="w-full"
            loading={isPending}
            onClick={onLogout}
            color="red"
            startIcon={<LogOut />}
            aria-label="Logout from your account"
        >
            Logout
        </Button>
    </div>
));

LogoutSection.displayName = 'LogoutSection';

// Main Component
const MobileMenu = ({
    isOpen,
    items = [],
    isAuthenticated,
    user,
    userMenu = { authenticated: [], guest: [] },
    onClose,
    pathname,
    role
}) => {
    const { mutateAsync: logout, isPending } = useLogout();

    const handleLogout = useCallback(async () => {
        try {
            await logout();
            onClose?.();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }, [logout, onClose]);

    const handleBackdropClick = useCallback(() => {
        onClose?.();
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop Overlay */}
            <div
                className="fixed inset-0 bg-black z-40 xl:hidden"
                style={{ opacity: 0.2 }}
                onClick={handleBackdropClick}
                aria-hidden="true"
            />

            {/* Mobile Menu */}
            <Animation
                animation={MENU_CONFIG.animation}
                className={`xl:hidden bg-white border-t border-gray-100 shadow-lg fixed left-0 right-0 ${MENU_CONFIG.zIndex}`}
                style={{ top: MENU_CONFIG.headerHeight }}
                role="dialog"
                aria-label="Mobile menu"
                aria-modal="true"
            >
                <div
                    className="overflow-y-auto overflow-x-hidden overscroll-contain"
                    style={{
                        maxHeight: 'calc(100vh - 108px)',
                        WebkitOverflowScrolling: 'touch'
                    }}
                >
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex flex-col" style={{ gap: '0.5rem' }}>
                            <UserInfoCard
                                isAuthenticated={isAuthenticated}
                                user={user}
                                role={role}
                            />

                            <VendorCTA />

                            <NavigationItems
                                items={items}
                                pathname={pathname}
                                onClose={onClose}
                            />

                            <UserMenu
                                isAuthenticated={isAuthenticated}
                                userMenu={userMenu}
                                pathname={pathname}
                                onClose={onClose}
                            />

                            {isAuthenticated && (
                                <LogoutSection
                                    onLogout={handleLogout}
                                    isPending={isPending}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </Animation>
        </>
    );
};

export default memo(MobileMenu);