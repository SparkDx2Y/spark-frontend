"use client";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

export default function LoginForm() {
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

      
      <form className="space-y-4">
        <Input label="Email Address" type="email" />

        <Input label="Password" type="password" />

        <div className="text-right">
          <Link href="/forgot-password" className="text-primary text-sm">
            Forgot Password?
          </Link>
        </div>

        <Button>Log In</Button>
      </form>

      
      <p className="text-center text-gray-400 text-sm">
        Don't have an account?{" "}
        <Link href="/signup" className="text-primary">
          Create Account
        </Link>
      </p>

    </div>
  );
}
