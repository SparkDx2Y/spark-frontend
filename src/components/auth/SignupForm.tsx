'use client';

import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import Input from "../ui/Input";
import Button from "../ui/Button";


import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { signupSchema, SignupSchemaType } from "@/validations/auth/signup.schema";
import { signup, googleLogin } from "@/services/authService";
import { handleFormError } from "@/utils/handleFormError";
import { showSuccess, showError, handleApiError } from "@/utils/toast";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/features/auth/authSlice";

export default function SignupForm() {

    const router = useRouter()
    const dispatch = useAppDispatch()

    //^ Initialize the  react hookform
    const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<SignupSchemaType>({
        resolver: zodResolver(signupSchema)
    });

    const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
        try {
            if (!credentialResponse.credential) {
                showError("Google Signup failed: No credential received");
                return;
            }

            const response = await googleLogin(credentialResponse.credential);

            dispatch(setCredentials({
                user: response.data.user
            }))

            if (response.data.user.isProfileCompleted) {
                showSuccess(response.message)
                router.push('/user/home')
            } else {
                router.push('/complete-profile')
            }
        } catch (error: unknown) {
            handleApiError(error, "Google Signup failed");
        }
    }



    //^ Handle the submit
    const onSubmit = async (data: SignupSchemaType) => {
        try {

            const response = await signup(data)

            showSuccess(response.message)

            router.push('/verify-otp?flow=signup')

        } catch (error: unknown) {

            handleFormError(error, setError, {
                email: 'email'
            })
        }
    }


    return (
        <div className='space-y-6'>

            <div className="text-center">
                <h2 className="text-2xl font-bold text-white">Sign Up</h2>
                <p className="text-gray-400">Join Spark and start your journey</p>
            </div>

            <div className="flex justify-center">
                <div className="w-full">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => showError("Google Signup failed")}
                        theme="filled_black"
                        shape="pill"
                        text="signup_with"
                        width="100%"
                    />
                </div>
            </div>

            {errors.root?.message && (
                <p className="text-red-500 text-sm text-center">{errors.root.message}</p>
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