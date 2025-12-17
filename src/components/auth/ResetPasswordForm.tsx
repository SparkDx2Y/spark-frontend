'use client'

import Link from "next/link";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { resetPasswordSchema, ResetPasswordSchemaType } from "@/validations/auth/reset-password.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleFormError } from "@/utils/handleFormError";
import { resetPassword } from "@/services/authService";





export default function ResetPasswordForm() {
    const router = useRouter()

    const { register, handleSubmit, setError, formState: { errors, isSubmitting}} = useForm<ResetPasswordSchemaType>({
        resolver: zodResolver(resetPasswordSchema)
    })

    const onSubmit = async (data: ResetPasswordSchemaType ) => {
        try {
            await resetPassword(data)
            router.push('/login')
        } catch (error: unknown) {
            handleFormError(error, setError)
        }
    }
    return (
        <div className='space-y-6'>

            <div className="text-center">
                <h2 className="text-2xl font-bold text-white">Reset Password</h2>
                <p className="text-gray-400">Enter your new password</p>
            </div>

            { errors.root?.message && (
                <p className="text-red-500 text-sm text-center">{errors.root.message}</p>
            )}


            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <Input label="New Password" type="password" {...register('newPassword')} error={errors.newPassword?.message}/>

                <Input label="Confirm New Password" type="password" {...register('confirmPassword')} error={errors.confirmPassword?.message}/>

                <Button type='submit' disabled={isSubmitting}> {isSubmitting ? "Resetting..." : "Reset Password" }</Button>
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