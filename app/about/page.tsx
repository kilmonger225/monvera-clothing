export default function AboutPage() {
  return (
    // We are setting the section to a deep, full-height black container
    // and explicitly telling all child text (via text-[#FFFFFF]) to be white.
    <section className="w-full min-h-screen bg-[#1A1A1A] px-6 py-24 flex items-center justify-center">
      <div className="max-w-3xl w-full">
        
        {/* Forces the headline to be high-contrast white */}
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 text-[#FFFFFF]">
          About Monvera
        </h1>
        
        {/* Forces the paragraph text to be white, with a subtle opacity reduction for texture */}
        <p className="text-lg md:text-xl font-medium leading-relaxed text-[#FFFFFF]/80 max-w-2xl">
          Monvera is dedicated to heavyweight quality and minimalist design. We believe in clothing that lasts, engineered for the modern individual who values both performance and structured drape. Our essentials are crafted to withstand the daily journey without compromise.
        </p>
      </div>
    </section>
  );
}