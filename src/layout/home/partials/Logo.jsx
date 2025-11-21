'use client'

import Image from "next/image";
import Link from "next/link";


const Logo = () => (
    <Link href="/" className="flex items-center space-x-2 group flex-shrink-0">
        <Image height={65} width={98} src="/images/logo/logo.png" alt="logo" />
    </Link>
);

export default Logo