"use client";

import { useState, useCallback } from "react";
import { addToCart, getCart } from "@/services/cart.service";
import { AddTocartPayload, CartDataDto } from "@/types/cart.type";
import { useToast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";
import { useCartCount } from "@/context/CartCountContext";

export function useCart() {
  const toast = useToast();
  const { fetchCartCount } = useCartCount();
  const [cart, setCart] = useState<CartDataDto | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getCart();
      setCart(data);
    } catch {
      setError("Failed to fetch cart");
    } finally {
      setLoading(false);
    }
  }, []);

  const addItemToCart = useCallback(
    async (item: AddTocartPayload) => {
      setLoading(true);
      setError(null);

      try {
        const result = await addToCart(item);
        await fetchCartCount();

        toast({
          title: "Add To Cart Success",
          description: result.message,
        });
      } catch (err) {
        const error = err as AxiosError<{ message: string }>;

        toast({
          title: "Add To Cart Failed",
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    },
    [fetchCart, toast]
  );

  return {
    cart,
    loading,
    error,
    refreshCart: fetchCart,
    addItemToCart,
  };
}
