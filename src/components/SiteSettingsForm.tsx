import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { SingleImageUpload } from "./SingleImageUpload";

interface SiteSettings {
  id: string;
  logo_url: string | null;
  footer_logo_url: string | null;
  company_name: string;
  phone: string | null;
  address: string | null;
  cnpj: string | null;
  site_title: string | null;
}

export const SiteSettingsForm = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [formData, setFormData] = useState({
    logo_url: "",
    footer_logo_url: "",
    company_name: "53.677.354 MARCOS MÁQUINAS E FERRAMENTAS",
    phone: "(62) 99888-0796",
    address: "R. do Lírio, 525 - Jardim dos Buritis, Aparecida de Goiânia - GO, 74923-500, Brasil",
    cnpj: "53.677.354/0001-31",
    site_title: "MARCOS MÁQUINAS E FERRAMENTAS",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .single();

      if (error) throw error;

      if (data) {
        setSettings(data);
        setFormData({
          logo_url: data.logo_url || "",
          footer_logo_url: data.footer_logo_url || "",
          company_name: data.company_name,
          phone: data.phone || "",
          address: data.address || "",
          cnpj: data.cnpj || "",
          site_title: data.site_title || "",
        });
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      toast.error("Erro ao carregar configurações");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("site_settings")
        .update({
          logo_url: formData.logo_url || null,
          footer_logo_url: formData.footer_logo_url || null,
          company_name: formData.company_name,
          phone: formData.phone || null,
          address: formData.address || null,
          cnpj: formData.cnpj || null,
          site_title: formData.site_title || null,
        })
        .eq("id", settings?.id);

      if (error) throw error;

      toast.success("Configurações atualizadas com sucesso!");
      loadSettings();
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Erro ao atualizar configurações");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="company_name">Nome da Empresa</Label>
          <Input
            id="company_name"
            value={formData.company_name}
            onChange={(e) =>
              setFormData({ ...formData, company_name: e.target.value })
            }
            required
          />
        </div>

        <div>
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
        </div>

        <div>
          <Label htmlFor="address">Endereço</Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="site_title">Título do Site (Aba do Navegador)</Label>
          <Input
            id="site_title"
            value={formData.site_title}
            onChange={(e) =>
              setFormData({ ...formData, site_title: e.target.value })
            }
            placeholder="Título exibido na aba do navegador"
          />
        </div>

        <div>
          <Label htmlFor="cnpj">CNPJ</Label>
          <Input
            id="cnpj"
            value={formData.cnpj}
            onChange={(e) =>
              setFormData({ ...formData, cnpj: e.target.value })
            }
          />
        </div>

        <div>
          <Label>Logo do Cabeçalho</Label>
          <SingleImageUpload
            value={formData.logo_url}
            onChange={(url) => setFormData({ ...formData, logo_url: url })}
            bucket="product-images"
          />
        </div>

        <div>
          <Label>Logo do Rodapé</Label>
          <SingleImageUpload
            value={formData.footer_logo_url}
            onChange={(url) =>
              setFormData({ ...formData, footer_logo_url: url })
            }
            bucket="product-images"
          />
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Salvando..." : "Salvar Configurações"}
      </Button>
    </form>
  );
};
