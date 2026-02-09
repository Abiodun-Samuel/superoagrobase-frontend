'use client'

import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { KeyRound, AlertCircle, CheckCircle2, Clock, Loader2, RefreshCcw } from "lucide-react";

import InputForm from "@/components/form/InputForm";
import Button from "@/components/ui/Button";
import { useResetPassword, useVerifyToken } from "@/queries/auth.query";
import { ResetPasswordSchema } from "@/validation/schema";
import { Toast } from "@/lib/toastify";
import Alert from "../common/Alert";

const ResetPassword = () => {
    const { mutateAsync, isPending, isError, isSuccess, error } = useResetPassword();
    const router = useRouter();
    const searchParams = useSearchParams();

    const email = searchParams.get('email');
    const token = searchParams.get('token');

    // Token verification - automatically triggers when email and token are present
    const {
        data: tokenVerification,
        isLoading: isVerifyingToken,
        error: tokenError,
        refetch: retryVerification
    } = useVerifyToken(
        { email, token, type: 'password_reset' },
        { enabled: !!(email && token) }
    );

    // Determine token status
    const tokenStatus = useMemo(() => {
        if (!email || !token) return 'missing_params';
        if (isVerifyingToken) return 'verifying';
        if (tokenError) return 'invalid';
        if (tokenVerification) return 'valid';
        return 'pending';
    }, [email, token, isVerifyingToken, tokenError, tokenVerification]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(ResetPasswordSchema),
        defaultValues: {
            password: '',
            password_confirmation: ''
        }
    });

    // Auto-redirect if params are missing
    useEffect(() => {
        if (!email || !token) {
            Toast.error('Missing email or token parameters');
            const timer = setTimeout(() => {
                router.push('/auth/forgot-password');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [email, token, router]);

    const handleResetPassword = useCallback(async (data) => {
        if (!email || !token) {
            Toast.error('Cannot reset password without email and token');
            return;
        }

        const payload = {
            ...data,
            email,
            token
        };

        try {
            await mutateAsync(payload);
            reset();
        } catch (err) {
            // Error handled by mutation
        }
    }, [email, token, mutateAsync, reset]);

    const tagline = useMemo(() => {
        if (email) {
            return `Enter a new password for ${email}`;
        }
        return "Enter your new password below";
    }, [email]);

    const isFormValid = !isPending && tokenStatus === 'valid';

    // Token Status Banner Component
    const TokenStatusBanner = () => {
        if (tokenStatus === 'missing_params') {
            return (
                <Alert
                    variant="error"
                    message={{
                        message: "Invalid Reset Link",
                        details: "The password reset link is invalid or incomplete. Please request a new one."
                    }}
                />
            );
        }

        if (tokenStatus === 'verifying') {
            return (
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <Loader2 className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                Verifying reset link...
                            </p>
                            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                                Please wait while we validate your password reset token
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        if (tokenStatus === 'invalid') {
            return (
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-red-900 dark:text-red-100">
                                Invalid or Expired Reset Link
                            </p>
                            <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                                This password reset link is invalid or has expired. Links are only valid for 60 minutes.
                            </p>
                            <div className="flex items-center gap-2 mt-3 flex-wrap">
                                <button
                                    type="button"
                                    onClick={() => retryVerification()}
                                    className="inline-flex items-center gap-1.5 text-xs font-medium text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100 transition-colors"
                                >
                                    <RefreshCcw className="w-3.5 h-3.5" />
                                    Retry Verification
                                </button>
                                <span className="text-red-300 dark:text-red-700">|</span>
                                <Link
                                    href="/auth/forgot-password"
                                    className="text-xs font-medium text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100 transition-colors"
                                >
                                    Request New Link
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        if (tokenStatus === 'valid') {
            return (
                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-green-900 dark:text-green-100">
                                Reset Link Verified
                            </p>
                            <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                                You can now set a new password for your account
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <>
            {/* Header Section */}
            <div className="text-center space-y-3 relative">
                <div className="space-y-1">
                    <Link href='/' className="flex items-center justify-center">
                        <img width={90} src="/images/logo/logo.png" alt="logo" />
                    </Link>
                    <h1 className="text-xl gap-1 font-semibold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-100 dark:via-gray-200 dark:to-gray-100 bg-clip-text text-transparent">
                        Reset Password
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-normal">
                        {tagline}
                    </p>
                </div>

                {/* Decorative Line */}
                <div className="flex items-center justify-center gap-2">
                    <div className="h-px w-12 bg-gradient-to-r from-transparent to-gray-300 dark:to-gray-600"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400"></div>
                    <div className="h-px w-12 bg-gradient-to-l from-transparent to-gray-300 dark:to-gray-600"></div>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(handleResetPassword)} className="space-y-5 mt-5 relative">
                {/* Token Status Banner */}
                <TokenStatusBanner />

                {/* Success Message */}
                {isSuccess && (
                    <Alert variant="success" message="Password reset successful! You will be redirected to the login page in a few seconds..." />
                )}

                {/* Error Message */}
                {isError && error && (
                    <Alert error={error} />
                )}

                {/* Password Fields - Only show if token is valid */}
                {tokenStatus === 'valid' && (
                    <>
                        <InputForm
                            label="New Password"
                            name="password"
                            type="password"
                            register={register}
                            error={errors.password?.message}
                            placeholder="Enter your new password"
                            required={true}
                            autoComplete="new-password"
                        />

                        <InputForm
                            label="Confirm New Password"
                            name="password_confirmation"
                            type="password"
                            register={register}
                            error={errors.password_confirmation?.message}
                            placeholder="Confirm your new password"
                            required={true}
                            autoComplete="new-password"
                        />

                        {/* Password Requirements */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 text-xs text-gray-600 dark:text-gray-400">
                            <p className="font-medium mb-2">Password must contain:</p>
                            <ul className="space-y-1 list-disc list-inside">
                                <li>At least 8 characters</li>
                                <li>One uppercase letter</li>
                                <li>One lowercase letter</li>
                                <li>One number</li>
                                <li>One special character</li>
                            </ul>
                        </div>

                        <Button
                            className="w-full mt-1"
                            type="submit"
                            color="blue"
                            loading={isPending}
                            disabled={!isFormValid}
                            startIcon={<KeyRound />}
                        >
                            {isPending ? "Resetting..." : "Reset Password"}
                        </Button>
                    </>
                )}

                {/* Loading State - Show skeleton inputs while verifying */}
                {tokenStatus === 'verifying' && (
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                            <div className="h-11 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                            <div className="h-11 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
                        </div>
                        <div className="h-24 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
                        <div className="h-11 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                )}

                {/* Help Text */}
                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                    <span>Didn't receive the email? </span>
                    <Link
                        href={`/auth/forgot-password${email ? `?email=${email}` : ''}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline font-medium transition-all"
                    >
                        Request new link
                    </Link>
                </div>

                {/* Back to Login */}
                <div className="text-center">
                    <Link
                        href="/auth/login"
                        className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                    >
                        Back to login
                    </Link>
                </div>
            </form>
        </>
    );
};

export default ResetPassword;