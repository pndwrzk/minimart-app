"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ProductResponse } from "@/types/product.type";
import { formatRupiah } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { isLoggedIn } from "@/lib/auth";
import { image_host } from "@/lib/constants";

export type Product = ProductResponse;

type Props = { product: Product };

export const ProductCard: React.FC<Props> = ({ product }) => {
  const { addItemToCart, refreshCart, loading } = useCart();
  const handleAddToCart = async () => {
    const isLogged = isLoggedIn();
    if (!isLogged) {
      alert("Please login to add items to cart");
      return;
    }
    try {
      await addItemToCart({ product_id: product.id });
      await refreshCart();
    } catch (err: any) {
      console.error(err.message);
    }
  };

  return (
    <div className="relative border rounded-lg shadow-md bg-white overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="absolute top-[25px] left-6 z-20 bg-black text-white text-xs font-semibold px-4 py-1 rounded-sm shadow-md">
        {product.category.name}
      </div>

      <div className="p-4 flex flex-col items-center">
        <img
          src={
            product.image_path
              ? `${image_host}/${product.image_path}`
              : "/placeholder.png"
          }
          alt={product.name}
          width={300}
          height={300}
          className="object-contain rounded-2xl"
        />

        <div className="mt-3 w-full text-left">
          <p className="font-semibold text-lg text-gray-800">{product.name}</p>
          <p className=" text-sm text-gray-500">{product?.description}</p>

          <div className="flex justify-between mt-1 text-sm text-gray-800">
            <span>{product.stock} in stock</span>
            <span className="text-blue-700 font-bold">
              {formatRupiah(Number(product.price))}
            </span>
          </div>
        </div>

        <Button
          variant="default"
          className="mt-3 w-full cursor-pointer"
          onClick={handleAddToCart}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
};
