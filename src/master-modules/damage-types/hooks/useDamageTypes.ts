import {
  useEffect,
  useMemo,
  useState,
} from "react";

import damageTypeService from "../service/damageTypeService";
import type { DamageType } from "../types/damageType.types";

const ITEMS_PER_PAGE = 10;

const useDamageTypes = () => {
  const [damageTypes, setDamageTypes] = useState<
    DamageType[]
  >([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(
    null
  );

  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  // =========================
  // LOAD DAMAGE TYPES
  // =========================

  const loadDamageTypes = async () => {
    try {
      setLoading(true);
      setError(null);

      const response =
        await damageTypeService.getAllDamageTypes();

      console.log(
        "Damage Types API Response:",
        response.data
      );

      if (response.data?.success) {
        setDamageTypes(
          response.data.data || []
        );
      } else {
        setDamageTypes([]);

        setError(
          response.data?.error?.message ||
            "Failed to load damage types"
        );
      }
    } catch (err: any) {
      console.error(
        "Damage Types API Error:",
        err
      );

      setError(
        err?.response?.data?.error?.message ||
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load damage types"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    loadDamageTypes();
  }, []);

  // =========================
  // SEARCH
  // =========================

  const filteredDamageTypes = useMemo(() => {
    const search = searchTerm
      .toLowerCase()
      .trim();

    if (!search) {
      return damageTypes;
    }

    return damageTypes.filter((damageType) => {
      return (
        damageType.name
          ?.toLowerCase()
          .includes(search) ||

        damageType.id
          .toString()
          .includes(search)
      );
    });
  }, [damageTypes, searchTerm]);

  // =========================
  // RESET PAGE WHEN SEARCH
  // =========================

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // =========================
  // PAGINATION
  // =========================

  const totalItems =
    filteredDamageTypes.length;

  const totalPages = Math.ceil(
    totalItems / ITEMS_PER_PAGE
  );

  const paginatedDamageTypes = useMemo(() => {
    const startIndex =
      (currentPage - 1) * ITEMS_PER_PAGE;

    const endIndex =
      startIndex + ITEMS_PER_PAGE;

    return filteredDamageTypes.slice(
      startIndex,
      endIndex
    );
  }, [
    filteredDamageTypes,
    currentPage,
  ]);

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
    damageTypes,

    filteredDamageTypes,

    paginatedDamageTypes,

    loading,
    error,

    searchTerm,
    setSearchTerm,

    currentPage,
    totalPages,
    totalItems,

    itemsPerPage: ITEMS_PER_PAGE,

    handlePageChange,

    loadDamageTypes,
  };
};

export default useDamageTypes;