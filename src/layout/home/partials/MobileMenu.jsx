'use client'

import { memo } from 'react';
import { BriefcaseBusiness } from 'lucide-react';
import MobileNavItem from './MobileNavItem';
import Animation from '@/components/common/Animation';
import TextBadge from '@/components/ui/TextBadge';

// Constants
const MENU_CONFIG = {
    headerHeight: '108px',
    animation: 'fade-up',
    zIndex: 'z-50',
};

const VendorCTA = memo(() => (
    <div className="py-3 my-2 border-t border-b border-gray-100">
        <TextBadge
            href="/become-a-vendor"
            className="w-full block"
            size="md"
            color="orange"
            startIcon={<BriefcaseBusiness />}
        >
            Become a Vendor
        </TextBadge>
    </div>
));

VendorCTA.displayName = 'VendorCTA';

const NavigationItems = memo(({ items, pathname, onClose }) => {
    if (!items || items.length === 0) return null;

    return (
        <nav className="w-full" role="navigation" aria-label="Main navigation">
            <div className="flex flex-col" style={{ gap: '0.5rem' }}>
                {items.map((item) => (
                    <div key={item.id} className="w-full">
                        <MobileNavItem
                            item={item}
                            pathname={pathname}
                            onClose={onClose}
                        />
                    </div>
                ))}
            </div>
        </nav>
    );
});

NavigationItems.displayName = 'NavigationItems';

const MobileMenu = ({
    isOpen,
    items = [],
    onClose,
    pathname,
}) => {

    if (!isOpen) return null;

    return (
        <>
            {/* Mobile Menu */}
            <Animation
                animation={MENU_CONFIG.animation}
                className={`xl:hidden bg-white border-t border-gray-100 shadow-lg fixed left-0 right-0 ${MENU_CONFIG.zIndex}`}
                style={{ top: MENU_CONFIG.headerHeight }}
                role="dialog"
                aria-label="Mobile menu"
                aria-modal="true"
            >
                <div
                    className="overflow-y-auto overflow-x-hidden"
                    style={{
                        maxHeight: 'calc(100vh - 108px)',
                        WebkitOverflowScrolling: 'touch'
                    }}
                >
                    <div className="container mx-auto px-4 pt-4 pb-10">
                        <div className="flex flex-col" style={{ gap: '0.5rem' }}>

                            <VendorCTA />

                            <NavigationItems
                                items={items}
                                pathname={pathname}
                                onClose={onClose}
                            />
                        </div>
                    </div>
                </div>
            </Animation>
        </>
    );
};

export default memo(MobileMenu);