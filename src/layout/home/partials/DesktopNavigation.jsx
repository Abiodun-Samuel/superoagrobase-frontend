'use client'

import NavItem from "./NavItem";
import Button from "@/components/ui/Button";

const DesktopNavigation = ({ items, activeDropdown, onToggleDropdown, pathname }) => (
    <nav className="hidden xl:flex items-center space-x-1.5 flex-1 justify-center">
        {items.map((item) => (
            <NavItem
                key={item.id}
                item={item}
                isActive={activeDropdown === item.id}
                onToggle={() => item.dropdown && onToggleDropdown(item.id)}
                pathname={pathname}
            />
        ))}
        <Button color='orange' href='/become-a-vendor'>Become a Vendor</Button>
    </nav>
);

export default DesktopNavigation