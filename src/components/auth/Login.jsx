'use client'

import Button from "@/components/ui/Button";
import { useLogin } from "@/queries/auth.query";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { LoginSchema } from "@/validation/schema";
import InputForm from "../form/InputForm";
import Alert from "../common/Alert";
import { LogIn } from "lucide-react";

const Login = ({ redirectTo }) => {
    const { mutateAsync, isPending, isError, error } = useLogin({ redirectTo });

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(LoginSchema)
    });

    const handleLogin = async (data) => {
        try {
            await mutateAsync(data);
            reset();
        } catch (err) { }
    }

    return (
        <>
            {/* Header Section */}
            <div className="text-center space-y-3 relative">
                <div className="space-y-1">
                    <Link href='/' className="flex items-center justify-center">
                        <img width={90} src="/images/logo/logo.png" alt="logo" />
                    </Link>
                    <h1 className="text-xl gap-1 font-semibold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-100 dark:via-gray-200 dark:to-gray-100 bg-clip-text text-transparent">
                        Welcome Back
                    </h1>
                </div>

                {/* Decorative Line */}
                <div className="flex items-center justify-center gap-2">
                    <div className="h-px w-12 bg-gradient-to-r from-transparent to-gray-300 dark:to-gray-600"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400"></div>
                    <div className="h-px w-12 bg-gradient-to-l from-transparent to-gray-300 dark:to-gray-600"></div>
                </div>
            </div>


            {/* Form */}
            <form onSubmit={handleSubmit(handleLogin)} className="space-y-5 mt-5 relative">
                {isError && (
                    <Alert error={error} />
                )}
                <InputForm
                    label="Email"
                    name="email"
                    type="email"
                    register={register}
                    error={errors.email?.message}
                    placeholder="Enter your email"
                    required={true}
                />

                <InputForm
                    label="Password"
                    name="password"
                    type="password"
                    register={register}
                    error={errors.password?.message}
                    placeholder="Enter your password"
                    required={true}
                />

                <Link
                    href={`/forgot-password`}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-normal  text-xs"
                >
                    Forget Password?
                </Link>
                <Button
                    className="w-full mt-1"
                    type="submit"
                    color="green"
                    loading={isPending}
                    startIcon={<LogIn />}
                >
                    Login
                </Button>


                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                    <span>Don't have an account?  </span>
                    <Link
                        href={`/auth/register`}
                        className="text-blue-600 dark:text-blue-400 underline font-medium"
                    >
                        Register
                    </Link>
                </div>
            </form>
        </>
    );
};

export default Login;