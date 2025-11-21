'use client'

import { isActivePath } from "@/utils/helper";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import DropdownMenu from "./DropdownMenu";

// Navigation Item
const NavItem = ({ item, isActive, onToggle, pathname }) => {

    // Custom Hooks
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
    const Icon = item.icon;
    const isCurrentPath = isActivePath(pathname, item.path);
    const dropdownRef = useClickOutside(() => isActive && onToggle());

    const buttonClasses = `flex items-center space-x-1 px-4 py-2 rounded-lg transition-all duration-200 font-medium group whitespace-nowrap ${isCurrentPath ? 'text-green-600 bg-gray-100' : 'text-gray-700 hover:text-green-600 hover:bg-gray-100'}`;

    return (
        <div className="relative" ref={dropdownRef}>
            {item.dropdown ? (
                <button onClick={onToggle} className={buttonClasses} aria-expanded={isActive}>
                    <Icon size={18} className="group-hover:scale-110 transition-transform" />
                    <span>{item.label}</span>
                    <ChevronDown size={16} className={`transform transition-transform duration-200 ${isActive ? 'rotate-180' : ''}`} />
                </button>
            ) : (
                <Link href={item.path} className={buttonClasses}>
                    <Icon size={18} className="group-hover:scale-110 transition-transform" />
                    <span>{item.label}</span>
                </Link>
            )}

            {item.dropdown && isActive && (
                <DropdownMenu items={item.dropdown} pathname={pathname} />
            )}
        </div>
    );
};

export default NavItem