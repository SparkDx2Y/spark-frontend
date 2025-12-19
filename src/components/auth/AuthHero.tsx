const AuthHero = () => {
  return (
    <div className="hidden lg:block space-y-6 relative z-10">

        {/* floating decorative circle */}

        <div className="absolute top-3 right-25 w-32 h-32  bg-purple-500  rounded-4xl blur-3xl opacity-35 animate-float-delayed" />
        <div className="absolute top-3 right-25 w-32 h-32  bg-purple-500  rounded-4xl blur-3xl opacity-35 animate-float-delayed" />
      
      <h1 className="text-5xl font-bold leading-tight">
        <span className="bg-linear-to-r from-white via-gray-300 to-white bg-clip-text text-transparent animate-gradient">
          Your one in a million
        </span>
        <br />
        <span className="bg-linear-to-r from-primary via-pink-400 to-purple-500 bg-clip-text text-transparent animate-gradient-shift">
          might be closer than you think.
        </span>
      </h1>

     
      <p className="text-lg text-gray-400 max-w-md">
        <span className="font-semibold text-primary">1.6 million</span> messages sent daily.
      </p>

    </div>
  );
};

export default AuthHero;
