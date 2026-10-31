
import { useCallback, useEffect, useState } from "react";

import materialConsumptionAuditTrailService from "../services/materialConsumptionAuditTrailService";

import type {
  MaterialConsumptionAuditTrailItem,
  MaterialConsumptionAuditTrailResponse,
} from "../types/materialConsumptionAuditTrail.types";

const useMaterialConsumptionAuditTrail = () => {
  const [items, setItems] = useState<
    MaterialConsumptionAuditTrailItem[]
  >([]);

  const [pagination, setPagination] =
    useState<MaterialConsumptionAuditTrailResponse>({
      items: [],
      totalCount: 0,
      pageNumber: 1,
      pageSize: 20,
      totalPages: 0,
    });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await materialConsumptionAuditTrailService.getRequests(
          currentPage,
          pageSize
        );

      const result = response.data?.data;

      setItems(result?.items ?? []);

      setPagination({
        items: result?.items ?? [],
        totalCount: result?.totalCount ?? 0,
        pageNumber: result?.pageNumber ?? currentPage,
        pageSize: result?.pageSize ?? pageSize,
        totalPages: result?.totalPages ?? 0,
      });
    } catch (err: any) {
      console.error(
        "Failed to load material consumption audit trail:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to load material consumption requests."
      );

      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    void fetchRequests();
  }, [fetchRequests]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > pagination.totalPages) return;

    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return {
    items,
    pagination,
    currentPage,
    pageSize,
    loading,
    error,
    handlePageChange,
    handlePageSizeChange,
    refresh: fetchRequests,
  };
};

export default useMaterialConsumptionAuditTrail;
