import Image from "next/image";
import { ContactSection } from "@/components/sections/ContactSection";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-offwhite bg-grid-pattern py-20 md:py-24 flex-grow">
        <div className="mx-auto max-w-[1200px] px-6">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-forest/60">
            About Hyle
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-text-primary md:text-5xl lg:text-6xl mb-8">
            Environmental Intelligence <br /> for Indonesia
          </h1>


          <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-12 shadow-lg border border-forest/10">
            <Image
              src="/images/rainforest-hero.jpg"
              alt="Indonesian rainforest canopy"
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </div>
        </div>
      </section>

      {/* About Hyle Forest Green Section */}
      <section className="bg-forest py-20">
        <div className="mx-auto max-w-[1200px] px-6">
          <h2 className="text-3xl font-bold tracking-tight text-white mb-8">
            About Hyle
          </h2>

          <div className="grid gap-12 md:grid-cols-2">
            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-white/80">
                Hyle is an environmental intelligence platform focused on Indonesia.
                It provides environmental health scores for regions based on forest cover,
                biodiversity, and land degradation indicators.
              </p>
              <p className="text-lg leading-relaxed text-white/80">
                Our mission is to democratize access to high-fidelity environmental data,
                enabling researchers, policymakers, and organizations to make informed
                decisions about conservation and sustainable development.
              </p>
            </div>
            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-white/80">
                Users can explore regions on a map, view environmental metrics,
                submit consulting requests for expert analysis, and read environmental insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      <ContactSection />
    </div>
  );
}
