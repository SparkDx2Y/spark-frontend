import dynamic from 'next/dynamic';
import Hero from "@/components/landing/Hero";

// Skeleton 
const SectionSkeleton = ({ h }: { h: string }) => (
  <div className={`w-full ${h} bg-black flex items-center justify-center`}>
    <div className="w-[90%] h-[90%] bg-white/2 rounded-[40px] xs:rounded-[60px] sm:rounded-[80px] lg:rounded-[100px] animate-pulse" />
  </div>
);

//* Lazy load components for better performance 
const Stats = dynamic(() => import("@/components/landing/Stats"), {
  ssr: true,
  loading: () => <SectionSkeleton h="h-[400px] sm:h-[500px]" />,
});

const Features = dynamic(() => import("@/components/landing/Features"), {
  ssr: true,
  loading: () => <SectionSkeleton h="h-[600px] sm:h-[800px]" />,
});

const HowItWorks = dynamic(() => import("@/components/landing/HowItWorks"), {
  ssr: true,
  loading: () => <SectionSkeleton h="h-[600px] lg:h-screen" />,
});

export default function LandingPage() {
  return (
    <div className="bg-black">
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
    </div>
  );
}
