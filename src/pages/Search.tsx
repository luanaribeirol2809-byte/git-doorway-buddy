import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCardWrapper } from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { Search as SearchIcon } from "lucide-react";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const searchProducts = async () => {
      if (!query.trim()) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      
      const { data } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,brand.ilike.%${query}%`);
      
      if (data) {
        setProducts(data);
      }
      setLoading(false);
    };

    searchProducts();
  }, [query]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <SearchIcon className="h-5 w-5 text-muted-foreground" />
            <h1 className="text-2xl font-bold">Resultados da busca</h1>
          </div>
          {query && (
            <p className="text-muted-foreground">
              {loading ? 'Buscando' : `${products.length} resultado${products.length !== 1 ? 's' : ''} encontrado${products.length !== 1 ? 's' : ''}`} para "{query}"
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {!query.trim() ? (
              <div className="text-center py-12">
                <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Digite algo para buscar</h2>
                <p className="text-muted-foreground">Use a barra de busca acima para encontrar produtos</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Nenhum produto encontrado</h2>
                <p className="text-muted-foreground">Tente usar outras palavras-chave</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCardWrapper key={product.id} product={product} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Search;