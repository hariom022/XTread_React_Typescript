import { useEffect, useMemo, useState } from "react";
import tyreSizeService from "../service/tyreSizesService";
import type { TyreSize } from "../types/tyreSize.types";

const PAGE_SIZE = 10;

const useTyreSizes = () => {
  const [tyreSizes, setTyreSizes] = useState<TyreSize[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const loadTyreSizes = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await tyreSizeService.getAllTyreSizes(1);

      if (response.data.success) {
        setTyreSizes(response.data.data || []);
      } else {
        setTyreSizes([]);
        setError(
          typeof response.data.error === "string"
            ? response.data.error
            : "Failed to load tyre sizes."
        );
      }
    } catch (err: any) {
      setTyreSizes([]);

      setError(
        err?.response?.data?.error?.message ||
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load tyre sizes."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTyreSizes();
  }, []);

  const filteredTyreSizes = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return tyreSizes;
    }

    return tyreSizes.filter((item) =>
      [
        item.casingSize,
        item.categoryId?.toString(),
        item.rim?.toString(),
        item.averageCircumferenceMm?.toString(),
        item.minimumMm?.toString(),
        item.maximumMm?.toString(),
        item.displayOrder?.toString(),
      ].some((value) =>
        value?.toLowerCase
          ? value.toLowerCase().includes(searchValue)
          : String(value).includes(searchValue)
      )
    );
  }, [tyreSizes, search]);

  const totalPages = Math.ceil(
    filteredTyreSizes.length / PAGE_SIZE
  );

  const paginatedTyreSizes = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;

    return filteredTyreSizes.slice(
      startIndex,
      startIndex + PAGE_SIZE
    );
  }, [filteredTyreSizes, currentPage]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    tyreSizes,
    filteredTyreSizes,
    paginatedTyreSizes,

    loading,
    error,

    search,
    handleSearch,

    currentPage,
    totalPages,
    handlePageChange,

    reload: loadTyreSizes,
  };
};

export default useTyreSizes;