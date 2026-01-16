import { Suspense } from "react";
import { getServerProfile } from "@/lib/data/user/userProfile.data";
import ProfileManager from "@/components/user/ProfileManager";
import { Loader2 } from "lucide-react";

/**
 * SERVER COMPONENT: User Profile Page
 * 1. Fetch the user's detailed profile on the SERVER.
 * 2. Render the ProfileManager (Client Component) with initial data.
 */

export default async function UserProfilePage() {
    // Fetch data instantly before rendering
    const profileData = await getServerProfile();

    return (
        <Suspense fallback={<ProfileLoading />}>
            <ProfileManager initialProfile={profileData} />
        </Suspense>
    );
}

function ProfileLoading() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    );
}
