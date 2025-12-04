export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 mt-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Footer Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                <div>
                    <h3 className="text-white font-semibold mb-4">Spark Dating</h3>
                    <ul className="space-y-3">
                        <li><a href="#" className="text-gray-400 hover:text-white transition-colors">iPhone Dating App</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Android Dating App</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Start Dating</a></li>
                    </ul>
                </div>

                {/* <!-- Dating and Relationship Advice Column --> */}
                <div>
                    <h3 className="text-white font-semibold mb-4">Dating and Relationship Advice</h3>
                    <ul className="space-y-3">
                        <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Dating Tips</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Online Dating Advice</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Relationship Advice</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Single Life</a></li>
                    </ul>
                </div>

                {/* <!-- About Column --> */}
                <div>
                    <h3 className="text-white font-semibold mb-4">About Spark</h3>
                    <ul className="space-y-3">
                        <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Success Couples</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help</a></li>
                    </ul>
                </div>

                {/* <!-- Follow Column --> */}
                <div>
                    <h3 className="text-white font-semibold mb-4">Follow Spark</h3>
                    <div className="flex space-x-4">
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                            <span className="sr-only">Facebook</span>
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" clipRule="evenodd"/>
                            </svg>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                            <span className="sr-only">Twitter</span>
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                            <span className="sr-only">Instagram</span>
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.597 0-2.917-.01-3.96-.058-.976-.045-1.505-.207-1.858-.344a3.097 3.097 0 00-1.15-.748 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        {/* Legal Links and Safety Notice */}
        <div className="border-t border-gray-800 pt-8">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <p className="text-gray-500 text-sm">© Copyright 2025 Spark, Inc. All rights reserved.</p>
                    <div className="flex flex-wrap justify-center gap-4 text-sm">
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">Accessibility</a>
                        <span className="text-gray-700">|</span>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">Safety</a>
                        <span className="text-gray-700">|</span>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
                        <span className="text-gray-700">|</span>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
                        <span className="text-gray-700">|</span>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">Imprint</a>
                        <span className="text-gray-700">|</span>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">Online Dating Safety Policy</a>
                    </div>
                </div>

                {/* <!-- Safety Notice --> */}
                <div className="mt-8 text-sm text-gray-400">
                    <p className="uppercase font-medium mb-2">SPARK DOES NOT CONDUCT CRIMINAL BACKGROUND CHECKS ON THE MEMBERS OR THE SUBSCRIBERS OF THIS WEBSITE.</p>
                    <p>HOWEVER, THE SAFETY AND SECURITY OF OUR MEMBERS IS OUR TOP PRIORITY. BY SIGNING UP TO OUR SERVICES YOU ALSO AGREE TO READ AND FOLLOW OUR 
                        <a href="#" className="text-blue-400 hover:text-blue-300">ONLINE DATING SAFETY TIPS</a>.
                    </p>
                </div>
            </div>
        </div>
    </footer>
  );
}