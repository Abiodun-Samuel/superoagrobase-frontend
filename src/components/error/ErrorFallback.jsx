'use client';

import { AlertTriangle } from 'lucide-react';
import Button from '../ui/Button';

export default function ErrorFallback({
    title = "Something went wrong",
    message = "We encountered an error while loading this content.",
    showRetry = false,
    onRetry,
}) {
    const handleRetry = () => {
        if (onRetry) {
            onRetry();
        } else {
            window.location.reload();
        }
    };

    return (
        <div className="w-full py-16 px-4">
            <div className="max-w-md mx-auto text-center space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>

                <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                        {title}
                    </h3>
                    <p className="text-gray-600">
                        {message}
                    </p>
                </div>

                {showRetry && (
                    <Button
                        color="red"
                        variant="outline"
                        onClick={handleRetry}
                    >
                        Retry
                    </Button>
                )}
            </div>
        </div>
    );
}