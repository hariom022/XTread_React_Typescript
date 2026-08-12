import { useEffect, useMemo, useState } from "react";
import tyreMakeService from "../service/tyreMakeService";
import type { TyreMake } from "../types/tyreMake.types";

const ITEMS_PER_PAGE = 10;

const useTyreMakes = () => {
  const [tyreMakes, setTyreMakes] = useState<TyreMake[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  // =========================
  // LOAD TYRE MAKES
  // =========================

  const loadTyreMakes = async () => {
    try {
      setLoading(true);
      setError(null);

      const response =
        await tyreMakeService.getAllTyreMakes();

      console.log(
        "Tyre Makes API Response:",
        response.data
      );

      if (response.data?.success) {
        setTyreMakes(response.data.data || []);
      } else {
        setTyreMakes([]);

        setError(
          response.data?.error?.message ||
            "Failed to load tyre makes"
        );
      }
    } catch (err: any) {
      console.error(
        "Tyre Makes API Error:",
        err
      );

      setError(
        err?.response?.data?.error?.message ||
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load tyre makes"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    loadTyreMakes();
  }, []);

  // =========================
  // SEARCH
  // =========================

  const filteredTyreMakes = useMemo(() => {
    const search = searchTerm
      .toLowerCase()
      .trim();

    if (!search) {
      return tyreMakes;
    }

    return tyreMakes.filter((tyreMake) => {
      return (
        tyreMake.tyreMakeName
          ?.toLowerCase()
          .includes(search) ||

        tyreMake.tyreClassificationName
          ?.toLowerCase()
          .includes(search) ||

        tyreMake.tyreMakeId
          .toString()
          .includes(search) ||

        tyreMake.tyreClassificationId
          .toString()
          .includes(search)
      );
    });
  }, [tyreMakes, searchTerm]);

  // =========================
  // RESET PAGE WHEN SEARCH
  // =========================

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // =========================
  // PAGINATION
  // =========================

  const totalItems = filteredTyreMakes.length;

  const totalPages = Math.ceil(
    totalItems / ITEMS_PER_PAGE
  );

  const paginatedTyreMakes = useMemo(() => {
    const startIndex =
      (currentPage - 1) * ITEMS_PER_PAGE;

    const endIndex =
      startIndex + ITEMS_PER_PAGE;

    return filteredTyreMakes.slice(
      startIndex,
      endIndex
    );
  }, [filteredTyreMakes, currentPage]);

  // =========================
  // PAGE CHANGE
  // =========================

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);
  };

  return {
    tyreMakes,

    filteredTyreMakes,

    paginatedTyreMakes,

    loading,
    error,

    searchTerm,
    setSearchTerm,

    currentPage,
    totalPages,
    totalItems,

    itemsPerPage: ITEMS_PER_PAGE,

    handlePageChange,

    loadTyreMakes,
  };
};

export default useTyreMakes;