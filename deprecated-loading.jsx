'use client'
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

const LoadingPage = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0;
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Blurred Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-slate-900/60 to-emerald-950/50" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-12 max-w-lg">

          {/* Logo Container with Glass Effect */}
          <div className="relative inline-block group">
            {/* Glow Effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 rounded-3xl opacity-30 blur-2xl group-hover:opacity-40 transition-opacity duration-500" />

            {/* Glass Card */}
            <div className="relative backdrop-blur-xl bg-white/10 rounded-3xl p-12 shadow-2xl border border-white/20">
              {/* Logo Placeholder - Replace with your actual logo */}
              <div className="w-32 h-32 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg">
                <span className="text-4xl font-bold text-white">LOGO</span>
              </div>

              {/* Spinner */}
              <div className="relative">
                <Loader2
                  size={48}
                  className="text-emerald-400 animate-spin mx-auto"
                  strokeWidth={2.5}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-2 border-emerald-400/20" />
                </div>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-white via-emerald-100 to-white bg-clip-text text-transparent animate-pulse-slow">
                Loading
              </h1>
              <p className="text-lg sm:text-xl text-emerald-100/90 font-light tracking-wide">
                Preparing your experience
              </p>
            </div>

            {/* Modern Progress Bar */}
            <div className="space-y-3">
              <div className="relative w-80 max-w-full mx-auto h-1.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 rounded-full transition-all duration-300 ease-out shadow-lg shadow-emerald-500/50"
                  style={{ width: `${progress}%` }}
                />
                <div
                  className="absolute inset-y-0 left-0 bg-white/30 rounded-full blur-sm"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Progress Percentage */}
              <div className="text-emerald-300/80 text-sm font-medium tracking-wider">
                {progress}%
              </div>
            </div>
          </div>

          {/* Floating Particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-emerald-400/30 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: `${3 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0;
          }
          25% {
            opacity: 0.3;
          }
          50% {
            transform: translateY(-30px) translateX(20px) scale(1.2);
            opacity: 0.5;
          }
          75% {
            opacity: 0.3;
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingPage;