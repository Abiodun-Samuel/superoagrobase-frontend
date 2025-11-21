'use client'

import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

const TopBar = ({ data }) => (
    <div className="bg-gradient-to-r from-[#558B2F] to-[#7CB342] text-white h-9">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
            <div className="flex gap-5 items-center justify-between h-full text-xs sm:text-sm">
                <div className="flex items-center space-x-3 sm:space-x-6">
                    <Link href={`tel:${data.phone}`} className="flex items-center space-x-2 hover:text-[#9CCC65] transition-colors">
                        <Phone size={14} />
                        <span>{data.phone}</span>
                    </Link>
                    <Link href={`mailto:${data.email}`} className="hidden md:flex items-center space-x-2 hover:text-[#9CCC65] transition-colors cursor-pointer">
                        <Mail size={14} />
                        <span className="inline">{data.email}</span>
                    </Link>
                </div>
                <div className="flex items-center space-x-2">
                    <MapPin size={14} className="inline flex-shrink-0" />
                    <span className="font-medium truncate">{data.address}</span>
                </div>
            </div>
        </div>
    </div>
);
export default TopBar