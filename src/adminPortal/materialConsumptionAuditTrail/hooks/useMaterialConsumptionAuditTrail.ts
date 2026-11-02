
import { useCallback, useEffect, useState } from "react";

import materialConsumptionAuditTrailService from "../services/materialConsumptionAuditTrailService";

import type {
  MaterialConsumptionAuditTrailItem,
  MaterialConsumptionAuditTrailResponse,
} from "../types/materialConsumptionAuditTrail.types";

import type {
  MaterialConsumptionAuditTrailFilters,
} from "../types/materialConsumptionAuditTrailFilter.types";

const initialFilters: MaterialConsumptionAuditTrailFilters = {
  Search: "",
  Statuses: [],
  Status: "",
  CustomerNumber: "",
  OrderNumber: "",
  CustomerName: "",
  ProductionNumber: "",
};

const useMaterialConsumptionAuditTrail = () => {
  const [items, setItems] = useState<MaterialConsumptionAuditTrailItem[]>([]);

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

  const [filters, setFilters] =
    useState<MaterialConsumptionAuditTrailFilters>(initialFilters);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await materialConsumptionAuditTrailService.getRequests(
          currentPage,
          pageSize,
          {
            Search: filters.Search,
            Statuses: filters.Statuses,
            Status: filters.Status ? Number(filters.Status) : undefined,
            CustomerNumber: filters.CustomerNumber,
            OrderNumber: filters.OrderNumber,
            CustomerName: filters.CustomerName,
            ProductionNumber: filters.ProductionNumber,
          }
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
        err?.response?.data?.error?.message ||
          err?.response?.data?.message ||
          "Failed to load material consumption requests."
      );

      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, filters]);

  useEffect(() => {
    void fetchRequests();
  }, [fetchRequests]);

  // Update individual filter
  const handleFilterChange = (
    field: keyof MaterialConsumptionAuditTrailFilters,
    value: string | number[]
  ) => {
    setFilters((previous) => ({
      ...previous,
      [field]: value,
    }));

    setCurrentPage(1);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters(initialFilters);
    setCurrentPage(1);
  };

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
    filters,
    loading,
    error,
    handleFilterChange,
    clearFilters,
    handlePageChange,
    handlePageSizeChange,
    refresh: fetchRequests,
  };
};

export default useMaterialConsumptionAuditTrail;
