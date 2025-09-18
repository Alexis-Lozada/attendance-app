import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import InfoSection from "@/components/home/InfoSection";
import QuickActions from "@/components/home/QuickActions";
import PromoSection from "@/components/home/PromoSection"; 

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-6xl mx-auto px-6 py-12 space-y-16">
        {/* Hero principal */}
        <Hero />

        {/* Sección de información */}
        <InfoSection />

        {/* Promo con gradient e imagen */}
        <PromoSection />

        {/* Acciones rápidas */}
        <QuickActions />

        {/* Área con calendario y gráfica */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
        </section>
      </main>

      <Footer />
    </div>
  );
}
