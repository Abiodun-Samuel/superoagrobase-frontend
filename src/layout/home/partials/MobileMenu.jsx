'use client'
import { isActivePath } from '@/utils/helper';
import MobileNavItem from './MobileNavItem';
import Link from 'next/link';
import { BriefcaseBusiness, LogOut } from 'lucide-react';
import Button from '@/components/ui/Button';
import Animation from '@/components/common/Animation';
import RoleBadge from '@/components/ui/RoleBadge';
import Avatar from '@/components/ui/Avatar';
import { useLogout } from '@/queries/auth.query';
import TextBadge from '@/components/ui/TextBadge';

// Mobile Menu
const MobileMenu = ({ isOpen, items, isAuthenticated, user, userMenu, onClose, pathname, role }) => {
    const { mutateAsync, isPending } = useLogout()
    if (!isOpen) return null;
    const handleLogout = async () => {
        await mutateAsync()
        onClose?.()
    }


    return (
        <Animation animation={'fade-up'} className="xl:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="container mx-auto px-4 pt-4 space-y-2 max-h-[calc(100vh-108px)] overflow-y-auto">
                {/* User Info */}
                <div className="mb-4 p-4 bg-gray-100 shadow rounded-xl">
                    {isAuthenticated ? (
                        <div className="flex items-center space-x-3">
                            <Avatar src={user?.avatar} initials={user?.initials} size="md" />
                            <div>
                                <p className="font-semibold text-gray-800">{user?.full_name}</p>
                                <RoleBadge role={role} size="xs" />
                            </div>
                        </div>
                    ) : (
                        <>
                            <p className="text-sm font-semibold text-gray-800">Welcome!</p>
                            <p className="text-xs text-gray-500 mt-1">Login to access all features</p>
                        </>
                    )}
                </div>

                <div className="py-3 my-2 border-b border-t border-gray-100">
                    <TextBadge href="/become-a-vendor" className="w-full" size="md" color="orange" startIcon={<BriefcaseBusiness />}>Become a Vendor</TextBadge>
                </div>

                {/* Navigation Items */}
                {items.map((item) => (
                    <MobileNavItem key={item.id} item={item} pathname={pathname} onClose={onClose} />
                ))}

                {/* User Menu */}
                <div className="border-t border-gray-100 pt-4 my-4 space-y-2">
                    {(isAuthenticated ? userMenu.authenticated : userMenu.guest).map((item) => {
                        const Icon = item.icon;
                        const isCurrentPath = isActivePath(pathname, item.path);

                        return (
                            <Link
                                key={item.id}
                                href={item.path}
                                onClick={() => onClose()}
                                className={`hover:bg-gray-100 hover:text-green-600 flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-all duration-200 ${isCurrentPath ? 'bg-gray-100 text-green-600' : 'hover:bg-gray-100 hover:text-green-600'
                                    }`}
                            >
                                <Icon size={20} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>

                {isAuthenticated ? <div className="px-4 border-t border-gray-100 py-4">
                    <Button loading={isPending} onClick={handleLogout} color='red' startIcon={<LogOut />}>Logout</Button>
                </div> : null}
            </div>
        </Animation>
    );
};


export default MobileMenu