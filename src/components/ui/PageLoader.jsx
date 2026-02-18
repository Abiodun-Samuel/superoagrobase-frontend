'use client'

import { Loader } from "lucide-react"

const PageLoader = ({ text = 'Loading page...', showBlur = false }) => {
    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            aria-live="polite"
            role="status"
            aria-label="Loading content"
        >
            {/* Blurred Backdrop */}
            {showBlur && <div
                className="absolute inset-0 bg-gray-900/50 backdrop-blur-md"
                aria-hidden="true"
            />}

            {/* Content Container */}
            <div className="relative z-10 flex flex-col items-center gap-6 animate-fadeIn">
                {/* Logo Container with Pulse Animation */}
                <div className="relative">
                    {/* Glow Effect */}
                    <div
                        className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl animate-pulse"
                        aria-hidden="true"
                    />

                    {/* Logo */}
                    <div className="relative flex items-center justify-center rounded-full w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-white shadow-2xl p-4 animate-scaleIn">
                        <img
                            src="/images/logo/logo.png"
                            alt="SuperoAgrobase Logo"
                            className="w-full h-full object-contain"
                            loading="eager"
                            draggable="false"
                        />
                    </div>
                </div>

                {/* Redesigned Loading Message */}
                <div className="flex flex-col items-center gap-3 animate-slideUp">
                    {/* Main Loading Text */}
                    {/* <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/95 backdrop-blur-sm shadow-lg border border-gray-100">
                        <Loader
                            className="text-green-600 w-4 h-4 sm:w-5 sm:h-5 animate-spin shrink-0"
                            strokeWidth={2.5}
                            aria-hidden="true"
                        />
                        <span className="text-sm sm:text-base font-semibold text-gray-800 tracking-wide">
                            {text}
                        </span>
                    </div> */}

                    {/* Progress Indicator Dots */}
                    <div className="flex items-center gap-1.5" aria-hidden="true">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-600 animate-bounce-dot" style={{ animationDelay: '0ms' }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-bounce-dot" style={{ animationDelay: '150ms' }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-bounce-dot" style={{ animationDelay: '300ms' }} />
                    </div>
                </div>
            </div>

            {/* Custom Animations */}
            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes scaleIn {
                    from {
                        transform: scale(0.8);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1);
                        opacity: 1;
                    }
                }

                @keyframes slideUp {
                    from {
                        transform: translateY(20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                @keyframes bounce-dot {
                    0%, 80%, 100% {
                        transform: translateY(0);
                        opacity: 1;
                    }
                    40% {
                        transform: translateY(-6px);
                        opacity: 0.7;
                    }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }

                .animate-scaleIn {
                    animation: scaleIn 0.4s ease-out;
                }

                .animate-slideUp {
                    animation: slideUp 0.5s ease-out 0.2s both;
                }

                .animate-bounce-dot {
                    animation: bounce-dot 1.4s ease-in-out infinite;
                }
            `}</style>
        </div>
    )
}

export default PageLoader