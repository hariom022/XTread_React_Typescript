import {
  useEffect,
  useMemo,
  useState,
} from "react";

import autoclaveService from "../service/autoclaveService";
import type { Autoclave } from "../types/autoclave.types";

const ITEMS_PER_PAGE = 10;

const useAutoclaves = () => {
  const [autoclaves, setAutoclaves] = useState<
    Autoclave[]
  >([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(
    null
  );

  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  // =========================
  // LOAD AUTOCLAVES
  // =========================

  const loadAutoclaves = async () => {
    try {
      setLoading(true);
      setError(null);

      const response =
        await autoclaveService.getAllAutoclaves();

      console.log(
        "Autoclaves API Response:",
        response.data
      );

      if (response.data?.success) {
        setAutoclaves(response.data.data || []);
      } else {
        setAutoclaves([]);

        setError(
          response.data?.error?.message ||
            "Failed to load autoclaves"
        );
      }
    } catch (err: any) {
      console.error(
        "Autoclaves API Error:",
        err
      );

      setError(
        err?.response?.data?.error?.message ||
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load autoclaves"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    loadAutoclaves();
  }, []);

  // =========================
  // SEARCH
  // =========================

  const filteredAutoclaves = useMemo(() => {
    const search = searchTerm
      .toLowerCase()
      .trim();

    if (!search) {
      return autoclaves;
    }

    return autoclaves.filter((autoclave) => {
      return (
        autoclave.name
          ?.toLowerCase()
          .includes(search) ||

        autoclave.autoclaveId
          .toString()
          .includes(search) ||

        autoclave.sortOrder
          .toString()
          .includes(search)
      );
    });
  }, [autoclaves, searchTerm]);

  // =========================
  // RESET PAGE WHEN SEARCH
  // =========================

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // =========================
  // PAGINATION
  // =========================

  const totalItems = filteredAutoclaves.length;

  const totalPages = Math.ceil(
    totalItems / ITEMS_PER_PAGE
  );

  const paginatedAutoclaves = useMemo(() => {
    const startIndex =
      (currentPage - 1) * ITEMS_PER_PAGE;

    const endIndex =
      startIndex + ITEMS_PER_PAGE;

    return filteredAutoclaves.slice(
      startIndex,
      endIndex
    );
  }, [filteredAutoclaves, currentPage]);

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
    autoclaves,

    filteredAutoclaves,

    paginatedAutoclaves,

    loading,
    error,

    searchTerm,
    setSearchTerm,

    currentPage,
    totalPages,
    totalItems,

    itemsPerPage: ITEMS_PER_PAGE,

    handlePageChange,

    loadAutoclaves,
  };
};

export default useAutoclaves;