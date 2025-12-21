'use client';

import { Plus, X } from "lucide-react";

import Image from "next/image";

import Input from "../ui/Input";
import Button from "../ui/Button";



export default function CompleteProfileForm() {


    return (
        <div className='space-y-6'>
            <div className="text-center">
                <h2 className="text-2xl font-bold text-white">Complete Profile</h2>
                <p className="text-gray-400">Tell us a bit more about yourself</p>
            </div>

            <form className="space-y-4">
{/* DOB & Gender Row */}
<div className="grid grid-cols-2 gap-4">
  <Input
    label="Date of Birth"
    type="date"
  />

  <div className="relative w-full group">
    <select
      defaultValue=""
      className="w-full px-4 pt-6 pb-2 border border-white/10 rounded-xl text-gray-100 bg-transparent outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all duration-200 appearance-none"
    >
      <option value="" disabled className="bg-gray-900">
        Select Gender
      </option>
      <option value="male" className="bg-gray-900">Male</option>
      <option value="female" className="bg-gray-900">Female</option>
    </select>

    <label className="absolute left-4 top-2 text-gray-400 text-xs pointer-events-none">
      Gender
    </label>
  </div>
</div>


                {/* Interested In */}
                <div className="relative w-full group">
                    <select
                        defaultValue=""
                        className="w-full px-4 pt-6 pb-2 border border-white/10 rounded-xl text-gray-100 bg-transparent outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all duration-200 appearance-none"
                    >
                        <option value="" disabled className="bg-gray-900">Select Preference</option>
                        <option value="men" className="bg-gray-900">Men</option>
                        <option value="women" className="bg-gray-900">Women</option>
                        <option value="everyone" className="bg-gray-900">Everyone</option>
                    </select>
                    <label className="absolute left-4 top-2 text-gray-400 text-xs pointer-events-none">
                        Interested In
                    </label>
                </div>

                {/* Mobile No */}
                <Input
                    label="Mobile Number"
                    type="tel"
                />

                {/* Profile Photos */}
                <div className="space-y-2">
                    <label className="text-gray-400 text-sm ml-1">Profile Photos</label>
                    <div className="grid grid-cols-3 gap-2">
                        <button
                            type="button"

                            className="aspect-square rounded-xl border border-dashed border-white/20 flex flex-col items-center justify-center text-gray-500 hover:text-primary hover:border-primary/50 transition-colors bg-white/5"
                        >
                            <Plus size={24} />
                        </button>

                    </div>

                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                    />

                    <p className="text-xs text-gray-500 text-center">Upload 2-6 photos to complete your profile</p>
                </div>

                <Button type='submit'>
                    Complete Profile
                </Button>
            </form>
        </div>
    )
}
