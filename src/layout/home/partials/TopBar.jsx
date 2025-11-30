'use client'

import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

const TopBar = ({ data }) => {
    if (!data) return null;

    const { phone, email, address } = data;

    return (
        <div className="bg-green-600 text-white h-9">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex items-center justify-start sm:justify-between h-full text-xs sm:text-sm gap-7 sm:gap-4">
                    {phone && (
                        <Link
                            href={`tel:${phone}`}
                            className="flex items-center space-x-0 sm:space-x-2 hover:text-[#9CCC65] transition-colors group"
                            aria-label={`Call us at ${phone}`}
                            title={`Call us at ${phone}`}
                        >
                            <Phone size={14} className="flex-shrink-0" />
                            <span className="hidden sm:inline">
                                {phone}
                            </span>
                        </Link>
                    )}

                    {email && (
                        <Link
                            href={`mailto:${email}`}
                            className="flex items-center space-x-0 sm:space-x-2 hover:text-[#9CCC65] transition-colors group"
                            aria-label={`Email us at ${email}`}
                            title={`Email us at ${email}`}
                        >
                            <Mail size={14} className="flex-shrink-0" />
                            <span className="hidden sm:inline">
                                {email}
                            </span>
                        </Link>
                    )}

                    {address && (
                        <Link
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                            target="_blank"
                            aria-label={`Our office is located at: ${address}`}
                            title={`Our office is located at: ${address}`}
                            rel="noopener noreferrer"
                            className="flex truncate items-center space-x-0 sm:space-x-2 hover:text-[#9CCC65] transition-colors group"
                        >
                            <MapPin size={14} className="flex-shrink-0" />
                            <span className="hidden sm:inline truncate">
                                {address}
                            </span>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopBar;