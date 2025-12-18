'use client';



import OtpInput from "../ui/OtpInput";
import Button from "../ui/Button";

import { useForm, Controller } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";

import { otpSchema, OtpSchemaType } from "@/validations/auth/otp.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleFormError } from "@/utils/handleFormError";
import { resendOtp, verifyForgotPasswordOtp, verifyOtp } from "@/services/authService";
import { showSuccess } from "@/utils/toast";



export default function OtpForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const flow = searchParams.get("flow");
  
    const isValidFlow =
      flow === "signup" || flow === "forgot-password";

    const { control, handleSubmit, setError, formState: { errors, isSubmitting }} = useForm<OtpSchemaType>({
        resolver: zodResolver(otpSchema),
        defaultValues: { otp: '' }
    })


    if (!isValidFlow) {
        router.replace("/login");
        return null;
      }

      
      const onSubmit = async (data: OtpSchemaType) => {
        try {
          if (flow === "forgot-password") {

           const response =  await verifyForgotPasswordOtp(data);
            showSuccess(response.message)
            router.push("/reset-password");

          } else {

          const response = await verifyOtp(data);
          showSuccess(response.message)
            router.push("/login");

          }

        } catch (error) {
          handleFormError(error, setError, { otp: "otp" });
        }

      };

    const handleResendOtp = async () => {
        try {
           const response = await resendOtp();
           showSuccess(response.message)
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
               
                <Controller name='otp' control={control} render={({field}) =>(
                  <OtpInput length={6} value={field.value} onChange={field.onChange} error={errors.otp?.message}/>
                  )}
                />

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