import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative w-full h-[70vh] min-h-[400px] max-h-[600px] overflow-hidden ">

      {/* Content */}
      <div className="relative z-30 flex items-center justify-center h-full ">

      <div className="bg-header w-full h-35 py-10 hover:border-neon-red transition-all duration-400">
          <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-thin tracking-tight text-foreground text-center drop-shadow-2xl heading-text">
            Happy_<span className="text-neon-red neon-shadow-red ">B/day</span>_Dad<span className="text-neon-red neon-shadow-red ">!</span>
          </h1>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
