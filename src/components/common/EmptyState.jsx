'use client'

import { ShoppingCart } from "lucide-react";
import IconBadge from "../ui/IconBadge";

/**
 * EmptyState Component
 * 
 * A reusable component for displaying empty states across the application
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.icon - Icon component to display (e.g., <ShoppingCart />)
 * @param {string} props.title - Main heading text
 * @param {string} props.description - Descriptive text explaining the empty state
 * @param {string} [props.iconColor='red'] - Color of the icon badge ('red', 'green', 'blue', 'yellow', 'purple', 'gray')
 * @param {string} [props.iconSize='2xl'] - Size of the icon badge ('sm', 'md', 'lg', 'xl', '2xl')
 * @param {string} [props.iconShape='circle'] - Shape of the icon badge ('circle', 'square', 'rounded')
 * @param {string} [props.className] - Additional CSS classes for the container
 * @param {React.ReactNode} [props.children] - Custom content to render below description
 * @param {number} [props.maxDescriptionWidth=28] - Maximum width for description in rem units
 */
const EmptyState = ({
    title = "No items found",
    description = "There are no items to display at the moment.",
    iconBadge = null,
    actionButton = null,
    className = '',
    children,
    maxDescriptionWidth = 28,
}) => {

    return (
        <div className={`flex flex-col items-center justify-center my-10 space-y-4 p-4 ${className}`}>
            {iconBadge && (
                <div>
                    {iconBadge}
                </div>
            )}

            <h2 className="text-xl font-bold text-gray-900 text-center">
                {title}
            </h2>

            <p
                className="text-gray-500 text-base text-center"
                style={{ maxWidth: `${maxDescriptionWidth}rem` }}
            >
                {description}
            </p>

            {/* Custom children content */}
            {children && (
                <div className="w-full max-w-md">
                    {children}
                </div>
            )}

            {actionButton && (
                <div>
                    {actionButton}
                </div>
            )}
        </div>
    );
};

export default EmptyState;