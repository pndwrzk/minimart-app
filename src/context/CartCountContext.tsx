"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { getCartCount } from "@/services/cart.service";
import { isLoggedIn } from "@/lib/auth";

type CartCountContextType = {
  cartCount: number;
  loading: boolean;
  fetchCartCount: () => Promise<void>;
};

const CartCountContext = createContext<CartCountContextType | undefined>(
  undefined
);

export function CartCountProvider({ children }: { children: ReactNode }) {
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCartCount = useCallback(async () => {
    setLoading(true);
    try {
      const isLogged = isLoggedIn();
       if (!isLogged) {
    setCartCount(0);
    return;
  }
      const data = await getCartCount();
      setCartCount(data.total_items);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <CartCountContext.Provider
      value={{ cartCount, loading, fetchCartCount }}
    >
      {children}
    </CartCountContext.Provider>
  );
}

export function useCartCount() {
  const context = useContext(CartCountContext);
  if (!context) {
    throw new Error("useCartCount must be used inside CartCountProvider");
  }
  return context;
}
