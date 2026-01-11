'use client';

import { useEffect, useState } from "react";
import OtpInput from "../ui/OtpInput";
import Button from "../ui/Button";

import { useForm, Controller } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { otpSchema, OtpSchemaType } from "@/validations/auth/otp.schema";
import { handleFormError } from "@/utils/handleFormError";
import { resendOtp, verifyForgotPasswordOtp, verifyOtp } from "@/services/authService";
import { showSuccess } from "@/utils/toast";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/features/auth/authSlice";

const RESENDTIME_DELAY = 30

export default function OtpForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const flow = searchParams.get("flow");

  const [resendTime, setResendTime] = useState<number>(RESENDTIME_DELAY)

  //^ Form hooks
  const { control, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<OtpSchemaType>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' }
  })

  const isValidFlow = flow === 'signup' || flow === 'forgot-password';

  // Invalid Flow Protection
  useEffect(() => {
    if (!isValidFlow) {
      router.replace("/login");
    }
  }, [isValidFlow, router]);

  //^ Resend CountDown Timer  Effect
  useEffect(() => {
    if (resendTime === 0) return;

    const interval = setInterval(() => {
      setResendTime((prev) => prev - 1)
    }, 1000);

    return () => clearInterval(interval)
  }, [resendTime])

  //^ verify OTP
  const onSubmit = async (data: OtpSchemaType) => {
    try {
      if (flow === "forgot-password") {

        const response = await verifyForgotPasswordOtp(data);
        showSuccess(response.message)
        router.push("/reset-password");

      } else {

        const response = await verifyOtp(data);

        dispatch(setCredentials({
          user: {
            ...response.user,
            isProfileCompleted: response.isProfileCompleted
          }
        }))

        showSuccess(response.message)
        router.push("/complete-profile");

      }

    } catch (error) {
      handleFormError(error, setError, { otp: "otp" });
    }

  };

  //^ Resend OTP
  const handleResendOtp = async () => {
    try {

      const response = await resendOtp();
      showSuccess(response.message)

      setResendTime(RESENDTIME_DELAY)

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

      {/* SHOW GLOBAL ERROR  */}
      {errors.root?.message && (
        <p className="text-red-500 text-sm text-center">{errors.root.message}</p>
      )}

      {/* OTP FORM */}
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

        <Controller name='otp' control={control} render={({ field }) => (
          <OtpInput length={6} value={field.value} onChange={field.onChange} error={errors.otp?.message} />
        )}
        />

        <Button type='submit' disabled={isSubmitting}>{isSubmitting ? "Verifying..." : "Verify"}</Button>
      </form>

      {/* RESEND SECTION */}
      <div className="text-center text-sm text-gray-400">
        Didn&apos;t receive the code?{' '}
        <button type="button" disabled={resendTime > 0} onClick={handleResendOtp} className="text-primary hover:text-rose-500 font-medium transition-colors cursor-pointer disabled:text-gray-500 disabled:cursor-not-allowed">
          {resendTime > 0 ? `Resend in ${resendTime}s` : "Resend OTP"}
        </button>
      </div>


    </div>
  )
}