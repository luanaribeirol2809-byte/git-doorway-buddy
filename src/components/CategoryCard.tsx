import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface CategoryCardProps {
  name: string;
  description: string;
  icon?: string;
  productCount?: number;
  image: string;
  slug?: string;
}

export const CategoryCard = ({ 
  name, 
  description, 
  icon, 
  productCount, 
  image,
  slug 
}: CategoryCardProps) => {
  return (
    <Card className="group hover:shadow-card transition-all duration-300 hover:-translate-y-1 cursor-pointer">
      <CardContent className="p-0">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-hero opacity-60"></div>
          
          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-6">
            <div className="text-white">
              <div className="text-3xl mb-2">{icon}</div>
              <h3 className="font-bold text-lg mb-1">{name}</h3>
              <p className="text-sm text-white/90 mb-2">{description}</p>
              <span className="text-xs text-white/80">
                {productCount} produtos
              </span>
            </div>
          </div>
        </div>

        {/* Action Area */}
        <div className="p-4">
          <Button 
            className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
            variant="outline"
            asChild
            disabled={!slug}
          >
            <Link to={slug ? `/categoria/${slug}` : "#"}>Ver Produtos</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};