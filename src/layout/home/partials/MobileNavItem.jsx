'use client'

import { isActivePath } from "@/utils/helper";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const MobileNavItem = ({ item, pathname, onClose }) => {
    const [isOpen, setIsOpen] = useState(false);
    const Icon = item.icon;
    const isCurrentPath = isActivePath(pathname, item.path);

    const itemClasses = `flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:text-green-600 ${isCurrentPath ? 'bg-gray-100 text-green-600' : 'hover:bg-gray-100 hover:text-green-600'
        }`;

    return (
        <div>
            {item.dropdown ? (
                <button onClick={() => setIsOpen(!isOpen)} className={itemClasses}>
                    <div className="flex items-center space-x-3">
                        <Icon size={20} />
                        <span className="font-medium">{item.label}</span>
                    </div>
                    <ChevronDown size={16} className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
            ) : (
                <Link href={item.path} onClick={onClose} className={itemClasses}>
                    <div className="flex items-center space-x-3">
                        <Icon size={20} />
                        <span className="font-medium">{item.label}</span>
                    </div>
                </Link>
            )}

            {item.dropdown && (
                <div className={`ml-8 space-y-2 overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[500px] mt-2' : 'max-h-0'}`}>
                    {item.dropdown.map((dropdownItem) => {
                        const DropIcon = dropdownItem.icon;
                        const isDropCurrentPath = isActivePath(pathname, dropdownItem.path);

                        return (
                            <Link
                                key={dropdownItem.id}
                                href={dropdownItem.path}
                                onClick={() => onClose()}
                                className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-all text-sm ${isDropCurrentPath ? 'bg-[#F5F5F5] text-[#7CB342]' : 'hover:bg-[#F5F5F5] hover:text-[#7CB342]'
                                    }`}
                            >
                                <DropIcon size={16} />
                                <span>{dropdownItem.label}</span>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MobileNavItem