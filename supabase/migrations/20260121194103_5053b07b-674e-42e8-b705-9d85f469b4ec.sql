-- Add site_title column to site_settings table for browser tab title
ALTER TABLE public.site_settings 
ADD COLUMN site_title text DEFAULT 'MARCOS MÁQUINAS E FERRAMENTAS';