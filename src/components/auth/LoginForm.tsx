"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { FcGoogle } from "react-icons/fc";
import { loginSchema, LoginSchemaType } from "@/validations/auth/login.schema";
import { handleFormError } from "@/utils/handleFormError";
import { login } from "@/services/authService";
import { showSuccess } from "@/utils/toast";

export default function LoginForm() {
  const router = useRouter()

  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginSchemaType) => {
    try {

      const response = await login(data)
      
      if (response.isProfileCompleted) {
        showSuccess(response.message)
        router.push('/user/home')
      } else {
        router.push('/complete-profile')
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


      <div className="grid grid-cols-2 gap-4">
        <button className="w-full flex items-center justify-center px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-300 hover:bg-white/10 transition">
          Facebook
        </button>

        <button className="w-full flex items-center justify-center px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-300 hover:bg-white/10 transition">
          <FcGoogle className="w-5 h-5 mr-2" />
          Google
        </button>
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
