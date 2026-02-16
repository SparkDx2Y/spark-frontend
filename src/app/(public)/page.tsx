import dynamic from 'next/dynamic';
import Hero from "@/components/landing/Hero";

//* Lazy load  components for better performance
const Stats = dynamic(() => import("@/components/landing/Stats"), {
  ssr: true,
});

const Features = dynamic(() => import("@/components/landing/Features"), {
  ssr: true,
});

const HowItWorks = dynamic(() => import("@/components/landing/HowItWorks"), {
  ssr: true,
});

export default function LandingPage() {
  return (
    <div>


      <Hero />
      <Stats />
      <Features />
      <HowItWorks />

    </div>
  );
}
