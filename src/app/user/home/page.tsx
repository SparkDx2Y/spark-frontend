import Image from "next/image";

const profiles = [
    { id: 1, name: "Sophie", image: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg" },
    { id: 2, name: "Emma", image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg" },
    { id: 3, name: "Charu Chandran", image: "https://images.pexels.com/photos/2681751/pexels-photo-2681751.jpeg" },
    { id: 4, name: "Meenakshi", image: "https://images.pexels.com/photos/3228727/pexels-photo-3228727.jpeg" }, // Using a pexels one as fallback for local file
    { id: 5, name: "Mrnul", image: "https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg" },
    { id: 6, name: "Kavya", image: "https://images.pexels.com/photos/3762800/pexels-photo-3762800.jpeg" },
    { id: 7, name: "Aisha", image: "https://images.pexels.com/photos/1840608/pexels-photo-1840608.jpeg" },
    { id: 8, name: "Nisha", image: "https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg" },
    { id: 9, name: "Divya", image: "https://images.pexels.com/photos/732425/pexels-photo-732425.jpeg" },
    { id: 10, name: "Arya", image: "https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg" },
];

export default function UserHomePage() {
    return (
        <div className="flex-1">
            {/* Hero Section with Background */}
            <section className="relative h-[60vh] min-h-[400px]">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.pexels.com/photos/3228727/pexels-photo-3228727.jpeg"
                        alt="Hero Background"
                        fill
                        className="object-cover"
                        priority
                        unoptimized
                    />
                    <div className="absolute inset-0 bg-linear-to-r from-black via-black/80 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-center px-8 sm:px-12">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 max-w-2xl text-white">
                        Find Your <span className="text-primary">Perfect Match</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl">
                        Discover amazing people near you and create meaningful connections.
                    </p>
                    <button className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-semibold w-fit transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20">
                        Start Matching
                    </button>
                </div>
            </section>

            {/* Content Section */}
            <div className="px-8 sm:px-12 py-12">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold">New Discoveries</h2>
                    <button className="text-primary hover:text-primary/80 font-medium transition-colors text-sm">
                        View All
                    </button>
                </div>

                {/* Main Profile Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                    {profiles.map((profile) => (
                        <div key={profile.id} className="group cursor-pointer">
                            <div className="relative aspect-3/4 rounded-2xl overflow-hidden shadow-xl ring-1 ring-white/10 transition-all duration-500 group-hover:ring-primary/50">
                                <Image
                                    src={profile.image}
                                    alt={profile.name}
                                    fill
                                    unoptimized
                                    className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-1 group-hover:translate-y-0 transition-transform">
                                    <h3 className="text-white font-semibold text-lg drop-shadow-md">{profile.name}</h3>
                                    <div className="h-0.5 w-0 bg-primary group-hover:w-full transition-all duration-500 rounded-full mt-1"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}