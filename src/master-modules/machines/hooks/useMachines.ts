import {
  useEffect,
  useMemo,
  useState,
} from "react";

import machineService from "../service/machineService";
import type { Machine } from "../types/machine.types";

const ITEMS_PER_PAGE = 10;

const useMachines = () => {
  const [machines, setMachines] = useState<Machine[]>(
    []
  );

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(
    null
  );

  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  // =========================
  // LOAD MACHINES
  // =========================

  const loadMachines = async () => {
    try {
      setLoading(true);
      setError(null);

      const response =
        await machineService.getAllMachines();

      console.log(
        "Machines API Response:",
        response.data
      );

      if (response.data?.success) {
        setMachines(response.data.data || []);
      } else {
        setMachines([]);

        setError(
          response.data?.error?.message ||
            "Failed to load machines"
        );
      }
    } catch (err: any) {
      console.error(
        "Machines API Error:",
        err
      );

      setError(
        err?.response?.data?.error?.message ||
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load machines"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    loadMachines();
  }, []);

  // =========================
  // SEARCH
  // =========================

  const filteredMachines = useMemo(() => {
    const search = searchTerm
      .toLowerCase()
      .trim();

    if (!search) {
      return machines;
    }

    return machines.filter((machine) => {
      return (
        machine.machineName
          ?.toLowerCase()
          .includes(search) ||

        machine.machineId
          .toString()
          .includes(search) ||

        machine.casingStageId
          .toString()
          .includes(search) ||

        machine.sortOrder
          .toString()
          .includes(search)
      );
    });
  }, [machines, searchTerm]);

  // =========================
  // RESET PAGE WHEN SEARCH
  // =========================

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // =========================
  // PAGINATION
  // =========================

  const totalItems = filteredMachines.length;

  const totalPages = Math.ceil(
    totalItems / ITEMS_PER_PAGE
  );

  const paginatedMachines = useMemo(() => {
    const startIndex =
      (currentPage - 1) * ITEMS_PER_PAGE;

    const endIndex =
      startIndex + ITEMS_PER_PAGE;

    return filteredMachines.slice(
      startIndex,
      endIndex
    );
  }, [filteredMachines, currentPage]);

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
    machines,

    filteredMachines,

    paginatedMachines,

    loading,
    error,

    searchTerm,
    setSearchTerm,

    currentPage,
    totalPages,
    totalItems,

    itemsPerPage: ITEMS_PER_PAGE,

    handlePageChange,

    loadMachines,
  };
};

export default useMachines;