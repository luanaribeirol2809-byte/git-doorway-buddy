-- Add cnpj column to site_settings table
ALTER TABLE public.site_settings 
ADD COLUMN cnpj text DEFAULT '53.677.354/0001-31';