'use client'

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, AlertCircle, Loader } from "lucide-react";

import Button from "@/components/ui/Button";
import { useVerifyEmail, useVerifyToken } from "@/queries/auth.query";
import Alert from "../common/Alert";

// Constants
const VERIFICATION_STATES = {
    VALIDATING_PARAMS: 'validating_params',
    VALIDATING_TOKEN: 'validating_token',
    VERIFYING: 'verifying',
    SUCCESS: 'success',
    ERROR: 'error',
    INVALID_PARAMS: 'invalid_params',
    INVALID_TOKEN: 'invalid_token',
    ALREADY_VERIFIED: 'already_verified',
};

const ERROR_CODES = {
    EMAIL_ALREADY_VERIFIED: 'EMAIL_ALREADY_VERIFIED',
    USER_NOT_FOUND: 'USER_NOT_FOUND',
    INVALID_TOKEN: 'INVALID_TOKEN',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',
    NO_TOKEN_FOUND: 'NO_TOKEN_FOUND',
};

const REDIRECT_COUNTDOWN = 5; // seconds
const MIN_TOKEN_LENGTH = 10;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Utility to extract error code from API response
const getErrorCode = (error) => {
    return error?.response?.data?.error_code || null;
};

// Utility to check if email is already verified
const isAlreadyVerified = (error) => {
    const errorCode = getErrorCode(error);
    const message = error?.response?.data?.message?.toLowerCase() || '';

    return (
        errorCode === ERROR_CODES.EMAIL_ALREADY_VERIFIED ||
        message.includes('already verified')
    );
};

// Utility to get user-friendly error messages based on error code
const getErrorMessage = (errorCode, defaultMessage) => {
    const messages = {
        [ERROR_CODES.EMAIL_ALREADY_VERIFIED]: 'This email address has already been verified.',
        [ERROR_CODES.USER_NOT_FOUND]: 'No account found with this email address.',
        [ERROR_CODES.INVALID_TOKEN]: 'This verification link is invalid or has been corrupted.',
        [ERROR_CODES.TOKEN_EXPIRED]: 'This verification link has expired. Please request a new one.',
        [ERROR_CODES.NO_TOKEN_FOUND]: 'No verification token found. Please request a new verification email.',
    };

    return messages[errorCode] || defaultMessage;
};

// Validation Utilities
const validateEmail = (email) => {
    if (!email) return { isValid: false, error: 'Email is required.' };
    if (!EMAIL_REGEX.test(email)) return { isValid: false, error: 'Invalid email format.' };
    return { isValid: true, error: null };
};

const validateToken = (token) => {
    if (!token) return { isValid: false, error: 'Verification token is required.' };
    if (token.length < MIN_TOKEN_LENGTH) return { isValid: false, error: 'Invalid token format.' };
    return { isValid: true, error: null };
};

const validateParams = (email, token) => {
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) return emailValidation;

    const tokenValidation = validateToken(token);
    if (!tokenValidation.isValid) return tokenValidation;

    return { isValid: true, error: null };
};

// UI Components
const Logo = () => (
    <Link href='/' className="flex items-center justify-center">
        <img width={90} src="/images/logo/logo.png" alt="SuperoAgrobase Logo" />
    </Link>
);

const DecorativeLine = ({ color = 'gray' }) => {
    const dotColors = {
        gray: 'bg-gray-500 dark:bg-gray-400',
        blue: 'bg-blue-500 dark:bg-blue-400',
        green: 'bg-green-500 dark:bg-green-400',
        red: 'bg-red-500 dark:bg-red-400',
        amber: 'bg-amber-500 dark:bg-amber-400',
    };

    return (
        <div className="flex items-center justify-center gap-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-gray-300 dark:to-gray-600"></div>
            <div className={`w-1.5 h-1.5 rounded-full ${dotColors[color]}`}></div>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-gray-300 dark:to-gray-600"></div>
        </div>
    );
};

const PageHeader = ({ icon: Icon, iconColor, title, subtitle, email }) => (
    <div className="space-y-4">
        <Logo />

        <div className="flex items-center justify-center">
            <Icon className={`w-16 h-16 ${iconColor}`} />
        </div>

        <div>
            <h1 className="text-xl font-semibold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-100 dark:via-gray-200 dark:to-gray-100 bg-clip-text text-transparent">
                {title}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-normal mt-2">
                {subtitle}
            </p>
            {email && (
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {email}
                </p>
            )}
        </div>
    </div>
);

const InfoCard = ({ variant = 'info', title, children }) => {
    const variants = {
        info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400',
        success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400',
        warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400',
        error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400',
    };

    return (
        <div className={`border rounded-lg p-4 text-sm ${variants[variant]}`}>
            {title && <p className="font-medium mb-2">{title}</p>}
            {children}
        </div>
    );
};

// Main Component
const EmailVerification = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const email = searchParams.get('email');
    const token = searchParams.get('token');

    // State
    const [verificationState, setVerificationState] = useState(VERIFICATION_STATES.VALIDATING_PARAMS);
    const [countdown, setCountdown] = useState(REDIRECT_COUNTDOWN);
    const [validationError, setValidationError] = useState(null);

    // Memoized validation
    const paramsValidation = useMemo(() => validateParams(email, token), [email, token]);

    // Prepare token verification params
    const tokenVerifyParams = useMemo(() => {
        if (!email || !token || !paramsValidation.isValid) return null;
        return {
            email,
            token,
            type: 'email_verification'
        };
    }, [email, token, paramsValidation.isValid]);

    // API Hooks - Token Verification (Step 2)
    const {
        data: tokenData,
        isLoading: isValidatingToken,
        isError: isTokenError,
        error: tokenError,
        isSuccess: isTokenValid
    } = useVerifyToken(tokenVerifyParams, {
        enabled: verificationState === VERIFICATION_STATES.VALIDATING_TOKEN && !!tokenVerifyParams
    });

    // API Hooks - Email Verification (Step 3)
    const {
        mutateAsync: verifyEmail,
        isPending: isVerifying,
        isError: isVerifyError,
        error: verifyError
    } = useVerifyEmail();

    // Step 1: Validate URL Parameters
    useEffect(() => {
        if (!paramsValidation.isValid) {
            setVerificationState(VERIFICATION_STATES.INVALID_PARAMS);
            setValidationError(paramsValidation.error);
            return;
        }

        // Proceed to token validation
        setVerificationState(VERIFICATION_STATES.VALIDATING_TOKEN);
    }, [paramsValidation]);

    // Step 2: Handle Token Validation Response
    useEffect(() => {
        if (verificationState !== VERIFICATION_STATES.VALIDATING_TOKEN) return;

        // Token validation successful
        if (isTokenValid) {
            setVerificationState(VERIFICATION_STATES.VERIFYING);
            return;
        }

        // Token validation failed
        if (isTokenError) {
            // Check if email is already verified
            if (isAlreadyVerified(tokenError)) {
                setVerificationState(VERIFICATION_STATES.ALREADY_VERIFIED);
                return;
            }

            // Handle other token errors
            setVerificationState(VERIFICATION_STATES.INVALID_TOKEN);
            const errorCode = getErrorCode(tokenError);
            const defaultMessage = tokenError?.response?.data?.message
                || tokenError?.message
                || 'Invalid or expired verification token.';

            // Get user-friendly error message based on error code
            const errorMessage = getErrorMessage(errorCode, defaultMessage);
            setValidationError(errorMessage);
        }
    }, [verificationState, isTokenValid, isTokenError, tokenError]);

    // Step 3: Perform Email Verification
    useEffect(() => {
        if (verificationState !== VERIFICATION_STATES.VERIFYING) return;

        const performVerification = async () => {
            try {
                await verifyEmail({ email, token });
                setVerificationState(VERIFICATION_STATES.SUCCESS);
            } catch (error) {
                setVerificationState(VERIFICATION_STATES.ERROR);
            }
        };

        performVerification();
    }, [verificationState, email, token, verifyEmail]);

    // Step 4: Handle Success Redirect
    useEffect(() => {
        if (verificationState !== VERIFICATION_STATES.SUCCESS) return;

        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(prev => prev - 1);
            }, 1000);

            return () => clearTimeout(timer);
        }

        if (countdown === 0) {
            router.push('/');
        }
    }, [verificationState, countdown, router]);

    // Handlers
    const handleRetry = useCallback(() => {
        if (email && token) {
            setVerificationState(VERIFICATION_STATES.VALIDATING_TOKEN);
            setValidationError(null);
        }
    }, [email, token]);

    const handleRequestNewEmail = useCallback(() => {
        router.push('/auth/verify-email');
    }, [router]);

    // Render Functions
    const renderInvalidParams = () => (
        <div className="text-center space-y-6 relative">
            <PageHeader
                icon={AlertCircle}
                iconColor="text-red-500 dark:text-red-400"
                title="Invalid Verification Link"
                subtitle={validationError}
            />

            <DecorativeLine color="red" />

            <div className="space-y-3">
                <InfoCard variant="error" title="What to do next:">
                    <ul className="space-y-1 list-disc list-inside text-xs">
                        <li>Request a new verification email</li>
                        <li>Use the latest link sent to your email</li>
                        <li>Check your spam folder</li>
                        <li>Ensure you copied the complete link</li>
                    </ul>
                </InfoCard>

                <div className="flex flex-col gap-3">
                    <Button className="w-full" color="blue" onClick={handleRequestNewEmail}>
                        Request New Verification Email
                    </Button>
                    <Button className="w-full" color="gray" variant="outline" href={'/'}>
                        Go to Home
                    </Button>
                </div>
            </div>
        </div>
    );

    const renderAlreadyVerified = () => (
        <div className="text-center space-y-6 relative">
            <PageHeader
                icon={CheckCircle2}
                iconColor="text-green-500 dark:text-green-400"
                title="Email Already Verified"
                subtitle="Your email address has already been verified"
                email={email}
            />

            <DecorativeLine color="green" />

            <div className="space-y-3">
                <InfoCard variant="success" title="Good news!">
                    <p className="text-xs">
                        Your email address is already verified, Go to Homepage.
                    </p>
                </InfoCard>

                <div className="flex flex-col gap-3">
                    <Button className="w-full" color="gray" variant="outline" href={'/'}>
                        Go to Home
                    </Button>
                </div>
            </div>
        </div>
    );

    const renderValidatingToken = () => (
        <div className="text-center space-y-6 relative">
            <PageHeader
                icon={Loader}
                iconColor="text-blue-500 dark:text-blue-400 animate-spin"
                title="Validating Verification Link"
                subtitle="Please wait while we validate your verification link..."
                email={email}
            />

            <DecorativeLine color="blue" />

            <InfoCard variant="info">
                <p className="text-xs">
                    We're checking if your verification link is valid and has not expired.
                </p>
            </InfoCard>
        </div>
    );

    const renderInvalidToken = () => (
        <div className="text-center space-y-6 relative">
            <PageHeader
                icon={XCircle}
                iconColor="text-red-500 dark:text-red-400"
                title="Invalid Verification Token"
                subtitle={validationError}
                email={email}
            />

            <DecorativeLine color="red" />

            <div className="space-y-3">
                <InfoCard variant="error" title="Common reasons:">
                    <ul className="space-y-1 list-disc list-inside text-xs">
                        <li>The verification link has expired (valid for 60 minutes)</li>
                        <li>The link has already been used</li>
                        <li>The token format is invalid or corrupted</li>
                        <li>You may have clicked an old verification link</li>
                    </ul>
                </InfoCard>

                <div className="flex flex-col gap-3">
                    <Button className="w-full" color="green" onClick={handleRequestNewEmail}>
                        Request New Verification Email
                    </Button>
                    <Button className="w-full" color="gray" variant="outline" href={'/'}>
                        Go to Home
                    </Button>
                </div>
            </div>
        </div>
    );

    const renderVerifying = () => (
        <div className="text-center space-y-6 relative">
            <PageHeader
                icon={Loader}
                iconColor="text-blue-500 dark:text-blue-400 animate-spin"
                title="Verifying Your Email"
                subtitle="Please wait while we verify your email address..."
                email={email}
            />

            <DecorativeLine color="blue" />

            <InfoCard variant="info">
                <p className="text-xs">
                    This will only take a moment. Do not close this page.
                </p>
            </InfoCard>
        </div>
    );

    const renderSuccess = () => (
        <div className="text-center space-y-6 relative">
            <PageHeader
                icon={CheckCircle2}
                iconColor="text-green-500 dark:text-green-400"
                title="Email Verified Successfully!"
                subtitle="Your account has been verified. You can now access all features."
                email={email}
            />

            <DecorativeLine color="green" />

            <div className="space-y-3">
                <InfoCard variant="success" title="Welcome to SuperoAgrobase!">
                    <p className="text-xs">
                        Redirecting to home in {countdown} second{countdown !== 1 ? 's' : ''}...
                    </p>
                </InfoCard>

                <Button className="w-full" color="green" href={'/'}>
                    Go to Home Now
                </Button>
            </div>
        </div>
    );

    const renderError = () => (
        <div className="text-center space-y-6 relative">
            <PageHeader
                icon={XCircle}
                iconColor="text-red-500 dark:text-red-400"
                title="Verification Failed"
                subtitle="We couldn't verify your email address"
                email={email}
            />

            <DecorativeLine color="red" />

            <div className="space-y-3">
                {isVerifyError && verifyError && (
                    <Alert error={verifyError} />
                )}

                <InfoCard variant="warning" title="What might have gone wrong:">
                    <ul className="space-y-1 list-disc list-inside text-xs">
                        <li>The verification link has expired</li>
                        <li>The link has already been used</li>
                        <li>Network connection issue</li>
                        <li>Server temporarily unavailable</li>
                    </ul>
                </InfoCard>

                <div className="flex flex-col gap-3">
                    <Button
                        className="w-full"
                        color="blue"
                        onClick={handleRetry}
                        disabled={isVerifying}
                        loading={isVerifying}
                    >
                        Try Again
                    </Button>
                    <Button className="w-full" color="green" onClick={handleRequestNewEmail}>
                        Request New Verification Email
                    </Button>
                    <Button className="w-full" color="gray" variant="outline" href={'/'}>
                        Go to Home
                    </Button>
                </div>
            </div>
        </div>
    );

    // State Router
    const renderContent = () => {
        switch (verificationState) {
            case VERIFICATION_STATES.INVALID_PARAMS:
                return renderInvalidParams();
            case VERIFICATION_STATES.VALIDATING_TOKEN:
                return renderValidatingToken();
            case VERIFICATION_STATES.INVALID_TOKEN:
                return renderInvalidToken();
            case VERIFICATION_STATES.ALREADY_VERIFIED:
                return renderAlreadyVerified();
            case VERIFICATION_STATES.VERIFYING:
                return renderVerifying();
            case VERIFICATION_STATES.SUCCESS:
                return renderSuccess();
            case VERIFICATION_STATES.ERROR:
                return renderError();
            default:
                return renderValidatingToken();
        }
    };

    return renderContent();
};

export default EmailVerification;