import {
  useEffect,
  useMemo,
  useState,
} from "react";

import damageLevelService from "../service/damageLevelService";
import type { DamageLevel } from "../types/damageLevel.types";

const ITEMS_PER_PAGE = 10;

const useDamageLevels = () => {
  const [damageLevels, setDamageLevels] = useState<
    DamageLevel[]
  >([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(
    null
  );

  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  // =========================
  // LOAD DAMAGE LEVELS
  // =========================

  const loadDamageLevels = async () => {
    try {
      setLoading(true);
      setError(null);

      const response =
        await damageLevelService.getAllDamageLevels();

      console.log(
        "Damage Levels API Response:",
        response.data
      );

      if (response.data?.success) {
        setDamageLevels(
          response.data.data || []
        );
      } else {
        setDamageLevels([]);

        setError(
          response.data?.error?.message ||
            "Failed to load damage levels"
        );
      }
    } catch (err: any) {
      console.error(
        "Damage Levels API Error:",
        err
      );

      setError(
        err?.response?.data?.error?.message ||
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load damage levels"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    loadDamageLevels();
  }, []);

  // =========================
  // SEARCH
  // =========================

  const filteredDamageLevels = useMemo(() => {
    const search = searchTerm
      .toLowerCase()
      .trim();

    if (!search) {
      return damageLevels;
    }

    return damageLevels.filter((damageLevel) => {
      return (
        damageLevel.name
          ?.toLowerCase()
          .includes(search) ||

        damageLevel.damageLevelId
          .toString()
          .includes(search) ||

        damageLevel.sortOrder
          .toString()
          .includes(search)
      );
    });
  }, [damageLevels, searchTerm]);

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
    filteredDamageLevels.length;

  const totalPages = Math.ceil(
    totalItems / ITEMS_PER_PAGE
  );

  const paginatedDamageLevels = useMemo(() => {
    const startIndex =
      (currentPage - 1) * ITEMS_PER_PAGE;

    const endIndex =
      startIndex + ITEMS_PER_PAGE;

    return filteredDamageLevels.slice(
      startIndex,
      endIndex
    );
  }, [
    filteredDamageLevels,
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
    damageLevels,

    filteredDamageLevels,

    paginatedDamageLevels,

    loading,
    error,

    searchTerm,
    setSearchTerm,

    currentPage,
    totalPages,
    totalItems,

    itemsPerPage: ITEMS_PER_PAGE,

    handlePageChange,

    loadDamageLevels,
  };
};

export default useDamageLevels;