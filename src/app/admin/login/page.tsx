import Image from "next/image";
import AuthFormWrapper from "@/components/auth/AuthFormWrapper";
import AdminLoginForm from "@/components/auth/AdminLoginForm";

export default function AdminLoginPage() {

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 font-sans">
            <div className="mb-12 text-center">
                <div className="relative group transition-all duration-500">
                    <div className="absolute -inset-4 bg-amber-500/10 blur-2xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
                    <Image
                        src="/SparkLogo.png"
                        alt="Spark"
                        width={200}
                        height={70}
                        className="w-[180px] h-auto object-contain relative z-10 drop-shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                        priority
                    />
                    <div className="mt-8 flex flex-col items-center gap-2 relative z-10">
                        <p className="text-amber-500 text-[10px] font-black tracking-[0.4em] uppercase">
                            Administration Portal
                        </p>
                        <div className="h-px w-12 bg-linear-to-r from-transparent via-amber-500/50 to-transparent"></div>
                    </div>
                </div>
            </div>

            {/* Login Form */}
            <div className="w-full max-w-md relative">
                <div className="absolute -inset-2 bg-amber-500/5 blur-xl rounded-3xl opacity-50"></div>
                <AuthFormWrapper>
                    <AdminLoginForm />
                </AuthFormWrapper>
            </div>

            <p className="mt-12 text-stone-500 text-sm font-medium opacity-60">
                Authorized Access Only. All activities are monitored.
            </p>
        </div>
    );

}
