import { useState, useEffect } from "react";
import { getCategories } from "@/services/category.service";
import { CategoryResponse } from "@/types/category.type";

type UseCategoriesResult = {
  categories: CategoryResponse[];
  loading: boolean;
  error: string | null;
};

export function useCategories(): UseCategoriesResult {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      try {
        const res = await getCategories();
        setCategories(res.data || []);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load categories");
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return { categories, loading, error };
}
