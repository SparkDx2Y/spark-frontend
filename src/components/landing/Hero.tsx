const Hero = () => {
  return (
    <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 overflow-hidden">


      <div className="max-w-4xl mx-auto text-center relative z-10">

          {/* floating decorative circle */}

          <div className="absolute top-20 right-20 w-32 h-32  bg-purple-500  rounded-4xl blur-3xl opacity-35 animate-float-delayed" />
        <div className="absolute top-20 right-20 w-32 h-32  bg-purple-500  rounded-4xl blur-3xl opacity-35 animate-float-delayed" />


        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-6 py-2 mb-8 hover:bg-white/10 transition-all duration-300 cursor-pointer group">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
            Join 2M+ users finding love
          </span>
        </div>

        {/* Main Heading with Gradient */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          <span className="bg-linear-to-r from-white via-gray-300 to-white bg-clip-text text-transparent animate-gradient">
            Your one in a million
          </span>
          <br />
          <span className="bg-linear-to-r from-primary via-pink-400 to-purple-500 bg-clip-text text-transparent animate-gradient-shift">
            might be closer than you think.
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-xl sm:text-2xl text-gray-400 mb-4 max-w-2xl mx-auto">
          <span className="font-bold text-primary animate-pulse-slow">1.6 million</span> messages sent daily.
        </p>
        <p className="text-base sm:text-lg text-gray-500 mb-10 max-w-xl mx-auto">
          Connect with like-minded people who share your values, interests, and dreams.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button className="group relative bg-linear-to-r from-primary to-pink-600 text-white rounded-full px-10 py-4 font-semibold text-lg shadow-lg shadow-primary/50 hover:shadow-xl hover:shadow-primary/60 transition-all duration-300 hover:scale-105 overflow-hidden">
            <span className="relative z-10">CREATE ACCOUNT</span>
            <div className="absolute inset-0 bg-linear-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>100% Verified Profiles</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Safe & Secure</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>4.8/5 Rating</span>
          </div>
        </div>
      </div>

    </main>
  );
};

export default Hero;