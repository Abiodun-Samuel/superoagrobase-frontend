'use client'

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { NavbarData } from '@/utils/data';
import TopBar from './partials/TopBar';
import Logo from './partials/Logo';
import DesktopNavigation from './partials/DesktopNavigation';
import ActionButtons from './partials/ActionButtons';
import MobileMenuButton from './partials/MobileMenuButton';
import MobileMenu from './partials/MobileMenu';
import { NAVBAR_CONFIG } from '@/utils/constant';
import { useMe } from '@/queries/auth.query';
import useAuth from '@/hooks/useAuth';


const useScrollPosition = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return isScrolled;
};

const Navbar = () => {
    useMe()
    const pathname = usePathname();
    const isScrolled = useScrollPosition();
    const { user, isAuthenticated, role } = useAuth();

    const [state, setState] = useState({
        isMobileMenuOpen: false,
        activeDropdown: null,
    });

    const updateState = (updates) => setState(prev => ({ ...prev, ...updates }));

    const navHeight = isScrolled
        ? NAVBAR_CONFIG.heights.topBar + NAVBAR_CONFIG.heights.mainNavScrolled
        : NAVBAR_CONFIG.heights.topBar + NAVBAR_CONFIG.heights.mainNav;

    return (
        <>
            {/* Spacer for fixed navbar */}
            <div style={{ height: `${navHeight}px` }} />

            <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
                <TopBar data={NavbarData.topBar} />

                {/* Main Navigation Bar */}
                <div
                    className={`transition-all duration-300 bg-white border-b border-gray-100 ${isScrolled ? 'h-18' : 'h-22'
                        }`}
                >
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
                        <div className="flex items-center justify-between h-full gap-2 sm:gap-4">
                            <Logo />

                            <DesktopNavigation
                                items={NavbarData.mainNav}
                                activeDropdown={state.activeDropdown}
                                onToggleDropdown={(id) => updateState({ activeDropdown: state.activeDropdown === id ? null : id })}
                                pathname={pathname}
                            />

                            <ActionButtons
                                isAuthenticated={isAuthenticated}
                                user={user}
                                role={role}
                                userMenu={NavbarData.userMenu}
                                pathname={pathname}
                            />

                            <MobileMenuButton
                                isOpen={state.isMobileMenuOpen}
                                onClick={() => updateState({ isMobileMenuOpen: !state.isMobileMenuOpen })}
                            />
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <MobileMenu
                    isOpen={state.isMobileMenuOpen}
                    items={NavbarData.mainNav}
                    isAuthenticated={isAuthenticated}
                    user={user}
                    role={role}
                    userMenu={NavbarData.userMenu}
                    onClose={() => updateState({ isMobileMenuOpen: false })}
                    pathname={pathname}
                />
            </nav>
        </>
    );
};

export default Navbar;