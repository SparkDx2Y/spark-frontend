import Link from "next/link";
import Image from "next/image";
const Navbar = () => {
  return (
    <nav className="bg-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="shrink-0 flex items-center">
            <Image src="/spark-logo.png" alt="Logo" width={150} height={150} />
          </div>
          <div>
            <Link href='/login'>
            <button className="text-gray-300 hover:text-white px-4 py-2">Log In</button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
export default Navbar;
