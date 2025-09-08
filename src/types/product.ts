// types/product.ts

export interface Product {
  id: string;
  title: string;
  category: string;
  actualPrice: number;
  discountedPrice: number;
  discountPercent: number;
  description: string;
  specs: string[];
  benefits: string[];
  featured: boolean;
  imageUrl: string;
}

// Optional: Form data type for creating/updating products
export interface ProductFormData extends Omit<Product, "id"> {
  imageFile: File | null; // for local upload before saving
}
