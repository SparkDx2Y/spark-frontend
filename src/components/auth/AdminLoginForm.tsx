"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { loginSchema, LoginSchemaType } from "@/validations/auth/login.schema";
import { handleFormError } from "@/utils/handleFormError";
import { login } from "@/services/authService";
import { showSuccess } from "@/utils/toast";

export default function AdminLoginForm() {
    const router = useRouter()

    const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<LoginSchemaType>({
        resolver: zodResolver(loginSchema)
    })

    const onSubmit = async (data: LoginSchemaType) => {
        try {

            const response = await login(data)

            // Allow access for admin only
            if (response.user.role === 'admin') {
                showSuccess("Admin Login successfully")
                router.push('/admin/dashboard')
            } else {
                setError("root", { message: "Access denied. Admin account required." })
            }

        } catch (error: unknown) {
            handleFormError(error, setError, {
                email: "email",
                password: "password"
            })
        }

    }

    return (
        <div className="space-y-6 pt-4">


            {errors.root?.message && (
                <p className='text-red-500 text-sm text-center bg-red-500/10 py-2 rounded-lg'>{errors.root.message}</p>
            )}


            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <Input label="Admin Email" type="email"  {...register("email")} error={errors.email?.message} />

                <Input label="Password" type="password" {...register("password")} error={errors.password?.message} />

                <Button type='submit' className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Logging in..." : "Login to Dashboard"}
                </Button>
            </form>

        </div>
    );
}
