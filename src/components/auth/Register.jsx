'use client'

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRegister } from "@/queries/auth.query";
import Button from "@/components/ui/Button";
import { RegisterSchema } from "@/validation/schema";
import InputForm from "../form/InputForm";
import Alert from "../common/Alert";
import Link from "next/link";

export default function Register() {
    const { mutate, isPending, isError, error } = useRegister();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(RegisterSchema),
    });


    const handleRegister = async (data) => {
        const payload = { ...data, password_confirmation: data?.password };
        mutate(payload);
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
                        Register
                    </h1>
                </div>
                {/* Decorative Line */}
                <div className="flex items-center justify-center gap-2">
                    <div className="h-px w-12 bg-gradient-to-r from-transparent to-gray-300 dark:to-gray-600"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400"></div>
                    <div className="h-px w-12 bg-gradient-to-l from-transparent to-gray-300 dark:to-gray-600"></div>
                </div>
            </div>

            {/* form  */}
            <form onSubmit={handleSubmit(handleRegister)} className="space-y-5 mt-5 relative">
                {isError && (
                    <Alert error={error} />
                )}
                <div className="grid grid-cols-2 my-5 gap-x-2 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                        <InputForm
                            label='First Name'
                            required
                            name="first_name"
                            placeholder="First name"
                            register={register}
                            error={errors.first_name?.message}
                        />
                    </div>
                    <div className="sm:col-span-1">
                        <InputForm
                            label='Last Name'
                            required
                            name="last_name"
                            placeholder="Last name"
                            register={register}
                            error={errors.last_name?.message}
                        />
                    </div>
                </div>

                <InputForm
                    label='Email'
                    required
                    name="email"
                    placeholder="Email"
                    register={register}
                    type="email"
                    error={errors.email?.message}
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

                <Button className="w-full" loading={isPending} type="submit" variant='primary' size="md">
                    Register
                </Button>

                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                    <span>Already registered? </span>
                    <Link
                        href={`/auth/login`}
                        className="text-blue-600 dark:text-blue-400 underline font-medium"
                    >
                        Login
                    </Link>
                </div>
            </form>
        </ >
    );
}
