import { memo, useState, useEffect } from "react";

/**
 * RadioSelectForm - A modern radio group component with optional "Other" field
 * Perfect for forms with react-hook-form and yup validation
 * 
 * @component
 * @example
 * <RadioSelectForm
 *   label="How did you hear about us?"
 *   name="referralSource"
 *   register={register}
 *   setValue={setValue}
 *   watch={watch}
 *   error={errors.referralSource?.message}
 *   required
 *   options={[
 *     { id: "google", name: "Google Search" },
 *     { id: "friend", name: "Friend Referral" }
 *   ]}
 *   enableOther
 *   otherLabel="Other (please specify)"
 *   otherPlaceholder="Tell us how you found us"
 * />
 */
const RadioSelectForm = memo(({
    label,
    name,
    register,
    setValue,
    watch,
    error,
    required = false,
    options = [],
    validationRules = {},
    disabled = false,
    description,
    layout = "vertical", // "vertical" | "horizontal" | "grid"
    enableOther = false,
    otherLabel = "Other",
    otherPlaceholder = "Please specify",
    otherMinLength = 2,
    otherRequired = true,
    className = ""
}) => {
    const [otherValue, setOtherValue] = useState("");

    // Watch the current value if watch is provided
    const currentValue = watch ? watch(name) : null;
    const isOtherSelected = currentValue === "other";

    // Sync otherValue with form state on mount/change
    useEffect(() => {
        if (watch && isOtherSelected) {
            const otherTextValue = watch(`${name}_other_text`);
            if (otherTextValue && otherTextValue !== otherValue) {
                setOtherValue(otherTextValue);
            }
        }
    }, [watch, name, isOtherSelected, otherValue]);

    // Validation rules
    const validation = {
        required: required ? `${label || name} is required` : false,
        ...validationRules
    };

    const layoutClasses = {
        vertical: "flex flex-col gap-2.5",
        horizontal: "flex flex-wrap gap-3",
        grid: "grid grid-cols-1 sm:grid-cols-2 gap-3"
    };

    // Handle other input change
    const handleOtherInputChange = (e) => {
        const value = e.target.value;
        setOtherValue(value);

        // Update the hidden field value for form submission
        if (setValue) {
            setValue(`${name}_other_text`, value, {
                shouldValidate: true,
                shouldDirty: true
            });
        }
    };

    // Auto-select "other" radio when typing in other field
    const handleOtherInputFocus = () => {
        if (setValue && !isOtherSelected) {
            setValue(name, "other", {
                shouldValidate: false,
                shouldDirty: true
            });
        }
    };

    // Handle blur to trigger validation
    const handleOtherInputBlur = () => {
        // Trigger validation when leaving the other input field
        if (setValue && isOtherSelected) {
            setValue(`${name}_other_text`, otherValue, {
                shouldValidate: true,
                shouldDirty: true
            });
        }
    };

    // Register the hidden "other" text field
    useEffect(() => {
        if (register && enableOther) {
            register(`${name}_other_text`);
        }
    }, [register, name, enableOther]);

    // Get the error for the other text field
    const otherFieldError = error || (watch && watch(`${name}_other_text_error`));

    return (
        <fieldset disabled={disabled} className={`mb-6 ${className}`}>
            {/* Label Section */}
            {label && (
                <legend className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                    {label}
                    {required && (
                        <span className="text-red-500 dark:text-red-400 ml-1.5 font-bold" aria-label="required">*</span>
                    )}
                </legend>
            )}

            {/* Description */}
            {description && (
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    {description}
                </p>
            )}

            {/* Radio Options */}
            <div
                className={layoutClasses[layout]}
                role="radiogroup"
                aria-labelledby={label ? `${name}-label` : undefined}
                aria-required={required}
            >
                {/* Regular Options */}
                {options.map((option) => {
                    const isDisabled = disabled || option.disabled;

                    return (
                        <label
                            key={option.id}
                            className={`
                                group relative flex items-start gap-3 py-2.5 px-4 rounded-xl
                                border transition-all duration-200 ease-out
                                ${isDisabled
                                    ? 'cursor-not-allowed opacity-50 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                                    : 'cursor-pointer hover:shadow-md hover:-translate-y-0.5 hover:border-blue-500/50 dark:hover:border-cyan-400/50'
                                }
                                bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700
                                has-[:checked]:bg-gradient-to-br has-[:checked]:from-blue-50 has-[:checked]:to-blue-100 
                                dark:has-[:checked]:from-cyan-950/40 dark:has-[:checked]:to-teal-900/30
                                has-[:checked]:border-blue-500 dark:has-[:checked]:border-cyan-400
                                has-[:checked]:shadow has-[:checked]:shadow-blue-100/25 dark:has-[:checked]:shadow-cyan-100/20
                            `}
                        >
                            {/* Custom Radio Button */}
                            <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                                <input
                                    type="radio"
                                    value={option.id}
                                    {...(register ? register(name, validation) : {})}
                                    disabled={isDisabled}
                                    className="sr-only peer"
                                    aria-describedby={error ? `${name}-error` : undefined}
                                    aria-label={option.name}
                                />

                                {/* Outer Circle */}
                                <div className={`
                                    w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2
                                    flex items-center justify-center
                                    transition-all duration-200 ease-out
                                    border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700
                                    peer-checked:border-blue-500 peer-checked:bg-blue-500 
                                    dark:peer-checked:border-cyan-400 dark:peer-checked:bg-cyan-400
                                    peer-checked:shadow-lg peer-checked:shadow-blue-500/40
                                    dark:peer-checked:shadow-cyan-400/40
                                    peer-focus:ring-4 peer-focus:ring-blue-500/20 dark:peer-focus:ring-cyan-400/20
                                    ${!isDisabled && 'group-hover:border-blue-500 dark:group-hover:border-cyan-400 group-hover:shadow-sm'}
                                `}>
                                    {/* Inner Circle - Animated */}
                                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white scale-0 opacity-0 peer-checked:scale-100 peer-checked:opacity-100 transition-all duration-200 ease-out" />
                                </div>

                                {/* Ripple effect on focus */}
                                <div className="absolute inset-0 rounded-full peer-focus:animate-ping peer-focus:bg-blue-500/20 dark:peer-focus:bg-cyan-400/20 pointer-events-none" />
                            </div>

                            {/* Label Content */}
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold transition-colors duration-200 text-gray-600 dark:text-gray-200 peer-has-[:checked]:text-blue-600 dark:peer-has-[:checked]:text-cyan-300">
                                    {option.name}
                                </div>

                                {option.description && (
                                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                                        {option.description}
                                    </div>
                                )}
                            </div>

                            {/* Check Icon for selected state */}
                            <div className="shrink-0 mt-0.5 opacity-0 scale-0 has-[:checked]:opacity-100 has-[:checked]:scale-100 transition-all duration-200">
                                <svg
                                    className="w-5 h-5 text-blue-600 dark:text-cyan-300"
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

                {/* Other Option with Text Input */}
                {enableOther && (
                    <div
                        className={`
                            group relative rounded-xl border-2 transition-all duration-200 ease-out
                            ${disabled
                                ? 'cursor-not-allowed opacity-50 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                                : 'hover:shadow-md hover:-translate-y-0.5'
                            }
                            bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700
                            ${isOtherSelected
                                ? 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-cyan-950/40 dark:to-teal-900/30 border-blue-500 dark:border-cyan-100 shadow'
                                : 'hover:border-blue-500/50 dark:hover:border-cyan-400/50'
                            }
                        `}
                    >
                        {/* Radio button part */}
                        <label className="flex items-start gap-3 py-2.5 px-4 cursor-pointer">
                            <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                                <input
                                    type="radio"
                                    value="other"
                                    {...(register ? register(name, validation) : {})}
                                    disabled={disabled}
                                    className="sr-only peer"
                                    aria-describedby={error ? `${name}-error` : undefined}
                                    aria-label={otherLabel}
                                />

                                {/* Outer Circle */}
                                <div className={`
                                    w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2
                                    flex items-center justify-center
                                    transition-all duration-200 ease-out
                                    border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700
                                    peer-checked:border-blue-500 peer-checked:bg-blue-500 
                                    dark:peer-checked:border-cyan-400 dark:peer-checked:bg-cyan-400
                                    peer-checked:shadow-lg peer-checked:shadow-blue-500/40
                                    dark:peer-checked:shadow-cyan-400/40
                                    peer-focus:ring-4 peer-focus:ring-blue-500/20 dark:peer-focus:ring-cyan-400/20
                                    ${!disabled && 'group-hover:border-blue-500 dark:group-hover:border-cyan-400'}
                                `}>
                                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white scale-0 opacity-0 peer-checked:scale-100 peer-checked:opacity-100 transition-all duration-200 ease-out" />
                                </div>

                                <div className="absolute inset-0 rounded-full peer-focus:animate-ping peer-focus:bg-blue-500/20 dark:peer-focus:bg-cyan-400/20 pointer-events-none" />
                            </div>

                            {/* Other Label */}
                            <div className="flex-1 min-w-0">
                                <div className={`text-sm font-semibold transition-colors duration-200 ${isOtherSelected ? 'text-blue-600 dark:text-cyan-300' : 'text-gray-600 dark:text-gray-200'}`}>
                                    {otherLabel}
                                </div>
                            </div>

                            {/* Check Icon */}
                            {isOtherSelected && (
                                <div className="shrink-0 mt-0.5 animate-scale-in">
                                    <svg
                                        className="w-5 h-5 text-blue-600 dark:text-cyan-300"
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
                            )}
                        </label>

                        {/* Text Input Part - Always visible but only required when "other" is selected */}
                        <div className="px-4 pb-3">
                            <input
                                type="text"
                                value={otherValue}
                                onChange={handleOtherInputChange}
                                onFocus={handleOtherInputFocus}
                                onBlur={handleOtherInputBlur}
                                disabled={disabled}
                                className={`
                                    w-full px-4 py-2.5 text-sm rounded-lg
                                    border-2 transition-all duration-200
                                    bg-white dark:bg-gray-900
                                    text-gray-800 dark:text-gray-200
                                    placeholder:text-gray-400 dark:placeholder:text-gray-500
                                    ${isOtherSelected
                                        ? 'border-blue-500 dark:border-cyan-400 ring-4 ring-blue-500/10 dark:ring-cyan-400/10'
                                        : 'border-gray-300 dark:border-gray-600'
                                    }
                                    ${error && isOtherSelected && !otherValue.trim()
                                        ? 'border-red-500 dark:border-red-400 ring-red-500/10 dark:ring-red-400/10'
                                        : ''
                                    }
                                    focus:border-blue-500 dark:focus:border-cyan-400
                                    focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-cyan-400/10
                                    focus:outline-none
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                `}
                                placeholder={otherPlaceholder}
                                aria-label={`${otherLabel} text input`}
                                aria-required={otherRequired && isOtherSelected}
                                aria-invalid={error && isOtherSelected && !otherValue.trim()}
                            />
                            {isOtherSelected && (
                                <div className="mt-1.5">
                                    {otherValue ? (
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            {otherValue.length} character{otherValue.length !== 1 ? 's' : ''}
                                            {otherMinLength > 0 && otherValue.length < otherMinLength && (
                                                <span className="text-amber-600 dark:text-amber-400 ml-1">
                                                    (minimum {otherMinLength} required)
                                                </span>
                                            )}
                                        </p>
                                    ) : otherRequired ? (
                                        <p className="text-xs text-red-500 dark:text-red-400">
                                            This field is required
                                        </p>
                                    ) : (
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Optional
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <p id={`${name}-error`} className="text-red-500 text-xs mt-2 animate-slide-down" role="alert">
                    {error}
                </p>
            )}

            <style>{`
                @keyframes scale-in {
                    from {
                        transform: scale(0) rotate(-180deg);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1) rotate(0deg);
                        opacity: 1;
                    }
                }
                
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
                
                .animate-scale-in {
                    animation: scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                
                .animate-slide-down {
                    animation: slide-down 0.3s ease-out;
                }
            `}</style>
        </fieldset>
    );
});

RadioSelectForm.displayName = "RadioSelectForm";
export default RadioSelectForm;