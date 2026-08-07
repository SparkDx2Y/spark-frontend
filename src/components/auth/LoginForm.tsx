"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { loginSchema, LoginSchemaType } from "@/validations/auth/login.schema";
import { handleFormError } from "@/utils/handleFormError";
import { login, googleLogin } from "@/services/authService";
import { showSuccess, showError, handleApiError } from "@/utils/toast";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/features/auth/authSlice";

export default function LoginForm() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [showDemoModal, setShowDemoModal] = useState(false)

  const { register, handleSubmit, setError, setValue, formState: { errors, isSubmitting } } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      role: 'user'
    }
  })

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
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
    } catch (error: unknown) {
      handleApiError(error, "Google Login failed");
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

  const fillDemoAndSubmit = (type: 'male' | 'female') => {
    setShowDemoModal(false);
    
    // Set these to the real demo values provided and trigger login immediately
    if (type === 'male') {
      setValue('email', 'bajebi5787@dnsink.com');
      setValue('password', 'Dawson@123');
      onSubmit({ email: 'bajebi5787@dnsink.com', password: 'Dawson@123', role: 'user' });
    } else {
      setValue('email', 'dpdntadauuoaepzojs@jbsze.net');
      setValue('password', 'Jessy@123');
      onSubmit({ email: 'dpdntadauuoaepzojs@jbsze.net', password: 'Jessy@123', role: 'user' });
    }
  }

  return (
    <>
      <div className="space-y-6 relative">


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
          
          <button 
            type="button" 
            onClick={() => setShowDemoModal(true)}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 py-3 rounded-full hover:bg-purple-600/30 transition-colors text-white font-semibold mt-4"
          >
             Try Guest User
          </button>
        </form>


        <p className="text-center text-gray-400 text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary">
            Create Account
          </Link>
        </p>

      </div>

      {/* Demo Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Select Demo Persona</h3>
              <p className="text-gray-400 text-sm">Choose an account to explore Spark</p>
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={() => fillDemoAndSubmit('male')}
                className="w-full flex items-center justify-center gap-3 bg-blue-600/20 border border-blue-500/30 py-3 rounded-xl hover:bg-blue-600/30 transition-colors text-blue-400 font-medium"
              >
                <span>👨</span> Male Profile
              </button>
              
              <button 
                onClick={() => fillDemoAndSubmit('female')}
                className="w-full flex items-center justify-center gap-3 bg-pink-600/20 border border-pink-500/30 py-3 rounded-xl hover:bg-pink-600/30 transition-colors text-pink-400 font-medium"
              >
                <span>👩</span> Female Profile
              </button>
            </div>
            
            <button 
              onClick={() => setShowDemoModal(false)}
              className="w-full mt-6 py-2 text-gray-500 hover:text-white transition-colors text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
