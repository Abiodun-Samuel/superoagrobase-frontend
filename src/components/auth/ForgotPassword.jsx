'use client'

import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { Mail } from "lucide-react";

import InputForm from "@/components/form/InputForm";
import Button from "@/components/ui/Button";
import { useForgotPassword } from "@/queries/auth.query";
import Alert from "../common/Alert";
import { ForgotPasswordSchema } from "@/validation/schema";

const TAGLINE = "Enter your email address and we'll send you a link to reset your password.";
const COOLDOWN_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const STORAGE_KEY = "forgot_password_cooldown";

const ForgotPassword = () => {
    const { mutateAsync, isPending, isError, isSuccess, error } = useForgotPassword();

    const [cooldownEnd, setCooldownEnd] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState(0);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(ForgotPasswordSchema),
        defaultValues: { email: '' }
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

    const handleForgotPassword = useCallback(async (data) => {
        try {
            await mutateAsync(data);

            // Start cooldown only on success
            const endTime = Date.now() + COOLDOWN_DURATION;
            setCooldownEnd(endTime);
            localStorage.setItem(STORAGE_KEY, endTime.toString());
        } catch (err) {
            // Error is handled by Alert component
        }
    }, [mutateAsync]);

    const isButtonDisabled = isPending || timeRemaining > 0;

    const formatTime = useCallback((ms) => {
        const totalSeconds = Math.ceil(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, []);

    const buttonText = useMemo(() => {
        if (isPending) return "Sending...";
        if (timeRemaining > 0) return `Resend in ${formatTime(timeRemaining)}`;
        return "Send Reset Link";
    }, [isPending, timeRemaining, formatTime]);

    return (
        <>
            {/* Header Section */}
            <div className="text-center space-y-3 relative">
                <div className="space-y-1">
                    <Link href='/' className="flex items-center justify-center">
                        <img width={90} src="/images/logo/logo.png" alt="logo" />
                    </Link>
                    <h1 className="text-xl gap-1 font-semibold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-100 dark:via-gray-200 dark:to-gray-100 bg-clip-text text-transparent">
                        Forgot Password?
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-normal">
                        {TAGLINE}
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
            <form onSubmit={handleSubmit(handleForgotPassword)} className="space-y-5 mt-5 relative">
                {/* Success Message */}
                {isSuccess && (
                    <Alert variant="success" message={"Password reset link sent successfully!, Please check your email inbox and spam folder. The link will expire in 24 hours."} />
                )}

                {/* Error Message */}
                {isError && error && (
                    <Alert error={error} />
                )}

                <InputForm
                    label="Email Address"
                    name="email"
                    type="email"
                    register={register}
                    error={errors.email?.message}
                    placeholder="Enter your email address"
                    required={true}
                />

                <Button
                    className="w-full mt-1"
                    type="submit"
                    color="blue"
                    loading={isPending}
                    disabled={isButtonDisabled}
                    startIcon={<Mail />}
                >
                    {buttonText}
                </Button>

                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                    <span>Remember your password? </span>
                    <Link
                        href="/auth/login"
                        className="text-blue-600 dark:text-blue-400 underline font-medium"
                    >
                        Sign in
                    </Link>
                </div>
            </form>
        </>
    );
};

export default ForgotPassword;