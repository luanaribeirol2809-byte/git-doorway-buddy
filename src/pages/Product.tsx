import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  MessageCircle,
  Share2,
  Heart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Product as ProductType } from "@/types/product";
import { toast } from "@/hooks/use-toast";

const Product = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [product, setProduct] = useState<ProductType | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadProduct(id);
    }
  }, [id]);

  const loadProduct = async (productId: string) => {
    try {
      setLoading(true);

      // Load main product
      const { data: productData, error: productError } = await supabase
        .from("products")
        .select(
          `
          *,
          categories (
            name
          )
        `
        )
        .eq("id", productId)
        .single();

      if (productError) {
        toast({
          title: "Produto não encontrado",
          description: "O produto solicitado não foi encontrado.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setProduct(productData);

      // Load related products from same category
      if (productData.category_id) {
        const { data: relatedData } = await supabase
          .from("products")
          .select(
            `
            *,
            categories (
              name
            )
          `
          )
          .eq("category_id", productData.category_id)
          .neq("id", productId)
          .limit(3);

        setRelatedProducts(relatedData || []);
      }
    } catch (error) {
      console.error("Error loading product:", error);
      toast({
        title: "Erro ao carregar produto",
        description: "Ocorreu um erro ao carregar o produto.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando produto...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
            <Button onClick={() => navigate("/")}>Voltar ao início</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Parse specifications if it's a string
  const specifications =
    typeof product.specifications === "string"
      ? product.specifications.split("\n").reduce((acc, line) => {
          const [key, value] = line.split(":").map((s) => s.trim());
          if (key && value) acc[key] = value;
          return acc;
        }, {} as Record<string, string>)
      : {};

  const images =
    product.images && product.images.length > 0
      ? product.images
      : ["/placeholder.svg"];

  // Mock product data
  const mockProduct = {
    id: "1",
    name: "Furadeira de Impacto Bosch GSB 550 RE 550W",
    price: 299.9,
    originalPrice: 349.9,
    rating: 5,
    category: "Ferramentas Elétricas",
    brand: "Bosch",
    model: "GSB 550 RE",
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
    ],
    description: `A Furadeira de Impacto Bosch GSB 550 RE é uma ferramenta versátil e potente, ideal para trabalhos em madeira, metal e alvenaria. Com motor de 550W de potência, oferece excelente desempenho em diversas aplicações.

Esta furadeira combina funcionalidade e durabilidade, sendo uma escolha confiável para profissionais e entusiastas do DIY. Seu design ergonômico proporciona conforto durante o uso prolongado.`,

    specifications: {
      Potência: "550W",
      Tensão: "127V / 220V",
      "Rotação sem carga": "0-3.000 rpm",
      "Impactos por minuto": "0-48.000 ipm",
      "Capacidade do mandril": "1,5 - 13mm",
      Peso: "1,9 kg",
      Dimensões: "290 x 70 x 210 mm",
      Garantia: "12 meses",
    },

    features: [
      "Motor de alta eficiência 550W",
      "Função furar e furar com impacto",
      "Mandril com trava automática",
      "Punho ergonômico com empunhadura softgrip",
      "Seletor de rotação direita/esquerda",
      "Gatilho com controle de velocidade variável",
      "Profundidade regulável",
      "Cabo de 2 metros",
    ],
  };

  const mockRelatedProducts = [
    {
      id: "2",
      name: "Kit Chaves Combinadas 8-22mm Stanley",
      price: 159.9,
      rating: 4,
      image: "/placeholder.svg",
      category: "Ferramentas Manuais",
    },
    {
      id: "3",
      name: "Esmerilhadeira Angular Makita GA4530 720W",
      price: 189.9,
      rating: 4,
      image: "/placeholder.svg",
      category: "Ferramentas Elétricas",
    },
    {
      id: "4",
      name: "Parafusadeira Black+Decker BDCD12 12V",
      price: 149.9,
      rating: 4,
      image: "/placeholder.svg",
      category: "Ferramentas Elétricas",
    },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 ${
          index < rating ? "fill-warning text-warning" : "text-muted-foreground"
        }`}
      />
    ));
  };

  const handleWhatsAppClick = () => {
    const message = `Olá! Tenho interesse no produto: ${
      product.name
    }, Modelo: ${
      product.model || "N/A"
    }. Poderia me dar mais informações sobre preço e disponibilidade?`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=5562998880796&text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-muted-foreground">
          <span>Início</span> /{" "}
          <span>{product.categories?.name || "Categoria"}</span> /{" "}
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div>
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden mb-4">
              <img
                src={images[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Image Thumbnails */}
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                    currentImageIndex === index
                      ? "border-primary"
                      : "border-transparent hover:border-muted-foreground"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} - Imagem ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <Badge variant="secondary">
                {product.categories?.name || "Categoria"}
              </Badge>
              {product.brand && (
                <Badge variant="outline" className="ml-2">
                  {product.brand}
                </Badge>
              )}
            </div>

            <h1 className="text-3xl font-bold text-foreground mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-1">
                {renderStars(product.rating || 5)}
              </div>
              <span className="text-muted-foreground">
                ({product.rating || 5}.0 estrelas)
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <span className="text-4xl font-bold text-primary">
                R${" "}
                {(product.price || 0).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 mb-8">
              <Button
                size="lg"
                className="w-full bg-accent hover:bg-accent-light text-accent-foreground font-bold text-lg py-6"
                onClick={handleWhatsAppClick}
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Comprar pelo WhatsApp
              </Button>

              <div className="flex gap-2">
                <Button variant="outline" size="lg" className="flex-1">
                  <Heart className="h-5 w-5 mr-2" />
                  Favoritar
                </Button>
                <Button variant="outline" size="lg" className="flex-1">
                  <Share2 className="h-5 w-5 mr-2" />
                  Compartilhar
                </Button>
              </div>
            </div>

            {/* Key Features */}
            {product.features && product.features.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">
                  Principais Características:
                </h3>
                {product.features.slice(0, 4).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Descrição</h2>
              {product.description && (
                <div className="prose prose-gray max-w-none text-muted-foreground">
                  {product.description.split("\n\n").map((paragraph, index) => (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}

              {product.features && product.features.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold mt-6 mb-3">
                    Características Completas:
                  </h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {/* Specifications */}
            <div>
              <h2 className="text-2xl font-bold mb-4">
                Especificações Técnicas
              </h2>
              <div className="bg-muted rounded-lg p-6">
                <div className="space-y-3">
                  {Object.keys(specifications).length > 0 ? (
                    Object.entries(specifications).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between items-center py-2 border-b border-border last:border-b-0"
                      >
                        <span className="font-medium">{key}</span>
                        <span className="text-muted-foreground">{value}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        Especificações técnicas não disponíveis
                      </p>
                    </div>
                  )}

                  {/* Always show basic product info */}
                  {product.brand && (
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="font-medium">Marca</span>
                      <span className="text-muted-foreground">
                        {product.brand}
                      </span>
                    </div>
                  )}
                  {product.model && (
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="font-medium">Modelo</span>
                      <span className="text-muted-foreground">
                        {product.model}
                      </span>
                    </div>
                  )}
                  {product.weight && (
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="font-medium">Peso</span>
                      <span className="text-muted-foreground">
                        {product.weight}kg
                      </span>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="font-medium">Dimensões</span>
                      <span className="text-muted-foreground">
                        {product.dimensions}
                      </span>
                    </div>
                  )}
                  {product.warranty && (
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="font-medium">Garantia</span>
                      <span className="text-muted-foreground">
                        {product.warranty}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Produtos Relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  id={relatedProduct.id}
                  name={relatedProduct.name}
                  price={relatedProduct.price || 0}
                  rating={relatedProduct.rating || 5}
                  image={
                    (relatedProduct.images && relatedProduct.images[0]) ||
                    "/placeholder.svg"
                  }
                  category={relatedProduct.categories?.name || "Categoria"}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Product;
