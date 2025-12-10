import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useCategories } from "@/hooks/useCategory";
import { RotateCw } from "lucide-react";

type FilterProps = {
  category: string;
  sort: string;
  minPrice: number | "";
  maxPrice: number | "";
  onFilter: (filters: {
    category: string;
    sort: string;
    minPrice: number | "";
    maxPrice: number | "";
  }) => void;
};

export const Filter: React.FC<FilterProps> = ({
  category,
  sort,
  minPrice,
  maxPrice,
  onFilter,
}) => {
  const { categories, loading, error } = useCategories();
  const [tempCategory, setTempCategory] = useState(category);
  const [tempSort, setTempSort] = useState(sort);
  const [tempMinPrice, setTempMinPrice] = useState<number | "">(minPrice);
  const [tempMaxPrice, setTempMaxPrice] = useState<number | "">(maxPrice);

  useEffect(() => {
    setTempCategory(category);
    setTempSort(sort);
    setTempMinPrice(minPrice);
    setTempMaxPrice(maxPrice);
  }, [category, sort, minPrice, maxPrice]);

  const handleFilter = () => {
    onFilter({
      category: tempCategory,
      sort: tempSort,
      minPrice: tempMinPrice,
      maxPrice: tempMaxPrice,
    });
  };

  const handleReset = () => {
    setTempCategory("all");
    setTempSort("created_at-DESC");
    setTempMinPrice("");
    setTempMaxPrice("");
    onFilter({
      category: "all",
      sort: "created_at-DESC",
      minPrice: "",
      maxPrice: "",
    });
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 flex-wrap">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full">
        <Select onValueChange={setTempCategory} value={tempCategory}>
          <SelectTrigger className="w-full sm:w-48 bg-white">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {loading && (
              <SelectItem value="loading" disabled>
                Loading...
              </SelectItem>
            )}
            {error && (
              <SelectItem value="error" disabled>
                {error}
              </SelectItem>
            )}
            {!loading &&
              !error &&
              categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        {/* Sort Select */}
        <Select onValueChange={setTempSort} value={tempSort}>
          <SelectTrigger className="w-full sm:w-48 bg-white">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at-DESC">Newest</SelectItem>
            <SelectItem value="created_at-ASC">Oldest</SelectItem>
            <SelectItem value="price-DESC">Highest Price</SelectItem>
            <SelectItem value="price-ASC">Lowest Price</SelectItem>
          </SelectContent>
        </Select>

       
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <input
            type="number"
            placeholder="Min"
            className="w-full sm:w-32 px-2 py-1 border rounded bg-white"
            value={tempMinPrice}
            onChange={(e) =>
              setTempMinPrice(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max"
            className="w-full sm:w-32 px-2 py-1 border rounded bg-white"
            value={tempMaxPrice}
            onChange={(e) =>
              setTempMaxPrice(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0">
          <Button
            variant="default"
            className="w-full sm:w-auto cursor-pointer"
            onClick={handleFilter}
          >
            Filter
          </Button>
          <Button
            variant="outline"
            className="w-full sm:w-auto cursor-pointer flex items-center gap-1"
            onClick={handleReset}
          >
            <RotateCw size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};
