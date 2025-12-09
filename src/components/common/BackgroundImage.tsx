import Image from 'next/image';

const BackgroundImage = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute w-full h-full opacity-15">
        <Image src="/BgImage.png" alt="Background" fill className="w-full h-full object-cover transform -rotate-6 -translate-y-[5%]" priority/>
      </div>
    </div>
  );
};
export default BackgroundImage;
