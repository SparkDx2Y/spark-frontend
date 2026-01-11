import AuthFormWrapper from "@/components/auth/AuthFormWrapper";
import AuthHero from "@/components/auth/AuthHero";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";





export default function OtpPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-20">

            <div className="w-full max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    

                    <div className="order-1 lg:order-0">
                        <AuthHero />
                    </div>

                    <div className="flex items-center justify-center order-0 lg:order-0">
                        <AuthFormWrapper>
                            <ResetPasswordForm />
                        </AuthFormWrapper>
                    </div>
                </div>
            </div>
        </div>
    )
}