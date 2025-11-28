'use client'

import { Loader } from "lucide-react"

const PageLoader = ({ text = 'Loading page...' }) => {
    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            aria-live="polite"
            role="status"
            aria-label="Loading content"
        >
            {/* Blurred Backdrop */}
            <div
                className="absolute inset-0 bg-gray-900/50 backdrop-blur-md"
                aria-hidden="true"
            />

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

                {/* Loading Message */}
                <div className="bg-white rounded-lg shadow-xl px-6 py-3 flex items-center gap-3 animate-slideUp">
                    <Loader
                        className="text-green-500 w-5 h-5 animate-spin shrink-0"
                        strokeWidth={2.5}
                        aria-hidden="true"
                    />
                    <span className="text-sm sm:text-base font-medium text-gray-700">
                        {text}
                    </span>
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

                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }

                .animate-scaleIn {
                    animation: scaleIn 0.4s ease-out;
                }

                .animate-slideUp {
                    animation: slideUp 0.5s ease-out 0.2s both;
                }
            `}</style>
        </div>
    )
}

export default PageLoader