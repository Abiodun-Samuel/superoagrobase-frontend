'use client'
import { Loader2 } from 'lucide-react';


const LoadingPage = () => (
  <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 flex flex-col items-center justify-center px-4">
    <div className="text-center space-y-8">
      {/* Animated Logo/Icon */}
      <div className="relative inline-block">
        <div className="absolute inset-0 bg-emerald-200 rounded-full blur-2xl opacity-40 animate-pulse"></div>
        <div className="relative bg-white rounded-full p-8 shadow-2xl">
          <Loader2 size={64} className="text-emerald-600 animate-spin" strokeWidth={2} />
        </div>
      </div>

      {/* Loading Text */}
      <div className="space-y-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Loading...
        </h1>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Please wait while we prepare your content
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full animate-loading-bar"></div>
      </div>
    </div>

    <style jsx>{`
      @keyframes loading-bar {
        0% {
          width: 0%;
          transform: translateX(0);
        }
        50% {
          width: 70%;
        }
        100% {
          width: 100%;
          transform: translateX(0);
        }
      }

      .animate-loading-bar {
        animation: loading-bar 2s ease-in-out infinite;
      }
    `}</style>
  </div>
);

export default LoadingPage