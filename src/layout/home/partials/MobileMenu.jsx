'use client'

import { memo } from 'react';
import { BriefcaseBusiness } from 'lucide-react';
import MobileNavItem from './MobileNavItem';
import Animation from '@/components/common/Animation';
import TextBadge from '@/components/ui/TextBadge';

const VendorCTA = memo(() => (
    <div className="py-3 mb-2 border-b border-gray-100">
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
            <div
                className={`xl:hidden bg-white border-t border-gray-100 shadow-lg fixed left-0 right-0 z-50`}
                role="dialog"
                aria-label="Mobile menu"
                aria-modal="true"
            >
                <div
                    className="overflow-y-auto overflow-x-hidden"
                >
                    <div className="container mx-auto px-4 pb-8">
                        <Animation animation={'fade-up'} className="flex flex-col" style={{ gap: '0.5rem' }}>
                            <VendorCTA />
                            <NavigationItems
                                items={items}
                                pathname={pathname}
                                onClose={onClose}
                            />
                        </Animation>
                    </div>
                </div>
            </div>
        </>
    );
};

export default memo(MobileMenu);