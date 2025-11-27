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
            <div className="flex items-center space-x-3">
                <Avatar src={user?.avatar} initials={user?.initials} size="md" />
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{user?.full_name}</p>
                    <RoleBadge role={role} size="xs" />
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
    <div className="py-3 my-2 border-y border-gray-100">
        <TextBadge
            href="/become-a-vendor"
            className="w-full"
            size="md"
            color="orange"
            startIcon={<BriefcaseBusiness />}
        >
            Become a Vendor
        </TextBadge>
    </div>
));

VendorCTA.displayName = 'VendorCTA';

const NavigationItems = memo(({ items, pathname, onClose }) => (
    <nav className="space-y-2" role="navigation" aria-label="Main navigation">
        {items.map((item) => (
            <MobileNavItem
                key={item.id}
                item={item}
                pathname={pathname}
                onClose={onClose}
            />
        ))}
    </nav>
));

NavigationItems.displayName = 'NavigationItems';

const UserMenuItem = memo(({ item, pathname, onClose }) => {
    const Icon = item.icon;
    const isActive = isActivePath(pathname, item.path);

    const linkClasses = [
        'flex items-center space-x-3 w-full px-4 py-3 rounded-lg',
        'transition-all duration-200',
        isActive
            ? 'bg-gray-100 text-green-600'
            : 'hover:bg-gray-100 hover:text-green-600'
    ].join(' ');

    return (
        <Link
            href={item.path}
            onClick={onClose}
            className={linkClasses}
            aria-current={isActive ? 'page' : undefined}
        >
            <Icon size={20} aria-hidden="true" />
            <span className="font-medium">{item.label}</span>
        </Link>
    );
});

UserMenuItem.displayName = 'UserMenuItem';

const UserMenu = memo(({ isAuthenticated, userMenu, pathname, onClose }) => {
    const menuItems = isAuthenticated ? userMenu.authenticated : userMenu.guest;

    return (
        <div className="border-t border-gray-100 pt-4 mt-4 space-y-2">
            {menuItems.map((item) => (
                <UserMenuItem
                    key={item.id}
                    item={item}
                    pathname={pathname}
                    onClose={onClose}
                />
            ))}
        </div>
    );
});

UserMenu.displayName = 'UserMenu';

const LogoutSection = memo(({ onLogout, isPending }) => (
    <div className="border-t border-gray-100 pt-4 pb-2">
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
    items,
    isAuthenticated,
    user,
    userMenu,
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
        }
    }, [logout, onClose]);

    if (!isOpen) return null;

    const menuStyles = {
        top: MENU_CONFIG.headerHeight,
    };

    return (
        <>
            {/* Backdrop Overlay */}
            <div
                className="fixed inset-0 bg-black/20 z-40 xl:hidden"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Mobile Menu */}
            <Animation
                animation={MENU_CONFIG.animation}
                className={`xl:hidden bg-white border-t border-gray-100 shadow-lg fixed left-0 right-1 ${MENU_CONFIG.zIndex}`}
                style={menuStyles}
                role="dialog"
                aria-label="Mobile menu"
                aria-modal="true"
            >
                <div className="max-h-[calc(100vh-108px)] overflow-y-auto overscroll-contain">
                    <div className="container mx-auto px-4 py-4 space-y-2">
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
            </Animation>
        </>
    );
};

export default memo(MobileMenu);