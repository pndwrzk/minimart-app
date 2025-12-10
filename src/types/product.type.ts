import { CategoryResponse } from "./category.type";

export type ProductResponse = {
  id: number;
  name: string;
  image_path: string;
  category_id: number;
  price: string;
  stock: number;
  description: string;
  created_at: string; 
  updated_at: string; 
  category: CategoryResponse
};


export type GetProductsParams = {
  search?: string;
  category?: string | number;
  orderBy?: string;
  sortBy?: string;
  minPrice?: number;
  maxPrice?: number;
    page?: number;
    pageSize?: number;
};
