
import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import { PaginationState } from "./types";

interface TemplatePaginationProps {
  pagination: PaginationState;
  onPageChange: (page: number) => void;
}

export const TemplatePagination = ({ 
  pagination, 
  onPageChange 
}: TemplatePaginationProps) => {
  if (pagination.totalPages <= 1) return null;
  
  const renderPaginationLinks = () => {
    const links = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(
      1,
      pagination.page - Math.floor(maxVisiblePages / 2)
    );
    const endPage = Math.min(
      pagination.totalPages,
      startPage + maxVisiblePages - 1
    );

    for (let i = startPage; i <= endPage; i++) {
      links.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={i === pagination.page}
            onClick={() => onPageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return links;
  };

  return (
    <Pagination className="mt-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => onPageChange(Math.max(1, pagination.page - 1))} 
            className={pagination.page <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
        
        {renderPaginationLinks()}
        
        <PaginationItem>
          <PaginationNext 
            onClick={() => onPageChange(Math.min(pagination.totalPages, pagination.page + 1))} 
            className={pagination.page >= pagination.totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
