'use client'

import { memo, useCallback, useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { isActivePath } from '@/utils/helper';

// Constants
const STYLES = {
    colors: {
        active: 'bg-gray-100 text-green-600',
        inactive: 'text-gray-700 hover:bg-gray-100 hover:text-green-600',
        dropdownActive: 'bg-[#F5F5F5] text-[#7CB342]',
        dropdownInactive: 'text-gray-700 hover:bg-[#F5F5F5] hover:text-[#7CB342]',
    },
    transition: 'transition-all duration-200',
    dropdownTransition: 'transition-all duration-300 ease-in-out',
};

// Sub-components
const NavItemIcon = memo(({ Icon, size = 20 }) => (
    <Icon size={size} aria-hidden="true" style={{ flexShrink: 0 }} />
));
NavItemIcon.displayName = 'NavItemIcon';

const NavItemContent = memo(({ icon: Icon, label, iconSize = 20 }) => (
    <div className="flex items-center flex-1" style={{ gap: '0.75rem' }}>
        <NavItemIcon Icon={Icon} size={iconSize} />
        <span className="font-medium" style={{ lineHeight: '1.5' }}>{label}</span>
    </div>
));
NavItemContent.displayName = 'NavItemContent';

const DropdownIndicator = memo(({ isOpen }) => (
    <ChevronDown
        size={16}
        className={`transform ${STYLES.dropdownTransition} ${isOpen ? 'rotate-180' : 'rotate-0'}`}
        aria-hidden="true"
        style={{ flexShrink: 0, marginLeft: '0.5rem' }}
    />
));
DropdownIndicator.displayName = 'DropdownIndicator';

const DropdownItem = memo(({ item, pathname, onClose }) => {
    const Icon = item.icon;
    const isActive = isActivePath(pathname, item.path);

    const linkClasses = [
        'flex items-center px-4 py-2 rounded-xl text-sm w-full',
        STYLES.transition,
        isActive ? STYLES.colors.dropdownActive : STYLES.colors.dropdownInactive,
    ].join(' ');

    return (
        <Link
            href={item.path}
            onClick={onClose}
            className={linkClasses}
            aria-current={isActive ? 'page' : undefined}
            style={{ gap: '0.75rem', display: 'flex' }}
        >
            <NavItemIcon Icon={Icon} size={16} />
            <span style={{ lineHeight: '1.5' }}>{item.label}</span>
        </Link>
    );
});
DropdownItem.displayName = 'DropdownItem';

const DropdownMenu = memo(({ items, isOpen, pathname, onClose }) => {
    if (!items || items.length === 0) return null;

    return (
        <div
            className={`overflow-hidden ${STYLES.dropdownTransition}`}
            style={{
                maxHeight: isOpen ? '500px' : '0',
                marginTop: isOpen ? '0.5rem' : '0',
                marginLeft: '2rem',
                opacity: isOpen ? 1 : 0,
            }}
            aria-hidden={!isOpen}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {items.map((dropdownItem) => (
                    <DropdownItem
                        key={dropdownItem.id}
                        item={dropdownItem}
                        pathname={pathname}
                        onClose={onClose}
                    />
                ))}
            </div>
        </div>
    );
});
DropdownMenu.displayName = 'DropdownMenu';

const NavButton = memo(({ item, isActive, isOpen, onClick }) => {
    const buttonClasses = [
        'flex items-center w-full px-4 py-3 rounded-xl text-left',
        STYLES.transition,
        isActive ? STYLES.colors.active : STYLES.colors.inactive,
    ].join(' ');

    return (
        <button
            onClick={onClick}
            className={buttonClasses}
            aria-expanded={isOpen}
            aria-haspopup="true"
            type="button"
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
            <NavItemContent icon={item.icon} label={item.label} />
            <DropdownIndicator isOpen={isOpen} />
        </button>
    );
});
NavButton.displayName = 'NavButton';

const NavLink = memo(({ item, isActive, onClose }) => {
    const linkClasses = [
        'flex items-center w-full px-4 py-3 rounded-xl',
        STYLES.transition,
        isActive ? STYLES.colors.active : STYLES.colors.inactive,
    ].join(' ');

    return (
        <Link
            href={item.path}
            onClick={onClose}
            className={linkClasses}
            aria-current={isActive ? 'page' : undefined}
            style={{ display: 'flex', textDecoration: 'none' }}
        >
            <NavItemContent icon={item.icon} label={item.label} />
        </Link>
    );
});
NavLink.displayName = 'NavLink';

// Main Component
const MobileNavItem = ({ item, pathname, onClose }) => {
    const [isOpen, setIsOpen] = useState(false);

    const isActive = isActivePath(pathname, item.path);
    const hasDropdown = Boolean(item.dropdown && item.dropdown.length > 0);

    const handleToggle = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    const handleClose = useCallback(() => {
        onClose?.();
    }, [onClose]);

    return (
        <div style={{ width: '100%', display: 'block', minHeight: '1px' }}>
            {hasDropdown ? (
                <>
                    <NavButton
                        item={item}
                        isActive={isActive}
                        isOpen={isOpen}
                        onClick={handleToggle}
                    />
                    <DropdownMenu
                        items={item.dropdown}
                        isOpen={isOpen}
                        pathname={pathname}
                        onClose={handleClose}
                    />
                </>
            ) : (
                <NavLink
                    item={item}
                    isActive={isActive}
                    onClose={handleClose}
                />
            )}
        </div>
    );
};

export default memo(MobileNavItem);