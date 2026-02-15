'use client'

import { forwardRef } from 'react';

const DashboardSection = forwardRef(({
    children,
    spacing = 'normal',
    className = '',
    fullHeight = false,
    ...props
}, ref) => {

    const spacings = {
        tight: 'space-y-4',
        normal: 'space-y-6',
        relaxed: 'space-y-8',
        loose: 'space-y-12'
    };
    // Combine classes
    const sectionClasses = [
        spacings[spacing] || spacings.normal,
        fullHeight ? 'h-full' : '',
        className
    ].filter(Boolean).join(' ');

    return (
        <div
            ref={ref}
            className={`${sectionClasses} mx-auto space-y-10 my-10 max-w-(--breakpoint-2xl)`}
            {...props}
        >
            {children}
        </div>
    );
});

DashboardSection.displayName = 'DashboardSection';
export default DashboardSection;