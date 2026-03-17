import Navbar from "@/components/common/Navbar"
import Footer from "@/components/common/Footer"
import "./landing.css"

export default function PublicLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="text-white relative min-h-screen bg-black">
      {/* NAVBAR */}
      <Navbar />

      {/* PAGE CONTENT */}
      <main className="relative z-10">
        {children}
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  )
}