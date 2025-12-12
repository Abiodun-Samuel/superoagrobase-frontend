'use client'

import { Menu, X } from "lucide-react";

const MobileMenuButton = ({ isOpen, onClick }) => (
    <button
        onClick={onClick}
        className="xl:hidden p-2 rounded-xl hover:bg-[#F5F5F5] transition-colors flex-shrink-0"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
    >
        {isOpen ? <X size={20} className="text-gray-700" /> : <Menu size={20} className="text-gray-700" />}
    </button>
);

export default MobileMenuButton