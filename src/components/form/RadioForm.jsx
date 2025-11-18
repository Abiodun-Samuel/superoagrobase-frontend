import { memo } from "react";

const RadioForm = memo(({
    label,
    name,
    register,
    error,
    required = false,
    options = [],
    validationRules = {},
    disabled = false,
    description,
    layout = "vertical" // "vertical" | "horizontal" | "grid"
}) => {
    const validation = {
        required: required ? `${label || name} is required` : false,
        ...validationRules
    };

    const layoutClasses = {
        vertical: "flex flex-col gap-2",
        horizontal: "flex flex-wrap gap-3",
        grid: "grid grid-cols-1 sm:grid-cols-2 gap-3"
    };

    return (
        <fieldset disabled={disabled}>
            {label && (
                <legend className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                    {label}
                    {required && (
                        <span className="text-red-500 ml-0.5 font-bold">*</span>
                    )}
                </legend>
            )}

            {description && (
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    {description}
                </p>
            )}

            <div
                className={layoutClasses[layout]}
                role="radiogroup"
                aria-labelledby={label ? `${name}-label` : undefined}
                aria-required={required}
            >
                {options.map((option) => {
                    const isDisabled = disabled || option.disabled;

                    return (
                        <label
                            key={option.value}
                            className={`
                                group relative flex items-start gap-3 py-2.5 px-3 rounded-xl
                                border transition-all duration-200 ease-out
                                ${isDisabled
                                    ? 'cursor-not-allowed opacity-50 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                                    : 'cursor-pointer hover:shadow-md hover:-translate-y-0.5 hover:border-blue-500/50 dark:hover:border-cyan-400/50'
                                }
                                bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700
                                has-[:checked]:bg-gradient-to-br has-[:checked]:from-blue-50 has-[:checked]:to-blue-100 
                                dark:has-[:checked]:from-cyan-950/40 dark:has-[:checked]:to-teal-900/30
                                has-[:checked]:border-blue-500 dark:has-[:checked]:border-cyan-400
                                has-[:checked]:shadow-sm has-[:checked]:shadow-blue-500/20 dark:has-[:checked]:shadow-cyan-400/20
                            `}
                        >
                            <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                                <input
                                    type="radio"
                                    value={option.value}
                                    {...(register ? register(name, validation) : {})}
                                    disabled={isDisabled}
                                    className="sr-only peer"
                                    aria-describedby={error ? `${name}-error` : undefined}
                                    aria-label={option.label}
                                />

                                <div className={`
                                    w-4 h-4 sm:w-5 sm:h-5 rounded-full border
                                    flex items-center justify-center
                                    transition-all duration-200 ease-out
                                    border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700
                                    peer-checked:border-blue-500 dark:peer-checked:border-cyan-400
                                    peer-checked:bg-blue-500 dark:peer-checked:bg-cyan-400
                                    peer-checked:shadow-md peer-checked:shadow-blue-500/30 dark:peer-checked:shadow-cyan-400/30
                                    peer-focus:ring-4 peer-focus:ring-blue-500/20 dark:peer-focus:ring-cyan-400/20
                                    ${!isDisabled && 'group-hover:border-blue-500 dark:group-hover:border-cyan-400 group-hover:shadow-sm'}
                                `}>
                                    <div className="
                                        w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white 
                                        scale-0 opacity-0 peer-checked:scale-100 peer-checked:opacity-100 
                                        transition-all duration-200 ease-out
                                    " />
                                </div>

                                <div className="absolute inset-0 rounded-full peer-focus:animate-ping peer-focus:bg-blue-500/20 pointer-events-none" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="text-sm sm:text-base font-medium transition-colors duration-200 text-gray-500 dark:text-gray-200 peer-has-[:checked]:text-blue-600 dark:peer-has-[:checked]:text-blue-400">
                                    {option.label}
                                </div>

                                {option.description && (
                                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                                        {option.description}
                                    </div>
                                )}
                            </div>

                            <div className="shrink-0 mt-0.5 opacity-0 scale-0 has-[:checked]:opacity-100 has-[:checked]:scale-100 transition-all duration-200">
                                <svg
                                    className="w-5 h-5 text-blue-600 dark:text-blue-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2.5}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                        </label>
                    );
                })}
            </div>

            {error && (
                <p id={`${name}-error`} className="text-red-500 text-xs mt-2 animate-slide-down" role="alert">
                    {error}
                </p>
            )}

            <style>{`
                @keyframes slide-down {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-slide-down {
                    animation: slide-down 0.3s ease-out;
                }
            `}</style>
        </fieldset>
    );
});

RadioForm.displayName = "RadioForm";
export default RadioForm;