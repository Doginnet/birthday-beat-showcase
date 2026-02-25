import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative w-full h-[70vh] min-h-[400px] max-h-[600px] overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />

      {/* Gradient fade to background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, transparent 30%, hsl(0 0% 8% / 0.6) 60%, hsl(0 0% 8%) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-thin tracking-tight text-foreground text-center drop-shadow-2xl">
          Happy B/day, Dad!
        </h1>
      </div>
    </section>
  );
};

export default HeroSection;
