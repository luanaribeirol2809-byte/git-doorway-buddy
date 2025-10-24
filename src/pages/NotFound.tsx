import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Home, Search, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <div className="text-8xl mb-6">🔧</div>
          
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Página Não Encontrada
          </h2>
          
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Parece que a ferramenta que você está procurando não está em nossa bancada. 
            Que tal explorar nossa loja?
          </p>

          <div className="space-y-4">
            <Button 
              asChild 
              size="lg" 
              className="w-full bg-accent hover:bg-accent-light text-accent-foreground"
            >
              <Link to="/">
                <Home className="h-5 w-5 mr-2" />
                Voltar para Início
              </Link>
            </Button>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="lg" 
                className="flex-1"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="flex-1"
                asChild
              >
                <Link to="/">
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-8 text-sm text-muted-foreground">
            <p>Código do erro: 404 - {location.pathname}</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
