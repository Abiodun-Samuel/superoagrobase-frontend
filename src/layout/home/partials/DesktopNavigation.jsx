'use client'

import NavItem from "./NavItem";

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

export default DesktopNavigation