import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowRight, CheckCircle } from "lucide-react";
import heroBannerImage from "@/assets/hero-banner.jpg";

export const HeroBanner = () => {
  const handleWhatsAppClick = () => {
    const message =
      "Olá! Gostaria de conhecer os produtos da ATACADO FERRAMENTAS.";
    const whatsappUrl = `https://api.whatsapp.com/send?phone=5562998880796&text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <section className="relative min-h-[600px] md:h-[600px] overflow-hidden rounded-lg mx-4 my-6 group">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <img
          src={heroBannerImage}
          alt="Ferramentas e Equipamentos Profissionais"
          className="w-full h-full object-cover transition-transform duration-[20s] ease-linear group-hover:scale-105"
        />
        {/* Dynamic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-primary/50 to-black/40"></div>
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-pulse"></div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-10 right-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse hidden md:block"></div>
      <div className="absolute bottom-20 left-10 w-16 h-16 bg-primary/20 rounded-full blur-lg animate-pulse delay-1000 hidden md:block"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center py-12 md:py-0">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-6xl font-bold mb-4 md:mb-6 leading-tight animate-fade-in">
            <span
              className="inline-block animate-fade-in text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
              style={{ animationDelay: "0.2s" }}
            >
              Ferramentas
            </span>
            <span
              className="block text-white animate-fade-in drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
              style={{ animationDelay: "0.4s" }}
            >
              Profissionais
            </span>
          </h1>

          <p
            className="text-base md:text-2xl mb-6 md:mb-8 text-white/95 leading-relaxed animate-fade-in drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            style={{ animationDelay: "0.6s" }}
          >
            Equipamentos de qualidade para profissionais exigentes. Mais de 20
            anos atendendo o mercado brasileiro.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 animate-fade-in"
            style={{ animationDelay: "0.8s" }}
          >
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 md:px-8 py-5 md:py-6 text-base md:text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25 group/btn"
              onClick={handleWhatsAppClick}
            >
              <MessageCircle className="h-4 md:h-5 w-4 md:w-5 mr-2 transition-transform group-hover/btn:rotate-12" />
              Fale Conosco
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 md:px-8 py-5 md:py-6 text-base md:text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25 group/btn backdrop-blur-sm"
              onClick={() => {
                document.getElementById('featured-products')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Ver Produtos
              <ArrowRight className="h-4 md:h-5 w-4 md:w-5 ml-2 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </div>

          {/* Enhanced Features */}
          <div
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm animate-fade-in"
            style={{ animationDelay: "1s" }}
          >
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/15 backdrop-blur-sm border border-white/30 hover:bg-white/25 transition-all duration-300 hover:scale-105 group/feature">
              <CheckCircle className="w-4 h-4 text-white animate-pulse" />
              <span className="text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] group-hover/feature:drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] transition-all">
                Frete Grátis
              </span>
            </div>
            <div
              className="flex items-center gap-3 p-3 rounded-lg bg-white/15 backdrop-blur-sm border border-white/30 hover:bg-white/25 transition-all duration-300 hover:scale-105 group/feature"
              style={{ animationDelay: "1.2s" }}
            >
              <CheckCircle
                className="w-4 h-4 text-white animate-pulse"
                style={{ animationDelay: "0.5s" }}
              />
              <span className="text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] group-hover/feature:drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] transition-all">
                Garantia Oficial
              </span>
            </div>
            <div
              className="flex items-center gap-3 p-3 rounded-lg bg-white/15 backdrop-blur-sm border border-white/30 hover:bg-white/25 transition-all duration-300 hover:scale-105 group/feature"
              style={{ animationDelay: "1.4s" }}
            >
              <CheckCircle
                className="w-4 h-4 text-white animate-pulse"
                style={{ animationDelay: "1s" }}
              />
              <span className="text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] group-hover/feature:drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] transition-all">
                Suporte Especializado
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Animated border */}
      <div className="absolute inset-0 rounded-lg border-2 border-transparent bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </section>
  );
};
