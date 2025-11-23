import { Package } from "lucide-react";

export const HeroSectionImageSkeleton = () => (
    <div className="relative h-[500px] lg:h-[550px] rounded-3xl overflow-hidden shadow bg-white">
        <div className="w-full h-full bg-gradient-to-br from-amber-500/20 to-green-600/20 relative animate-pulse">
            <div className="absolute inset-0 opacity-5">
                <div className="grid grid-cols-6 grid-rows-6 h-full w-full">
                    {Array.from({ length: 36 }, (_, i) => (
                        <div key={`skeleton-grid-${i}`} className="border border-green-600" />
                    ))}
                </div>
            </div>

            <div className="relative h-full flex flex-col justify-between p-8">
                <div className="flex justify-center items-start">
                    <div className="h-8 w-40 bg-gray-300 rounded-full" />
                </div>

                <div className="flex-1 flex items-center justify-center py-8">
                    <div className="relative w-80 h-80 lg:w-96 lg:h-96 bg-gray-200 rounded-xl flex items-center justify-center">
                        <Package className="w-24 h-24 text-gray-400" />
                    </div>
                </div>

                <div className="flex justify-center space-x-2">
                    {Array.from({ length: 3 }, (_, i) => (
                        <div key={`skeleton-indicator-${i}`} className="w-3 h-3 bg-gray-300 rounded-full" />
                    ))}
                </div>
            </div>
        </div>
    </div>
);