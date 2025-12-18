'use client';

import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import Input from "../ui/Input";
import Button from "../ui/Button";


import { signupSchema, SignupSchemaType } from "@/validations/auth/signup.schema";
import { signup } from "@/services/authService";
import { handleFormError } from "@/utils/handleFormError";
import { showSuccess } from "@/utils/toast";

export default function SignupForm() {

    const router = useRouter()

    //^ Initialize the  react hookform
    const { register, handleSubmit, setError,  formState: { errors, isSubmitting } } = useForm<SignupSchemaType>({
        resolver: zodResolver(signupSchema)
    });

    //^ Handle the submit
    const onSubmit = async (data: SignupSchemaType ) => {
        try {

           const response =  await signup(data)

            showSuccess(response.message)

            router.push('/verify-otp?flow=signup')

        } catch(error: unknown) {

            handleFormError(error, setError, {
                email:'email'
            })
        }
    }


    return (
        <div className='space-y-6'>

            <div className="text-center">
                <h2 className="text-2xl font-bold text-white">Sign Up</h2>
                <p className="text-gray-400">Join Spark and start your journey</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button className="w-full flex items-center justify-center px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-300 hover:bg-white/10 transition">
                    Facebook
                </button>

                <button className="w-full flex items-center justify-center px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-300 hover:bg-white/10 transition">
                    <FcGoogle className="w-5 h-5 mr-2" />
                    Google
                </button>
            </div>

            { errors.root?.message && (
                <p className="text-red-500 text-sm text-center">{ errors.root.message }</p>
            )}


            <div className="flex items-center gap-4 py-2">
                <div className="h-px bg-white/10 flex-1" />
                <span className="text-gray-500 text-sm">Or continue with</span>
                <div className="h-px bg-white/10 flex-1" />
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <Input label="Name" type="text"  {...register("name")} error={errors.name?.message} />

                <Input label="Email Address" type="email" {...register("email")} error={errors.email?.message} />

                <Input label="Password" type="password" {...register("password")} error={errors.password?.message} />

                <Input label="Confirm Password" type="password" {...register("confirmPassword")} error={errors.confirmPassword?.message} />

                <Button type='submit' disabled={isSubmitting}>{isSubmitting ? "Signing Up..." : "Sign Up"}</Button>
            </form>

            <p className="text-center text-gray-400 text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-primary">
                    Log In
                </Link>
            </p>
        </div>
    )
}