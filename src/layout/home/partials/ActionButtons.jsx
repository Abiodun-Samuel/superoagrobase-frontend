'use client'

import { ChevronDown, ShoppingCart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import UserDropdown from "./UserDropdown";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import { useCart } from "@/queries/cart.query";

const ActionButtons = ({ isAuthenticated, user, userMenu, pathname, role }) => {
    const { data: cartData } = useCart();

    const useClickOutside = (handler) => {
        const ref = useRef(null);

        useEffect(() => {
            const handleClickOutside = (event) => {
                if (ref.current && !ref.current.contains(event.target)) {
                    handler();
                }
            };

            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }, [handler]);

        return ref;
    };

    const [showUserMenu, setShowUserMenu] = useState(false);
    const userMenuRef = useClickOutside(() => setShowUserMenu(false));

    const iconButtonClass = "relative p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 group";
    const badgeClass = "absolute -top-1 -right-1 bg-[#FFA726] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center";

    return (
        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">

            {/* Cart */}
            <Link href="/cart" className={iconButtonClass} aria-label="Cart">
                <ShoppingCart size={20} className="w-5.5 h-5.5 text-gray-700 group-hover:text-green-600" />
                <span className={badgeClass}>{cartData?.summary?.item_count || 0}</span>
            </Link>

            {/* User Menu */}
            <div className="relative md:block" ref={userMenuRef}>
                <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-[#F5F5F5] transition-all duration-200"
                    aria-expanded={showUserMenu}
                >
                    <Avatar src={user?.avatar} initials={user?.initials} size="xs" />
                    <span className="text-sm font-medium text-gray-700 hidden lg:block">  {user?.first_name || 'Account'}</span>
                    <ChevronDown size={16} className={`text-gray-700 transform transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {showUserMenu && (
                    <UserDropdown
                        isAuthenticated={isAuthenticated}
                        user={user}
                        role={role}
                        userMenu={userMenu}
                        onClose={() => setShowUserMenu(false)}
                        pathname={pathname}
                    />
                )}
            </div>
        </div>
    );
};

export default ActionButtons