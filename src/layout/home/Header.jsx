'use client'

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { NAVBAR_DATA } from '@/utils/data';
import Logo from './partials/Logo';
import DesktopNavigation from './partials/DesktopNavigation';
import ActionButtons from './partials/ActionButtons';
import MobileMenuButton from './partials/MobileMenuButton';
import MobileMenu from './partials/MobileMenu';
import useAuth from '@/hooks/useAuth';


const Header = () => {
    const pathname = usePathname();
    const { user, isAuthenticated, role } = useAuth();

    const [state, setState] = useState({
        isMobileMenuOpen: false,
        activeDropdown: null,
    });

    const updateState = (updates) => setState(prev => ({ ...prev, ...updates }));

    return (
        <>
            {/* Spacer for fixed navbar */}
            <div className='h-[70px]' />

            <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">

                {/* Main Navigation Bar */}
                <div
                    className={`transition-all duration-300 bg-white border-b border-gray-100 h-20`}
                >
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
                        <div className="flex items-center justify-between h-full gap-2 sm:gap-4">
                            <Logo />

                            <DesktopNavigation
                                items={NAVBAR_DATA.mainNav}
                                activeDropdown={state.activeDropdown}
                                onToggleDropdown={(id) => updateState({ activeDropdown: state.activeDropdown === id ? null : id })}
                                pathname={pathname}
                            />

                            <ActionButtons
                                isAuthenticated={isAuthenticated}
                                user={user}
                                role={role}
                                userMenu={NAVBAR_DATA.userMenu}
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
                    items={NAVBAR_DATA.mainNav}
                    onClose={() => updateState({ isMobileMenuOpen: false })}
                    pathname={pathname}
                />
            </nav>
        </>
    );
};

export default Header;