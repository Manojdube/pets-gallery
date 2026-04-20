import { useState, useMemo, useCallback } from 'react';

interface UsePaginationProps<T> {
  data: T[];
  itemsPerPage?: number;
  initialPage?: number;
}

const MAX_PAGE_BUTTONS = 5;

export function usePagination<T>({
  data,
  itemsPerPage = 12,
  initialPage = 1,
}: UsePaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState(() => initialPage);

  const totalPages = useMemo(
    () => Math.ceil(data.length / itemsPerPage),
    [data.length, itemsPerPage]
  );

  // ✅ derived safe page (no useEffect needed)
  const safePage = Math.min(currentPage, totalPages || 1);

  const paginatedData = useMemo(() => {
    const start = (safePage - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  }, [data, safePage, itemsPerPage]);

  const goToPage = useCallback((page: number) => {
    setCurrentPage((prev) => {
      const next = Math.max(1, Math.min(page, totalPages || 1));
      return prev === next ? prev : next;
    });
  }, [totalPages]);

  const next = useCallback(() => {
    setCurrentPage((p) => Math.min(p + 1, totalPages || 1));
  }, [totalPages]);

  const prev = useCallback(() => {
    setCurrentPage((p) => Math.max(p - 1, 1));
  }, []);

  const pageNumbers = useMemo(() => {
    const start = Math.max(1, safePage - 2);
    const end = Math.min(totalPages, start + MAX_PAGE_BUTTONS - 1);
    const adjustedStart = Math.max(1, end - MAX_PAGE_BUTTONS + 1);

    const pages: (number | 'first' | 'last')[] = [];

    if (adjustedStart > 1) pages.push('first');
    for (let i = adjustedStart; i <= end; i++) pages.push(i);
    if (end < totalPages) pages.push('last');

    return pages;
  }, [safePage, totalPages]);

  return {
    currentPage: safePage,
    totalPages,
    paginatedData,
    pageNumbers,
    goToPage,
    next,
    prev,
    hasNext: safePage < totalPages,
    hasPrev: safePage > 1,
  };
}