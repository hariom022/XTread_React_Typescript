import {
  useEffect,
  useMemo,
  useState,
} from "react";

import rejectionReasonService from "../service/rejectionReasonService";
import type { RejectionReason } from "../types/rejectionReason.types";

const ITEMS_PER_PAGE = 10;

const useRejectionReasons = () => {
  const [rejectionReasons, setRejectionReasons] =
    useState<RejectionReason[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(
    null
  );

  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  // =========================
  // LOAD REJECTION REASONS
  // =========================

  const loadRejectionReasons = async () => {
    try {
      setLoading(true);
      setError(null);

      const response =
        await rejectionReasonService.getAllRejectionReasons();

      console.log(
        "Rejection Reasons API Response:",
        response.data
      );

      if (response.data?.success) {
        setRejectionReasons(
          response.data.data || []
        );
      } else {
        setRejectionReasons([]);

        setError(
          response.data?.error?.message ||
            "Failed to load rejection reasons"
        );
      }
    } catch (err: any) {
      console.error(
        "Rejection Reasons API Error:",
        err
      );

      setError(
        err?.response?.data?.error?.message ||
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load rejection reasons"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    loadRejectionReasons();
  }, []);

  // =========================
  // SEARCH
  // =========================

  const filteredRejectionReasons = useMemo(() => {
    const search = searchTerm
      .toLowerCase()
      .trim();

    if (!search) {
      return rejectionReasons;
    }

    return rejectionReasons.filter(
      (rejectionReason) => {
        return (
          rejectionReason.code
            ?.toLowerCase()
            .includes(search) ||

          rejectionReason.reason
            ?.toLowerCase()
            .includes(search) ||

          rejectionReason.category
            ?.toLowerCase()
            .includes(search) ||

          rejectionReason.rejectionReasonId
            .toString()
            .includes(search) ||

          rejectionReason.casingStageId
            .toString()
            .includes(search) ||

          rejectionReason.casingSubstageId
            ?.toString()
            .includes(search)
        );
      }
    );
  }, [rejectionReasons, searchTerm]);

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
    filteredRejectionReasons.length;

  const totalPages = Math.ceil(
    totalItems / ITEMS_PER_PAGE
  );

  const paginatedRejectionReasons = useMemo(() => {
    const startIndex =
      (currentPage - 1) * ITEMS_PER_PAGE;

    const endIndex =
      startIndex + ITEMS_PER_PAGE;

    return filteredRejectionReasons.slice(
      startIndex,
      endIndex
    );
  }, [
    filteredRejectionReasons,
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
    rejectionReasons,

    filteredRejectionReasons,

    paginatedRejectionReasons,

    loading,
    error,

    searchTerm,
    setSearchTerm,

    currentPage,
    totalPages,
    totalItems,

    itemsPerPage: ITEMS_PER_PAGE,

    handlePageChange,

    loadRejectionReasons,
  };
};

export default useRejectionReasons;