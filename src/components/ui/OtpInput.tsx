'use client'

import { useRef } from "react";

interface OtpInputProps {
    length?: number;
    value: string;
    onChange: (value: string) => void;
    error?: string;
}


export default function OtpInput({ length = 6, value, onChange, error }: OtpInputProps) {

    const inputsRef = useRef<HTMLInputElement[]>([])

    const values = value.split('').concat(Array(length).fill('')).slice(0,length)

    const handleChange = (index: number, digit: string) => {

        if (!/\d?$/.test(digit)) return;

        const newValue = [...values];
        newValue[index] = digit;


        onChange(newValue.join(''));

        if (digit && index < length - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !values[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    return (
        <div className="space-y-2">

            <div className="flex justify-center gap-3">
                { values.map((digit, index) => (
                    <input key={index}
                    ref={ (el) => {
                        if(el) inputsRef.current[index] = el
                    }}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    maxLength={1}
                    inputMode="numeric"
                    className="w-12 h-14 text-center text-xl font-bold bg-white/5 border border-white/10 rounded-xl text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition "
                />
                ))}
            </div>

            { error && (
                <p className="text-red-500 text-sm">{error}</p>
            )}
        </div>
    )
}