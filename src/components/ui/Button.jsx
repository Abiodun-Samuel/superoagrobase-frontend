'use client'
import { Loader } from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';

const Button = ({
    children,
    color = "green",
    variant = "solid",
    startIcon,
    endIcon,
    onClick,
    href,
    title,
    className = "",
    disabled = false,
    type = "button",
    loading = false,
    target = "_self",
    rel = "",
}) => {
    const buttonRef = useRef(null);

    const handleClick = (event) => {
        if (disabled || loading) return;
        if (onClick) onClick(event);
    };

    // Color configurations with solid and outline variants
    const colorConfig = {
        green: {
            solid: {
                bg: 'bg-[#66BB6A]',
                hoverBg: 'hover:bg-[#4CAF50]',
                activeBg: 'active:bg-[#4CAF50]',
                text: 'text-white',
                border: 'border-transparent',
                shadow: 'shadow-sm hover:shadow-md',
                focusRing: 'focus-visible:ring-[#66BB6A]',
                glow: 'hover:shadow-[#66BB6A]/30'
            },
            outline: {
                bg: 'bg-transparent',
                hoverBg: 'hover:bg-[#66BB6A]/10',
                activeBg: 'active:bg-[#66BB6A]/20',
                text: 'text-[#66BB6A]',
                border: 'border-[#66BB6A]',
                shadow: 'hover:shadow-sm',
                focusRing: 'focus-visible:ring-[#66BB6A]',
                glow: 'hover:shadow-[#66BB6A]/20'
            }
        },
        darkgreen: {
            solid: {
                bg: 'bg-[#558B2F]',
                hoverBg: 'hover:bg-[#3E6A21]',
                activeBg: 'active:bg-[#3E6A21]',
                text: 'text-white',
                border: 'border-transparent',
                shadow: 'shadow-sm hover:shadow-md',
                focusRing: 'focus-visible:ring-[#558B2F]',
                glow: 'hover:shadow-[#558B2F]/30'
            },
            outline: {
                bg: 'bg-transparent',
                hoverBg: 'hover:bg-[#558B2F]/10',
                activeBg: 'active:bg-[#558B2F]/20',
                text: 'text-[#558B2F]',
                border: 'border-[#558B2F]',
                shadow: 'hover:shadow-sm',
                focusRing: 'focus-visible:ring-[#558B2F]',
                glow: 'hover:shadow-[#558B2F]/20'
            }
        },
        lightgreen: {
            solid: {
                bg: 'bg-[#9CCC65]',
                hoverBg: 'hover:bg-[#7CB342]',
                activeBg: 'active:bg-[#7CB342]',
                text: 'text-[#2E2E2E]',
                border: 'border-transparent',
                shadow: 'shadow-sm hover:shadow-md',
                focusRing: 'focus-visible:ring-[#9CCC65]',
                glow: 'hover:shadow-[#9CCC65]/30'
            },
            outline: {
                bg: 'bg-transparent',
                hoverBg: 'hover:bg-[#9CCC65]/10',
                activeBg: 'active:bg-[#9CCC65]/20',
                text: 'text-[#9CCC65]',
                border: 'border-[#9CCC65]',
                shadow: 'hover:shadow-sm',
                focusRing: 'focus-visible:ring-[#9CCC65]',
                glow: 'hover:shadow-[#9CCC65]/20'
            }
        },
        orange: {
            solid: {
                bg: 'bg-[#FFA726]',
                hoverBg: 'hover:bg-[#FB8C00]',
                activeBg: 'active:bg-[#FB8C00]',
                text: 'text-white',
                border: 'border-transparent',
                shadow: 'shadow-sm hover:shadow-md',
                focusRing: 'focus-visible:ring-[#FFA726]',
                glow: 'hover:shadow-[#FFA726]/30'
            },
            outline: {
                bg: 'bg-transparent',
                hoverBg: 'hover:bg-[#FFA726]/10',
                activeBg: 'active:bg-[#FFA726]/20',
                text: 'text-[#FFA726]',
                border: 'border-[#FFA726]',
                shadow: 'hover:shadow-sm',
                focusRing: 'focus-visible:ring-[#FFA726]',
                glow: 'hover:shadow-[#FFA726]/20'
            }
        },
        accent: {
            solid: {
                bg: 'bg-[#66BB6A]',
                hoverBg: 'hover:bg-[#4CAF50]',
                activeBg: 'active:bg-[#4CAF50]',
                text: 'text-white',
                border: 'border-transparent',
                shadow: 'shadow-sm hover:shadow-md',
                focusRing: 'focus-visible:ring-[#66BB6A]',
                glow: 'hover:shadow-[#66BB6A]/30'
            },
            outline: {
                bg: 'bg-transparent',
                hoverBg: 'hover:bg-[#66BB6A]/10',
                activeBg: 'active:bg-[#66BB6A]/20',
                text: 'text-[#66BB6A]',
                border: 'border-[#66BB6A]',
                shadow: 'hover:shadow-sm',
                focusRing: 'focus-visible:ring-[#66BB6A]',
                glow: 'hover:shadow-[#66BB6A]/20'
            }
        },
        dark: {
            solid: {
                bg: 'bg-[#2E2E2E]',
                hoverBg: 'hover:bg-[#1A1A1A]',
                activeBg: 'active:bg-[#1A1A1A]',
                text: 'text-white',
                border: 'border-transparent',
                shadow: 'shadow-sm hover:shadow-md',
                focusRing: 'focus-visible:ring-[#2E2E2E]',
                glow: 'hover:shadow-[#2E2E2E]/40'
            },
            outline: {
                bg: 'bg-transparent',
                hoverBg: 'hover:bg-[#2E2E2E]/10',
                activeBg: 'active:bg-[#2E2E2E]/20',
                text: 'text-[#2E2E2E]',
                border: 'border-[#2E2E2E]',
                shadow: 'hover:shadow-sm',
                focusRing: 'focus-visible:ring-[#2E2E2E]',
                glow: 'hover:shadow-[#2E2E2E]/20'
            }
        },
        gray: {
            solid: {
                bg: 'bg-[#757575]',
                hoverBg: 'hover:bg-[#616161]',
                activeBg: 'active:bg-[#616161]',
                text: 'text-white',
                border: 'border-transparent',
                shadow: 'shadow-sm hover:shadow-md',
                focusRing: 'focus-visible:ring-[#757575]',
                glow: 'hover:shadow-[#757575]/30'
            },
            outline: {
                bg: 'bg-[#F5F5F5]',
                hoverBg: 'bg-[#F5F5F5]',
                activeBg: 'bg-[#F5F5F5]',
                text: 'text-[#2E2E2E]',
                border: 'border-transparent',
                shadow: 'hover:shadow',
                focusRing: 'focus-visible:ring-[#F5F5F5]',
                glow: 'hover:shadow-gray-300/50'
            }
        },
        white: {
            solid: {
                bg: 'bg-white',
                hoverBg: 'hover:bg-[#F5F5F5]',
                activeBg: 'active:bg-[#F5F5F5]',
                text: 'text-[#2E2E2E]',
                border: 'border-[#E0E0E0]',
                shadow: 'shadow-sm hover:shadow-md',
                focusRing: 'focus-visible:ring-gray-400',
                glow: 'hover:shadow-gray-300/50'
            },
            outline: {
                bg: 'bg-transparent',
                hoverBg: 'hover:bg-white/10',
                activeBg: 'active:bg-white/20',
                text: 'text-[#2E2E2E]',
                border: 'border-[#2E2E2E]',
                shadow: 'hover:shadow-sm',
                focusRing: 'focus-visible:ring-[#2E2E2E]',
                glow: 'hover:shadow-gray-400/30'
            }
        },
        red: {
            solid: {
                bg: 'bg-[#EF5350]',
                hoverBg: 'hover:bg-[#E53935]',
                activeBg: 'active:bg-[#E53935]',
                text: 'text-white',
                border: 'border-transparent',
                shadow: 'shadow-sm hover:shadow-md',
                focusRing: 'focus-visible:ring-[#EF5350]',
                glow: 'hover:shadow-[#EF5350]/30'
            },
            outline: {
                bg: 'bg-transparent',
                hoverBg: 'hover:bg-[#EF5350]/10',
                activeBg: 'active:bg-[#EF5350]/20',
                text: 'text-[#EF5350]',
                border: 'border-[#EF5350]',
                shadow: 'hover:shadow-sm',
                focusRing: 'focus-visible:ring-[#EF5350]',
                glow: 'hover:shadow-[#EF5350]/20'
            }
        }
    };

    const currentColor = colorConfig[color] || colorConfig.green;
    const currentVariant = currentColor[variant] || currentColor.solid;

    const baseClasses = `
    inline-flex
    items-center
    justify-center
    min-h-[36px]
    h-10
    sm:h-10
    md:h-11
    px-3
    sm:px-4
    md:px-5
    gap-1.5
    sm:gap-2
    text-sm
    sm:text-sm
    md:text-base
    font-semibold
    rounded-lg
    border-2
    relative
    overflow-hidden
    transition-all
    duration-300
    ease-out
    select-none
    -webkit-tap-highlight-color-transparent
    min-w-fit
  `;

    const disabledClasses = disabled || loading
        ? 'cursor-not-allowed opacity-50 pointer-events-none'
        : 'cursor-pointer';

    const focusClasses = `
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-offset-2
    ${currentVariant.focusRing}
  `;

    const interactionClasses = `
    active:scale-[0.96]
    hover:scale-[1.02]
    hover:-translate-y-0.5
    ${currentVariant.shadow}
    ${currentVariant.glow}
  `;

    const combinedClasses = `
    ${baseClasses}
    ${currentVariant.bg}
    ${currentVariant.hoverBg}
    ${currentVariant.activeBg}
    ${currentVariant.text}
    ${currentVariant.border}
    ${disabledClasses}
    ${focusClasses}
    ${interactionClasses}
    ${className}
  `
        .trim()
        .replace(/\s+/g, ' ');

    const renderStartIcon = () => {
        if (loading) {
            return (
                <Loader
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 animate-spin shrink-0"
                    strokeWidth={2.5}
                />
            );
        }
        if (startIcon) {
            return (
                <span className="flex items-center justify-center shrink-0 w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5">
                    {startIcon}
                </span>
            );
        }
        return null;
    };

    const renderEndIcon = () => {
        if (endIcon && !loading) {
            return (
                <span className="flex items-center justify-center shrink-0 w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5">
                    {endIcon}
                </span>
            );
        }
        return null;
    };

    const ButtonContent = () => (
        <>
            {loading ? (
                <Loader
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 animate-spin shrink-0"
                    strokeWidth={2.5}
                />
            ) : (
                <>
                    {renderStartIcon()}
                    <span className="truncate flex items-center gap-1 font-semibold leading-none">
                        {children}
                    </span>
                    {renderEndIcon()}
                </>
            )}
        </>
    );

    if (href && !disabled && !loading) {
        const isExternal = href.startsWith('http') || href.startsWith('//');
        const finalRel = rel || (target === '_blank' ? 'noopener noreferrer' : '');

        return isExternal ? (
            <a
                ref={buttonRef}
                href={href}
                target={target}
                rel={finalRel}
                title={title || ''}
                className={combinedClasses}
                onClick={handleClick}
                role="button"
                tabIndex={0}
            >
                <ButtonContent />
            </a>
        ) : (
            <Link
                ref={buttonRef}
                href={href}
                target={target}
                rel={finalRel}
                title={title || ''}
                className={combinedClasses}
                onClick={handleClick}
                role="button"
                tabIndex={0}
            >
                <ButtonContent />
            </Link>
        );
    }

    return (
        <button
            ref={buttonRef}
            title={title || ''}
            type={type}
            className={combinedClasses}
            onClick={handleClick}
            disabled={disabled || loading}
            aria-busy={loading}
            aria-disabled={disabled || loading}
        >
            <ButtonContent />
        </button>
    );
};

export default Button;