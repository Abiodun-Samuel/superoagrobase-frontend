import React from 'react';
import { FileX } from 'lucide-react';

export const ContentPlaceholder = ({
    icon: Icon = FileX,
    title = 'No content available',
    description = 'There is no data to display at the moment.',
    color = 'blue',
    variant = 'light',
    className = '',
}) => {
    // Color palette configuration
    const colorThemes = {
        blue: {
            container: 'from-blue-50/80 via-blue-50/50 to-transparent',
            card: 'bg-white/90 border-blue-100',
            title: 'text-blue-900',
            description: 'text-blue-600/80',
            light: {
                iconBg: 'bg-blue-50',
                iconColor: 'text-blue-600',
                ring: 'bg-blue-500/10',
            },
            solid: {
                iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
                iconColor: 'text-white',
                ring: 'bg-blue-500/20',
            }
        },
        green: {
            container: 'from-green-50/80 via-emerald-50/50 to-transparent',
            card: 'bg-white/90 border-green-100',
            title: 'text-green-900',
            description: 'text-green-600/80',
            light: {
                iconBg: 'bg-green-50',
                iconColor: 'text-green-600',
                ring: 'bg-green-500/10',
            },
            solid: {
                iconBg: 'bg-gradient-to-br from-green-500 to-emerald-600',
                iconColor: 'text-white',
                ring: 'bg-green-500/20',
            }
        },
        red: {
            container: 'from-red-50/80 via-rose-50/50 to-transparent',
            card: 'bg-white/90 border-red-100',
            title: 'text-red-900',
            description: 'text-red-600/80',
            light: {
                iconBg: 'bg-red-50',
                iconColor: 'text-red-600',
                ring: 'bg-red-500/10',
            },
            solid: {
                iconBg: 'bg-gradient-to-br from-red-500 to-rose-600',
                iconColor: 'text-white',
                ring: 'bg-red-500/20',
            }
        },
        purple: {
            container: 'from-purple-50/80 via-violet-50/50 to-transparent',
            card: 'bg-white/90 border-purple-100',
            title: 'text-purple-900',
            description: 'text-purple-600/80',
            light: {
                iconBg: 'bg-purple-50',
                iconColor: 'text-purple-600',
                ring: 'bg-purple-500/10',
            },
            solid: {
                iconBg: 'bg-gradient-to-br from-purple-500 to-violet-600',
                iconColor: 'text-white',
                ring: 'bg-purple-500/20',
            }
        },
        amber: {
            container: 'from-amber-50/80 via-orange-50/50 to-transparent',
            card: 'bg-white/90 border-amber-100',
            title: 'text-amber-900',
            description: 'text-amber-600/80',
            light: {
                iconBg: 'bg-amber-50',
                iconColor: 'text-amber-600',
                ring: 'bg-amber-500/10',
            },
            solid: {
                iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600',
                iconColor: 'text-white',
                ring: 'bg-amber-500/20',
            }
        },
        slate: {
            container: 'from-slate-50/80 via-gray-50/50 to-transparent',
            card: 'bg-white/90 border-slate-200',
            title: 'text-slate-900',
            description: 'text-slate-600/80',
            light: {
                iconBg: 'bg-slate-100',
                iconColor: 'text-slate-600',
                ring: 'bg-slate-500/10',
            },
            solid: {
                iconBg: 'bg-gradient-to-br from-slate-600 to-slate-700',
                iconColor: 'text-white',
                ring: 'bg-slate-500/20',
            }
        },
        indigo: {
            container: 'from-indigo-50/80 via-blue-50/50 to-transparent',
            card: 'bg-white/90 border-indigo-100',
            title: 'text-indigo-900',
            description: 'text-indigo-600/80',
            light: {
                iconBg: 'bg-indigo-50',
                iconColor: 'text-indigo-600',
                ring: 'bg-indigo-500/10',
            },
            solid: {
                iconBg: 'bg-gradient-to-br from-indigo-500 to-blue-600',
                iconColor: 'text-white',
                ring: 'bg-indigo-500/20',
            }
        },
        pink: {
            container: 'from-pink-50/80 via-rose-50/50 to-transparent',
            card: 'bg-white/90 border-pink-100',
            title: 'text-pink-900',
            description: 'text-pink-600/80',
            light: {
                iconBg: 'bg-pink-50',
                iconColor: 'text-pink-600',
                ring: 'bg-pink-500/10',
            },
            solid: {
                iconBg: 'bg-gradient-to-br from-pink-500 to-rose-600',
                iconColor: 'text-white',
                ring: 'bg-pink-500/20',
            }
        }
    };

    const colorTheme = colorThemes[color] || colorThemes.blue;
    const iconVariant = colorTheme[variant] || colorTheme.light;

    return (
        <div className={`w-full min-h-[280px] flex items-center justify-center p-3 bg-gradient-to-br ${colorTheme.container} ${className}`}>
            <div className={`max-w-xl w-full ${colorTheme.card} border backdrop-blur-sm rounded-xl p-8 text-center transition-all duration-500 hover:scale-[1.02] shadow`}>

                {/* Icon with animated rings */}
                <div className="relative inline-flex items-center justify-center mb-6">
                    {/* Animated rings */}
                    <div className={`absolute inset-0 w-20 h-20 ${iconVariant.ring} rounded-full animate-ping opacity-75`}
                        style={{ animationDuration: '2s' }}></div>
                    <div className={`absolute inset-0 w-20 h-20 ${iconVariant.ring} rounded-full animate-pulse`}
                        style={{ animationDuration: '3s' }}></div>

                    {/* Icon container */}
                    <div className={`relative w-20 h-20 ${iconVariant.iconBg} ${iconVariant.iconColor} rounded-xl flex items-center justify-center transform transition-all duration-300 hover:rotate-6 hover:scale-110 shadow`}>
                        <Icon className="w-10 h-10 animate-float" strokeWidth={1.5} />
                    </div>
                </div>

                {/* Content */}
                <h3 className={`text-xl font-semibold ${colorTheme.title} mb-2 animate-fadeIn`}>
                    {title}
                </h3>
                <p className={`text-sm ${colorTheme.description} ${colorTheme.card} border p-2 rounded-xl leading-relaxed animate-fadeIn`}
                    style={{ animationDelay: '0.1s' }}>
                    {description}
                </p>
            </div>

            <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
};

export default ContentPlaceholder