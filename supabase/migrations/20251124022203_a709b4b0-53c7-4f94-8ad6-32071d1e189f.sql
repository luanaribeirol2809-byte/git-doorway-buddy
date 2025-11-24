-- Create site_settings table for managing site configuration
CREATE TABLE public.site_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  logo_url text,
  footer_logo_url text,
  company_name text NOT NULL DEFAULT '53.677.354 MARCOS MÁQUINAS E FERRAMENTAS',
  phone text DEFAULT '(62) 99888-0796',
  address text DEFAULT 'R. do Lírio, 525 - Jardim dos Buritis, Aparecida de Goiânia - GO, 74923-500, Brasil'
);

-- Enable Row Level Security
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Everyone can view site settings
CREATE POLICY "Everyone can view site settings"
ON public.site_settings
FOR SELECT
USING (true);

-- Only admins can insert site settings
CREATE POLICY "Only admins can insert site settings"
ON public.site_settings
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Only admins can update site settings
CREATE POLICY "Only admins can update site settings"
ON public.site_settings
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Insert default settings
INSERT INTO public.site_settings (company_name, phone, address)
VALUES (
  '53.677.354 MARCOS MÁQUINAS E FERRAMENTAS',
  '(62) 99888-0796',
  'R. do Lírio, 525 - Jardim dos Buritis, Aparecida de Goiânia - GO, 74923-500, Brasil'
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();