import Link from "next/link";
import Image from "next/image";
import ScrollNav from "./ScrollNav";

const Navbar = () => {
  
  return (
      <ScrollNav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center group">
            <div className="relative transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/SparkLogo.png"
                alt="Spark Logo"
                width={140}
                height={140}
                className="w-32 sm:w-36 h-auto"
              />
            </div>
          </Link>

          {/* Navigation Links - Hidden on mobile, shown on desktop */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-gray-300 hover:text-white font-medium transition-colors duration-200 relative group"
            >
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-pink-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="#how-it-works"
              className="text-gray-300 hover:text-white font-medium transition-colors duration-200 relative group"
            >
              How It Works
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-pink-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="#about"
              className="text-gray-300 hover:text-white font-medium transition-colors duration-200 relative group"
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-pink-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Log In Button */}
            <Link
              href="/login"
              className="text-gray-300 hover:text-white font-medium px-4 sm:px-6 py-2 sm:py-2.5 rounded-full hover:bg-white/5 transition-all duration-200"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>


    </ScrollNav>
  );
};

export default Navbar;
