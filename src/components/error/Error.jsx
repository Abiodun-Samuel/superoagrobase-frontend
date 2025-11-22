// app/error.js
'use client';

import { useEffect } from 'react';
import Button from '@/components/ui/Button';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function Error({ error, reset }) {
    useEffect(() => {
        // Log error to error reporting service (e.g., Sentry)
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 px-4">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full">
                    <AlertCircle className="w-10 h-10 text-red-600" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Oops! Something went wrong
                    </h1>
                    <p className="text-gray-600">
                        We encountered an unexpected error while loading this page.
                    </p>
                </div>

                {error?.message && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-sm text-red-800 font-mono">
                            {error.message}
                        </p>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        color="red"
                        variant="solid"
                        onClick={reset}
                        startIcon={<RefreshCw className="w-5 h-5" />}
                    >
                        Try Again
                    </Button>
                    <Button
                        color="gray"
                        variant="outline"
                        href="/"
                    >
                        Go Home
                    </Button>
                </div>
            </div>
        </div>
    );
}