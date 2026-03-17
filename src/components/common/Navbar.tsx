import Link from "next/link";
import Image from "next/image";
import ScrollNav from "./ScrollNav";

const Navbar = () => {
  return (
    <ScrollNav>
      {/* Logo */}
      <Link href="/" className="shrink-0 flex items-center group">
        <div className="relative transition-transform duration-300 group-hover:scale-105">
          <Image
            src="/SparkLogo.png"
            alt="Spark Logo"
            width={600}
            height={200}
            priority
            className="w-24 sm:w-28 md:w-32 lg:w-36 h-auto"
          />
        </div>
      </Link>

      {/* Navigation Links - Hidden on mobile and tablet, shown on desktop */}
      <div className="hidden lg:flex items-center gap-4 xl:gap-6">
        <Link
          href="#features"
          className="text-gray-300 hover:text-white text-sm xl:text-base font-medium transition-colors duration-200 relative group"
        >
          Features
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-primary to-pink-500 group-hover:w-full transition-all duration-300"></span>
        </Link>
        <Link
          href="#how-it-works"
          className="text-gray-300 hover:text-white text-sm xl:text-base font-medium transition-colors duration-200 relative group whitespace-nowrap"
        >
          How It Works
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-primary to-pink-500 group-hover:w-full transition-all duration-300"></span>
        </Link>
        <Link
          href="#about"
          className="text-gray-300 hover:text-white text-sm xl:text-base font-medium transition-colors duration-200 relative group"
        >
          About
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-primary to-pink-500 group-hover:w-full transition-all duration-300"></span>
        </Link>
      </div>

      {/* CTA Button */}
      <div className="flex items-center">
        <Link
          href="/login"
          className="relative p-[1.5px] inline-flex items-center justify-center overflow-hidden rounded-full group transition-transform hover:scale-105"
        >
          <span className="absolute inset-[-1000%] animate-spin-slow bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_40%,#ff2daa_50%,transparent_60%,transparent_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center bg-black justify-center rounded-full px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-300 backdrop-blur-3xl transition-all group-hover:text-white whitespace-nowrap">
            Log In
          </span>
        </Link>
      </div>


    </ScrollNav>
  );
};

export default Navbar;