import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Product } from "@/types/product";
import ImageUpload from "@/components/ImageUpload";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
}

const ProductForm = ({ product, onClose }: ProductFormProps) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newFeature, setNewFeature] = useState("");
  
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    description: "",
    specifications: "",
    price: 0,
    rating: 5,
    category_id: "",
    brand: "",
    model: "",
    weight: 0,
    dimensions: "",
    warranty: "",
    features: [],
    stock_quantity: 0,
    is_featured: false,
    images: [],
    ...(product || {})
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleInputChange = (field: keyof Product, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addFeature = () => {
    if (newFeature.trim() && formData.features) {
      setFormData(prev => ({
        ...prev,
        features: [...(prev.features || []), newFeature.trim()]
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: (prev.features || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validação básica
      if (!formData.name?.trim()) {
        throw new Error('Nome da ferramenta é obrigatório');
      }

      const submitData = {
        name: formData.name.trim(),
        description: formData.description || "",
        specifications: formData.specifications || "",
        price: Number(formData.price) || 0,
        rating: Number(formData.rating) || 5,
        category_id: formData.category_id || null,
        brand: formData.brand || "",
        model: formData.model || "",
        weight: Number(formData.weight) || 0,
        dimensions: formData.dimensions || "",
        warranty: formData.warranty || "",
        features: formData.features || [],
        stock_quantity: Number(formData.stock_quantity) || 0,
        is_featured: Boolean(formData.is_featured),
        images: formData.images || [],
      };

      let result;
      if (product?.id) {
        result = await supabase
          .from('products')
          .update(submitData)
          .eq('id', product.id);
      } else {
        result = await supabase
          .from('products')
          .insert([submitData]);
      }

      if (result.error) throw result.error;

      toast({
        title: product?.id ? "Ferramenta atualizada" : "Ferramenta criada",
        description: product?.id 
          ? "Ferramenta atualizada com sucesso!" 
          : "Nova ferramenta adicionada ao catálogo!",
      });

      onClose();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar ferramenta",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={onClose}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {product?.id ? "Editar Ferramenta" : "Nova Ferramenta"}
            </h1>
            <p className="text-muted-foreground">
              {product?.id ? "Atualize as informações da ferramenta" : "Adicione uma nova ferramenta profissional ao catálogo"}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações da Ferramenta</CardTitle>
            <CardDescription>
              Preencha todos os campos para criar um catálogo completo e profissional
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Informações Básicas */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                  Informações Básicas
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome da Ferramenta *</Label>
                    <Input
                      id="name"
                      value={formData.name || ""}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Ex: Furadeira de Impacto Profissional"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria *</Label>
                    <Select value={formData.category_id || ""} onValueChange={(value) => handleInputChange('category_id', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Marca</Label>
                    <Input
                      id="brand"
                      value={formData.brand || ""}
                      onChange={(e) => handleInputChange('brand', e.target.value)}
                      placeholder="Ex: Bosch, Makita, DeWalt, Black & Decker"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model">Modelo</Label>
                    <Input
                      id="model"
                      value={formData.model || ""}
                      onChange={(e) => handleInputChange('model', e.target.value)}
                      placeholder="Ex: GSB 16 RE, HP1640K, DCD771C2"
                    />
                  </div>
                </div>
              </div>

              {/* Descrição e Especificações */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                  Descrição e Especificações
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição da Ferramenta</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Descreva os principais benefícios, aplicações e diferenciais da ferramenta..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specifications">Especificações Técnicas Detalhadas</Label>
                  <Textarea
                    id="specifications"
                    value={formData.specifications}
                    onChange={(e) => handleInputChange('specifications', e.target.value)}
                    placeholder="Potência: 650W&#10;Velocidade sem carga: 0-2800 rpm&#10;Impactos por minuto: 44800&#10;Torque máximo: 54 Nm&#10;Mandril: 13mm&#10;Comprimento: 195mm&#10;Cabo: 2,5m"
                    rows={6}
                  />
                </div>

                {/* Características Especiais */}
                <div className="space-y-2">
                  <Label>Características e Recursos Especiais</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Ex: LED integrado, sistema anti-vibração, empunhadura ergonômica..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    />
                    <Button type="button" onClick={addFeature} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {(formData.features || []).length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(formData.features || []).map((feature, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {feature}
                          <X
                            className="w-3 h-3 cursor-pointer hover:text-destructive"
                            onClick={() => removeFeature(index)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Dados Técnicos */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                  Dados Técnicos e Físicos
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Peso (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      value={formData.weight}
                      onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
                      placeholder="2.5"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dimensions">Dimensões (C x L x A)</Label>
                    <Input
                      id="dimensions"
                      value={formData.dimensions}
                      onChange={(e) => handleInputChange('dimensions', e.target.value)}
                      placeholder="195 x 65 x 195 mm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="warranty">Período de Garantia</Label>
                    <Input
                      id="warranty"
                      value={formData.warranty}
                      onChange={(e) => handleInputChange('warranty', e.target.value)}
                      placeholder="12 meses, 24 meses, 3 anos"
                    />
                  </div>
                </div>
              </div>

              {/* Preço e Estoque */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                  Preço e Disponibilidade
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Preço (R$) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                      placeholder="299.90"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock">Quantidade em Estoque</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock_quantity}
                      onChange={(e) => handleInputChange('stock_quantity', parseInt(e.target.value) || 0)}
                      placeholder="50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rating">Avaliação (1-5 estrelas)</Label>
                    <Select value={String(formData.rating)} onValueChange={(value) => handleInputChange('rating', parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <SelectItem key={rating} value={String(rating)}>
                            {"★".repeat(rating)} ({rating} estrela{rating > 1 ? 's' : ''})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Imagens do Produto */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                  Imagens do Produto
                </h3>
                <p className="text-sm text-muted-foreground">
                  Adicione até 6 imagens do produto. A primeira imagem será a principal.
                </p>
                <ImageUpload
                  images={formData.images || []}
                  onImagesChange={(images) => handleInputChange('images', images)}
                  maxImages={6}
                />
              </div>

              {/* Opções Avançadas */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                  Configurações
                </h3>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => handleInputChange('is_featured', checked)}
                  />
                  <Label htmlFor="featured" className="font-medium">
                    Produto em destaque na página inicial
                  </Label>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-4 pt-6 border-t border-border">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading 
                    ? (product?.id ? "Atualizando..." : "Criando...") 
                    : (product?.id ? "Atualizar Ferramenta" : "Adicionar ao Catálogo")
                  }
                </Button>
                <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductForm;