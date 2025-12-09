import Link from "next/link";
import Button from "../ui/Button";
import Input from "../ui/Input";





export default function ForgotPasswordForm() {

    return (
        <div className='space-y-6'>
        
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-white">Forgot Password</h2>
                        <p className="text-gray-400">Enter your email to reset your password</p>
                    </div>
   
                    <form className="space-y-4">
                        <Input label="Email Address" type="email" />
                        <Button>Send Reset Link</Button>
                    </form>
        
                    <p className="text-center text-gray-400 text-sm">
                        Remember your password?{" "}
                        <Link href="/login" className="text-primary">
                            Log In
                        </Link>
                    </p>
                </div>
    )
}