'use client'

import Button from "@/components/ui/Button";
import { useLogin } from "@/queries/auth.query";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Animation from "../common/Animation";
import Link from "next/link";
import { LoginSchema } from "@/validation/schema";
import InputForm from "../form/InputForm";
import Alert from "../common/Alert";
import { useSearchParams } from "next/navigation";

function LoginFormWrapper() {
    const searchParams = useSearchParams();
    const redirectTo = searchParams?.get('redirect');

    return <Login redirectTo={redirectTo} />;
}

const Login = () => {
    const searchParams = useSearchParams()
    const redirectTo = searchParams?.get('redirect');
    const { mutateAsync, isPending, isError, error } = useLogin({ redirectTo });

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(LoginSchema),
    });

    const email = watch('email');

    const handleLogin = async (data) => {
        try {
            await mutateAsync(data);
            reset();
        } catch (err) { }
    }

    return (
        <Animation animation={'zoom-in'} className="flex items-center justify-center px-4 my-12">
            <div className="w-full max-w-lg relative">
                <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-3xl py-8 px-6 md:p-10  shadow border-white/20 ">

                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 dark:from-green-400/20 to-transparent rounded-bl-full"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-green-500/10 dark:from-green-400/20 to-transparent rounded-tr-full"></div>

                    {/* Header Section */}
                    <div className="text-center mb-7 relative">
                        <div className="space-y-1">
                            <Link href='/' className="flex items-center justify-center">
                                <img width={90} src="/images/logo/logo.png" alt="logo" />
                            </Link>
                            <h1 className="text-xl gap-1 font-semibold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-100 dark:via-gray-200 dark:to-gray-100 bg-clip-text text-transparent">
                                Welcome Back
                            </h1>
                        </div>

                        {/* Decorative Line */}
                        <div className="mt-6 flex items-center justify-center gap-2">
                            <div className="h-px w-12 bg-gradient-to-r from-transparent to-gray-300 dark:to-gray-600"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400"></div>
                            <div className="h-px w-12 bg-gradient-to-l from-transparent to-gray-300 dark:to-gray-600"></div>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(handleLogin)} className="space-y-5 relative">
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

                        {isError && (
                            <Alert error={error} />
                        )}

                        <Button
                            className="w-full mt-1"
                            type="submit"
                            color="green"
                            loading={isPending}
                        >
                            Sign In
                        </Button>

                        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                            <span>Can't remember your password?  </span>
                            {/* <Link
                                href={`/forgot-password?email=${email}`}
                                className="text-red-600 dark:text-red-400 hover:underline font-medium"
                            >
                                Forgot password
                            </Link> */}
                        </div>
                    </form>
                </div>
            </div>
        </Animation>
    );
};

export default LoginFormWrapper;