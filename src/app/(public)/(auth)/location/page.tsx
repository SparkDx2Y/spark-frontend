
import AuthFormWrapper from "@/components/auth/AuthFormWrapper";
import AuthHero from "@/components/auth/AuthHero";
import LocationRequest from "@/components/auth/LocationRequest";

export default function LocationPage() {
    return (
        <div className="min-h-[85vh] flex items-center justify-center px-4 py-10">

            <div className="w-full max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    <div className="order-1 lg:order-0 hidden lg:block">
                        <AuthHero />
                    </div>

                    <div className="flex items-center justify-center order-0 lg:order-0">
                        <AuthFormWrapper>
                            <LocationRequest />
                        </AuthFormWrapper>
                    </div>
                </div>
            </div>
        </div>
    )
}
