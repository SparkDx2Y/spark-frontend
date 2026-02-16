import Image from 'next/image';

const BackgroundImage = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
      <div className="absolute inset-0 opacity-15">
        <Image
          src="/BgImage.png"
          alt="Background"
          fill
          className="w-full h-full object-cover transform -rotate-6 scale-125"
          priority
        />
      </div>
    </div>
  );
};

export default BackgroundImage;
