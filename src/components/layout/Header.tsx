"use client";

import React, { useState, useEffect } from "react";
import { ShoppingCart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter, useSearchParams } from "next/navigation";
import { ClearToken } from "@/lib/axios";
import { isLoggedIn } from "@/lib/auth";
import { useCartCount } from "@/context/CartCountContext";
import { useToast } from "../ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const Header: React.FC = () => {
  const router = useRouter();
  const toast = useToast();
  const searchParams = useSearchParams();
  const query = searchParams.get("search") || "";

  const [search, setSearch] = useState(query);
  const [isLogged, setIsLogged] = useState(false);
  const [openLogout, setOpenLogout] = useState(false);

  const { cartCount, fetchCartCount, loading } = useCartCount();

  useEffect(() => {
    fetchCartCount();
  }, [fetchCartCount]);

  useEffect(() => {
    setSearch(query);
  }, [query]);

  useEffect(() => {
    setIsLogged(isLoggedIn());
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = search.trim();
    if (trimmed === "") {
      router.push("/");
    } else {
      router.push(`/?search=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleLogout = () => {
    ClearToken();
    window.location.reload();
  };

  const handleToCart = () => {
    const isLogged = isLoggedIn();

    if (!isLogged) {
      toast({
        title: "Login required",
        description: "Please log in first to access your cart.",
      });
      return;
    }

    router.push("/cart");
  };

    const handleToHistory = () => {
    const isLogged = isLoggedIn();

    if (!isLogged) {
      toast({
        title: "Login required",
        description: "Please log in first to access your history order.",
      });
      return;
    }

    router.push("/order-history");
  };


  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black shadow-sm px-4 sm:px-6 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
        <div
          className="hidden sm:block text-2xl text-white font-bold cursor-pointer"
          onClick={() => router.push("/")}
        >
          Minimart
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex items-center justify-center w-full sm:flex-1 sm:mx-4"
        >
          <div className="relative w-full sm:max-w-md md:max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black text-sm sm:text-base"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </form>

        <div className="flex items-center gap-3 mt-2 sm:mt-0">
          <button
            type="button"
            aria-label="Cart"
            onClick={handleToCart}
            className="relative p-2 rounded hover:bg-gray-800 transition cursor-pointer"
          >
            <ShoppingCart className="w-6 h-6 text-white" />
            {isLogged && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 text-xs cursor-pointer"
              >
                {loading ? "..." : cartCount}
              </Badge>
            )}
          </button>

          <span className="border-l-2 border-gray-500 h-6"></span>

          <div className="flex gap-2 flex-row">
            {!isLogged ? (
              <>
                <Button
                  onClick={() => router.push("/login")}
                  type="button"
                  className="border border-white bg-black text-white hover:bg-white hover:text-black cursor-pointer"
                >
                  Login
                </Button>
                <Button
                  onClick={() => router.push("/register")}
                  type="button"
                  className="bg-white text-black hover:text-white hover:bg-black border border-black hover:border-white cursor-pointer"
                >
                  Register
                </Button>
              </>
            ) : (
              <>
              <Button
                  onClick={handleToHistory}
                  type="button"
                  className="bg-white text-black hover:text-white hover:bg-black border border-black hover:border-white cursor-pointer"
                >
                  Order History
                </Button>
              <Dialog open={openLogout} onOpenChange={setOpenLogout}>
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    className="flex items-center gap-1 border border-white bg-black text-white hover:bg-white hover:text-black cursor-pointer"
                  >
                    Logout
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Logout</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to logout?
                    </DialogDescription>
                  </DialogHeader>

                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      className="cursor-pointer"
                      variant="outline"
                      onClick={() => setOpenLogout(false)}
                    >
                      Cancel
                    </Button>

                    <Button
                      variant="default"
                      className="cursor-pointer"
                      onClick={() => {
                        handleLogout();
                        setOpenLogout(false);
                      }}
                    >
                      Yes, Logout
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
