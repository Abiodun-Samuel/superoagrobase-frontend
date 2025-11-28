'use client'

import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import RoleBadge from "@/components/ui/RoleBadge";
import { useLogout } from "@/queries/auth.query";
import { isActivePath } from "@/utils/helper";
import { BriefcaseBusiness, LogOut } from "lucide-react";
import Link from "next/link";
import TextBadge from "@/components/ui/TextBadge";

// User Dropdown
const UserDropdown = ({ isAuthenticated, user, userMenu, pathname, role, onClose }) => {
    const { mutateAsync, isPending } = useLogout()
    const handleLogout = async () => {
        await mutateAsync()
        onClose?.()
    }
    const menuItems = isAuthenticated ? userMenu.authenticated : userMenu.guest;

    return (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 pt-2 z-10000">
            {/* Header */}
            <div className="px-4 py-3">
                {isAuthenticated ? (
                    <div className="flex items-center space-x-3">
                        <Avatar src={user?.avatar} initials={user?.initials} size="md" />
                        <div>
                            <p className="text-sm font-semibold text-gray-800">{user?.full_name}</p>
                            <RoleBadge role={role} size="xs" />
                        </div>
                    </div>
                ) : (
                    <>
                        <p className="text-sm font-semibold text-gray-700">Welcome to SuperoAgrobase</p>
                        <p className="text-xs text-gray-500 mt-1">Login to access all features</p>
                    </>
                )}
            </div>

            <div className="px-4 py-3 my-2 border-b border-t border-gray-100">
                <TextBadge href="/become-a-vendor" className="w-full" size="md" color="orange" startIcon={<BriefcaseBusiness />}>Become a Vendor</TextBadge>
            </div>

            {/* Menu Items */}
            <div className="mb-3">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isCurrentPath = isActivePath(pathname, item.path);

                    return (
                        <Link
                            key={item.id}
                            href={item.path}
                            onClick={() => onClose()}
                            className={`flex items-center space-x-3 px-4 py-3 transition-all duration-200 group hover:bg-gray-100 hover:text-green-600 ${isCurrentPath ? 'bg-gray-100 text-green-600' : 'hover:bg-gray-100 hover:text-green-600'
                                }`}
                        >
                            <Icon size={18} className={isCurrentPath ? 'text-green-600' : 'text-gray-600 group-hover:text-green-600'} />
                            <span className={isCurrentPath ? 'text-green-600' : 'text-gray-600 group-hover:text-green-600'}>{item.label}</span>
                        </Link>
                    );
                })}
            </div>

            {isAuthenticated ?
                <div className="px-4">
                    <div className="border-t border-gray-100 py-3">
                        <Button className="w-full" loading={isPending} onClick={handleLogout} color='red' startIcon={<LogOut />}>Logout</Button>
                    </div>
                </div>
                : null}
        </div>
    );
};

export default UserDropdown