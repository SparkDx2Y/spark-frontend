import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import InterestsGuard from "@/components/guards/InterestsGuard";

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-black text-gray-100 overflow-x-hidden">
            <Sidebar />
            <MobileNav />
            <main className="flex-1 md:ml-20 min-h-screen pb-24 md:pb-0">
                <InterestsGuard>
                    {children}
                </InterestsGuard>
            </main>
        </div>
    );
}
