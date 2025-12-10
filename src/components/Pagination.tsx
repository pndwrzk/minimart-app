"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPage: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPage,
  onPageChange,
}) => {
  if (totalPage <= 1) return null;

  const handlePrev = (): void => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = (): void => {
    if (currentPage < totalPage) {
      onPageChange(currentPage + 1);
    }
  };

  const getPages = (): (number | "...")[] => {
    const pages: (number | "...")[] = [];

  
    if (totalPage <= 7) {
      for (let i = 1; i <= totalPage; i++) {
        pages.push(i);
      }
      return pages;
    }

  
    pages.push(1);

    
    if (currentPage > 4) {
      pages.push("...");
    }


    const start: number = Math.max(2, currentPage - 1);
    const end: number = Math.min(totalPage - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    
    if (currentPage < totalPage - 3) {
      pages.push("...");
    }


    pages.push(totalPage);

    return pages;
  };

  const pages = getPages();

  return (
    <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
    
      <Button
        className="cursor-pointer"
        variant="outline"
        onClick={handlePrev}
        disabled={currentPage === 1}
      >
        Prev
      </Button>

     
      {pages.map((page, index) => {
        const key: string =
          page === "..."
            ? `ellipsis-${index}`
            : `page-${page}-${index}`;

        if (page === "...") {
          return (
            <span
              key={key}
              className="px-3 py-2 text-gray-500 select-none"
            >
              ...
            </span>
          );
        }

        return (
          <Button
            key={key}
            className="cursor-pointer"
            variant={currentPage === page ? "default" : "outline"}
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        );
      })}

    
      <Button
        className="cursor-pointer"
        variant="outline"
        onClick={handleNext}
        disabled={currentPage === totalPage}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
