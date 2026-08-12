import {
  useEffect,
  useMemo,
  useState,
} from "react";

import repairMaterialService from "../service/repairMaterialService";
import type { RepairMaterial } from "../types/repairMaterial.types";

const ITEMS_PER_PAGE = 10;

const useRepairMaterials = () => {
  const [repairMaterials, setRepairMaterials] =
    useState<RepairMaterial[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(
    null
  );

  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  // =========================
  // LOAD REPAIR MATERIALS
  // =========================

  const loadRepairMaterials = async () => {
    try {
      setLoading(true);
      setError(null);

      const response =
        await repairMaterialService.getAllRepairMaterials();

      console.log(
        "Repair Materials API Response:",
        response.data
      );

      if (response.data?.success) {
        setRepairMaterials(
          response.data.data || []
        );
      } else {
        setRepairMaterials([]);

        setError(
          response.data?.error?.message ||
            "Failed to load repair materials"
        );
      }
    } catch (err: any) {
      console.error(
        "Repair Materials API Error:",
        err
      );

      setError(
        err?.response?.data?.error?.message ||
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load repair materials"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    loadRepairMaterials();
  }, []);

  // =========================
  // SEARCH
  // =========================

  const filteredRepairMaterials = useMemo(() => {
    const search = searchTerm
      .toLowerCase()
      .trim();

    if (!search) {
      return repairMaterials;
    }

    return repairMaterials.filter(
      (repairMaterial) => {
        return (
          repairMaterial.name
            ?.toLowerCase()
            .includes(search) ||

          repairMaterial.id
            .toString()
            .includes(search)
        );
      }
    );
  }, [repairMaterials, searchTerm]);

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
    filteredRepairMaterials.length;

  const totalPages = Math.ceil(
    totalItems / ITEMS_PER_PAGE
  );

  const paginatedRepairMaterials = useMemo(() => {
    const startIndex =
      (currentPage - 1) * ITEMS_PER_PAGE;

    const endIndex =
      startIndex + ITEMS_PER_PAGE;

    return filteredRepairMaterials.slice(
      startIndex,
      endIndex
    );
  }, [
    filteredRepairMaterials,
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
    repairMaterials,

    filteredRepairMaterials,

    paginatedRepairMaterials,

    loading,
    error,

    searchTerm,
    setSearchTerm,

    currentPage,
    totalPages,
    totalItems,

    itemsPerPage: ITEMS_PER_PAGE,

    handlePageChange,

    loadRepairMaterials,
  };
};

export default useRepairMaterials;