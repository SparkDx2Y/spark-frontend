'use client';



import Link from "next/link";
import Input from "../ui/Input";
import Button from "../ui/Button";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { otpSchema, OtpSchemaType } from "@/validations/auth/otp.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleFormError } from "@/utils/handleFormError";
import { resendOtp, verifyOtp } from "@/services/authService";



export default function OtpForm() {
    const router = useRouter();

    const { register, handleSubmit, setError, formState: { errors, isSubmitting }} = useForm<OtpSchemaType>({
        resolver: zodResolver(otpSchema)
    })

    const onSubmit = async (data: OtpSchemaType) => {
        try {
            await verifyOtp(data);

            router.push("/login")
        } catch (error: unknown) {
            handleFormError(error, setError, {
                otp: "otp"
            });
        }
    }

    const handleResendOtp = async () => {
        try {
            await resendOtp();
        } catch (error: unknown) {
            handleFormError(error, setError)
        }
    }

    return (
        <div className='space-y-6'>

            <div className="text-center">
                <h2 className="text-2xl font-bold text-white">Verify Your Email</h2>
                <p className="text-gray-400">Enter the verification code sent to your email</p>
            </div>

            {errors.root?.message && (
                <p className="text-red-500 text-sm text-center">{errors.root.message}</p>
            )}

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <Input label="Verification Code" type="text" {...register("otp")} error={errors.otp?.message}/>

                <Button type='submit' disabled={isSubmitting}>{isSubmitting ? "Verifying..." : "Verify" }</Button>
            </form>

            <div className="text-center text-sm text-gray-400">
                Didn&apos;t receive the code?{' '}
                <button type="button"  onClick={handleResendOtp} className="text-primary hover:text-primary/80 font-medium transition-colors cursor-pointer">
                    Resend
                </button>
            </div>


        </div>
    )
}