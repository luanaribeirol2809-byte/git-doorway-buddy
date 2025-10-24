import { Phone, Mail, MapPin, Clock } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-muted border-t border-border mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold text-primary mb-4">
              🔧 ATACADO FERRAMENTAS DISTRIBUICAO LTDA
            </h3>
            <p className="text-muted-foreground mb-4">
              Sua loja completa de ferramentas e equipamentos profissionais.
              Qualidade e confiança há mais de 20 anos.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contato</h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>(62) 99888-0796</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>contato@ferramentastore.com.br</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Rua das Ferramentas, 123 - São Paulo, SP</span>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div>
            <h4 className="font-semibold mb-4">Horário de Atendimento</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <div>
                  <p>Segunda a Sexta: 8h às 18h</p>
                  <p>Sábado: 8h às 16h</p>
                  <p>Domingo: Fechado</p>
                </div>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">Principais Categorias</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Ferramentas Elétricas</li>
              <li>Ferramentas Manuais</li>
              <li>Equipamentos para Borracharia</li>
              <li>Soldas e Acessórios</li>
              <li>Segurança e EPIs</li>
              <li>Lubrificantes</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>
            &copy; 2024 ATACADO FERRAMENTAS DISTRIBUICAO LTDA. Todos os direitos
            reservados.
          </p>
          <p className="mt-2">CNPJ: 63.174.587/0001-75</p>
        </div>
      </div>
    </footer>
  );
};
