"use client";

import React, { useState, useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import { Filter } from "@/components/Filter";
import { useProduct } from "@/hooks/useProduct";
import { useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Pagination } from "@/components/Pagination";


const HomePage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("search") || "";

  const [category, setCategory] = useState<string>("");
  const [sort, setSort] = useState<string>("created_at-DESC");
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(8);
  const { products, loading, meta, refetch } = useProduct({
    search: query,
    category: category === "all" ? undefined : category,
    sort,
    minPrice: minPrice === "" ? undefined : minPrice,
    maxPrice: maxPrice === "" ? undefined : maxPrice,
    page: currentPage,
    pageSize: itemsPerPage,
  });

 
  useEffect(() => {
    setCurrentPage(1);
    refetch(); 
  }, [query]);

  
  useEffect(() => {
    setCurrentPage(1);

  }, [itemsPerPage]);

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };


  const handleFilter = (filters: {
    category: string;
    sort: string;
    minPrice: number | "";
    maxPrice: number | "";
  }) => {
    setCategory(filters.category);
    setSort(filters.sort);
    setMinPrice(filters.minPrice);
    setMaxPrice(filters.maxPrice);
    setCurrentPage(1);
    refetch();
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
const endItem = Math.min(currentPage * itemsPerPage, meta?.total_data ?? 0);

  return (
    <div className="min-h-screen py-[150px] sm:py-24 bg-zinc-50 font-sans px-4 sm:px-6 lg:px-8">
      <Filter
        category={category}
        sort={sort}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onFilter={handleFilter}
      />


    <div className="w-full flex flex-row justify-between">
      <div className="flex flex-row justify-between w-32 mb-3 bg-white">
        <select
          className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 cursor-pointer text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 appearance-none"
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
        >
          <option value={8}>8 items</option>
          <option value={10}>10 items</option>
          <option value={12}>12 items</option>
        </select>
        <ChevronDown
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
          size={20}
        />
      </div>

     <div className="flex items-center gap-1 text-lg">
 
   <span className="text-gray-600 italic">
  <span className="text-black font-semibold not-italic">Showing : </span>{startItem}–{endItem} of {meta?.total_data} products
</span>

</div>


    </div>
      

    

      {loading ? (
        <p className="text-center py-10">Loading...</p>
      ) : meta?.total_data === 0 ? (
        <p className="text-center py-10">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPage={meta?.total_page || 1}
        onPageChange={handlePageClick}
      />
    </div>
  );
};

export default HomePage;
