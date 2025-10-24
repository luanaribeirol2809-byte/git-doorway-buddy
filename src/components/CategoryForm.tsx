import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

interface Category {
  id?: string;
  name: string;
  slug: string;
  description?: string;
}

interface CategoryFormProps {
  category?: Category | null;
  onClose: () => void;
}

const CategoryForm = ({ category, onClose }: CategoryFormProps) => {
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<Category>({
    name: "",
    slug: "",
    description: "",
    ...(category || {})
  });

  const handleInputChange = (field: keyof Category, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-generate slug from name
      if (field === 'name') {
        updated.slug = value
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim()
          .replace(/^-+|-+$/g, '');
      }
      
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validação básica
      if (!formData.name?.trim()) {
        throw new Error('Nome da categoria é obrigatório');
      }

      if (!formData.slug?.trim()) {
        throw new Error('Slug da categoria é obrigatório');
      }

      const submitData = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description?.trim() || "",
      };

      let result;
      if (category?.id) {
        result = await supabase
          .from('categories')
          .update(submitData)
          .eq('id', category.id);
      } else {
        result = await supabase
          .from('categories')
          .insert([submitData]);
      }

      if (result.error) throw result.error;

      toast({
        title: category?.id ? "Categoria atualizada" : "Categoria criada",
        description: category?.id 
          ? "Categoria atualizada com sucesso!" 
          : "Nova categoria adicionada ao sistema!",
      });

      onClose();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar categoria",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={onClose}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {category?.id ? "Editar Categoria" : "Nova Categoria"}
            </h1>
            <p className="text-muted-foreground">
              {category?.id ? "Atualize as informações da categoria" : "Adicione uma nova categoria ao sistema"}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações da Categoria</CardTitle>
            <CardDescription>
              Preencha os campos para criar uma categoria organizada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Categoria *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Ex: Ferramentas Elétricas"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug da URL *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="ferramentas-eletricas"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Usado na URL da categoria. Gerado automaticamente do nome.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição da Categoria</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Descreva o que esta categoria representa e quais tipos de produtos ela contém..."
                  rows={4}
                />
              </div>

              <div className="flex gap-4 pt-6 border-t border-border">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading 
                    ? (category?.id ? "Atualizando..." : "Criando...") 
                    : (category?.id ? "Atualizar Categoria" : "Criar Categoria")
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

export default CategoryForm;