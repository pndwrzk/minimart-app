import { useState, useEffect } from "react";
import { AxiosError } from "axios";
import { ProductResponse } from "@/types/product.type";
import { BaseResponse, Meta } from "@/types/base-response.type";
import { getProducts } from "@/services/product.service";

export type UseProductParams = {
  search?: string;
  category?: string;
  sort?: string;
  sortBy?: string;
  orderBy?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
};

export function useProduct(params: UseProductParams) {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<Meta | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
        if (params.sort) {
          const [orderBy, sortBy] = params.sort.split("-");
          params = { ...params, sortBy, orderBy };
        }
      const res: BaseResponse<ProductResponse[]> = await getProducts(params);
      setProducts(res.data);
      if (res.meta) {
        setMeta(res.meta);
      } else {
        setMeta({
          page: params.page || 1,
          total_page: 1,
          total_data: res.data.length,
        });
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(error.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [JSON.stringify(params)]);

  return {
    products,
    loading,
    error,
    meta,
    refetch: fetchProducts,
  };
}
