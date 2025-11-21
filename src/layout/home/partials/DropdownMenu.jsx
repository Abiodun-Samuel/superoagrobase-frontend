'use client'

import { isActivePath } from "@/utils/helper";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Dropdown Menu
const DropdownMenu = ({ items, pathname }) => {
    const [activeSubDropdown, setActiveSubDropdown] = useState(null);

    return (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 animate-fadeIn z-50">
            {items.map((item) => {
                const Icon = item.icon;
                const isCurrentPath = isActivePath(pathname, item.path);

                return (
                    <div key={item.id} className="relative">
                        {item.dropdown ? (
                            <button
                                onClick={() => setActiveSubDropdown(activeSubDropdown === item.id ? null : item.id)}
                                className={`flex items-center justify-between w-full px-4 py-3 transition-all duration-200 group ${isCurrentPath ? 'bg-[#F5F5F5] text-[#7CB342]' : 'hover:bg-[#F5F5F5] hover:text-[#7CB342]'
                                    }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <Icon size={18} className={`group-hover:scale-110 transition-all ${isCurrentPath ? 'text-[#7CB342]' : 'text-gray-400 group-hover:text-[#7CB342]'}`} />
                                    <span className="font-medium">{item.label}</span>
                                </div>
                                <ChevronDown size={14} className={`transform transition-transform ${activeSubDropdown === item.id ? 'rotate-180' : '-rotate-90'}`} />
                            </button>
                        ) : (
                            <Link
                                href={item.path}
                                className={`flex items-center space-x-3 px-4 py-3 transition-all duration-200 group ${isCurrentPath ? 'bg-[#F5F5F5] text-[#7CB342]' : 'hover:bg-[#F5F5F5] hover:text-[#7CB342]'
                                    }`}
                            >
                                <Icon size={18} className={`group-hover:scale-110 transition-all ${isCurrentPath ? 'text-[#7CB342]' : 'text-gray-400 group-hover:text-[#7CB342]'}`} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        )}

                        {item.dropdown && activeSubDropdown === item.id && (
                            <div className="absolute left-full top-0 ml-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50">
                                {item.dropdown.map((subItem) => {
                                    const SubIcon = subItem.icon;
                                    const isSubCurrentPath = isActivePath(pathname, subItem.path);

                                    return (
                                        <Link
                                            key={subItem.id}
                                            href={subItem.path}
                                            className={`flex items-center space-x-3 px-4 py-3 transition-all duration-200 group ${isSubCurrentPath ? 'bg-[#F5F5F5] text-[#7CB342]' : 'hover:bg-[#F5F5F5] hover:text-[#7CB342]'
                                                }`}
                                        >
                                            <SubIcon size={16} className={`group-hover:scale-110 transition-all ${isSubCurrentPath ? 'text-[#7CB342]' : 'text-gray-400 group-hover:text-[#7CB342]'}`} />
                                            <span className="font-medium text-sm">{subItem.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};


export default DropdownMenu