'use client'
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const CollapsibleSection = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-4 bg-green-50 hover:bg-green-100 transition flex items-center justify-between text-left"
                aria-expanded={isOpen}
            >
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-green-600 flex-shrink-0" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-green-600 flex-shrink-0" />
                )}
            </button>
            {isOpen && (
                <div className="px-6 py-4 bg-white">
                    {children}
                </div>
            )}
        </div>
    );
};

export default CollapsibleSection