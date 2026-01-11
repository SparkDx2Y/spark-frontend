import Sidebar from "@/components/layout/Sidebar";

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-black text-gray-100">
            <Sidebar />
            <main className="flex-1 ml-20 min-h-screen">
                {children}
            </main>
        </div>
    );
}
