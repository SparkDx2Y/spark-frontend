import Link from "next/link";
import Button from "../ui/Button";
import Input from "../ui/Input";





export default function ResetPasswordForm() {

    return (
        <div className='space-y-6'>

            <div className="text-center">
                <h2 className="text-2xl font-bold text-white">Reset Password</h2>
                <p className="text-gray-400">Enter your new password</p>
            </div>


            <form className="space-y-4">
                <Input label="New Password" type="password" />

                <Input label="Confirm New Password" type="password" />

                <Button>Reset Password</Button>
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