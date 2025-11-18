'use client'

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "@/schema";
import { useRegister } from "@/queries/auth.query";
import { UserRole, UserRoles } from "@/utils/constant";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Message from "@/components/common/Message";
import Animation from "@/components/common/Animation";

export default function Register() {
    const { mutate, isPending, isError, error } = useRegister();
    const [role, setRole] = useState(UserRole.MEMBER)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(registerSchema),
    });


    const handleRegister = async (data) => {
        const payload = { ...data, role };
        mutate(payload);
    }

    return (
        <Animation animation={'zoom-in'} className="my-48 flex items-center justify-center">

            <div className="flex flex-col justify-center flex-1 w-full max-w-lg mx-auto shadow px-10 py-2 bg-white dark:bg-gray-800 rounded-lg border-1">
                <div className="my-3">
                    <h4 className="font-semibold text-gray-800 text-lg dark:text-white/90">
                        Sign Up
                    </h4>
                </div>
                <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                    <form onSubmit={handleSubmit(handleRegister)} className="my-5">
                        <div className="space-y-5">
                            <div className="w-full max-w-2xl mx-auto">
                                <div className="flex flex-auto justify-evenly border rounded-md w-full">
                                    {UserRoles?.map((rol) => (
                                        <button
                                            key={rol?.id}
                                            type="button"
                                            className={`${role === rol?.name ? "bg-blue-600 text-white" : ""} border-none px-2 py-1 rounded-md w-full text-sm`}
                                            onClick={() => setRole(rol?.name)}
                                        >
                                            <input type="radio" className="hidden" id={rol?.name} checked={role === rol?.name} readOnly />
                                            <label className="cursor-pointer" htmlFor={rol?.name}>{rol?.name}</label>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 my-5 gap-x-2 sm:grid-cols-2">
                                <div className="sm:col-span-1">
                                    <InputForm
                                        name="first_name"
                                        placeholder="First name"
                                        register={register}
                                        error={errors.first_name?.message}
                                    />
                                </div>
                                <div className="sm:col-span-1">
                                    <InputForm
                                        name="last_name"
                                        placeholder="Last name"
                                        register={register}
                                        error={errors.last_name?.message}
                                    />
                                </div>
                            </div>
                            <div className="my-5">
                                <InputForm
                                    name="phone_number"
                                    placeholder="Phone number"
                                    register={register}
                                    type="text"
                                    error={errors.phone_number?.message}
                                />
                            </div>
                            <div className="my-5">
                                <InputForm
                                    name="email"
                                    placeholder="Email"
                                    register={register}
                                    type="email"
                                    error={errors.email?.message}
                                />
                            </div>
                            {/* <!-- Password --> */}
                            <div className="my-5">
                                <div className="relative">
                                    <SelectForm name="gender"
                                        placeholder="Gender"
                                        register={register}
                                        options={[
                                            { id: 'Male', name: "Male" },
                                            { id: 'Female', name: "Female" }
                                        ]}
                                        error={errors.gender?.message} />
                                </div>
                            </div>

                            {isError && (
                                <Message
                                    variant="error"
                                    data={error?.data}
                                />
                            )}

                            <div>
                                <Button loading={isPending} type="submit" variant='primary' size="md">
                                    Register
                                </Button>
                            </div>
                        </div>
                    </form>

                </div>
            </div >
        </Animation >
    );
}
