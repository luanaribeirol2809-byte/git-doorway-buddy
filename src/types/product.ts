export interface Product {
  id?: string;
  name: string;
  description?: string;
  specifications?: string;
  price?: number;
  rating: number;
  category_id?: string;
  brand?: string;
  model?: string;
  weight?: number;
  dimensions?: string;
  warranty?: string;
  features?: string[];
  stock_quantity?: number;
  is_featured?: boolean;
  images?: string[];
  categories?: { name: string };
  created_at?: string;
  updated_at?: string;
}