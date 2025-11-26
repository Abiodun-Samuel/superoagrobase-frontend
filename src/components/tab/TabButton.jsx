import { useState, useEffect } from "react";
import Animation from "../common/Animation";

export const TabButton = ({ active, onClick, icon: Icon, label, count }) => {
    const [clicked, setClicked] = useState(false);

    useEffect(() => {
        if (clicked) {
            const timer = setTimeout(() => setClicked(false), 150);
            return () => clearTimeout(timer);
        }
    }, [clicked]);

    return (
        <Animation
            animation={active ? "scale" : "fade"}
            duration={0.35}
            easing="ease-out"
            className={`inline-block`}
        >
            <button
                onClick={(e) => {
                    setClicked(true);
                    onClick?.(e);
                }}
                className={`
          relative flex items-center gap-2.5 px-3 py-2 sm:px-5 sm:py-3.5
          text-xs sm:text-sm font-semibold transition-all duration-300 rounded-lg
          ${active
                        ? "text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/30 dark:shadow-indigo-500/20"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50"}
          ${clicked ? "scale-95" : "scale-100"}
        `}
                style={{
                    transition: "all 0.25s cubic-bezier(0.25, 0.1, 0.25, 1)",
                }}
            >
                {Icon && (
                    <Animated
                        animation={active ? "scale" : "fade"}
                        duration={0.25}
                        className={`flex items-center justify-center`}
                    >
                        <Icon className={`w-5 h-5 ${active ? "text-white" : ""}`} />
                    </Animated>
                )}

                <Animated
                    animation={active ? "slideUp" : "fade"}
                    duration={0.3}
                    easing="ease-out"
                    className="inline-block"
                >
                    {label}
                </Animated>

                {count !== undefined && (
                    <Animated
                        animation="scale"
                        duration={0.3}
                        delay={0.05}
                        className={`
              ml-1 px-2 py-0.5 rounded-full text-xs font-bold
              ${active
                                ? "bg-white/20 text-white"
                                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"}
            `}
                    >
                        {count}
                    </Animated>
                )}
            </button>
        </Animation>
    );
};