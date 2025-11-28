export default function LoadingPage() {
    return (
        <div className="fixed top-0 right-0 left-0 bottom-0 min-h-screen inset-0 bg-transparent backdrop-blur-sm z-100 flex items-center justify-center pt-20">
            <div className="bg-white rounded-lg shadow-lg p-6 flex items-center gap-3">
                <svg className="animate-spin h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">Loading products...</span>
            </div>
        </div>
        // <div
        //     className="fixed top-0 right-0 left-0 backdrop-blur-sm min-h-screen dark:bg-gray-900 transition-colors duration-300 inset-0 z-1000000 flex items-center justify-center bg-gray-900/40"
        //     aria-live="polite"
        //     role="status"
        // >
        //     {/* <div className="w-full max-w-xl px-6 py-12 md:py-20">
        //         <div className="mx-auto flex flex-col items-center gap-6">
        //             <div className="relative flex items-center justify-center">
        //                 <div
        //                     className="absolute -inset-6 rounded-full blur-3xl opacity-30 dark:opacity-20"
        //                     aria-hidden="true"
        //                 />
        //                 <div
        //                     className="relative flex items-center justify-center rounded-full
        //                  w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32
        //                  bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900
        //                  border border-gray-100 dark:border-gray-700
        //                  shadow-lg"
        //                 >
        //                     <div
        //                         className="absolute -inset-1 rounded-full animate-[spin_6s_linear_infinite]"
        //                         aria-hidden="true"
        //                     />

        //                 </div>
        //             </div>
        //         </div>
        //     </div> */}
        //     <div
        //         className="relative z-10 flex items-center justify-center rounded-full
        //                    w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32
        //                    bg-white p-3 dark:bg-gray-800"
        //     >
        //         <img
        //             src={'/images/logo/logo.png'}
        //             alt={'SuperoAgrobase Logo'}
        //             className="w-full h-full object-contain"
        //             loading="eager"
        //         />
        //     </div>
        // </div>
    );
}
