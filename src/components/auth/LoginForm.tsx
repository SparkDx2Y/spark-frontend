"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { FcGoogle } from "react-icons/fc";
import { GoogleLogin } from "@react-oauth/google";
import { loginSchema, LoginSchemaType } from "@/validations/auth/login.schema";
import { handleFormError } from "@/utils/handleFormError";
import { login, googleLogin } from "@/services/authService";
import { showSuccess, showError } from "@/utils/toast";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/features/auth/authSlice";

export default function LoginForm() {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      role: 'user'
    }
  })

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      if (!credentialResponse.credential) {
        showError("Google Login failed: No credential received");
        return;
      }
      const response = await googleLogin(credentialResponse.credential);

      dispatch(setCredentials({
        user: response.data.user
      }))

      if (!response.data.user.isProfileCompleted) {
        router.push('/complete-profile')
      } else if (!response.data.user.isInterestsSelected) {
        router.push('/interests')
      } else if (!response.data.user.isLocationCompleted) {
        router.push('/location')
      } else {
        showSuccess(response.message)
        router.push('/user/home')
      }
    } catch (error: any) {
      showError(error.response?.data?.message || "Google Login failed")
    }
  }


  const onSubmit = async (data: LoginSchemaType) => {
    try {

      const response = await login({ ...data, role: 'user' })

      dispatch(setCredentials({
        user: response.data.user
      }))

      if (!response.data.user.isProfileCompleted) {
        router.push('/complete-profile')
      } else if (!response.data.user.isInterestsSelected) {
        router.push('/interests')
      } else {
        showSuccess(response.message)
        router.push('/user/home')
      }

    } catch (error: unknown) {
      handleFormError(error, setError, {
        email: "email",
        password: "password"
      })
    }

  }

  return (
    <div className="space-y-6">


      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
        <p className="text-gray-400">Sign in to continue to Spark</p>
      </div>


      <div className="flex justify-center">
        <div className="w-full">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => showError("Google Login failed")}
            theme="filled_black"
            shape="pill"
            text="continue_with"
            width="100%"
          />
        </div>
      </div>


      <div className="flex items-center gap-4 py-2">
        <div className="h-px bg-white/10 flex-1" />
        <span className="text-gray-500 text-sm">Or continue with</span>
        <div className="h-px bg-white/10 flex-1" />
      </div>

      {errors.root?.message && (
        <p className='text-red-500 text-sm text-center'>{errors.root.message}</p>
      )}


      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Email Address" type="email"  {...register("email")} error={errors.email?.message} />

        <Input label="Password" type="password" {...register("password")} error={errors.password?.message} />

        <div className="text-right">
          <Link href="/forgot-password" className="text-primary text-sm">
            Forgot Password?
          </Link>
        </div>

        <Button type='submit' disabled={isSubmitting}>{isSubmitting ? "Signing In" : "Log In"}</Button>
      </form>


      <p className="text-center text-gray-400 text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-primary">
          Create Account
        </Link>
      </p>

    </div>
  );
}
