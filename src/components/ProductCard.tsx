import { Star, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  rating: number;
  image: string;
  category: string;
  isHighlighted?: boolean;
}

interface ProductCardWithProductProps {
  product: {
    id: string;
    name: string;
    price: number;
    rating: number;
    images: string[];
    category_id?: string;
    is_featured?: boolean;
  };
}

export const ProductCard = ({
  id,
  name,
  price,
  rating,
  image,
  category,
  isHighlighted = false,
}: ProductCardProps) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? "fill-warning text-warning" : "text-muted-foreground"
        }`}
      />
    ));
  };

  const handleWhatsAppClick = () => {
    const message = `Olá! Tenho interesse no produto: ${name}. Poderia me dar mais informações?`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=5562998880796&text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <Card
      className={`group hover:shadow-card transition-all duration-300 hover:-translate-y-1 ${
        isHighlighted ? "ring-2 ring-primary/20 bg-gradient-card" : ""
      }`}
    >
      <CardContent className="p-0">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {isHighlighted && (
            <div className="absolute top-2 right-2 bg-accent text-accent-foreground px-2 py-1 rounded-md text-xs font-medium">
              Destaque
            </div>
          )}
          <div className="absolute top-2 left-2 bg-secondary/90 text-secondary-foreground px-2 py-1 rounded-md text-xs">
            {category}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            {renderStars(rating)}
            <span className="text-sm text-muted-foreground ml-1">
              ({rating}.0)
            </span>
          </div>

          {/* Price */}
          <div className="mb-4">
            <span className="text-2xl font-bold text-primary">
              R$ {price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button
              className="w-full bg-accent hover:bg-accent-light text-accent-foreground font-medium"
              onClick={handleWhatsAppClick}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Comprar pelo WhatsApp
            </Button>

            <Button variant="outline" className="w-full" size="sm" asChild>
              <Link to={`/produto/${id}`}>Ver Detalhes</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Component wrapper that accepts a product object
export const ProductCardWrapper = ({
  product,
}: ProductCardWithProductProps) => {
  return (
    <ProductCard
      id={product.id}
      name={product.name}
      price={product.price}
      rating={product.rating || 0}
      image={product.images?.[0] || "/placeholder.svg"}
      category="Produto"
      isHighlighted={product.is_featured || false}
    />
  );
};
