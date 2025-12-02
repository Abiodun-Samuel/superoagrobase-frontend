import { useState } from 'react';
import {
    CheckCircle2,
    XCircle,
    AlertCircle,
    Info,
    X
} from 'lucide-react';

const Alert = ({
    variant,
    message = null,
    error = null,
    onClose,
    dismissible = true,
    className = '',
    actionButton = null,
    showIcon = true,
}) => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    const handleDismiss = () => {
        setIsVisible(false);
        onClose?.();
    };

    const activeVariant = variant || (error ? 'error' : 'info');

    // Variant configurations
    const variantConfig = {
        success: {
            container: 'bg-green-50 border-green-200 text-green-900',
            icon: CheckCircle2,
            iconColor: 'text-green-600',
            titleColor: 'text-green-900',
            messageColor: 'text-green-800',
            closeHover: 'hover:bg-green-100',
        },
        error: {
            container: 'bg-red-50 border-red-200 text-red-900',
            icon: XCircle,
            iconColor: 'text-red-600',
            titleColor: 'text-red-900',
            messageColor: 'text-red-800',
            closeHover: 'hover:bg-red-100',
        },
        warning: {
            container: 'bg-yellow-50 border-yellow-200 text-yellow-900',
            icon: AlertCircle,
            iconColor: 'text-yellow-600',
            titleColor: 'text-yellow-900',
            messageColor: 'text-yellow-800',
            closeHover: 'hover:bg-yellow-100',
        },
        info: {
            container: 'bg-blue-50 border-blue-200 text-blue-900',
            icon: Info,
            iconColor: 'text-blue-600',
            titleColor: 'text-blue-900',
            messageColor: 'text-blue-800',
            closeHover: 'hover:bg-blue-100',
        },
    };

    const config = variantConfig[activeVariant] || variantConfig.info;
    const IconComponent = config.icon;

    // Extract message and errors from error object or use direct message prop
    const displayMessage = message || error?.response?.data?.message || error?.message;
    const errorDetails = error?.response?.data?.errors;
    const hasErrors = errorDetails && Object.keys(errorDetails).length > 0;

    // Don't render if no message and no errors
    if (!displayMessage && !hasErrors) return null;

    return (
        <div
            className={`
                relative flex gap-3 p-4 rounded-lg border
                ${config.container}
                ${dismissible ? 'pr-10' : ''}
                ${className}
            `.trim().replace(/\s+/g, ' ')}
            role="alert"
            aria-live="polite"
        >
            {/* Close button */}
            {dismissible && (
                <button
                    type="button"
                    onClick={handleDismiss}
                    className={`
                        absolute top-3 right-3 p-1 rounded-md transition-colors
                        ${config.closeHover}
                        focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-current
                    `.trim().replace(/\s+/g, ' ')}
                    aria-label="Dismiss alert"
                >
                    <X className="w-4 h-4" />
                </button>
            )}

            {/* Icon */}
            {showIcon && (
                <div className="shrink-0 mt-0.5">
                    <IconComponent className={`w-5 h-5 ${config.iconColor}`} />
                </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
                {/* Main message */}
                {displayMessage && (
                    <p className={`text-sm font-medium leading-relaxed ${config.titleColor}`}>
                        {displayMessage}
                    </p>
                )}

                {/* Error details */}
                {hasErrors && (
                    <div className={`mt-2 space-y-1 text-sm ${config.messageColor}`}>
                        {Object.entries(errorDetails).map(([field, messages]) => {
                            const errorMessages = Array.isArray(messages) ? messages : [messages];

                            return errorMessages.map((msg, index) => (
                                <div key={`${field}-${index}`} className="flex items-center gap-2">
                                    <span className="shrink-0 w-1 h-1 rounded-full bg-current opacity-60" />
                                    <span className="flex-1">
                                        <span className="font-semibold capitalize">{field.replace(/_/g, ' ')}</span>
                                        {': '}
                                        {String(msg)}
                                    </span>
                                </div>
                            ));
                        })}
                    </div>
                )}

                {/* actionButton button */}
                {actionButton && (
                    <div className="mt-3">
                        {actionButton}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Alert;