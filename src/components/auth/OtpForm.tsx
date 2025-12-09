'use client';

import Input from "../ui/Input";
import Button from "../ui/Button";
import Link from "next/link";


export default function OtpForm() {

    return (
        <div className='space-y-6'>

            <div className="text-center">
                <h2 className="text-2xl font-bold text-white">Verify Your Email</h2>
                <p className="text-gray-400">Enter the verification code sent to your email</p>
            </div>

            <form className="space-y-4">
                <Input label="Verification Code" type="text" />

                <Button>Verify</Button>
            </form>

            <div className="text-center text-sm text-gray-400">
                Didn&apos;t receive the code?{' '}
                <button type="button" className="text-primary hover:text-primary/80 font-medium transition-colors cursor-pointer">
                    Resend
                </button>
            </div>


        </div>
    )
}