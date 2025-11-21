import { ROLE_CONFIG } from '@/utils/data';

const RoleBadge = ({
    role = 'user',
    size = 'md',
    variant = 'light',
    showIcon = true,
    className = ''
}) => {
    const baseStyles = "inline-flex items-center justify-center gap-1.5 rounded-full font-semibold border-2 transition-all duration-200";

    const sizeStyles = {
        xs: "text-xs px-2 py-0.5",
        sm: "text-xs px-3 py-1",
        md: "text-sm px-4 py-1.5",
        lg: "text-base px-5 py-2",
        xl: "text-lg px-6 py-2.5",
    };

    const iconSizes = {
        xs: 10,
        sm: 12,
        md: 14,
        lg: 16,
        xl: 18,
    };

    const variants = {
        light: {
            purple: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-700/50",
            blue: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700/50",
            orange: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-700/50",
            gray: "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-600/50",
        },

        solid: {
            purple: "bg-gradient-to-r from-purple-600 to-purple-700 text-white border-purple-500 dark:from-purple-500 dark:to-purple-600 dark:border-purple-400 shadow-sm",
            blue: "bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-500 dark:from-blue-500 dark:to-blue-600 dark:border-blue-400 shadow-sm",
            orange: "bg-gradient-to-r from-orange-600 to-orange-700 text-white border-orange-500 dark:from-orange-500 dark:to-orange-600 dark:border-orange-400 shadow-sm",
            gray: "bg-gradient-to-r from-gray-600 to-gray-700 text-white border-gray-500 dark:from-gray-500 dark:to-gray-600 dark:border-gray-400 shadow-sm",
        },
    };

    const normalizedRole = role.toLowerCase().trim();
    const config = ROLE_CONFIG[normalizedRole] || ROLE_CONFIG['user'];
    const Icon = config.icon;

    const selectedVariant = variant || config.variant;

    const sizeClass = sizeStyles[size];
    const colorStyles = variants[selectedVariant][config.color];
    const iconSize = iconSizes[size];

    return (
        <span className={`${baseStyles} ${sizeClass} ${colorStyles} ${className}`}>
            {showIcon && <Icon size={iconSize} className="flex-shrink-0" />}
            <span className="font-medium">{config.label}</span>
        </span>
    );
};
export default RoleBadge