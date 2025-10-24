-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  specifications TEXT,
  price DECIMAL(10,2),
  category_id UUID REFERENCES public.categories(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) DEFAULT 5,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for admin users
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories (public read, admin write)
CREATE POLICY "Anyone can view categories" 
ON public.categories 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage categories" 
ON public.categories 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

-- RLS Policies for products (public read, admin write)
CREATE POLICY "Anyone can view products" 
ON public.products 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage products" 
ON public.products 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, role)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name', 'user');
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for timestamp updates
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default categories
INSERT INTO public.categories (name, slug, description) VALUES 
('Ferramentas Elétricas', 'ferramentas-eletricas', 'Furadeiras, parafusadeiras, serras e outras ferramentas elétricas'),
('Ferramentas Manuais', 'ferramentas-manuais', 'Chaves, alicates, martelos e ferramentas manuais'),
('Equipamentos para Borracharia', 'equipamentos-borracharia', 'Compressores, calibradores e equipamentos para borracharia'),
('Soldas e Eletrodos', 'soldas-eletrodos', 'Máquinas de solda, eletrodos e equipamentos de soldagem');

-- Insert sample products
INSERT INTO public.products (name, description, specifications, price, category_id, rating, images) 
SELECT 
  'Furadeira Bosch GSB 550 RE',
  'Furadeira de impacto profissional da Bosch com 550W de potência. Ideal para perfurações em alvenaria, madeira e metal.',
  'Potência: 550W\nVelocidade: 0-3000 rpm\nImpacto: 0-48000 ipm\nMandril: 13mm\nPeso: 1,8kg',
  299.90,
  c.id,
  5,
  ARRAY['/src/assets/drill-bosch.jpg']
FROM public.categories c WHERE c.slug = 'ferramentas-eletricas'
UNION ALL
SELECT 
  'Jogo de Chaves Combinadas 8-22mm',
  'Conjunto completo de chaves combinadas cromadas. Material de alta qualidade com acabamento espelhado.',
  'Tamanhos: 8, 10, 12, 13, 14, 15, 17, 19, 22mm\nMaterial: Aço cromo vanádio\nAcabamento: Cromado\nEstojo incluso',
  89.90,
  c.id,
  4,
  ARRAY['/src/assets/wrench-set.jpg']
FROM public.categories c WHERE c.slug = 'ferramentas-manuais'
UNION ALL
SELECT 
  'Compressor de Ar 50L Schulz',
  'Compressor de ar profissional com reservatório de 50 litros. Motor monofásico 220V.',
  'Capacidade: 50L\nPressão máxima: 8,5 bar\nMotor: 2HP monofásico\nVazão: 230 L/min\nTensão: 220V',
  899.90,
  c.id,
  5,
  ARRAY['/src/assets/compressor.jpg']
FROM public.categories c WHERE c.slug = 'equipamentos-borracharia'
UNION ALL
SELECT 
  'Máquina de Solda Inversora ESAB',
  'Soldadora inversora 200A ESAB. Compacta e versátil para eletrodo revestido.',
  'Corrente de soldagem: 20-200A\nTensão de alimentação: 220V\nEletrodo: 2,5-4,0mm\nPeso: 5,2kg\nFator de trabalho: 60%',
  1299.90,
  c.id,
  5,
  ARRAY['/src/assets/welding-machine.jpg']
FROM public.categories c WHERE c.slug = 'soldas-eletrodos';