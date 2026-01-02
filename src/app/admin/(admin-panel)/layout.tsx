import AdminSidebar from "@/components/layout/AdminSidebar";

export default function AdminLayout({children}: {children: React.ReactNode}) {

    return (
        <div className="flex min-h-screen bg-transparent text-gray-100">
            <AdminSidebar />

            <main className="flex-1 ml-60 min-h-screen">
                <div className="p-8 lg:p-12 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
            
        </div>
    )

}