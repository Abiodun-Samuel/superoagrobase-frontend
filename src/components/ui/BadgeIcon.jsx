const BadgeIcon = ({
    variant = "light",
    color = "white",
    size = "md",
    icon,
    className
}) => {
    const baseStyles =
        "inline-flex items-center justify-center font-semibold rounded-lg";

    const sizeStyles = {
        sm: "p-1 text-xs",
        md: "p-2 text-sm",
        lg: "p-3 text-base",
    };

    const iconSizes = {
        sm: "w-3 h-3",
        md: "w-4 h-4",
        lg: "w-5 h-5",
    };

    const variants = {
        light: {
            green: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
            darkGreen:
                "bg-[#558B2F]/10 text-[#558B2F] dark:bg-[#558B2F]/20 dark:text-[#7CB342]",
            lightGreen:
                "bg-[#9CCC65]/15 text-[#558B2F] dark:bg-[#9CCC65]/25 dark:text-[#9CCC65]",
            orange:
                "bg-[#FFA726]/10 text-[#F57C00] dark:bg-[#FFA726]/20 dark:text-[#FFA726]",
            gray:
                "bg-[#757575]/10 text-[#2E2E2E] dark:bg-[#757575]/20 dark:text-[#F5F5F5]",
            red: "bg-[#EF5350]/10 text-[#C62828] dark:bg-[#EF5350]/20 dark:text-[#EF5350]",

            white: "bg-white text-[#2E2E2E] dark:bg-white/10 dark:text-white",
        },

        solid: {
            green: "bg-green-600 text-white",
            darkGreen: "bg-[#558B2F] text-white",
            lightGreen: "bg-[#9CCC65] text-[#2E2E2E]",
            orange: "bg-[#FFA726] text-white",
            gray: "bg-[#757575] text-white",
            red: "bg-[#EF5350] text-white",

            white: "bg-white text-[#2E2E2E] dark:bg-white dark:text-[#2E2E2E]",
        },
    };

    const colorStyles = variants[variant][color];
    const sizeClass = sizeStyles[size];
    const iconClass = iconSizes[size];

    return (
        <span className={`${baseStyles} ${sizeClass} ${colorStyles} ${className}`}>
            {icon && (
                <span className={`flex ${iconClass}`}>
                    {icon}
                </span>
            )}
        </span>
    );
};

export default BadgeIcon;
