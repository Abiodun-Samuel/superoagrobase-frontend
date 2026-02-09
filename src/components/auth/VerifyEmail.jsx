'use client'

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, RefreshCw, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";

import Button from "@/components/ui/Button";
import InputForm from "@/components/form/InputForm";
import { useResendVerification } from "@/queries/auth.query";
import Alert from "../common/Alert";
import { Toast } from "@/lib/toastify";

const COOLDOWN_DURATION = 5 * 60 * 1000; // 5 minutes
const STORAGE_KEY = "verify_email_cooldown";
const REDIRECT_DELAY = 3000; // 3 seconds

// Utility function to detect already verified error
const isAlreadyVerifiedError = (error) => {
    const message = error?.response?.data?.message?.toLowerCase() || '';
    const errorCode = error?.response?.data?.error_code;

    return (
        message.includes('already verified') ||
        message.includes('email verified') ||
        errorCode === 400 // Based on your API response
    );
};

const VerifyEmail = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const emailFromUrl = searchParams.get('email');

    const { mutateAsync: resendVerification, isPending: isResending, isError: isResendError, error: resendError, reset: resetMutation } = useResendVerification();

    const [cooldownEnd, setCooldownEnd] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [isAlreadyVerified, setIsAlreadyVerified] = useState(false);
    const [redirectCountdown, setRedirectCountdown] = useState(null);

    // React Hook Form
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            email: emailFromUrl || ''
        }
    });

    // Initialize cooldown from storage on mount
    useEffect(() => {
        const storedCooldown = localStorage.getItem(STORAGE_KEY);
        if (storedCooldown) {
            const endTime = parseInt(storedCooldown, 10);
            if (endTime > Date.now()) {
                setCooldownEnd(endTime);
            } else {
                localStorage.removeItem(STORAGE_KEY);
            }
        }
    }, []);

    // Update countdown timer
    useEffect(() => {
        if (!cooldownEnd) {
            setTimeRemaining(0);
            return;
        }

        const updateTimer = () => {
            const remaining = Math.max(0, cooldownEnd - Date.now());
            setTimeRemaining(remaining);

            if (remaining === 0) {
                setCooldownEnd(null);
                localStorage.removeItem(STORAGE_KEY);
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [cooldownEnd]);

    // Handle redirect countdown for already verified
    useEffect(() => {
        if (!isAlreadyVerified || redirectCountdown === null) return;

        if (redirectCountdown > 0) {
            const timer = setTimeout(() => {
                setRedirectCountdown(prev => prev - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }

        if (redirectCountdown === 0) {
            router.push('/');
        }
    }, [isAlreadyVerified, redirectCountdown, router]);

    const onSubmit = useCallback(async (data) => {
        const emailToUse = data.email || emailFromUrl;

        if (!emailToUse) {
            Toast.error('Email address is required');
            return;
        }

        // Reset states
        setIsAlreadyVerified(false);
        resetMutation();

        try {
            await resendVerification({ email: emailToUse });

            // Start cooldown
            const endTime = Date.now() + COOLDOWN_DURATION;
            setCooldownEnd(endTime);
            localStorage.setItem(STORAGE_KEY, endTime.toString());

            Toast.success('Verification email sent successfully!');
        } catch (err) {
            // Check if email is already verified
            if (isAlreadyVerifiedError(err)) {
                setIsAlreadyVerified(true);
                setRedirectCountdown(3);
            }
            // Other errors are handled by Alert component
        }
    }, [emailFromUrl, resendVerification, resetMutation]);

    const formatTime = useCallback((ms) => {
        const totalSeconds = Math.ceil(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        if (minutes > 0) {
            return `${minutes}m ${seconds}s`;
        }
        return `${seconds}s`;
    }, []);

    const resendButtonText = useMemo(() => {
        if (isResending) return "Sending...";
        if (timeRemaining > 0) return `Resend in ${formatTime(timeRemaining)}`;
        return "Resend Verification Email";
    }, [isResending, timeRemaining, formatTime]);

    const isResendDisabled = isResending || timeRemaining > 0;

    // Render already verified state
    if (isAlreadyVerified) {
        return (
            <>
                {/* Header Section */}
                <div className="text-center space-y-3 relative">
                    <div className="space-y-1">
                        <Link href='/' className="flex items-center justify-center">
                            <img width={90} src="/images/logo/logo.png" alt="logo" />
                        </Link>

                        <div className="flex items-center justify-center mb-4">
                            <CheckCircle2 className="w-16 h-16 text-green-500 dark:text-green-400" />
                        </div>

                        <h1 className="text-xl gap-1 font-semibold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-100 dark:via-gray-200 dark:to-gray-100 bg-clip-text text-transparent">
                            Email Already Verified
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-normal">
                            {emailFromUrl ? `The email ${emailFromUrl} is already verified` : 'Your email is already verified'}
                        </p>
                    </div>

                    {/* Decorative Line */}
                    <div className="flex items-center justify-center gap-2">
                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-gray-300 dark:to-gray-600"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400"></div>
                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-gray-300 dark:to-gray-600"></div>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-5 mt-5">
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-sm text-green-600 dark:text-green-400">
                        <p className="font-medium mb-2">Good news!</p>
                        <p className="text-xs mb-3">
                            Your email address has already been verified. You can now access all features of your account.
                        </p>
                        {redirectCountdown !== null && (
                            <p className="text-xs font-medium">
                                Redirecting to home in {redirectCountdown} second{redirectCountdown !== 1 ? 's' : ''}...
                            </p>
                        )}
                    </div>

                    <div className="space-y-3">
                        <Button
                            className="w-full"
                            type="button"
                            color="green"
                            href='/'
                        >
                            Go to Home
                        </Button>
                    </div>
                </div>
            </>
        );
    }

    // Render normal verify email state
    return (
        <>
            {/* Header Section */}
            <div className="text-center space-y-3 relative">
                <div className="space-y-1">
                    <Link href='/' className="flex items-center justify-center">
                        <img width={90} src="/images/logo/logo.png" alt="logo" />
                    </Link>

                    <div className="flex items-center justify-center mb-4">
                        <Mail className="w-16 h-16 text-green-500 dark:text-green-400" />
                    </div>

                    <h1 className="text-xl gap-1 font-semibold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-100 dark:via-gray-200 dark:to-gray-100 bg-clip-text text-transparent">
                        Verify Your Email
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-normal">
                        {emailFromUrl
                            ? `A verification link has been sent to ${emailFromUrl}`
                            : 'Enter your email to receive a verification link'
                        }
                    </p>
                </div>

                {/* Decorative Line */}
                <div className="flex items-center justify-center gap-2">
                    <div className="h-px w-12 bg-gradient-to-r from-transparent to-gray-300 dark:to-gray-600"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400"></div>
                    <div className="h-px w-12 bg-gradient-to-l from-transparent to-gray-300 dark:to-gray-600"></div>
                </div>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-5">
                {/* Error Message (excluding already verified) */}
                {isResendError && resendError && !isAlreadyVerifiedError(resendError) && (
                    <Alert error={resendError} />
                )}

                {/* Instructions */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 text-sm text-gray-600 dark:text-gray-400">
                    <p className="font-medium mb-2">Check your email</p>
                    <ul className="space-y-1 list-disc list-inside text-xs">
                        <li>We sent a verification link to your email address</li>
                        <li>Click the link to verify your account</li>
                        <li>Check your spam folder if you don't see it</li>
                        <li>The link will expire in 60 minutes</li>
                    </ul>
                </div>

                {/* Email Input (if no email in URL) */}
                {!emailFromUrl && (
                    <InputForm
                        label="Email Address"
                        name="email"
                        type="email"
                        placeholder="Enter your email address"
                        register={register}
                        error={errors.email?.message}
                        required={true}
                    />
                )}

                {/* Cooldown Warning */}
                {timeRemaining > 0 && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 text-sm text-amber-600 dark:text-amber-400">
                        <p className="font-medium mb-1">Please wait before resending</p>
                        <p className="text-xs">
                            You can request a new verification email in {formatTime(timeRemaining)}.
                        </p>
                    </div>
                )}

                {/* Resend Button */}
                <Button
                    className="w-full"
                    type="submit"
                    color="blue"
                    loading={isResending}
                    disabled={isResendDisabled}
                    startIcon={<RefreshCw />}
                >
                    {resendButtonText}
                </Button>

                {/* Navigation Links */}
                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                    <span>Already verified? </span>
                    <Link
                        href="/"
                        className="text-blue-600 dark:text-blue-400 underline font-medium"
                    >
                        Home
                    </Link>
                </div>
            </form>
        </>
    );
};

export default VerifyEmail;