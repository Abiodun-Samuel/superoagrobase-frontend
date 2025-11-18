'use client'

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Menu,
    X,
    Search,
    ShoppingCart,
    Heart,
    MapPin,
    Phone,
    ChevronDown,
    Package,
    Sprout,
    LogIn,
    LogOut,
    UserCircle,
    Settings,
    Clock,
    Shield,
    Home,
    Users,
    ShoppingBag,
    Briefcase,
    LayoutDashboard,
    Info,
    Wrench,
    BookOpen,
    Mail,
    Tractor
} from 'lucide-react';
import Image from 'next/image';

// Constants
const NAVBAR_CONFIG = {
    heights: {
        topBar: 36,
        mainNav: 90,
        mainNavScrolled: 74,
    },
    breakpoints: {
        mobile: 'xl:hidden',
        desktop: 'hidden xl:flex'
    }
};

// Navigation Data
const navigationData = {
    topBar: {
        contact: '+234 800 123 4567',
        location: 'Lagos, Nigeria',
        announcement: '🌱 Pickup or Safe Delivery Option'
    },
    mainNav: [
        { id: 'home', label: 'Home', path: '/', icon: Home },
        { id: 'about', label: 'About', path: '/about', icon: Info },
        {
            id: 'services',
            label: 'Services',
            path: '/services',
            icon: Wrench,
            dropdown: [
                { id: 'consulting', label: 'Consulting Services', path: '/services/consulting', icon: Users },
                { id: 'equipment-rental', label: 'Equipment Rental', path: '/services/equipment-rental', icon: Tractor },
                { id: 'training', label: 'Training Programs', path: '/services/training', icon: BookOpen },
                { id: 'delivery', label: 'Delivery Services', path: '/services/delivery', icon: Package }
            ]
        },
        { id: 'blogs', label: 'Blogs', path: '/blogs', icon: BookOpen },
        { id: 'contact', label: 'Contact', path: '/contact', icon: Mail },
        { id: 'products', label: 'Products', path: '/products', icon: ShoppingBag }
    ],
    userMenu: {
        authenticated: [
            { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
            { id: 'profile', label: 'My Profile', path: '/dashboard/profile', icon: UserCircle },
            { id: 'orders', label: 'My Orders', path: '/dashboard/orders', icon: Clock },
            { id: 'wishlist', label: 'Wishlist', path: '/wishlist', icon: Heart },
            { id: 'logout', label: 'Logout', path: '/logout', icon: LogOut, action: 'logout' }
        ],
        guest: [
            { id: 'login', label: 'Login', path: '/auth/login', icon: LogIn },
            { id: 'register', label: 'Register', path: '/auth/register', icon: UserCircle }
        ]
    }
};

// Mock Data
const mockSearchResults = [
    { id: 1, name: 'Organic Fertilizer 50kg', category: 'Fertilizers', price: '₦15,000' },
    { id: 2, name: 'Tomato Seeds (Hybrid)', category: 'Seeds', price: '₦2,500' },
    { id: 3, name: 'Irrigation Pump System', category: 'Equipment', price: '₦85,000' },
    { id: 4, name: 'NPK Fertilizer 20-10-10', category: 'Fertilizers', price: '₦12,000' },
    { id: 5, name: 'Garden Tractor', category: 'Equipment', price: '₦450,000' }
];

// Utility Functions
const getInitials = (name) => {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

const isActivePath = (pathname, itemPath) => {
    if (itemPath === '/') return pathname === '/';
    return pathname === itemPath || pathname?.startsWith(itemPath + '/');
};

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

const useScrollPosition = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return isScrolled;
};

// Main Navbar Component
const Navbar = () => {
    const pathname = usePathname();
    const isScrolled = useScrollPosition();

    const [state, setState] = useState({
        isMobileMenuOpen: false,
        activeDropdown: null,
        isAuthenticated: false,
        showSearchOverlay: false,
        searchQuery: '',
        searchResults: [],
        cartCount: 3,
        wishlistCount: 5,
        userName: 'John Doe'
    });

    useEffect(() => {
        document.body.style.overflow = state.showSearchOverlay ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [state.showSearchOverlay]);

    const updateState = (updates) => setState(prev => ({ ...prev, ...updates }));

    const handleSearch = () => {
        if (state.searchQuery.trim()) {
            const filtered = mockSearchResults.filter(item =>
                item.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                item.category.toLowerCase().includes(state.searchQuery.toLowerCase())
            );
            updateState({ searchResults: filtered });
        } else {
            updateState({ searchResults: [] });
        }
    };

    const navHeight = isScrolled
        ? NAVBAR_CONFIG.heights.topBar + NAVBAR_CONFIG.heights.mainNavScrolled
        : NAVBAR_CONFIG.heights.topBar + NAVBAR_CONFIG.heights.mainNav;

    return (
        <>
            {/* Spacer for fixed navbar */}
            <div style={{ height: `${navHeight}px` }} />

            <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
                {/* Top Bar */}
                <TopBar data={navigationData.topBar} />

                {/* Main Navigation Bar */}
                <div
                    className={`transition-all duration-300 bg-white border-b border-gray-100 ${isScrolled ? 'h-18' : 'h-22'
                        }`}
                >
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
                        <div className="flex items-center justify-between h-full gap-2 sm:gap-4">
                            <Logo />

                            <DesktopNavigation
                                items={navigationData.mainNav}
                                activeDropdown={state.activeDropdown}
                                onToggleDropdown={(id) => updateState({ activeDropdown: state.activeDropdown === id ? null : id })}
                                pathname={pathname}
                            />

                            <ActionButtons
                                isAuthenticated={state.isAuthenticated}
                                userName={state.userName}
                                cartCount={state.cartCount}
                                wishlistCount={state.wishlistCount}
                                userMenu={navigationData.userMenu}
                                onLogout={() => updateState({ isAuthenticated: false })}
                                onSearchClick={() => updateState({ showSearchOverlay: true })}
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
                    items={navigationData.mainNav}
                    isAuthenticated={state.isAuthenticated}
                    userName={state.userName}
                    userMenu={navigationData.userMenu}
                    onClose={() => updateState({ isMobileMenuOpen: false })}
                    onLogout={() => updateState({ isAuthenticated: false, isMobileMenuOpen: false })}
                    pathname={pathname}
                />
            </nav>

            {/* Search Overlay */}
            <SearchOverlay
                isOpen={state.showSearchOverlay}
                onClose={() => updateState({ showSearchOverlay: false, searchQuery: '', searchResults: [] })}
                searchQuery={state.searchQuery}
                onSearchQueryChange={(query) => updateState({ searchQuery: query })}
                searchResults={state.searchResults}
                onSearch={handleSearch}
            />
        </>
    );
};

// TopBar Component
const TopBar = ({ data }) => (
    <div className="bg-gradient-to-r from-[#558B2F] to-[#7CB342] text-white h-9">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
            <div className="flex items-center justify-between h-full text-xs sm:text-sm">
                <div className="flex items-center space-x-3 sm:space-x-6">
                    <a href={`tel:${data.contact}`} className="hidden sm:flex items-center space-x-2 hover:text-[#9CCC65] transition-colors">
                        <Phone size={14} />
                        <span>{data.contact}</span>
                    </a>
                    <div className="flex items-center space-x-2 hover:text-[#9CCC65] transition-colors cursor-pointer">
                        <MapPin size={14} />
                        <span className="hidden sm:inline">{data.location}</span>
                        <span className="sm:hidden">Lagos</span>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Shield size={14} className="hidden sm:inline flex-shrink-0" />
                    <span className="font-medium truncate">{data.announcement}</span>
                </div>
            </div>
        </div>
    </div>
);

// Logo Component
const Logo = () => (
    <Link href="/" className="flex items-center space-x-2 group flex-shrink-0">
        <Image height={65} width={98} src="/images/logo/logo.png" alt="logo" />
    </Link>
);

// Desktop Navigation
const DesktopNavigation = ({ items, activeDropdown, onToggleDropdown, pathname }) => (
    <nav className="hidden xl:flex items-center space-x-1 flex-1 justify-center">
        {items.map((item) => (
            <NavItem
                key={item.id}
                item={item}
                isActive={activeDropdown === item.id}
                onToggle={() => item.dropdown && onToggleDropdown(item.id)}
                pathname={pathname}
            />
        ))}
    </nav>
);

// Navigation Item
const NavItem = ({ item, isActive, onToggle, pathname }) => {
    const Icon = item.icon;
    const isCurrentPath = isActivePath(pathname, item.path);
    const dropdownRef = useClickOutside(() => isActive && onToggle());

    const buttonClasses = `flex items-center space-x-1 px-4 py-2 rounded-lg transition-all duration-200 font-medium group whitespace-nowrap ${isCurrentPath ? 'text-green-600 bg-[#F5F5F5]' : 'text-gray-700 hover:text-green-600 hover:bg-[#F5F5F5]'
        }`;

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

// Action Buttons
const ActionButtons = ({ isAuthenticated, userName, cartCount, wishlistCount, userMenu, onLogout, onSearchClick, pathname }) => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const userMenuRef = useClickOutside(() => setShowUserMenu(false));

    const iconButtonClass = "relative p-2 sm:p-2.5 rounded-lg hover:bg-[#F5F5F5] transition-all duration-200 group";
    const badgeClass = "absolute -top-1 -right-1 bg-[#FFA726] text-white text-xs font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center";

    return (
        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            {/* Search */}
            <button onClick={onSearchClick} className={iconButtonClass} aria-label="Search">
                <Search size={18} className="sm:w-5 sm:h-5 text-gray-700 group-hover:text-green-600" />
            </button>

            {/* Wishlist */}
            <Link href="/wishlist" className={iconButtonClass} aria-label="Wishlist">
                <Heart size={18} className="sm:w-5 sm:h-5 text-gray-700 group-hover:text-green-600" />
                {wishlistCount > 0 && <span className={badgeClass}>{wishlistCount}</span>}
            </Link>

            {/* Cart */}
            <Link href="/cart" className={iconButtonClass} aria-label="Cart">
                <ShoppingCart size={18} className="sm:w-5 sm:h-5 text-gray-700 group-hover:text-green-600" />
                {cartCount > 0 && <span className={badgeClass}>{cartCount}</span>}
            </Link>

            {/* User Menu */}
            <div className="relative hidden md:block" ref={userMenuRef}>
                <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-[#F5F5F5] transition-all duration-200"
                    aria-expanded={showUserMenu}
                >
                    {isAuthenticated ? (
                        <>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7CB342] to-[#558B2F] flex items-center justify-center text-white font-semibold text-sm">
                                {getInitials(userName)}
                            </div>
                            <span className="text-sm font-medium text-gray-700 max-w-24 truncate hidden lg:block">
                                {userName.split(' ')[0]}
                            </span>
                        </>
                    ) : (
                        <>
                            <UserCircle size={20} className="text-gray-700" />
                            <span className="text-sm font-medium text-gray-700 hidden lg:block">Account</span>
                        </>
                    )}
                    <ChevronDown size={16} className={`text-gray-700 transform transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {showUserMenu && (
                    <UserDropdown
                        isAuthenticated={isAuthenticated}
                        userName={userName}
                        userMenu={userMenu}
                        onClose={() => setShowUserMenu(false)}
                        onLogout={onLogout}
                        pathname={pathname}
                    />
                )}
            </div>
        </div>
    );
};

// User Dropdown
const UserDropdown = ({ isAuthenticated, userName, userMenu, onClose, onLogout, pathname }) => {
    const menuItems = isAuthenticated ? userMenu.authenticated : userMenu.guest;

    return (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100">
                {isAuthenticated ? (
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7CB342] to-[#558B2F] flex items-center justify-center text-white font-semibold">
                            {getInitials(userName)}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-800">{userName}</p>
                            <p className="text-xs text-gray-500">Farmer</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <p className="text-sm font-semibold text-gray-800">Welcome to SuperoAgrobase</p>
                        <p className="text-xs text-gray-500 mt-1">Login to access all features</p>
                    </>
                )}
            </div>

            {/* Menu Items */}
            {menuItems.map((item) => {
                const Icon = item.icon;
                const isCurrentPath = isActivePath(pathname, item.path);

                return (
                    <Link
                        key={item.id}
                        href={item.path}
                        onClick={(e) => {
                            if (item.action === 'logout') {
                                e.preventDefault();
                                onLogout();
                            }
                            onClose();
                        }}
                        className={`flex items-center space-x-3 px-4 py-3 transition-all duration-200 group ${isCurrentPath ? 'bg-[#F5F5F5] text-[#7CB342]' : 'hover:bg-[#F5F5F5] hover:text-[#7CB342]'
                            }`}
                    >
                        <Icon size={18} className={isCurrentPath ? 'text-[#7CB342]' : 'text-gray-400 group-hover:text-[#7CB342]'} />
                        <span className="font-medium">{item.label}</span>
                    </Link>
                );
            })}

            {/* Vendor CTA */}
            <div className="border-t border-gray-100 mt-2 pt-2 px-4 py-2">
                <Link
                    href="/auth/register/vendor"
                    className="flex items-center justify-center space-x-2 w-full px-4 py-2.5 bg-gradient-to-r from-[#FFA726] to-[#FF9800] text-white rounded-lg hover:shadow-lg transition-all duration-200 group"
                >
                    <Briefcase size={16} className="group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-semibold">Register as Vendor</span>
                </Link>
            </div>

        </div>
    );
};

// Mobile Menu Button
const MobileMenuButton = ({ isOpen, onClick }) => (
    <button
        onClick={onClick}
        className="xl:hidden p-2 rounded-lg hover:bg-[#F5F5F5] transition-colors flex-shrink-0"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
    >
        {isOpen ? <X size={20} className="text-gray-700" /> : <Menu size={20} className="text-gray-700" />}
    </button>
);

// Mobile Menu
const MobileMenu = ({ isOpen, items, isAuthenticated, userName, userMenu, onClose, onLogout, pathname }) => {
    if (!isOpen) return null;

    return (
        <div className="xl:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="container mx-auto px-4 py-4 space-y-2 max-h-[calc(100vh-108px)] overflow-y-auto">
                {/* User Info */}
                <div className="mb-4 p-4 bg-gradient-to-r from-[#F5F5F5] to-[#FAFAFA] rounded-xl">
                    {isAuthenticated ? (
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7CB342] to-[#558B2F] flex items-center justify-center text-white font-semibold">
                                {getInitials(userName)}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800">{userName}</p>
                                <p className="text-xs text-gray-500">Farmer</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <p className="text-sm font-semibold text-gray-800">Welcome!</p>
                            <p className="text-xs text-gray-500 mt-1">Login to access all features</p>
                        </>
                    )}
                </div>

                {/* Navigation Items */}
                {items.map((item) => (
                    <MobileNavItem key={item.id} item={item} pathname={pathname} onClose={onClose} />
                ))}

                {/* User Menu */}
                <div className="border-t border-gray-100 pt-4 mt-4 space-y-2">
                    {(isAuthenticated ? userMenu.authenticated : userMenu.guest).map((item) => {
                        const Icon = item.icon;
                        const isCurrentPath = isActivePath(pathname, item.path);

                        return (
                            <Link
                                key={item.id}
                                href={item.path}
                                onClick={(e) => {
                                    if (item.action === 'logout') {
                                        e.preventDefault();
                                        onLogout();
                                    }
                                    onClose();
                                }}
                                className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-all duration-200 ${isCurrentPath ? 'bg-[#F5F5F5] text-[#7CB342]' : 'hover:bg-[#F5F5F5] hover:text-[#7CB342]'
                                    }`}
                            >
                                <Icon size={20} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* Vendor CTA */}
                <div className="pt-4 pb-4">
                    <Link
                        href="/auth/register/vendor"
                        onClick={onClose}
                        className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-gradient-to-r from-[#FFA726] to-[#FF9800] text-white rounded-lg hover:shadow-lg transition-all duration-200"
                    >
                        <Briefcase size={20} />
                        <span className="font-semibold">Become a Vendor</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

// Mobile Nav Item
const MobileNavItem = ({ item, pathname, onClose }) => {
    const [isOpen, setIsOpen] = useState(false);
    const Icon = item.icon;
    const isCurrentPath = isActivePath(pathname, item.path);

    const itemClasses = `flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all duration-200 ${isCurrentPath ? 'bg-[#F5F5F5] text-[#7CB342]' : 'hover:bg-[#F5F5F5] hover:text-[#7CB342]'
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
                <div className={`ml-8 space-y-1 overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[500px] mt-2' : 'max-h-0'}`}>
                    {item.dropdown.map((dropdownItem) => {
                        const DropIcon = dropdownItem.icon;
                        const isDropCurrentPath = isActivePath(pathname, dropdownItem.path);

                        return (
                            <Link
                                key={dropdownItem.id}
                                href={dropdownItem.path}
                                onClick={onClose}
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

// Search Overlay
const SearchOverlay = ({ isOpen, onClose, searchQuery, onSearchQueryChange, searchResults, onSearch }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100]">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            {/* Search Container */}
            <div className="relative z-10 flex items-start justify-center pt-20 px-4">
                <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl">
                    {/* Search Input */}
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center space-x-4">
                            <Search size={24} className="text-[#7CB342] flex-shrink-0" />
                            <input
                                type="text"
                                placeholder="Search for seeds, fertilizers, equipment, and more..."
                                className="flex-1 text-lg outline-none text-gray-700 placeholder-gray-400"
                                value={searchQuery}
                                onChange={(e) => onSearchQueryChange(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && onSearch()}
                                autoFocus
                            />
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
                                aria-label="Close search"
                            >
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>
                        <button
                            onClick={onSearch}
                            className="mt-4 w-full py-3 bg-gradient-to-r from-[#7CB342] to-[#558B2F] text-white rounded-lg hover:shadow-lg transition-all duration-200 font-semibold"
                        >
                            Search
                        </button>
                    </div>

                    {/* Search Results */}
                    <div className="max-h-96 overflow-y-auto">
                        {searchResults.length > 0 ? (
                            <div className="p-4 space-y-2">
                                <p className="text-sm text-gray-500 px-2 mb-3">
                                    Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                                </p>
                                {searchResults.map((result) => (
                                    <Link
                                        key={result.id}
                                        href={`/product/${result.id}`}
                                        onClick={onClose}
                                        className="flex items-center justify-between p-4 rounded-lg hover:bg-[#F5F5F5] transition-all duration-200 group"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-[#F5F5F5] to-[#E8F5E9] rounded-lg flex items-center justify-center">
                                                <Package size={24} className="text-[#7CB342]" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800 group-hover:text-[#7CB342] transition-colors">
                                                    {result.name}
                                                </p>
                                                <p className="text-sm text-gray-500">{result.category}</p>
                                            </div>
                                        </div>
                                        <p className="font-bold text-[#7CB342]">{result.price}</p>
                                    </Link>
                                ))}
                            </div>
                        ) : searchQuery && searchResults.length === 0 ? (
                            <div className="p-8 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search size={32} className="text-gray-400" />
                                </div>
                                <p className="text-gray-600 font-medium">No results found</p>
                                <p className="text-sm text-gray-400 mt-2">Try searching with different keywords</p>
                            </div>
                        ) : (
                            <div className="p-8 text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#E8F5E9] to-[#C5E1A5] rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search size={32} className="text-[#7CB342]" />
                                </div>
                                <p className="text-gray-600 font-medium mb-4">Popular Searches</p>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {['Seeds', 'Fertilizers', 'Equipment', 'Organic', 'Irrigation'].map((tag) => (
                                        <button
                                            key={tag}
                                            onClick={() => {
                                                onSearchQueryChange(tag);
                                                onSearch();
                                            }}
                                            className="px-4 py-2 bg-[#F5F5F5] hover:bg-[#7CB342] hover:text-white rounded-full text-sm font-medium transition-all duration-200"
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;