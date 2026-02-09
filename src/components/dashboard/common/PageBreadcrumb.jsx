'use client'

import { useState, useEffect } from "react";
import { Toast } from "@/lib/toastify";
import { Home, ChevronRight, Maximize2, Minimize2, LayoutDashboard } from "lucide-react";
import Link from "next/link";

const PageBreadcrumb = ({ pageTitle, description }) => {
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const toggleFullscreen = async () => {
        try {
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
            } else {
                await document.exitFullscreen();
            }
        } catch (err) {
            Toast.error("Unable to toggle fullscreen mode");
        }
    };

    return (
        <div className="relative">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-transparent to-green-50/30 dark:from-emerald-950/20 dark:via-transparent dark:to-green-950/10 rounded-xl -z-10 blur-3xl" />

            <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-xl shadow-lg shadow-emerald-500/5 dark:shadow-emerald-900/10 p-4 sm:p-5">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Left Section - Page Title & Description */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3">
                            {/* Icon Container */}
                            <div className="relative flex-shrink-0 group">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                                <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 dark:from-emerald-600 dark:via-green-600 dark:to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/30 dark:shadow-emerald-900/40 ring-2 ring-white/20 dark:ring-gray-800/50 group-hover:scale-105 transition-transform duration-300">
                                    <LayoutDashboard className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-lg" strokeWidth={2.5} />
                                </div>
                            </div>

                            {/* Title & Description */}
                            <div className="flex-1 min-w-0 space-y-1">
                                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 dark:from-white dark:via-gray-100 dark:to-gray-200 bg-clip-text text-transparent tracking-tight leading-tight">
                                    {pageTitle}
                                </h1>
                                {description && (
                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl line-clamp-2">
                                        {description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Breadcrumb & Actions */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                        {/* Desktop Breadcrumb */}
                        <nav className="hidden lg:block" aria-label="Breadcrumb">
                            <ol className="flex items-center gap-2">
                                <li>
                                    <Link
                                        href={'/dashboard'}
                                        className="group relative flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg transition-all duration-300 hover:scale-105 overflow-hidden"
                                    >
                                        <span className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/50 dark:to-green-950/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <Home className="relative w-4 h-4 group-hover:rotate-12 transition-transform duration-300" strokeWidth={2.5} />
                                        <span className="relative">Dashboard</span>
                                    </Link>
                                </li>
                                <li>
                                    <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-600" strokeWidth={2.5} />
                                </li>
                                <li>
                                    <span className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-emerald-700 dark:text-emerald-400 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/50 dark:to-green-950/50 border border-emerald-200/50 dark:border-emerald-700/50 rounded-lg shadow-sm">
                                        {pageTitle}
                                    </span>
                                </li>
                            </ol>
                        </nav>

                        {/* Tablet Breadcrumb */}
                        <nav className="hidden sm:flex lg:hidden items-center gap-2" aria-label="Breadcrumb">
                            <Link
                                href={'/dashboard'}
                                className="group relative flex items-center justify-center w-9 h-9 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg transition-all duration-300 hover:scale-105 overflow-hidden"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/50 dark:to-green-950/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <Home className="relative w-4 h-4 group-hover:rotate-12 transition-transform duration-300" strokeWidth={2.5} />
                            </Link>
                            <ChevronRight className="w-3.5 h-3.5 text-gray-400 dark:text-gray-600" strokeWidth={2.5} />
                            <span className="px-3 py-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-400 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/50 dark:to-green-950/50 border border-emerald-200/50 dark:border-emerald-700/50 rounded-lg shadow-sm">
                                {pageTitle}
                            </span>
                        </nav>

                        {/* Mobile Breadcrumb */}
                        <nav className="flex sm:hidden items-center gap-1.5" aria-label="Breadcrumb">
                            <Link
                                href={'/dashboard'}
                                className="group relative flex items-center justify-center w-8 h-8 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg transition-all duration-300 overflow-hidden"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/50 dark:to-green-950/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <Home className="relative w-3.5 h-3.5" strokeWidth={2.5} />
                            </Link>
                            <ChevronRight className="w-3 h-3 text-gray-400 dark:text-gray-600" strokeWidth={2} />
                            <span className="px-2 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/50 dark:to-green-950/50 border border-emerald-200/50 dark:border-emerald-700/50 rounded-lg">
                                {pageTitle}
                            </span>
                        </nav>

                        {/* Fullscreen Toggle Button */}
                        <button
                            onClick={toggleFullscreen}
                            className="group relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-emerald-500/20 hover:scale-105 overflow-hidden"
                            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                            title={isFullscreen ? "Exit fullscreen (ESC)" : "Enter fullscreen (F11)"}
                        >
                            <span className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/50 dark:to-green-950/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            {isFullscreen ? (
                                <Minimize2 className="relative w-4 h-4 group-hover:scale-110 transition-transform duration-300" strokeWidth={2.5} />
                            ) : (
                                <Maximize2 className="relative w-4 h-4 group-hover:scale-110 transition-transform duration-300" strokeWidth={2.5} />
                            )}
                        </button>
                    </div>
                </div>

                {/* Bottom Accent Line */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500 rounded-b-xl opacity-50" />
            </div>
        </div>
    );
};

export default PageBreadcrumb;