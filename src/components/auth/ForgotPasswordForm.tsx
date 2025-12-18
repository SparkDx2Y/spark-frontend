'use client'

import Link from "next/link";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { forgotPasswordSchema, ForgotPasswordSchemaType } from "@/validations/auth/forgot-password.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPassword } from "@/services/authService";
import { handleFormError } from "@/utils/handleFormError";
import { showSuccess } from "@/utils/toast";





export default function ForgotPasswordForm() {
    const router = useRouter()

    const { register, handleSubmit,setError, formState: { errors, isSubmitting}} = useForm<ForgotPasswordSchemaType>({
        resolver: zodResolver(forgotPasswordSchema)
    })

    const onSubmit = async (data: ForgotPasswordSchemaType) => {
        try {
            
            const response = await forgotPassword(data)
            showSuccess(response.message)
            router.push('/verify-otp?flow=forgot-password')

        } catch (error: unknown) {
            handleFormError(error, setError, {
                email: 'email'
            })
        }
    }

    return (
        <div className='space-y-6'>
        
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-white">Forgot Password</h2>
                        <p className="text-gray-400">Enter your email to reset your password</p>
                    </div>

                    { errors.root?.message && (
                        <p className="text-red-500 text-sm text-center">{ errors.root.message}</p>
                    )} 
   
                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        <Input label="Email Address" type="email" {...register('email')} error={errors.email?.message}/>
                        <Button type='submit' disabled={isSubmitting} >{isSubmitting ? "Sending Otp ..." : "Send OTP" }</Button>
                    </form>
        
                    <p className="text-center text-gray-400 text-sm">
                        Remember your password?{" "}
                        <Link href="/login" className="text-primary">
                            Log In
                        </Link>
                    </p>
                </div>
    )
}